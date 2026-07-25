'use client';

import React, { useState, useEffect, useTransition, useMemo } from 'react';
import { toast } from 'sonner';
import DataTable from '@/components/shared/data-table';
import { Button } from '@/components/ui/button';
import { Table, TableHeader, TableHead, TableBody, TableRow, TableCell } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { 
  PlusCircle, 
  Edit, 
  Trash, 
  Loader2, 
  HelpCircle, 
  ChevronRight, 
  ChevronDown, 
  ToggleLeft,
  ToggleRight,
  GripVertical,
  Search,
  FolderTree
} from 'lucide-react';
import * as Icons from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Checkbox } from '@/components/ui/checkbox';
import { Textarea } from '@/components/ui/textarea';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import {
  createAddonCategoryAction,
  updateAddonCategoryAction,
  deleteAddonCategoryAction,
  toggleAddonCategoryActiveAction,
  reorderAddonCategoriesAction,
  getAddonCategoriesAction,
} from '@/actions/addon-categories';
import {
  createAddonFeatureAction,
  updateAddonFeatureAction,
  deleteAddonFeatureAction,
  toggleAddonFeatureActiveAction,
  reorderAddonFeaturesAction,
  getAddonFeaturesAction,
} from '@/actions/addon-features';
import type { AddonCategory, AddonFeature, PricingType, ServiceCategory } from '@/types';
import AdminCategoryHeader from './admin-category-header';
import { useAdminCategoryStore } from '@/store/admin-category-store';
import { slugify } from '@/lib/utils';

interface AddonsClientPageProps {
  categories: ServiceCategory[];
  initialCategoryId: string;
  initialCategories: AddonCategory[];
  initialAddons?: AddonFeature[];
}

