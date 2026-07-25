'use client';

import React, { useEffect, useState, useTransition } from 'react';
import { toast } from 'sonner';
import * as Icons from 'lucide-react';
import { 
  Edit3, 
  Copy, 
  Download, 
  Package, 
  Layers, 
  Building2, 
  CheckCircle, 
  XCircle, 
  Loader2 
} from 'lucide-react';
import { useAdminCategoryStore } from '@/store/admin-category-store';
import ServiceCategorySelect from './service-category-select';
import { getCategoryDependentCountsAction, type CategoryDependencies } from '@/actions/service-category/dependencies';
import { updateServiceCategoryAction } from '@/actions/service-category/update-service-category';
import { cloneServiceCategoryAction } from '@/actions/service-category/clone';
import { exportServiceCategoryAction } from '@/actions/service-category/import-export';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';

export default function AdminCategoryHeader() {
  const { selectedCategoryId, setSelectedCategoryId, selectedCategory, setCategories, categories } = useAdminCategoryStore();
  const [stats, setStats] = useState<CategoryDependencies | null>(null);
  const [isLoadingStats, setIsLoadingStats] = useState(false);
  const [isPending, startTransition] = useTransition();

  // Dialog states
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isCloneOpen, setIsCloneOpen] = useState(false);

  // Edit fields
  const [editName, setEditName] = useState('');
  const [editSlug, setEditSlug] = useState('');
  const [editDescription, setEditDescription] = useState('');
  const [editIcon, setEditIcon] = useState('Layers');

  // Clone fields
  const [cloneName, setCloneName] = useState('');
  const [cloneSlug, setCloneSlug] = useState('');
  const [cloneDescription, setCloneDescription] = useState('');
  const [cloneIcon, setCloneIcon] = useState('Layers');

  // Fetch counts
  useEffect(() => {
    if (!selectedCategoryId) {
      setStats(null);
      return;
    }
    async function fetchStats() {
      setIsLoadingStats(true);
      const res = await getCategoryDependentCountsAction(selectedCategoryId!);
      if (res.success && res.data) {
        setStats(res.data);
      }
      setIsLoadingStats(false);
    }
    fetchStats();
  }, [selectedCategoryId]);

  if (!selectedCategory) return null;

  const IconComponent = (Icons as any)[selectedCategory.icon || 'Layers'] || Layers;

  // Handle Edit Category submit
  const handleEditSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editName.trim() || !editSlug.trim()) {
      toast.error('Name and slug are required.');
      return;
    }
    startTransition(async () => {
      const res = await updateServiceCategoryAction(selectedCategory.id, {
        name: editName.trim(),
        description: editDescription.trim(),
        icon: editIcon.trim(),
        isActive: selectedCategory.isActive,
        sortOrder: selectedCategory.sortOrder || 0,
      });
      if (res.success && res.data) {
        setCategories(
          categories.map((c) => (c.id === selectedCategory.id ? res.data! : c))
        );
        toast.success('Service category updated successfully.');
        setIsEditOpen(false);
      } else {
        toast.error(res.error || 'Failed to update category.');
      }
    });
  };

  // Handle Clone Category submit
  const handleCloneSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!cloneName.trim() || !cloneSlug.trim()) {
      toast.error('Clone name and slug are required.');
      return;
    }
    startTransition(async () => {
      const res = await cloneServiceCategoryAction(selectedCategory.id, {
        name: cloneName.trim(),
        slug: cloneSlug.trim(),
        description: cloneDescription.trim(),
        icon: cloneIcon.trim(),
        isActive: true,
        displayOrder: categories.length + 1,
      });
      if (res.success && res.data) {
        // Reload all categories
        const reloadRes = await getCategoryDependentCountsAction(res.data);
        toast.success('Service category cloned successfully. Refreshing list...');
        window.location.reload();
      } else {
        toast.error(res.error || 'Failed to clone category.');
      }
    });
  };

  // Handle Export Category
  const handleExport = async () => {
    startTransition(async () => {
      const res = await exportServiceCategoryAction(selectedCategory.id);
      if (res.success && res.data) {
        const blob = new Blob([res.data], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `category-${selectedCategory.slug}-export.json`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
        toast.success('Category exported successfully.');
      } else {
        toast.error(res.error || 'Failed to export category.');
      }
    });
  };

  return (
    <div className="p-6 border border-border rounded-2xl bg-card shadow-sm space-y-6">
      {/* Category main details */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div className="flex items-start gap-4">
          <div className="p-3.5 rounded-xl bg-primary/10 text-primary border border-primary/20 shadow-sm mt-1">
            <IconComponent className="w-6.5 h-6.5" />
          </div>
          <div className="space-y-1.5">
            <div className="flex items-center gap-2.5 flex-wrap">
              <h2 className="text-xl font-bold tracking-tight text-foreground">{selectedCategory.name}</h2>
              <Badge variant={selectedCategory.isActive ? 'default' : 'secondary'} className="rounded-lg text-xs font-semibold px-2 py-0.5">
                {selectedCategory.isActive ? (
                  <span className="flex items-center gap-1"><CheckCircle className="w-3 h-3 text-emerald-400" /> Active</span>
                ) : (
                  <span className="flex items-center gap-1"><XCircle className="w-3 h-3 text-slate-500" /> Inactive</span>
                )}
              </Badge>
            </div>
            <p className="text-sm text-muted-foreground max-w-2xl leading-relaxed">
              {selectedCategory.description || 'No description provided.'}
            </p>
            <div className="pt-2">
              <ServiceCategorySelect
                categories={categories}
                selectedId={selectedCategoryId || ''}
                onChange={setSelectedCategoryId}
                disabled={isPending}
              />
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="flex items-center gap-2 w-full md:w-auto">
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              setEditName(selectedCategory.name);
              setEditSlug(selectedCategory.slug);
              setEditDescription(selectedCategory.description || '');
              setEditIcon(selectedCategory.icon || 'Layers');
              setIsEditOpen(true);
            }}
            className="flex-1 md:flex-none h-9 rounded-xl border border-border bg-background/50 hover:bg-muted text-xs font-semibold"
            disabled={isPending}
          >
            <Edit3 className="w-3.5 h-3.5 mr-1.5 text-indigo-400" />
            Edit Category
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              setCloneName(`${selectedCategory.name} (Clone)`);
              setCloneSlug(`${selectedCategory.slug}-clone`);
              setCloneDescription(selectedCategory.description || '');
              setCloneIcon(selectedCategory.icon || 'Layers');
              setIsCloneOpen(true);
            }}
            className="flex-1 md:flex-none h-9 rounded-xl border border-border bg-background/50 hover:bg-muted text-xs font-semibold"
            disabled={isPending}
          >
            <Copy className="w-3.5 h-3.5 mr-1.5 text-emerald-400" />
            Clone
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={handleExport}
            className="flex-1 md:flex-none h-9 rounded-xl border border-border bg-background/50 hover:bg-muted text-xs font-semibold"
            disabled={isPending}
          >
            {isPending ? (
              <Loader2 className="w-3.5 h-3.5 animate-spin mr-1.5 text-blue-400" />
            ) : (
              <Download className="w-3.5 h-3.5 mr-1.5 text-blue-400" />
            )}
            Export JSON
          </Button>
        </div>
      </div>

      {/* Stats counter row */}
      <div className="grid grid-cols-3 gap-4 pt-4 border-t border-border/60">
        <div className="flex items-center gap-3.5 p-3 rounded-xl bg-muted/30 border border-border/40">
          <div className="p-2 rounded-lg bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
            <Package className="w-4 h-4" />
          </div>
          <div>
            <span className="text-[10px] text-muted-foreground uppercase font-bold tracking-wider block leading-none">Packages</span>
            <span className="text-lg font-extrabold text-foreground leading-tight">
              {isLoadingStats ? <Loader2 className="w-4 h-4 animate-spin text-muted-foreground mt-1" /> : stats?.packages ?? 0}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-3.5 p-3 rounded-xl bg-muted/30 border border-border/40">
          <div className="p-2 rounded-lg bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
            <Layers className="w-4 h-4" />
          </div>
          <div>
            <span className="text-[10px] text-muted-foreground uppercase font-bold tracking-wider block leading-none">Service Types</span>
            <span className="text-lg font-extrabold text-foreground leading-tight">
              {isLoadingStats ? <Loader2 className="w-4 h-4 animate-spin text-muted-foreground mt-1" /> : stats?.serviceTypes ?? 0}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-3.5 p-3 rounded-xl bg-muted/30 border border-border/40">
          <div className="p-2 rounded-lg bg-blue-500/10 text-blue-400 border border-blue-500/20">
            <Building2 className="w-4 h-4" />
          </div>
          <div>
            <span className="text-[10px] text-muted-foreground uppercase font-bold tracking-wider block leading-none">Industries</span>
            <span className="text-lg font-extrabold text-foreground leading-tight">
              {isLoadingStats ? <Loader2 className="w-4 h-4 animate-spin text-muted-foreground mt-1" /> : stats?.industries ?? 0}
            </span>
          </div>
        </div>
      </div>

      {/* Edit Dialog Modal */}
      <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
        <DialogContent className="sm:max-w-[500px] border-border bg-popover text-popover-foreground rounded-2xl">
          <form onSubmit={handleEditSubmit} className="space-y-4">
            <DialogHeader>
              <DialogTitle className="text-base font-bold text-foreground">Edit Category Details</DialogTitle>
              <DialogDescription className="text-muted-foreground text-xs">
                Update the metadata settings for this service category.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-3.5">
              <div className="space-y-1">
                <Label className="text-muted-foreground text-xs">Category Name</Label>
                <Input
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                  className="bg-background border-border text-foreground rounded-xl"
                  disabled={isPending}
                />
              </div>
              <div className="space-y-1">
                <Label className="text-muted-foreground text-xs">Slug</Label>
                <Input
                  value={editSlug}
                  onChange={(e) => setEditSlug(e.target.value)}
                  className="bg-background border-border text-foreground rounded-xl"
                  disabled={isPending}
                />
              </div>
              <div className="space-y-1">
                <Label className="text-muted-foreground text-xs">Description</Label>
                <Textarea
                  value={editDescription}
                  onChange={(e) => setEditDescription(e.target.value)}
                  className="bg-background border-border text-foreground rounded-xl resize-none h-20"
                  disabled={isPending}
                />
              </div>
              <div className="space-y-1">
                <Label className="text-muted-foreground text-xs">Lucide Icon Name</Label>
                <Input
                  value={editIcon}
                  onChange={(e) => setEditIcon(e.target.value)}
                  className="bg-background border-border text-foreground rounded-xl"
                  disabled={isPending}
                />
              </div>
            </div>
            <DialogFooter className="gap-2 sm:gap-0">
              <Button type="button" variant="ghost" onClick={() => setIsEditOpen(false)} className="rounded-xl border border-border" disabled={isPending}>
                Cancel
              </Button>
              <Button type="submit" className="rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white" disabled={isPending}>
                {isPending && <Loader2 className="w-4 h-4 animate-spin mr-1.5" />}
                Save Changes
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Clone Dialog Modal */}
      <Dialog open={isCloneOpen} onOpenChange={setIsCloneOpen}>
        <DialogContent className="sm:max-w-[500px] border-border bg-popover text-popover-foreground rounded-2xl">
          <form onSubmit={handleCloneSubmit} className="space-y-4">
            <DialogHeader>
              <DialogTitle className="text-base font-bold text-foreground">Clone Service Category Ecosystem</DialogTitle>
              <DialogDescription className="text-muted-foreground text-xs">
                Duplicate this category and all its nested pricing templates, features, and addons.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-3.5">
              <div className="space-y-1">
                <Label className="text-muted-foreground text-xs">New Category Name</Label>
                <Input
                  value={cloneName}
                  onChange={(e) => setCloneName(e.target.value)}
                  className="bg-background border-border text-foreground rounded-xl"
                  disabled={isPending}
                />
              </div>
              <div className="space-y-1">
                <Label className="text-muted-foreground text-xs">New Slug</Label>
                <Input
                  value={cloneSlug}
                  onChange={(e) => setCloneSlug(e.target.value)}
                  className="bg-background border-border text-foreground rounded-xl"
                  disabled={isPending}
                />
              </div>
              <div className="space-y-1">
                <Label className="text-muted-foreground text-xs">Description</Label>
                <Textarea
                  value={cloneDescription}
                  onChange={(e) => setCloneDescription(e.target.value)}
                  className="bg-background border-border text-foreground rounded-xl resize-none h-20"
                  disabled={isPending}
                />
              </div>
              <div className="space-y-1">
                <Label className="text-muted-foreground text-xs">Lucide Icon Name</Label>
                <Input
                  value={cloneIcon}
                  onChange={(e) => setCloneIcon(e.target.value)}
                  className="bg-background border-border text-foreground rounded-xl"
                  disabled={isPending}
                />
              </div>
            </div>
            <DialogFooter className="gap-2 sm:gap-0">
              <Button type="button" variant="ghost" onClick={() => setIsCloneOpen(false)} className="rounded-xl border border-border" disabled={isPending}>
                Cancel
              </Button>
              <Button type="submit" className="rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white" disabled={isPending}>
                {isPending && <Loader2 className="w-4 h-4 animate-spin mr-1.5" />}
                Duplicate Ecosystem
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
