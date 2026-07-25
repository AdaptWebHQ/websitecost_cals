"use client";

import React, { useState, useEffect, useTransition } from "react";
import { toast } from "sonner";
import DataTable from "@/components/shared/data-table";
import { Button } from "@/components/ui/button";
import { TableRow, TableCell } from "@/components/ui/table";
import { 
  PlusCircle, 
  Loader2, 
  HelpCircle, 
  ChevronRight, 
  ChevronDown, 
  ToggleLeft,
  ToggleRight,
  Search,
  Library
} from "lucide-react";
import * as Icons from "lucide-react";

import {
  deletePackageFeatureCategoryAction,
  updatePackageFeatureCategoryAction,
  reorderPackageFeatureCategoriesAction,
  getPackageFeatureCategoriesAction,
} from "@/actions/package-feature-categories";
import {
  deletePackageFeatureAction,
  updatePackageFeatureAction,
  reorderPackageFeaturesAction,
  getPackageFeaturesAction,
} from "@/actions/package-features";
import type { PackageFeatureCategory, PackageFeature } from "@/types";
import AdminCategoryHeader from "./admin-category-header";
import { useAdminCategoryStore } from "@/store/admin-category-store";

// Child Sub-components
import { CategoryDialog } from "./package-features/category-dialog";
import { FeatureDialog } from "./package-features/feature-dialog";
import { FeatureSubTable } from "./package-features/feature-sub-table";

interface PackageFeaturesClientPageProps {
  categories: any[];
  initialCategoryId: string;
  initialCategories: PackageFeatureCategory[];
  initialFeatures: PackageFeature[];
}