export default function AddonsClientPage({
  categories: initialCategoriesData,
  initialCategoryId,
  initialCategories,
  initialAddons = [],
}: AddonsClientPageProps) {
  const { selectedCategoryId, categories: serviceCategories } = useAdminCategoryStore();
  const [categories, setCategories] = useState<AddonCategory[]>([]);
  const [addons, setAddons] = useState<AddonFeature[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [expandedCategoryIds, setExpandedCategoryIds] = useState<Record<string, boolean>>({});
  const [isPending, startTransition] = useTransition();

  // Drag and drop states
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);
  const [draggedCatId, setDraggedCatId] = useState<string | null>(null);

  // Category Modal State
  const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<AddonCategory | null>(null);
  const [isCategorySubmitting, setIsCategorySubmitting] = useState(false);
  const [categoryErrorMsg, setCategoryErrorMsg] = useState<string | null>(null);

  // Category Form Fields
  const [catName, setCatName] = useState('');
  const [catDescription, setCatDescription] = useState('');
  const [catIcon, setCatIcon] = useState('Layers');
  const [catIsActive, setCatIsActive] = useState(true);
  const [catSortOrder, setCatSortOrder] = useState(0);

  // Addon Modal State
  const [isAddonModalOpen, setIsAddonModalOpen] = useState(false);
  const [editingAddon, setEditingAddon] = useState<AddonFeature | null>(null);
  const [isAddonSubmitting, setIsAddonSubmitting] = useState(false);
  const [addonErrorMsg, setAddonErrorMsg] = useState<string | null>(null);

  // Addon Form Fields
  const [addonCategoryId, setAddonCategoryId] = useState('');
  const [addonName, setAddonName] = useState('');
  const [addonDescription, setAddonDescription] = useState('');
  const [addonPricingType, setAddonPricingType] = useState<PricingType>('fixed');
  const [addonPrice, setAddonPrice] = useState(0);
  const [addonDefaultSelected, setAddonDefaultSelected] = useState(false);
  const [addonIsActive, setAddonIsActive] = useState(true);
  const [addonSortOrder, setAddonSortOrder] = useState(0);

  // Load and refresh categories and addons
  useEffect(() => {
    if (!selectedCategoryId) {
      setCategories([]);
      setAddons([]);
      return;
    }
    startTransition(async () => {
      const [catsRes, addonsRes] = await Promise.all([
        getAddonCategoriesAction(selectedCategoryId!),
        getAddonFeaturesAction(selectedCategoryId!),
      ]);
      if (catsRes.success && catsRes.data) {
        setCategories(catsRes.data.sort((a, b) => a.sortOrder - b.sortOrder));
      } else {
        setCategories([]);
      }
      if (addonsRes.success && addonsRes.data) {
        setAddons(addonsRes.data.sort((a, b) => a.sortOrder - b.sortOrder));
      } else {
        setAddons([]);
      }
    });
  }, [selectedCategoryId]);

  const toggleExpandCategory = (catId: string) => {
    setExpandedCategoryIds((prev) => ({
      ...prev,
      [catId]: !prev[catId],
    }));
  };

  // --- Category Actions ---
  const openAddCategoryModal = () => {
    if (!selectedCategoryId) {
      toast.error('Select a service category first.');
      return;
    }
    setEditingCategory(null);
    setCatName('');
    setCatDescription('');
    setCatIcon('Layers');
    setCatIsActive(true);
    setCatSortOrder(categories.length + 1);
    setCategoryErrorMsg(null);
    setIsCategoryModalOpen(true);
  };

  const openEditCategoryModal = (cat: AddonCategory) => {
    setEditingCategory(cat);
    setCatName(cat.name);
    setCatDescription(cat.description || '');
    setCatIcon(cat.icon || 'Layers');
    setCatIsActive(cat.isActive);
    setCatSortOrder(cat.sortOrder);
    setCategoryErrorMsg(null);
    setIsCategoryModalOpen(true);
  };

  const handleCategorySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isCategorySubmitting) return;

    if (!catName.trim()) {
      setCategoryErrorMsg('Category name is required.');
      return;
    }
    if (!selectedCategoryId) return;

    setIsCategorySubmitting(true);
    setCategoryErrorMsg(null);

    const formData = {
      serviceCategoryId: selectedCategoryId!,
      name: catName.trim(),
      description: catDescription.trim(),
      icon: catIcon.trim(),
      isActive: catIsActive,
      sortOrder: catSortOrder,
    };

    try {
      if (editingCategory) {
        const res = await updateAddonCategoryAction(editingCategory.id, formData);
        if (res.success && res.data) {
          setCategories((prev) =>
            prev.map((c) => (c.id === editingCategory.id ? res.data! : c)).sort((a, b) => a.sortOrder - b.sortOrder)
          );
          setIsCategoryModalOpen(false);
          toast.success('Category updated successfully.');
        } else {
          setCategoryErrorMsg(res.error || 'Failed to update category.');
        }
      } else {
        const res = await createAddonCategoryAction(formData);
        if (res.success && res.data) {
          setCategories((prev) => [...prev, res.data!].sort((a, b) => a.sortOrder - b.sortOrder));
          setIsCategoryModalOpen(false);
          toast.success('Category created successfully.');
        } else {
          setCategoryErrorMsg(res.error || 'Failed to create category.');
        }
      }
    } catch (err) {
      console.error(err);
      setCategoryErrorMsg('An unexpected error occurred.');
    } finally {
      setIsCategorySubmitting(false);
    }
  };

  const handleDeleteCategory = (id: string) => {
    toast('Delete this category?', {
      description: 'All its addons will lose their reference, and this will fail if the category contains active addons.',
      action: {
        label: 'Delete',
        onClick: async () => {
          try {
            const res = await deleteAddonCategoryAction(id);
            if (res.success) {
              setCategories((prev) => prev.filter((c) => c.id !== id));
              toast.success('Category deleted successfully.');
            } else {
              toast.error(res.error || 'Failed to delete category.');
            }
          } catch (err) {
            console.error(err);
            toast.error('An unexpected error occurred.');
          }
        },
      },
    });
  };

  const handleToggleCategoryActive = async (id: string, currentActive: boolean) => {
    const nextActive = !currentActive;
    try {
      const res = await toggleAddonCategoryActiveAction(id, nextActive);
      if (res.success && res.data) {
        setCategories((prev) => prev.map((c) => (c.id === id ? res.data! : c)));
        toast.success('Category status updated.');
      } else {
        toast.error(res.error || 'Failed to update category status.');
      }
    } catch (err) {
      console.error(err);
      toast.error('An unexpected error occurred.');
    }
  };

  // --- Addon Actions ---
  const openAddAddonModal = (catId: string) => {
    const catAddons = addons.filter((a) => a.categoryId === catId);
    setEditingAddon(null);
    setAddonCategoryId(catId);
    setAddonName('');
    setAddonDescription('');
    setAddonPricingType('fixed');
    setAddonPrice(0);
    setAddonDefaultSelected(false);
    setAddonIsActive(true);
    setAddonSortOrder(catAddons.length + 1);
    setAddonErrorMsg(null);
    setIsAddonModalOpen(true);
  };

  const openEditAddonModal = (addon: AddonFeature) => {
    setEditingAddon(addon);
    setAddonCategoryId(addon.categoryId);
    setAddonName(addon.name);
    setAddonDescription(addon.description || '');
    setAddonPricingType(addon.pricingType);
    setAddonPrice(addon.price);
    setAddonDefaultSelected(addon.defaultSelected || false);
    setAddonIsActive(addon.isActive);
    setAddonSortOrder(addon.sortOrder);
    setAddonErrorMsg(null);
    setIsAddonModalOpen(true);
  };

  const handleAddonSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isAddonSubmitting) return;

    if (!addonName.trim()) {
      setAddonErrorMsg('Add-on name is required.');
      return;
    }
    if (!selectedCategoryId) return;

    setIsAddonSubmitting(true);
    setAddonErrorMsg(null);

    const formData = {
      serviceCategoryId: selectedCategoryId!,
      categoryId: addonCategoryId,
      name: addonName.trim(),
      slug: slugify(addonName),
      description: addonDescription.trim(),
      pricingType: addonPricingType,
      price: Number(addonPrice),
      defaultSelected: addonDefaultSelected,
      isActive: addonIsActive,
      sortOrder: addonSortOrder,
    };

    try {
      if (editingAddon) {
        const res = await updateAddonFeatureAction(editingAddon.id, formData);
        if (res.success && res.data) {
          setAddons((prev) =>
            prev.map((a) => (a.id === editingAddon.id ? res.data! : a)).sort((a, b) => a.sortOrder - b.sortOrder)
          );
          setIsAddonModalOpen(false);
          toast.success('Addon updated successfully.');
        } else {
          setAddonErrorMsg(res.error || 'Failed to update addon.');
        }
      } else {
        const res = await createAddonFeatureAction(formData);
        if (res.success && res.data) {
          setAddons((prev) => [...prev, res.data!].sort((a, b) => a.sortOrder - b.sortOrder));
          setIsAddonModalOpen(false);
          toast.success('Addon created successfully.');
        } else {
          setAddonErrorMsg(res.error || 'Failed to create addon.');
        }
      }
    } catch (err) {
      console.error(err);
      setAddonErrorMsg('An unexpected error occurred.');
    } finally {
      setIsAddonSubmitting(false);
    }
  };

  const handleDeleteAddon = (id: string) => {
    toast('Delete this addon?', {
      description: 'This will remove the addon from the ecosystem permanently.',
      action: {
        label: 'Delete',
        onClick: async () => {
          try {
            const res = await deleteAddonFeatureAction(id);
            if (res.success) {
              setAddons((prev) => prev.filter((a) => a.id !== id));
              toast.success('Addon deleted successfully.');
            } else {
              toast.error(res.error || 'Failed to delete addon.');
            }
          } catch (err) {
            console.error(err);
            toast.error('An unexpected error occurred.');
          }
        },
      },
    });
  };

  const handleToggleAddonActive = async (id: string, currentActive: boolean) => {
    const nextActive = !currentActive;
    try {
      const res = await toggleAddonFeatureActiveAction(id, nextActive);
      if (res.success && res.data) {
        setAddons((prev) => prev.map((a) => (a.id === id ? res.data! : a)));
        toast.success('Addon status updated.');
      } else {
        toast.error(res.error || 'Failed to update status.');
      }
    } catch (err) {
      console.error(err);
      toast.error('An unexpected error occurred.');
    }
  };

  const handleCategoryReorder = async (orderedIds: string[]) => {
    const sorted = [...categories].sort((a, b) => {
      const aIdx = orderedIds.indexOf(a.id);
      const bIdx = orderedIds.indexOf(b.id);
      return aIdx - bIdx;
    }).map((c, i) => ({ ...c, sortOrder: i + 1 }));

    setCategories(sorted);

    startTransition(async () => {
      const res = await reorderAddonCategoriesAction(orderedIds);
      if (res.success) {
        toast.success('Category order saved.');
      } else {
        toast.error(res.error || 'Failed to save category order.');
      }
    });
  };

  const handleAddonReorder = async (catId: string, orderedIds: string[]) => {
    const rest = addons.filter((a) => a.categoryId !== catId);
    const subset = addons.filter((a) => a.categoryId === catId);
    const sortedSubset = [...subset].sort((a, b) => {
      const aIdx = orderedIds.indexOf(a.id);
      const bIdx = orderedIds.indexOf(b.id);
      return aIdx - bIdx;
    }).map((a, i) => ({ ...a, sortOrder: i + 1 }));

    setAddons([...rest, ...sortedSubset].sort((a, b) => a.sortOrder - b.sortOrder));

    startTransition(async () => {
      const res = await reorderAddonFeaturesAction(orderedIds);
      if (res.success) {
        toast.success('Addon order saved.');
      } else {
        toast.error(res.error || 'Failed to save addon order.');
      }
    });
  };

  const columns = [
    { key: 'expand', label: '', className: 'w-10 pl-6' },
    { key: 'icon', label: 'Icon', className: 'w-16' },
    { key: 'name', label: 'Category Details' },
    { key: 'serviceCategory', label: 'Service Category' },
    { key: 'sortOrder', label: 'Display Order' },
    { key: 'status', label: 'Status' },
    { key: 'createdAt', label: 'Created Date' },
    { key: 'actions', label: 'Actions', className: 'text-right py-4 pr-6' },
  ];

  const filteredCategories = categories.filter((cat) => {
    const search = searchTerm.toLowerCase();
    const catMatches = 
      cat.name?.toLowerCase().includes(search) ||
      cat.description?.toLowerCase().includes(search);
      
    const hasMatchingAddons = addons.some(
      (a) => a.categoryId === cat.id && (
        a.name?.toLowerCase().includes(search) ||
        a.description?.toLowerCase().includes(search)
      )
    );
    
    return catMatches || hasMatchingAddons;
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
            placeholder="Search addon category or name..."
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
          <span className="ml-3 text-muted-foreground">Loading addons library...</span>
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
            const catAddons = addons.filter((a) => {
              if (a.categoryId !== cat.id) return false;
              if (!searchTerm) return true;
              const search = searchTerm.toLowerCase();
              const catMatches = 
                cat.name?.toLowerCase().includes(search) ||
                cat.description?.toLowerCase().includes(search);
              if (catMatches) return true;
              return (
                a.name?.toLowerCase().includes(search) ||
                a.description?.toLowerCase().includes(search)
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
                    {serviceCategories.find(c => c.id === selectedCategoryId)?.name || 'N/A'}
                  </TableCell>
                  <TableCell className="text-muted-foreground text-xs font-semibold pl-4">
                    Position {cat.sortOrder}
                  </TableCell>
                  <TableCell>
                    <button
                      onClick={() => handleToggleCategoryActive(cat.id, cat.isActive)}
                      className="text-slate-400 hover:text-white transition-colors cursor-pointer"
                      title={cat.isActive ? 'Deactivate Category' : 'Activate Category'}
                    >
                      {cat.isActive ? (
                        <ToggleRight className="w-8 h-8 text-emerald-400" />
                      ) : (
                        <ToggleLeft className="w-8 h-8 text-slate-500" />
                      )}
                    </button>
                  </TableCell>
                  <TableCell className="text-muted-foreground text-xs">
                    {cat.createdAt ? new Date(cat.createdAt).toLocaleDateString() : 'N/A'}
                  </TableCell>
                  <TableCell className="text-right py-4 pr-6">
                    <div className="flex items-center justify-end gap-1">
                      <Button
                        onClick={() => openAddAddonModal(cat.id)}
                        className="bg-indigo-600/10 hover:bg-indigo-600/20 text-indigo-400 border border-indigo-500/20 rounded-lg text-xs font-semibold h-7.5 px-3 mr-1"
                      >
                        Add Addon
                      </Button>
                      <Button
                        onClick={() => openEditCategoryModal(cat)}
                        variant="ghost"
                        size="icon"
                        className="text-slate-400 hover:text-white hover:bg-slate-800/40 rounded-lg w-7.5 h-7.5"
                      >
                        <Edit className="w-3.5 h-3.5" />
                      </Button>
                      <Button
                        onClick={() => handleDeleteCategory(cat.id)}
                        variant="ghost"
                        size="icon"
                        className="text-red-400 hover:text-red-300 hover:bg-red-500/10 rounded-lg w-7.5 h-7.5"
                      >
                        <Trash className="w-3.5 h-3.5" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>

                {/* Sub addons rows */}
                {isExpanded && (
                  <TableRow className="bg-muted/[0.1] border-none hover:bg-transparent">
                    <TableCell colSpan={8} className="p-0 border-b border-border">
                      <div className="pl-16 pr-6 pb-6 pt-2">
                        {catAddons.length === 0 ? (
                          <div className="text-xs text-muted-foreground italic py-3 pl-3 border border-dashed rounded-xl">
                            No addons added to this category yet. Click Add Addon to get started.
                          </div>
                        ) : (
                          <div className="border border-border rounded-xl overflow-hidden shadow-sm bg-background">
                            <Table>
                              <TableHeader className="bg-muted/40">
                                <TableRow className="border-b border-border">
                                  <TableHead className="w-8"></TableHead>
                                  <TableHead className="text-xs font-bold text-muted-foreground uppercase py-2">Addon Name</TableHead>
                                  <TableHead className="text-xs font-bold text-muted-foreground uppercase py-2">Pricing Type</TableHead>
                                  <TableHead className="text-xs font-bold text-muted-foreground uppercase py-2">Price</TableHead>
                                  <TableHead className="text-xs font-bold text-muted-foreground uppercase py-2 w-28">Status</TableHead>
                                  <TableHead className="text-xs font-bold text-muted-foreground uppercase py-2 w-28 text-right pr-4">Actions</TableHead>
                                </TableRow>
                              </TableHeader>
                              <TableBody>
                                {catAddons
                                  .sort((a, b) => (a.sortOrder || 0) - (b.sortOrder || 0))
                                  .map((addon, index) => {
                                    return (
                                      <TableRow
                                        key={addon.id}
                                        draggable
                                        onDragStart={(e) => {
                                          setDraggedIndex(index);
                                          setDraggedCatId(addon.categoryId);
                                          e.dataTransfer.effectAllowed = 'move';
                                        }}
                                        onDragOver={(e) => e.preventDefault()}
                                        onDrop={(e) => {
                                          e.preventDefault();
                                          if (draggedIndex === null || draggedIndex === index || draggedCatId !== addon.categoryId) return;
                                          const subset = addons.filter(a => a.categoryId === addon.categoryId);
                                          const updatedSubset = [...subset];
                                          const [moved] = updatedSubset.splice(draggedIndex, 1);
                                          updatedSubset.splice(index, 0, moved);
                                          handleAddonReorder(addon.categoryId, updatedSubset.map((a) => a.id));
                                          setDraggedIndex(null);
                                          setDraggedCatId(null);
                                        }}
                                        className="hover:bg-muted/40 border-b border-border transition-colors cursor-grab active:cursor-grabbing"
                                      >
                                        <TableCell className="p-3 text-muted-foreground w-8">
                                          <GripVertical className="w-3.5 h-3.5 text-muted-foreground hover:text-foreground" />
                                        </TableCell>
                                        <TableCell className="p-3 font-medium text-foreground">
                                          <div className="flex flex-col">
                                            <span className="text-sm font-semibold">{addon.name}</span>
                                            {addon.description && (
                                              <span className="text-[10px] text-muted-foreground font-normal mt-0.5">
                                                {addon.description}
                                              </span>
                                            )}
                                          </div>
                                        </TableCell>
                                        <TableCell className="p-3 text-xs text-muted-foreground">
                                          {addon.pricingType === 'fixed' ? 'Fixed Price' : addon.pricingType === 'per_page' ? 'Per Page' : 'Percentage'}
                                        </TableCell>
                                        <TableCell className="p-3 text-xs font-semibold text-foreground">
                                          ₹{addon.price}
                                        </TableCell>
                                        <TableCell className="p-3">
                                          <button
                                            onClick={() => handleToggleAddonActive(addon.id, addon.isActive)}
                                            className="text-slate-400 hover:text-white transition-colors cursor-pointer"
                                            title={addon.isActive ? 'Deactivate Addon' : 'Activate Addon'}
                                          >
                                            {addon.isActive ? (
                                              <ToggleRight className="w-8 h-8 text-emerald-400" />
                                            ) : (
                                              <ToggleLeft className="w-8 h-8 text-slate-500" />
                                            )}
                                          </button>
                                        </TableCell>
                                        <TableCell className="p-3 text-right">
                                          <div className="flex items-center justify-end gap-1 pr-2">
                                            <Button
                                              onClick={() => openEditAddonModal(addon)}
                                              variant="ghost"
                                              size="icon"
                                              className="text-slate-400 hover:text-white hover:bg-slate-800/40 rounded-lg w-7.5 h-7.5"
                                            >
                                              <Edit className="w-3.5 h-3.5" />
                                            </Button>
                                            <Button
                                              onClick={() => handleDeleteAddon(addon.id)}
                                              variant="ghost"
                                              size="icon"
                                              className="text-red-400 hover:text-red-300 hover:bg-red-500/10 rounded-lg w-7.5 h-7.5"
                                            >
                                              <Trash className="w-3.5 h-3.5" />
                                            </Button>
                                          </div>
                                        </TableCell>
                                      </TableRow>
                                    );
                                  })}
                              </TableBody>
                            </Table>
                          </div>
                        )}
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
            <FolderTree className="w-10 h-10" />
          </div>
          <div className="text-center space-y-1">
            <h3 className="text-base font-bold">No add-ons configured</h3>
            <p className="text-sm text-muted-foreground max-w-sm">
              No add-on categories available for this Service Category yet.
            </p>
          </div>
          <Button onClick={openAddCategoryModal} className="rounded-xl h-10 px-5">
            Create Add-on Category
          </Button>
        </div>
      )}

      {/* --- Category Modal --- */}
      <Dialog open={isCategoryModalOpen} onOpenChange={setIsCategoryModalOpen}>
        <DialogContent className="bg-popover border border-border shadow-2xl rounded-2xl w-full max-w-lg sm:max-w-lg max-h-[85vh] overflow-y-auto p-6 relative text-popover-foreground">
          <DialogHeader>
            <DialogTitle className="text-lg font-bold text-foreground">
              {editingCategory ? 'Edit Addon Category' : 'Create Addon Category'}
            </DialogTitle>
          </DialogHeader>
          <form onSubmit={handleCategorySubmit} className="space-y-4">
            {categoryErrorMsg && (
              <p className="text-xs text-red-400 bg-red-500/10 border border-red-500/20 p-2.5 rounded-lg">
                {categoryErrorMsg}
              </p>
            )}
            <div className="space-y-1">
              <Label className="text-muted-foreground text-xs">Category Name</Label>
              <Input
                required
                value={catName}
                onChange={(e) => setCatName(e.target.value)}
                placeholder="e.g. Integrations & Booking"
                className="bg-background border-border text-foreground rounded-xl h-10 text-sm"
              />
            </div>
            <div className="space-y-1">
              <Label className="text-muted-foreground text-xs">Description</Label>
              <Textarea
                rows={2}
                value={catDescription}
                onChange={(e) => setCatDescription(e.target.value)}
                placeholder="Describe what addons will be listed in this section..."
                className="bg-background border-border text-foreground rounded-xl"
              />
            </div>


            <div className="flex items-center space-x-2 py-1">
              <Checkbox
                id="catIsActive"
                checked={catIsActive}
                onCheckedChange={(checked) => setCatIsActive(!!checked)}
              />
              <label
                htmlFor="catIsActive"
                className="text-xs font-medium leading-none cursor-pointer"
              >
                Category is active and visible
              </label>
            </div>

            <div className="flex justify-end gap-3 pt-4 border-t border-border">
              <Button
                type="button"
                variant="ghost"
                onClick={() => setIsCategoryModalOpen(false)}
                className="rounded-xl border border-border"
                disabled={isCategorySubmitting}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                className="bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl"
                disabled={isCategorySubmitting}
              >
                {isCategorySubmitting && <Loader2 className="w-4 h-4 animate-spin mr-2" />}
                {editingCategory ? 'Update Category' : 'Create Category'}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      {/* --- Addon Modal --- */}
      <Dialog open={isAddonModalOpen} onOpenChange={setIsAddonModalOpen}>
        <DialogContent className="bg-popover border border-border shadow-2xl rounded-2xl w-full max-w-lg sm:max-w-lg max-h-[85vh] overflow-y-auto p-6 relative text-popover-foreground">
          <DialogHeader>
            <DialogTitle className="text-lg font-bold text-foreground">
              {editingAddon ? 'Edit Addon' : 'Create Addon'}
            </DialogTitle>
          </DialogHeader>
          <form onSubmit={handleAddonSubmit} className="space-y-4">
            {addonErrorMsg && (
              <p className="text-xs text-red-400 bg-red-500/10 border border-red-500/20 p-2.5 rounded-lg">
                {addonErrorMsg}
              </p>
            )}
            
            <div className="space-y-1">
              <Label className="text-muted-foreground text-xs">Parent Category</Label>
              <Input
                disabled
                value={categories.find((c) => c.id === addonCategoryId)?.name || ''}
                className="bg-muted border-border text-muted-foreground rounded-xl h-10 text-sm cursor-not-allowed"
              />
            </div>

            <div className="space-y-1">
              <Label className="text-muted-foreground text-xs">Addon Name</Label>
              <Input
                required
                value={addonName}
                onChange={(e) => setAddonName(e.target.value)}
                placeholder="e.g. Apple HealthKit Sync"
                className="bg-background border-border text-foreground rounded-xl h-10 text-sm"
                disabled={isAddonSubmitting}
              />
            </div>

            <div className="space-y-1">
              <Label className="text-muted-foreground text-xs">Description</Label>
              <Textarea
                rows={2}
                value={addonDescription}
                onChange={(e) => setAddonDescription(e.target.value)}
                placeholder="Describe what features/capabilities this addon integrates..."
                className="bg-background border-border text-foreground rounded-xl"
                disabled={isAddonSubmitting}
              />
            </div>

            <div className="grid grid-cols-3 gap-3">
              <div className="col-span-2 space-y-1">
                <Label className="text-muted-foreground text-xs font-semibold">Pricing Logic Model</Label>
                <Select value={addonPricingType} onValueChange={(val: any) => setAddonPricingType(val)} disabled={isAddonSubmitting}>
                  <SelectTrigger className="bg-background border-border rounded-xl">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-popover border-border rounded-xl">
                    <SelectItem value="fixed">Fixed Price</SelectItem>
                    <SelectItem value="per_page">Per Page Rate</SelectItem>
                    <SelectItem value="percentage">Percentage Markup</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-1">
                <Label className="text-muted-foreground text-xs font-semibold">Rate / Price (₹)</Label>
                <Input
                  required
                  type="number"
                  value={addonPrice}
                  onChange={(e) => setAddonPrice(Number(e.target.value))}
                  className="bg-background border-border text-foreground rounded-xl h-10 text-sm"
                  disabled={isAddonSubmitting}
                />
              </div>
            </div>



            <div className="flex items-center space-x-6 pt-2">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="addonDefaultSelected"
                  checked={addonDefaultSelected}
                  onCheckedChange={(checked) => setAddonDefaultSelected(!!checked)}
                  disabled={isAddonSubmitting}
                />
                <label
                  htmlFor="addonDefaultSelected"
                  className="text-xs font-medium leading-none cursor-pointer"
                >
                  Selected by default
                </label>
              </div>

              <div className="flex items-center space-x-2">
                <Checkbox
                  id="addonIsActive"
                  checked={addonIsActive}
                  onCheckedChange={(checked) => setAddonIsActive(!!checked)}
                  disabled={isAddonSubmitting}
                />
                <label
                  htmlFor="addonIsActive"
                  className="text-xs font-medium leading-none cursor-pointer"
                >
                  Add-on is active
                </label>
              </div>
            </div>

            <div className="flex justify-end gap-3 pt-4 border-t border-border">
              <Button
                type="button"
                variant="ghost"
                onClick={() => setIsAddonModalOpen(false)}
                className="rounded-xl border border-border"
                disabled={isAddonSubmitting}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                className="bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl"
                disabled={isAddonSubmitting}
              >
                {isAddonSubmitting && <Loader2 className="w-4 h-4 animate-spin mr-2" />}
                {editingAddon ? 'Update Addon' : 'Create Addon'}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
