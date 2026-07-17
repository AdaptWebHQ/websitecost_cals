'use client';

import React, { useState } from 'react';
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
  Sparkles,
  GripVertical,
  Search
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
} from '@/actions/addons/categories';
import {
  createAddonFeatureAction,
  updateAddonFeatureAction,
  deleteAddonFeatureAction,
  toggleAddonFeatureActiveAction,
  reorderAddonFeaturesAction,
} from '@/actions/addons';
import type { AddonCategory, AddonFeature, PricingType } from '@/types';

interface AddonsClientPageProps {
  initialCategories: AddonCategory[];
  initialAddons?: AddonFeature[];
}

export default function AddonsClientPage({ 
  initialCategories, 
  initialAddons = [] 
}: AddonsClientPageProps) {
  const [categories, setCategories] = useState<AddonCategory[]>(initialCategories);
  const [addons, setAddons] = useState<AddonFeature[]>(initialAddons);
  const [searchTerm, setSearchTerm] = useState('');
  const [expandedCategoryIds, setExpandedCategoryIds] = useState<Record<string, boolean>>({});

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
  const [catIcon, setCatIcon] = useState('Palette');
  const [catIsActive, setCatIsActive] = useState(true);
  const [catSortOrder, setCatSortOrder] = useState(0);

  // Feature Modal State
  const [isFeatureModalOpen, setIsFeatureModalOpen] = useState(false);
  const [editingFeature, setEditingFeature] = useState<AddonFeature | null>(null);
  const [isFeatureSubmitting, setIsFeatureSubmitting] = useState(false);
  const [featureErrorMsg, setFeatureErrorMsg] = useState<string | null>(null);

  // Feature Form Fields
  const [featureCategoryId, setFeatureCategoryId] = useState('');
  const [featureName, setFeatureName] = useState('');
  const [featureDescription, setFeatureDescription] = useState('');
  const [featurePricingType, setFeaturePricingType] = useState<PricingType>('fixed');
  const [featurePrice, setFeaturePrice] = useState<number>(0);
  const [featureDefaultSelected, setFeatureDefaultSelected] = useState(false);
  const [featureIsActive, setFeatureIsActive] = useState(true);
  const [featureSortOrder, setFeatureSortOrder] = useState(0);

  // --- Category Actions ---
  const openAddCategoryModal = () => {
    setEditingCategory(null);
    setCatName('');
    setCatDescription('');
    setCatIcon('Palette');
    setCatIsActive(true);
    setCatSortOrder(categories.length + 1);
    setCategoryErrorMsg(null);
    setIsCategoryModalOpen(true);
  };

  const openEditCategoryModal = (cat: AddonCategory) => {
    setEditingCategory(cat);
    setCatName(cat.name);
    setCatDescription(cat.description || '');
    setCatIcon(cat.icon);
    setCatIsActive(cat.isActive);
    setCatSortOrder(cat.sortOrder);
    setCategoryErrorMsg(null);
    setIsCategoryModalOpen(true);
  };

  const handleCategorySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsCategorySubmitting(true);
    setCategoryErrorMsg(null);

    const formData = {
      name: catName,
      description: catDescription,
      icon: catIcon,
      isActive: catIsActive,
      sortOrder: catSortOrder,
    };

    try {
      if (editingCategory) {
        const res = await updateAddonCategoryAction(editingCategory.id, formData);
        if (res.success && res.data) {
          setCategories((prev) =>
            prev.map((c) => (c.id === editingCategory.id ? res.data! : c))
          );
          setIsCategoryModalOpen(false);
        } else {
          setCategoryErrorMsg(res.error || 'Failed to update category.');
        }
      } else {
        const res = await createAddonCategoryAction(formData);
        if (res.success && res.data) {
          setCategories((prev) => [...prev, res.data!]);
          setIsCategoryModalOpen(false);
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
      description: 'All its addon features will lose their reference.',
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
            toast.error('Failed to delete category.');
          }
        },
      },
      cancel: { label: 'Cancel', onClick: () => {} },
    });
  };

  const toggleExpandCategory = (id: string) => {
    setExpandedCategoryIds((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  // --- Feature Actions ---
  const openAddFeatureModal = (categoryId: string) => {
    setEditingFeature(null);
    setFeatureCategoryId(categoryId);
    setFeatureName('');
    setFeatureDescription('');
    setFeaturePricingType('fixed');
    setFeaturePrice(0);
    setFeatureDefaultSelected(false);
    setFeatureIsActive(true);
    const catAddons = addons.filter((f) => f.categoryId === categoryId);
    setFeatureSortOrder(catAddons.length + 1);
    setFeatureErrorMsg(null);
    setIsFeatureModalOpen(true);
  };

  const openEditFeatureModal = (feature: AddonFeature) => {
    setEditingFeature(feature);
    setFeatureCategoryId(feature.categoryId);
    setFeatureName(feature.name);
    setFeatureDescription(feature.description || '');
    setFeaturePricingType(feature.pricingType);
    setFeaturePrice(feature.price);
    setFeatureDefaultSelected(feature.defaultSelected);
    setFeatureIsActive(feature.isActive);
    setFeatureSortOrder(feature.sortOrder);
    setFeatureErrorMsg(null);
    setIsFeatureModalOpen(true);
  };

  const handleFeatureSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsFeatureSubmitting(true);
    setFeatureErrorMsg(null);

    const formData = {
      categoryId: featureCategoryId,
      name: featureName,
      description: featureDescription,
      pricingType: featurePricingType,
      price: featurePrice,
      defaultSelected: featureDefaultSelected,
      isActive: featureIsActive,
      sortOrder: featureSortOrder,
    };

    try {
      if (editingFeature) {
        const res = await updateAddonFeatureAction(editingFeature.id, formData);
        if (res.success && res.data) {
          setAddons((prev) =>
            prev.map((f) => (f.id === editingFeature.id ? res.data! : f))
          );
          setIsFeatureModalOpen(false);
        } else {
          setFeatureErrorMsg(res.error || 'Failed to update addon feature.');
        }
      } else {
        const res = await createAddonFeatureAction(formData);
        if (res.success && res.data) {
          setAddons((prev) => [...prev, res.data!]);
          setIsFeatureModalOpen(false);
        } else {
          setFeatureErrorMsg(res.error || 'Failed to create addon feature.');
        }
      }
    } catch (err) {
      console.error(err);
      setFeatureErrorMsg('An unexpected error occurred.');
    } finally {
      setIsFeatureSubmitting(false);
    }
  };

  const handleDeleteFeature = (id: string) => {
    toast('Delete this addon feature?', {
      description: 'This action cannot be undone.',
      action: {
        label: 'Delete',
        onClick: async () => {
          try {
            const res = await deleteAddonFeatureAction(id);
            if (res.success) {
              setAddons((prev) => prev.filter((f) => f.id !== id));
              toast.success('Addon feature deleted successfully.');
            } else {
              toast.error(res.error || 'Failed to delete addon feature.');
            }
          } catch (err) {
            console.error(err);
            toast.error('Failed to delete addon feature.');
          }
        },
      },
      cancel: { label: 'Cancel', onClick: () => {} },
    });
  };

  const handleToggleFeatureActive = async (id: string, currentActive: boolean) => {
    const nextActive = !currentActive;
    try {
      setAddons((prev) =>
        prev.map((f) => (f.id === id ? { ...f, isActive: nextActive } : f))
      );
      const res = await toggleAddonFeatureActiveAction(id, nextActive);
      if (!res.success) {
        setAddons((prev) =>
          prev.map((f) => (f.id === id ? { ...f, isActive: currentActive } : f))
        );
        toast.error(res.error || 'Failed to toggle active status.');
      }
    } catch (err) {
      console.error(err);
      setAddons((prev) =>
        prev.map((f) => (f.id === id ? { ...f, isActive: currentActive } : f))
      );
    }
  };

  // Pricing format helper
  const formatPrice = (price: number, type: PricingType) => {
    if (type === 'percentage') return `${price}%`;
    const formatted = new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(price);
    if (type === 'per_page') return `${formatted} / page`;
    return formatted;
  };

  const columns = [
    { key: 'expand', label: '', className: 'w-10 pl-6' },
    { key: 'icon', label: 'Icon', className: 'w-16' },
    { key: 'name', label: 'Category Details' },
    { key: 'sortOrder', label: 'Display Order' },
    { key: 'status', label: 'Status' },
    { key: 'actions', label: 'Actions', className: 'text-right py-4 pr-6' },
  ];

  const filteredCategories = categories.filter((cat) => {
    const search = searchTerm.toLowerCase();
    const catMatches = 
      cat.name?.toLowerCase().includes(search) ||
      cat.description?.toLowerCase().includes(search);
      
    const hasMatchingAddons = addons.some(
      (addon) => addon.categoryId === cat.id && (
        addon.name?.toLowerCase().includes(search) ||
        addon.description?.toLowerCase().includes(search)
      )
    );
    
    return catMatches || hasMatchingAddons;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground">Add-on Categories & Add-on Features</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Configure logical divisions of global paid addon features and manage specific items under each section.
          </p>
        </div>
        <Button
          onClick={openAddCategoryModal}
          className="bg-indigo-600 hover:bg-indigo-500 text-white gap-2 rounded-xl h-11 px-5"
        >
          <PlusCircle className="w-5 h-5" />
          Add Category
        </Button>
      </div>

      {/* Search Filter */}
      <div className="relative max-w-md">
        <Search className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />
        <input
          type="text"
          placeholder="Search category or addon name..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full h-10 bg-background border border-border rounded-xl pl-10 pr-4 text-sm text-foreground placeholder:text-muted-foreground/60 focus:outline-none focus:border-indigo-500/50 transition-colors"
        />
      </div>

      {/* Listing Table */}
      <DataTable
        columns={columns}
        data={filteredCategories}
        emptyMessage={searchTerm ? "No addon categories match your search criteria." : "No addon categories defined yet. Get started by clicking Add Category."}
        renderRow={(cat) => {
          const IconComponent = (Icons as unknown as Record<string, React.ComponentType<{ className?: string }>>)[cat.icon] || HelpCircle;
          const isExpanded = !!expandedCategoryIds[cat.id];
          const catAddons = addons.filter((f) => {
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
                      <Badge className="bg-muted text-muted-foreground hover:bg-muted text-[10px] font-normal px-2 py-0.5 rounded-md border border-border">
                        {catAddons.length} {catAddons.length === 1 ? 'item' : 'items'}
                      </Badge>
                    </span>
                    <span className="text-xs text-muted-foreground font-normal mt-0.5 max-w-sm truncate">
                      {cat.description || 'No description provided.'}
                    </span>
                  </div>
                </TableCell>
                <TableCell className="text-muted-foreground font-medium text-xs">Position #{cat.sortOrder}</TableCell>
                <TableCell>
                  {cat.isActive ? (
                    <Badge className="bg-emerald-500/5 text-emerald-400 border border-emerald-500/10 rounded-full text-[10px] px-2.5 py-0.5 font-medium hover:bg-transparent">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 mr-1.5 inline-block"></span>
                      Active
                    </Badge>
                  ) : (
                    <Badge className="bg-slate-500/5 text-slate-400 border border-slate-500/10 rounded-full text-[10px] px-2.5 py-0.5 font-medium hover:bg-transparent">
                      <span className="w-1.5 h-1.5 rounded-full bg-slate-400 mr-1.5 inline-block"></span>
                      Inactive
                    </Badge>
                  )}
                </TableCell>
                <TableCell className="text-right py-4 pr-6">
                  <div className="flex items-center justify-end gap-2.5">
                    <Button
                      onClick={() => openAddFeatureModal(cat.id)}
                      variant="ghost"
                      size="sm"
                      className="text-xs text-indigo-400 hover:text-indigo-300 hover:bg-indigo-500/10 rounded-xl px-3 h-8.5 gap-1 border border-indigo-500/10"
                    >
                      <PlusCircle className="w-3.5 h-3.5" />
                      Add Add-on
                    </Button>
                    <Button
                      onClick={() => openEditCategoryModal(cat)}
                      variant="ghost"
                      size="icon"
                      className="text-muted-foreground hover:text-foreground hover:bg-muted rounded-lg w-8.5 h-8.5 border border-transparent hover:border-border"
                    >
                      <Edit className="w-4 h-4" />
                    </Button>
                    <Button
                      onClick={() => handleDeleteCategory(cat.id)}
                      variant="ghost"
                      size="icon"
                      className="text-red-400 hover:text-red-400 hover:bg-red-500/10 rounded-lg w-8.5 h-8.5 border border-transparent hover:border-red-500/10"
                    >
                      <Trash className="w-4 h-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>

              {/* Expandable sub-list of features inside the category */}
              {isExpanded && (
                <TableRow className="bg-muted/10 hover:bg-muted/10 border-border">
                  <TableCell colSpan={columns.length} className="p-5 pl-14">
                    <div className="relative pl-6 border-l border-border space-y-4">
                      {/* Features Sub-Header */}
                      <div className="flex items-center justify-between">
                        <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
                          <Sparkles className="w-3.5 h-3.5 text-indigo-400 animate-pulse" />
                          Associated Add-ons: <span className="text-indigo-400 font-semibold lowercase capitalize pl-1">{cat.name}</span>
                        </h4>
                      </div>

                      {catAddons.length === 0 ? (
                        <div className="text-center py-8 border border-dashed border-border rounded-xl bg-muted/5">
                          <p className="text-xs text-muted-foreground">No specific addons registered inside this category yet.</p>
                          <Button
                            onClick={() => openAddFeatureModal(cat.id)}
                            variant="ghost"
                            size="sm"
                            className="text-indigo-400 hover:text-indigo-300 text-xs mt-2 gap-1"
                          >
                            <PlusCircle className="w-3.5 h-3.5" />
                            Add first addon now
                          </Button>
                        </div>
                      ) : (
                        <div className="overflow-hidden border border-border rounded-xl bg-muted/20 shadow-sm">
                          <Table className="w-full text-left text-xs border-collapse">
                            <TableHeader className="bg-muted/30 border-b border-border">
                              <TableRow className="hover:bg-transparent border-border text-muted-foreground font-medium">
                                <TableHead className="p-3 w-8"></TableHead>
                                <TableHead className="p-3">Add-on Details</TableHead>
                                <TableHead className="p-3">Pricing Formula</TableHead>
                                <TableHead className="p-3">Default Selected</TableHead>
                                <TableHead className="p-3">Status</TableHead>
                                <TableHead className="p-3 text-right">Actions</TableHead>
                              </TableRow>
                            </TableHeader>
                            <TableBody>
                              {catAddons
                                .sort((a, b) => a.sortOrder - b.sortOrder)
                                .map((feat, index) => {
                                  const isDraggingOverThis = draggedIndex !== null && draggedCatId === feat.categoryId && draggedIndex !== index;
                                  return (
                                    <TableRow 
                                      key={feat.id} 
                                      draggable
                                      onDragStart={(e) => {
                                        setDraggedIndex(index);
                                        setDraggedCatId(feat.categoryId);
                                        e.dataTransfer.effectAllowed = 'move';
                                      }}
                                      onDragOver={(e) => {
                                        e.preventDefault();
                                      }}
                                      onDrop={(e) => {
                                        e.preventDefault();
                                        if (draggedIndex === null || draggedCatId !== feat.categoryId || draggedIndex === index) return;
                                        
                                        const updatedCatFeatures = [...catAddons];
                                        const [movedFeature] = updatedCatFeatures.splice(draggedIndex, 1);
                                        updatedCatFeatures.splice(index, 0, movedFeature);
                                        
                                        // Map new order positions
                                        const newCatFeatures = updatedCatFeatures.map((f, i) => ({
                                          ...f,
                                          sortOrder: i + 1,
                                        }));
                                        
                                        // Update state
                                        setAddons((prev) => {
                                          const rest = prev.filter((f) => f.categoryId !== feat.categoryId);
                                          return [...rest, ...newCatFeatures];
                                        });
                                        
                                        // Call server action to save order
                                        const orderedIds = newCatFeatures.map((f) => f.id);
                                        reorderAddonFeaturesAction(orderedIds).then((res) => {
                                          if (!res.success) {
                                            toast.error(res.error || 'Failed to save new order.');
                                          }
                                        });
                                        
                                        setDraggedIndex(null);
                                        setDraggedCatId(null);
                                      }}
                                      className={`border-b border-border hover:bg-muted/30 text-foreground transition-all ${
                                        isDraggingOverThis ? 'border-t-2 border-t-indigo-500' : ''
                                      }`}
                                    >
                                      <TableCell className="p-3 text-muted-foreground cursor-grab active:cursor-grabbing w-8">
                                        <GripVertical className="w-3.5 h-3.5 text-muted-foreground hover:text-foreground" />
                                      </TableCell>
                                      <TableCell className="p-3 font-medium text-foreground">
                                        <div className="flex flex-col">
                                          <span className="text-sm font-semibold">{feat.name}</span>
                                          <span className="text-[10px] text-muted-foreground font-normal mt-0.5">
                                            {feat.description || 'No description.'}
                                          </span>
                                        </div>
                                      </TableCell>
                                      <TableCell className="p-3 font-medium text-indigo-400 text-sm">
                                        {formatPrice(feat.price, feat.pricingType)}
                                      </TableCell>
                                      <TableCell className="p-3">
                                        {feat.defaultSelected ? (
                                          <Badge className="bg-indigo-500/5 text-indigo-400 border border-indigo-500/10 hover:bg-transparent rounded-lg text-[10px]">
                                            Pre-selected
                                          </Badge>
                                        ) : (
                                          <span className="text-muted-foreground font-normal text-[11px]">Optional</span>
                                        )}
                                      </TableCell>
                                      <TableCell className="p-3">
                                        <button
                                          onClick={() => handleToggleFeatureActive(feat.id, feat.isActive)}
                                          className="text-slate-400 hover:text-white transition-colors cursor-pointer"
                                          title={feat.isActive ? 'Deactivate Addon' : 'Activate Addon'}
                                        >
                                          {feat.isActive ? (
                                            <ToggleRight className="w-8 h-8 text-emerald-400" />
                                          ) : (
                                            <ToggleLeft className="w-8 h-8 text-slate-550" />
                                          )}
                                        </button>
                                      </TableCell>
                                      <TableCell className="p-3 text-right">
                                        <div className="flex items-center justify-end gap-1">
                                          <Button
                                            onClick={() => openEditFeatureModal(feat)}
                                            variant="ghost"
                                            size="icon"
                                            className="text-slate-400 hover:text-white hover:bg-slate-800/40 rounded-lg w-7.5 h-7.5 border border-transparent hover:border-slate-800/40"
                                          >
                                            <Edit className="w-3.5 h-3.5" />
                                          </Button>
                                          <Button
                                            onClick={() => handleDeleteFeature(feat.id)}
                                            variant="ghost"
                                            size="icon"
                                            className="text-red-400 hover:text-red-300 hover:bg-red-500/10 rounded-lg w-7.5 h-7.5 border border-transparent hover:border-red-500/10"
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

      {/* --- Category Modal --- */}
      <Dialog open={isCategoryModalOpen} onOpenChange={setIsCategoryModalOpen}>
        <DialogContent className="bg-popover border border-border shadow-2xl rounded-2xl w-full max-w-lg sm:max-w-lg max-h-[85vh] overflow-y-auto p-6 relative text-popover-foreground">
          <DialogHeader>
            <DialogTitle className="text-lg font-bold text-foreground">
              {editingCategory ? 'Edit Add-on Category' : 'Create Add-on Category'}
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
                placeholder="e.g. Core Design & Layout"
                className="bg-background border-border text-foreground rounded-xl h-10 text-sm"
              />
            </div>
            <div className="space-y-1">
              <Label className="text-muted-foreground text-xs">Description</Label>
              <Textarea
                rows={2}
                value={catDescription}
                onChange={(e) => setCatDescription(e.target.value)}
                placeholder="Describe what features will be listed in this section..."
                className="bg-background border-border text-foreground rounded-xl"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <Label className="text-muted-foreground text-xs">Lucide Icon Key</Label>
                <Input
                  required
                  value={catIcon}
                  onChange={(e) => setCatIcon(e.target.value)}
                  placeholder="e.g. Palette, Cpu, Shield, Globe"
                  className="bg-background border-border text-foreground rounded-xl h-10 text-sm"
                />
              </div>
              <div className="space-y-1">
                <Label className="text-muted-foreground text-xs">Display Order Position</Label>
                <Input
                  required
                  type="number"
                  value={catSortOrder}
                  onChange={(e) => setCatSortOrder(Number(e.target.value))}
                  className="bg-background border-border text-foreground rounded-xl h-10 text-sm"
                />
              </div>
            </div>

            <div className="flex items-center space-x-2 pt-2">
              <Checkbox
                id="catIsActive"
                checked={catIsActive}
                onCheckedChange={(checked) => setCatIsActive(!!checked)}
              />
              <Label htmlFor="catIsActive" className="text-sm font-medium text-foreground cursor-pointer select-none">
                Active Category
              </Label>
            </div>

            <div className="flex justify-end gap-3 pt-4 border-t border-border">
              <Button
                type="button"
                variant="ghost"
                onClick={() => setIsCategoryModalOpen(false)}
                className="text-muted-foreground hover:text-foreground rounded-xl h-10 px-5"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={isCategorySubmitting}
                className="bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl h-10 px-6 font-semibold shadow-lg shadow-indigo-600/10 disabled:opacity-50"
              >
                {isCategorySubmitting ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin shrink-0" />
                    Saving...
                  </>
                ) : (
                  'Save Changes'
                )}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      {/* --- Feature Modal --- */}
      <Dialog open={isFeatureModalOpen} onOpenChange={setIsFeatureModalOpen}>
        <DialogContent className="bg-popover border border-border shadow-2xl rounded-2xl w-full max-w-lg sm:max-w-lg max-h-[85vh] overflow-y-auto p-6 relative text-popover-foreground">
          <DialogHeader>
            <DialogTitle className="text-lg font-bold text-foreground">
              {editingFeature ? 'Edit Add-on Feature' : 'Create Add-on Feature'}
            </DialogTitle>
          </DialogHeader>
          <form onSubmit={handleFeatureSubmit} className="space-y-4">
            {featureErrorMsg && (
              <p className="text-xs text-red-400 bg-red-500/10 border border-red-500/20 p-2.5 rounded-lg">
                {featureErrorMsg}
              </p>
            )}
            
            <div className="space-y-1">
              <Label className="text-muted-foreground text-xs">Parent Category</Label>
              <Input
                disabled
                value={categories.find((c) => c.id === featureCategoryId)?.name || ''}
                className="bg-muted border-border text-muted-foreground rounded-xl h-10 text-sm cursor-not-allowed"
              />
            </div>

            <div className="space-y-1">
              <Label className="text-muted-foreground text-xs">Add-on Name</Label>
              <Input
                required
                value={featureName}
                onChange={(e) => setFeatureName(e.target.value)}
                placeholder="e.g. Multi-language Support"
                className="bg-background border-border text-foreground rounded-xl h-10 text-sm"
              />
            </div>

            <div className="space-y-1">
              <Label className="text-muted-foreground text-xs">Description</Label>
              <Textarea
                rows={2}
                value={featureDescription}
                onChange={(e) => setFeatureDescription(e.target.value)}
                placeholder="Describe what client requirements this addon feature satisfies..."
                className="bg-background border-border text-foreground rounded-xl"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <Label className="text-muted-foreground text-xs">Pricing Formula</Label>
                <Select 
                  value={featurePricingType} 
                  onValueChange={(val) => setFeaturePricingType((val ?? 'fixed') as PricingType)}
                >
                  <SelectTrigger className="w-full h-10 px-3 border border-border text-sm">
                    <SelectValue placeholder="Fixed Cost (INR)" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="fixed">Fixed Cost (INR)</SelectItem>
                    <SelectItem value="per_page">Per Page (INR)</SelectItem>
                    <SelectItem value="percentage">Percentage Markup (%)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-1">
                <Label className="text-muted-foreground text-xs">Rate Value</Label>
                <Input
                  required
                  type="number"
                  value={featurePrice}
                  onChange={(e) => setFeaturePrice(Number(e.target.value))}
                  placeholder="e.g. 5000"
                  className="bg-background border-border text-foreground rounded-xl h-10 text-sm"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <Label className="text-muted-foreground text-xs">Sort Order Position</Label>
                <Input
                  required
                  type="number"
                  value={featureSortOrder}
                  onChange={(e) => setFeatureSortOrder(Number(e.target.value))}
                  className="bg-background border-border text-foreground rounded-xl h-10 text-sm"
                />
              </div>
            </div>

            <div className="flex items-center space-x-6 pt-2">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="featDefaultSelected"
                  checked={featureDefaultSelected}
                  onCheckedChange={(checked) => setFeatureDefaultSelected(!!checked)}
                />
                <Label htmlFor="featDefaultSelected" className="text-sm font-medium text-foreground cursor-pointer select-none">
                  Pre-selected
                </Label>
              </div>

              <div className="flex items-center space-x-2">
                <Checkbox
                  id="featIsActive"
                  checked={featureIsActive}
                  onCheckedChange={(checked) => setFeatureIsActive(!!checked)}
                />
                <Label htmlFor="featIsActive" className="text-sm font-medium text-foreground cursor-pointer select-none">
                  Active Feature
                </Label>
              </div>
            </div>

            <div className="flex justify-end gap-3 pt-4 border-t border-border">
              <Button
                type="button"
                variant="ghost"
                onClick={() => setIsFeatureModalOpen(false)}
                className="text-muted-foreground hover:text-foreground rounded-xl h-10 px-5"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={isFeatureSubmitting}
                className="bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl h-10 px-6 font-semibold shadow-lg shadow-indigo-600/10 disabled:opacity-50"
              >
                {isFeatureSubmitting ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin shrink-0" />
                    Saving...
                  </>
                ) : (
                  'Save Changes'
                )}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