export default function PackageFeaturesClientPage({
  categories: initialCategoriesData,
  initialCategoryId,
  initialCategories,
  initialFeatures,
}: PackageFeaturesClientPageProps) {
  const { selectedCategoryId, categories: serviceCategories } = useAdminCategoryStore();
  const [categories, setCategories] = useState<PackageFeatureCategory[]>([]);
  const [features, setFeatures] = useState<PackageFeature[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [expandedCategoryIds, setExpandedCategoryIds] = useState<Record<string, boolean>>({});
  const [isPending, startTransition] = useTransition();

  // Modals visibility states
  const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<PackageFeatureCategory | null>(null);

  const [isFeatureModalOpen, setIsFeatureModalOpen] = useState(false);
  const [editingFeature, setEditingFeature] = useState<PackageFeature | null>(null);
  const [featureCategoryId, setFeatureCategoryId] = useState("");

  // Load and refresh categories and features
  useEffect(() => {
    if (!selectedCategoryId) {
      setCategories([]);
      setFeatures([]);
      return;
    }
    startTransition(async () => {
      const [catsRes, featsRes] = await Promise.all([
        getPackageFeatureCategoriesAction(selectedCategoryId!),
        getPackageFeaturesAction(selectedCategoryId!),
      ]);
      if (catsRes.success && catsRes.data) {
        setCategories(catsRes.data.sort((a, b) => a.displayOrder - b.displayOrder));
      } else {
        setCategories([]);
      }
      if (featsRes.success && featsRes.data) {
        setFeatures(featsRes.data.sort((a, b) => a.displayOrder - b.displayOrder));
      } else {
        setFeatures([]);
      }
    });
  }, [selectedCategoryId]);

  const toggleExpandCategory = (catId: string) => {
    setExpandedCategoryIds((prev) => ({
      ...prev,
      [catId]: !prev[catId],
    }));
  };

  // --- Category Handlers ---
  const openAddCategoryModal = () => {
    if (!selectedCategoryId) {
      toast.error("Select a service category first.");
      return;
    }
    setEditingCategory(null);
    setIsCategoryModalOpen(true);
  };

  const openEditCategoryModal = (cat: PackageFeatureCategory) => {
    setEditingCategory(cat);
    setIsCategoryModalOpen(true);
  };

  const handleCategorySuccess = (cat: PackageFeatureCategory, isEdit: boolean) => {
    if (isEdit) {
      setCategories((prev) =>
        prev.map((c) => (c.id === cat.id ? cat : c)).sort((a, b) => a.displayOrder - b.displayOrder)
      );
    } else {
      setCategories((prev) => [...prev, cat].sort((a, b) => a.displayOrder - b.displayOrder));
    }
  };

  const handleDeleteCategory = (id: string) => {
    toast("Delete this category?", {
      description: "All its package features will lose their reference, and this will fail if the category contains active features.",
      action: {
        label: "Delete",
        onClick: async () => {
          try {
            const res = await deletePackageFeatureCategoryAction(id);
            if (res.success) {
              setCategories((prev) => prev.filter((c) => c.id !== id));
              toast.success("Category deleted successfully.");
            } else {
              toast.error(res.error || "Failed to delete category.");
            }
          } catch (err) {
            console.error(err);
            toast.error("An unexpected error occurred.");
          }
        },
      },
      cancel: { label: "Cancel", onClick: () => {} },
    });
  };

  const handleToggleCategoryActive = async (id: string, currentActive: boolean) => {
    const cat = categories.find((c) => c.id === id);
    if (!cat) return;
    const nextActive = !currentActive;
    try {
      const res = await updatePackageFeatureCategoryAction(id, {
        serviceCategoryId: cat.serviceCategoryId,
        name: cat.name,
        description: cat.description || "",
        icon: cat.icon,
        displayOrder: cat.displayOrder,
        isActive: nextActive,
      });
      if (res.success && res.data) {
        setCategories((prev) => prev.map((c) => (c.id === id ? res.data! : c)));
        toast.success("Category status updated.");
      } else {
        toast.error(res.error || "Failed to update category status.");
      }
    } catch (err) {
      console.error(err);
      toast.error("An unexpected error occurred.");
    }
  };

  // --- Feature Handlers ---
  const openAddFeatureModal = (catId: string) => {
    setEditingFeature(null);
    setFeatureCategoryId(catId);
    setIsFeatureModalOpen(true);
  };

  const openEditFeatureModal = (feat: PackageFeature) => {
    setEditingFeature(feat);
    setFeatureCategoryId(feat.categoryId);
    setIsFeatureModalOpen(true);
  };

  const handleFeatureSuccess = (feat: PackageFeature, isEdit: boolean) => {
    if (isEdit) {
      setFeatures((prev) =>
        prev.map((f) => (f.id === feat.id ? feat : f)).sort((a, b) => a.displayOrder - b.displayOrder)
      );
    } else {
      setFeatures((prev) => [...prev, feat].sort((a, b) => a.displayOrder - b.displayOrder));
    }
  };

  const handleDeleteFeature = (id: string) => {
    toast("Delete this feature?", {
      description: "This will remove the feature from the library, and from any packages referencing it.",
      action: {
        label: "Delete",
        onClick: async () => {
          try {
            const res = await deletePackageFeatureAction(id);
            if (res.success) {
              setFeatures((prev) => prev.filter((f) => f.id !== id));
              toast.success("Feature deleted successfully.");
            } else {
              toast.error(res.error || "Failed to delete feature.");
            }
          } catch (err) {
            console.error(err);
            toast.error("An unexpected error occurred.");
          }
        },
      },
      cancel: { label: "Cancel", onClick: () => {} },
    });
  };

  const handleToggleFeatureActive = async (id: string, currentActive: boolean) => {
    const feat = features.find((f) => f.id === id);
    if (!feat) return;
    const nextActive = !currentActive;
    try {
      const res = await updatePackageFeatureAction(id, {
        serviceCategoryId: feat.serviceCategoryId,
        categoryId: feat.categoryId,
        name: feat.name,
        description: feat.description || "",
        displayOrder: feat.displayOrder,
        isActive: nextActive,
        packageIds: feat.packageIds || [],
        isRequired: feat.isRequired || false,
      });
      if (res.success && res.data) {
        setFeatures((prev) => prev.map((f) => (f.id === id ? res.data! : f)));
        toast.success("Feature status updated.");
      } else {
        toast.error(res.error || "Failed to update feature status.");
      }
    } catch (err) {
      console.error(err);
      toast.error("An unexpected error occurred.");
    }
  };

  const handleFeatureReorder = async (orderedIds: string[]) => {
    startTransition(async () => {
      const res = await reorderPackageFeaturesAction(orderedIds);
      if (res.success) {
        toast.success("Feature order saved.");
      } else {
        toast.error(res.error || "Failed to save feature order.");
      }
    });
  };

  const handleFeatureReorderSync = (catId: string, orderedIds: string[]) => {
    const rest = features.filter((f) => f.categoryId !== catId);
    const subset = features.filter((f) => f.categoryId === catId);
    const sortedSubset = [...subset].sort((a, b) => {
      const aIdx = orderedIds.indexOf(a.id);
      const bIdx = orderedIds.indexOf(b.id);
      return aIdx - bIdx;
    }).map((f, i) => ({ ...f, displayOrder: i + 1 }));

    setFeatures([...rest, ...sortedSubset].sort((a, b) => a.displayOrder - b.displayOrder));
    handleFeatureReorder(orderedIds);
  };

  const columns = [
    { key: "expand", label: "", className: "w-10 pl-6" },
    { key: "icon", label: "Icon", className: "w-16" },
    { key: "name", label: "Category Details" },
    { key: "serviceCategory", label: "Service Category" },
    { key: "displayOrder", label: "Display Order" },
    { key: "status", label: "Status" },
    { key: "createdAt", label: "Created Date" },
    { key: "actions", label: "Actions", className: "text-right py-4 pr-6" },
  ];

  const filteredCategories = categories.filter((cat) => {
    const search = searchTerm.toLowerCase();
    const catMatches = 
      cat.name?.toLowerCase().includes(search) ||
      cat.description?.toLowerCase().includes(search);
      
    const hasMatchingFeatures = features.some(
      (f) => f.categoryId === cat.id && (
        f.name?.toLowerCase().includes(search) ||
        f.description?.toLowerCase().includes(search)
      )
    );
    
    return catMatches || hasMatchingFeatures;
  });

  return (
    <div className="space-y-6">
      {/* Category Header */}
      <AdminCategoryHeader />

      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-4 border border-border rounded-2xl bg-card">
        <div className="relative w-full sm:max-w-md">
          <Search className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search category or feature name..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full h-10 bg-background border border-border rounded-xl pl-10 pr-4 text-sm text-foreground placeholder:text-muted-foreground/60 focus:outline-none focus:border-indigo-500/50 transition-colors"
          />
        </div>
        <Button
          onClick={openAddCategoryModal}
          className="bg-indigo-600 hover:bg-indigo-500 text-white gap-2 rounded-xl h-10 px-5"
          disabled={isPending}
        >
          <PlusCircle className="w-4 h-4" />
          Add Category
        </Button>
      </div>

      {isPending && (
        <div className="flex items-center justify-center p-12">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
          <span className="ml-3 text-muted-foreground">Loading features library...</span>
        </div>
      )}

      {/* Listing Table */}
      {!isPending && categories.length > 0 && (
        <DataTable
          columns={columns}
          data={filteredCategories}
          emptyMessage={searchTerm ? "No categories match your search criteria." : "No categories defined yet. Get started by clicking Add Category."}
          renderRow={(cat) => {
            const IconComponent = (Icons as unknown as Record<string, React.ComponentType<{ className?: string }>>)[cat.icon] || HelpCircle;
            const isExpanded = !!expandedCategoryIds[cat.id];
            const catFeatures = features.filter((f) => {
              if (f.categoryId !== cat.id) return false;
              if (!searchTerm) return true;
              const search = searchTerm.toLowerCase();
              const catMatches = 
                cat.name?.toLowerCase().includes(search) ||
                cat.description?.toLowerCase().includes(search);
              if (catMatches) return true;
              return (
                f.name?.toLowerCase().includes(search) ||
                f.description?.toLowerCase().includes(search)
              );
            });

            return (
              <React.Fragment key={cat.id}>
                <TableRow className="hover:bg-muted/40 border-border transition-colors">
                  <TableCell className="py-4 pl-6">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => toggleExpandCategory(cat.id)}
                      className="w-8 h-8 rounded-lg text-muted-foreground hover:text-foreground transition-colors"
                    >
                      {isExpanded ? (
                        <ChevronDown className="w-4 h-4 text-indigo-400" />
                      ) : (
                        <ChevronRight className="w-4 h-4" />
                      )}
                    </Button>
                  </TableCell>
                  <TableCell className="py-4 text-muted-foreground">
                    <div className="w-10 h-10 rounded-xl bg-muted border border-border flex items-center justify-center shadow-inner">
                      <IconComponent className="w-4.5 h-4.5 text-indigo-400" />
                    </div>
                  </TableCell>
                  <TableCell className="font-medium text-foreground">
                    <div className="flex flex-col">
                      <span className="flex items-center gap-2.5 text-sm font-semibold">
                        {cat.name}
                      </span>
                      {cat.description && (
                        <span className="text-xs text-muted-foreground font-normal mt-0.5 max-w-sm truncate">
                          {cat.description}
                        </span>
                      )}
                    </div>
                  </TableCell>
                  <TableCell className="text-muted-foreground text-xs">
                    {serviceCategories.find(c => c.id === selectedCategoryId)?.name || "N/A"}
                  </TableCell>
                  <TableCell className="text-muted-foreground text-xs font-semibold pl-4">
                    Position {cat.displayOrder}
                  </TableCell>
                  <TableCell>
                    <button
                      onClick={() => handleToggleCategoryActive(cat.id, cat.isActive)}
                      className="text-slate-400 hover:text-white transition-colors cursor-pointer"
                      title={cat.isActive ? "Deactivate Category" : "Activate Category"}
                    >
                      {cat.isActive ? (
                        <ToggleRight className="w-8 h-8 text-emerald-400" />
                      ) : (
                        <ToggleLeft className="w-8 h-8 text-slate-500" />
                      )}
                    </button>
                  </TableCell>
                  <TableCell className="text-muted-foreground text-xs">
                    {cat.createdAt ? new Date(cat.createdAt).toLocaleDateString() : "N/A"}
                  </TableCell>
                  <TableCell className="text-right py-4 pr-6">
                    <div className="flex items-center justify-end gap-1">
                      <Button
                        onClick={() => openAddFeatureModal(cat.id)}
                        className="bg-indigo-600/10 hover:bg-indigo-600/20 text-indigo-400 border border-indigo-500/20 rounded-lg text-xs font-semibold h-7.5 px-3 mr-1"
                      >
                        Add Feature
                      </Button>
                      <Button
                        onClick={() => openEditCategoryModal(cat)}
                        variant="ghost"
                        size="icon"
                        className="text-slate-400 hover:text-white hover:bg-slate-800/40 rounded-lg w-7.5 h-7.5"
                      >
                        <Icons.Edit className="w-3.5 h-3.5" />
                      </Button>
                      <Button
                        onClick={() => handleDeleteCategory(cat.id)}
                        variant="ghost"
                        size="icon"
                        className="text-red-400 hover:text-red-300 hover:bg-red-500/10 rounded-lg w-7.5 h-7.5"
                      >
                        <Icons.Trash className="w-3.5 h-3.5" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>

                {/* Sub features rows */}
                {isExpanded && (
                  <TableRow className="bg-muted/[0.1] border-none hover:bg-transparent">
                    <TableCell colSpan={8} className="p-0 border-b border-border">
                      <div className="pl-16 pr-6 pb-6 pt-2">
                        <FeatureSubTable
                          catId={cat.id}
                          catFeatures={catFeatures}
                          features={features}
                          onEdit={openEditFeatureModal}
                          onDelete={handleDeleteFeature}
                          onToggleActive={handleToggleFeatureActive}
                          onReorder={handleFeatureReorderSync}
                        />
                      </div>
                    </TableCell>
                  </TableRow>
                )}
              </React.Fragment>
            );
          }}
        />
      )}

      {/* Empty State Banner */}
      {!isPending && categories.length === 0 && (
        <div className="flex flex-col items-center justify-center p-12 border border-dashed border-border rounded-2xl bg-card space-y-4">
          <div className="p-4 bg-primary/10 rounded-full text-primary">
            <Library className="w-10 h-10" />
          </div>
          <div className="text-center space-y-1">
            <h3 className="text-base font-bold">No feature categories found</h3>
            <p className="text-sm text-muted-foreground max-w-sm">
              No package feature categories available for this Service Category yet.
            </p>
          </div>
          <Button onClick={openAddCategoryModal} className="rounded-xl h-10 px-5">
            Create Feature Category
          </Button>
        </div>
      )}

      {/* Modals */}
      {selectedCategoryId && (
        <>
          <CategoryDialog
            isOpen={isCategoryModalOpen}
            onOpenChange={setIsCategoryModalOpen}
            editingCategory={editingCategory}
            selectedCategoryId={selectedCategoryId}
            categoriesCount={categories.length}
            onSuccess={handleCategorySuccess}
          />
          <FeatureDialog
            isOpen={isFeatureModalOpen}
            onOpenChange={setIsFeatureModalOpen}
            editingFeature={editingFeature}
            selectedCategoryId={selectedCategoryId}
            featureCategoryId={featureCategoryId}
            categoryName={categories.find((c) => c.id === featureCategoryId)?.name || ""}
            featuresCount={features.filter((f) => f.categoryId === featureCategoryId).length}
            onSuccess={handleFeatureSuccess}
          />
        </>
      )}
    </div>
  );
}
