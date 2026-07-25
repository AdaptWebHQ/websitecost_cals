"use client";

import { useState, useTransition } from "react";
import { Plus, Download, Upload, Sprout, Loader2 } from "lucide-react";
import { toast } from "sonner";

import type { ServiceCategory } from "@/types";

import {
  deleteServiceCategoryAction,
  toggleServiceCategoryAction,
  reorderServiceCategoriesAction,
  importServiceCategoryAction,
  seedServiceCategoryTemplateAction,
} from "@/actions/service-category";
import { getCategoryDependentCountsAction, type CategoryDependencies } from "@/actions/service-category/dependencies";

import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";

import { ServiceCategoryForm } from "./service-category-form";
import { ServiceCategoryTable } from "./service-category-table";

interface ServiceCategoriesClientProps {
  initialCategories: ServiceCategory[];
}

const TEMPLATE_OPTIONS = [
  { value: 'website-development', label: 'Website Development Template' },
  { value: 'ecommerce-development', label: 'E-commerce Development Template' },
  { value: 'mobile-app-development', label: 'Mobile App Development Template' },
];

export function ServiceCategoriesClient({
  initialCategories,
}: ServiceCategoriesClientProps) {
  const [categories, setCategories] =
    useState<ServiceCategory[]>(initialCategories);

  const [selectedCategory, setSelectedCategory] =
    useState<ServiceCategory | null>(null);

  const [formOpen, setFormOpen] = useState(false);

  // Delete flow
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [dependencyStats, setDependencyStats] = useState<CategoryDependencies | null>(null);
  const [isCheckingDeps, setIsCheckingDeps] = useState(false);

  // Seed flow
  const [seedOpen, setSeedOpen] = useState(false);
  const [seedTemplate, setSeedTemplate] = useState('website-development');

  // Import flow
  const [importOpen, setImportOpen] = useState(false);
  const [importJson, setImportJson] = useState('');

  const [isPending, startTransition] = useTransition();

  function handleCreate() {
    setSelectedCategory(null);
    setFormOpen(true);
  }

  function handleEdit(category: ServiceCategory) {
    setSelectedCategory(category);
    setFormOpen(true);
  }

  function handleFormSuccess(category: ServiceCategory) {
    setCategories((prev) => {
      const exists = prev.some((item) => item.id === category.id);

      if (exists) {
        return prev.map((item) =>
          item.id === category.id ? category : item
        );
      }

      return [category, ...prev];
    });
  }

  function handleToggle(id: string) {
    startTransition(async () => {
      const result = await toggleServiceCategoryAction(id);

      if (!result.success || !result.data) {
        toast.error(result.error ?? "Failed to update status.");
        return;
      }

      setCategories((prev) =>
        prev.map((item) =>
          item.id === id ? result.data! : item
        )
      );

      toast.success("Status updated.");
    });
  }

  // Pre-delete reference check
  const handleInitiateDelete = async (id: string) => {
    setIsCheckingDeps(true);
    const res = await getCategoryDependentCountsAction(id);
    setIsCheckingDeps(false);
    
    if (res.success && res.data) {
      const totals = Object.values(res.data).reduce((acc, val) => acc + val, 0);
      setDependencyStats(res.data);
      setDeleteId(id);
      
      if (totals > 0) {
        toast.error("Category cannot be deleted. Active dependency references found.");
      }
    } else {
      toast.error(res.error || "Failed to check dependencies.");
    }
  };

  function handleDelete() {
    if (!deleteId) return;

    startTransition(async () => {
      const result = await deleteServiceCategoryAction(deleteId);

      if (!result.success) {
        toast.error(result.error ?? "Failed to delete category.");
        return;
      }

      setCategories((prev) =>
        prev.filter((item) => item.id !== deleteId)
      );

      toast.success("Category deleted.");
      setDeleteId(null);
      setDependencyStats(null);
    });
  }

  // Reorder action
  const handleReorder = (orderedIds: string[]) => {
    // Optimistic update
    const sorted = [...categories].sort((a, b) => {
      const aIdx = orderedIds.indexOf(a.id);
      const bIdx = orderedIds.indexOf(b.id);
      return aIdx - bIdx;
    }).map((c, i) => ({ ...c, sortOrder: i + 1 }));
    
    setCategories(sorted);

    startTransition(async () => {
      const res = await reorderServiceCategoriesAction(orderedIds);
      if (res.success) {
        toast.success("Order preserved successfully.");
      } else {
        toast.error(res.error || "Failed to save category order.");
      }
    });
  };

  // Seed submit
  const handleSeedSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    startTransition(async () => {
      const res = await seedServiceCategoryTemplateAction(seedTemplate);
      if (res.success) {
        toast.success("Preset template seeded successfully!");
        window.location.reload();
      } else {
        toast.error(res.error || "Failed to seed template.");
      }
    });
  };

  // Import handler
  const handleImportSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!importJson.trim()) return;
    startTransition(async () => {
      const res = await importServiceCategoryAction(importJson.trim());
      if (res.success && res.data) {
        toast.success(res.data.message);
        alert(res.data.summary);
        window.location.reload();
      } else {
        toast.error(res.error || "Failed to import JSON.");
      }
    });
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      if (event.target?.result) {
        setImportJson(event.target.result as string);
      }
    };
    reader.readAsText(file);
  };

  const hasDependencies = dependencyStats && Object.values(dependencyStats).reduce((acc, val) => acc + val, 0) > 0;

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Service Categories</h1>
          <p className="text-muted-foreground text-sm">
            Configure top-level service offerings and estimate environments.
          </p>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <Button variant="outline" size="sm" onClick={() => setSeedOpen(true)} className="rounded-xl border border-border bg-card hover:bg-muted text-xs font-semibold h-10 px-4">
            <Sprout className="w-4 h-4 mr-1.5 text-emerald-400" />
            Seed Template
          </Button>
          <Button variant="outline" size="sm" onClick={() => setImportOpen(true)} className="rounded-xl border border-border bg-card hover:bg-muted text-xs font-semibold h-10 px-4">
            <Upload className="w-4 h-4 mr-1.5 text-blue-400" />
            Import JSON
          </Button>
          <Button onClick={handleCreate} className="rounded-xl h-10 px-4">
            <Plus className="mr-2 h-4 w-4" />
            New Category
          </Button>
        </div>
      </div>

      {isCheckingDeps && (
        <div className="flex items-center justify-center p-6 text-xs text-muted-foreground gap-2">
          <Loader2 className="w-4 h-4 animate-spin text-primary" />
          Verifying category dependencies...
        </div>
      )}

      <ServiceCategoryTable
        categories={categories}
        onEdit={handleEdit}
        onDelete={handleInitiateDelete}
        onToggle={handleToggle}
        onReorder={handleReorder}
      />

      <ServiceCategoryForm
        open={formOpen}
        onOpenChange={setFormOpen}
        category={selectedCategory}
        onSuccess={handleFormSuccess}
      />

      {/* Delete protection dependency alert */}
      <AlertDialog
        open={!!deleteId}
        onOpenChange={(open) => {
          if (!open) {
            setDeleteId(null);
            setDependencyStats(null);
          }
        }}
      >
        <AlertDialogContent className="border-border bg-popover text-popover-foreground rounded-2xl sm:max-w-md">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-foreground font-bold">
              {hasDependencies ? "Category In Use - Delete Blocked" : "Delete Service Category?"}
            </AlertDialogTitle>

            <AlertDialogDescription className="text-muted-foreground text-sm">
              {hasDependencies ? (
                <div className="space-y-4">
                  <p className="text-red-400 font-medium bg-red-500/10 border border-red-500/20 p-3 rounded-xl">
                    This Service Category cannot be deleted because it is currently being used by other records.
                  </p>
                  <div className="border border-border rounded-xl p-4 bg-muted/30 space-y-2">
                    <span className="text-[10px] font-bold uppercase tracking-wider block border-b border-border pb-1">Dependencies Map:</span>
                    <div className="grid grid-cols-2 gap-2 text-xs font-mono">
                      <span>Packages: {dependencyStats?.packages}</span>
                      <span>Service Types: {dependencyStats?.serviceTypes}</span>
                      <span>Industries: {dependencyStats?.industries}</span>
                      <span>Feature Categories: {dependencyStats?.featureCategories}</span>
                      <span>Features: {dependencyStats?.features}</span>
                      <span>Addon Categories: {dependencyStats?.addonCategories}</span>
                      <span>Addon Features: {dependencyStats?.addonFeatures}</span>
                      <span>Calculations: {dependencyStats?.calculations}</span>
                      <span>Inquiries: {dependencyStats?.inquiries}</span>
                    </div>
                  </div>
                </div>
              ) : (
                "This action cannot be undone. Are you sure you want to delete this empty category?"
              )}
            </AlertDialogDescription>
          </AlertDialogHeader>

          <AlertDialogFooter className="gap-2 sm:gap-0 pt-4 border-t border-border/40">
            <AlertDialogCancel disabled={isPending} className="rounded-xl border border-border">
              {hasDependencies ? "Close" : "Cancel"}
            </AlertDialogCancel>

            {!hasDependencies && (
              <AlertDialogAction
                onClick={handleDelete}
                disabled={isPending}
                className="rounded-xl bg-destructive hover:bg-destructive/95 text-destructive-foreground"
              >
                Delete
              </AlertDialogAction>
            )}
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Seed Dialog */}
      <Dialog open={seedOpen} onOpenChange={setSeedOpen}>
        <DialogContent className="sm:max-w-md border-border bg-popover text-popover-foreground rounded-2xl">
          <form onSubmit={handleSeedSubmit} className="space-y-4">
            <DialogHeader>
              <DialogTitle className="text-base font-bold text-foreground">Seed Template offering</DialogTitle>
              <DialogDescription className="text-muted-foreground text-xs">
                Generates a fully complete structure (packages, features, addons, industries) with a single click.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-1">
              <Label className="text-muted-foreground text-xs">Select Template Type</Label>
              <Select value={seedTemplate} onValueChange={(val) => setSeedTemplate(val || '')} disabled={isPending}>
                <SelectTrigger className="bg-background border-border text-foreground rounded-xl h-10">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-popover border-border rounded-xl">
                  {TEMPLATE_OPTIONS.map(opt => (
                    <SelectItem key={opt.value} value={opt.value} className="cursor-pointer">
                      {opt.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <DialogFooter className="gap-2 sm:gap-0 pt-2">
              <Button type="button" variant="ghost" onClick={() => setSeedOpen(false)} className="rounded-xl border border-border" disabled={isPending}>
                Cancel
              </Button>
              <Button type="submit" className="rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white" disabled={isPending}>
                {isPending && <Loader2 className="w-4 h-4 animate-spin mr-1.5" />}
                Seed Ecosystem
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Import Dialog */}
      <Dialog open={importOpen} onOpenChange={setImportOpen}>
        <DialogContent className="sm:max-w-lg border-border bg-popover text-popover-foreground rounded-2xl">
          <form onSubmit={handleImportSubmit} className="space-y-4">
            <DialogHeader>
              <DialogTitle className="text-base font-bold text-foreground">Import Category Ecosystem JSON</DialogTitle>
              <DialogDescription className="text-muted-foreground text-xs">
                Upload a JSON export file to recreate a complete service category setup.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-3">
              <div className="space-y-1">
                <Label className="text-muted-foreground text-xs">Choose JSON File</Label>
                <Input
                  type="file"
                  accept=".json"
                  onChange={handleFileUpload}
                  className="bg-background border-border text-foreground rounded-xl"
                  disabled={isPending}
                />
              </div>
              {importJson && (
                <div className="space-y-1">
                  <Label className="text-[10px] text-muted-foreground uppercase font-bold tracking-wider">Preview payload contents:</Label>
                  <textarea
                    readOnly
                    value={importJson}
                    className="w-full h-32 bg-muted/40 text-muted-foreground font-mono text-[10px] p-3 border border-border rounded-xl resize-none"
                  />
                </div>
              )}
            </div>
            <DialogFooter className="gap-2 sm:gap-0 pt-2">
              <Button type="button" variant="ghost" onClick={() => setImportOpen(false)} className="rounded-xl border border-border" disabled={isPending}>
                Cancel
              </Button>
              <Button type="submit" className="rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white" disabled={isPending || !importJson}>
                {isPending && <Loader2 className="w-4 h-4 animate-spin mr-1.5" />}
                Import Ecosystem
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}