'use client';

import React, { useState } from 'react';
import DataTable from '@/components/shared/data-table';
import { Button } from '@/components/ui/button';
import { TableRow, TableCell } from '@/components/ui/table';
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
  GripVertical
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
  createCategoryAction,
  updateCategoryAction,
  deleteCategoryAction,
} from '@/actions/features/categories';
import {
  createFeatureAction,
  updateFeatureAction,
  deleteFeatureAction,
  toggleFeatureActiveAction,
  reorderFeaturesAction,
} from '@/actions/features';
import type { FeatureCategory, Feature, PricingType } from '@/types';

interface CategoriesClientPageProps {
  initialCategories: FeatureCategory[];
  initialFeatures?: Feature[];
}

export default function CategoriesClientPage({ 
  initialCategories, 
  initialFeatures = [] 
}: CategoriesClientPageProps) {
  const [categories, setCategories] = useState<FeatureCategory[]>(initialCategories);
  const [features, setFeatures] = useState<Feature[]>(initialFeatures);
  const [expandedCategoryIds, setExpandedCategoryIds] = useState<Record<string, boolean>>({});

  // Drag and drop states
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);
  const [draggedCatId, setDraggedCatId] = useState<string | null>(null);

  // Category Modal State
  const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<FeatureCategory | null>(null);
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
  const [editingFeature, setEditingFeature] = useState<Feature | null>(null);
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

  const openEditCategoryModal = (cat: FeatureCategory) => {
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
        const res = await updateCategoryAction(editingCategory.id, formData);
        if (res.success && res.data) {
          setCategories((prev) =>
            prev.map((c) => (c.id === editingCategory.id ? res.data! : c))
          );
          setIsCategoryModalOpen(false);
        } else {
          setCategoryErrorMsg(res.error || 'Failed to update category.');
        }
      } else {
        const res = await createCategoryAction(formData);
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

  const handleDeleteCategory = async (id: string) => {
    if (!confirm('Are you sure you want to delete this category? All its features will lose their reference.')) return;
    try {
      const res = await deleteCategoryAction(id);
      if (res.success) {
        setCategories((prev) => prev.filter((c) => c.id !== id));
      } else {
        alert(res.error || 'Failed to delete category.');
      }
    } catch (err) {
      console.error(err);
      alert('Failed to delete category.');
    }
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
    const catFeatures = features.filter((f) => f.categoryId === categoryId);
    setFeatureSortOrder(catFeatures.length + 1);
    setFeatureErrorMsg(null);
    setIsFeatureModalOpen(true);
  };

  const openEditFeatureModal = (feature: Feature) => {
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
        const res = await updateFeatureAction(editingFeature.id, formData);
        if (res.success && res.data) {
          setFeatures((prev) =>
            prev.map((f) => (f.id === editingFeature.id ? res.data! : f))
          );
          setIsFeatureModalOpen(false);
        } else {
          setFeatureErrorMsg(res.error || 'Failed to update feature.');
        }
      } else {
        const res = await createFeatureAction(formData);
        if (res.success && res.data) {
          setFeatures((prev) => [...prev, res.data!]);
          setIsFeatureModalOpen(false);
        } else {
          setFeatureErrorMsg(res.error || 'Failed to create feature.');
        }
      }
    } catch (err) {
      console.error(err);
      setFeatureErrorMsg('An unexpected error occurred.');
    } finally {
      setIsFeatureSubmitting(false);
    }
  };

  const handleDeleteFeature = async (id: string) => {
    if (!confirm('Are you sure you want to delete this feature?')) return;
    try {
      const res = await deleteFeatureAction(id);
      if (res.success) {
        setFeatures((prev) => prev.filter((f) => f.id !== id));
      } else {
        alert(res.error || 'Failed to delete feature.');
      }
    } catch (err) {
      console.error(err);
      alert('Failed to delete feature.');
    }
  };

  const handleToggleFeatureActive = async (id: string, currentActive: boolean) => {
    const nextActive = !currentActive;
    try {
      setFeatures((prev) =>
        prev.map((f) => (f.id === id ? { ...f, isActive: nextActive } : f))
      );
      const res = await toggleFeatureActiveAction(id, nextActive);
      if (!res.success) {
        setFeatures((prev) =>
          prev.map((f) => (f.id === id ? { ...f, isActive: currentActive } : f))
        );
        alert(res.error || 'Failed to toggle active status.');
      }
    } catch (err) {
      console.error(err);
      setFeatures((prev) =>
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

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-white">Feature Categories & Features</h1>
          <p className="text-sm text-slate-400 mt-1">
            Configure logical divisions of website features and manage specific items under each section.
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

      {/* Listing Table */}
      <DataTable
        columns={columns}
        data={categories}
        emptyMessage="No feature categories defined yet. Get started by clicking Add Category."
        renderRow={(cat) => {
          const IconComponent = (Icons as unknown as Record<string, React.ComponentType<{ className?: string }>>)[cat.icon] || HelpCircle;
          const isExpanded = !!expandedCategoryIds[cat.id];
          const catFeatures = features.filter((f) => f.categoryId === cat.id);

          return (
            <React.Fragment key={cat.id}>
              <TableRow className="hover:bg-slate-900/10 border-slate-800/40 transition-colors">
                <TableCell className="py-4 pl-6">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => toggleExpandCategory(cat.id)}
                    className="w-8 h-8 rounded-lg text-slate-500 hover:text-white transition-colors"
                  >
                    {isExpanded ? (
                      <ChevronDown className="w-4 h-4 text-indigo-400" />
                    ) : (
                      <ChevronRight className="w-4 h-4" />
                    )}
                  </Button>
                </TableCell>
                <TableCell className="py-4 text-slate-400">
                  <div className="w-10 h-10 rounded-xl bg-slate-900/30 border border-slate-800/60 flex items-center justify-center shadow-inner">
                    <IconComponent className="w-4.5 h-4.5 text-indigo-400" />
                  </div>
                </TableCell>
                <TableCell className="font-medium text-white">
                  <div className="flex flex-col">
                    <span className="flex items-center gap-2.5 text-sm font-semibold">
                      {cat.name}
                      <Badge className="bg-slate-800/60 text-slate-400 hover:bg-slate-800/60 text-[10px] font-normal px-2 py-0.5 rounded-md border border-slate-800/40">
                        {catFeatures.length} {catFeatures.length === 1 ? 'item' : 'items'}
                      </Badge>
                    </span>
                    <span className="text-xs text-slate-450 font-normal mt-0.5 max-w-sm truncate">
                      {cat.description || 'No description provided.'}
                    </span>
                  </div>
                </TableCell>
                <TableCell className="text-slate-350 font-medium text-xs">Position #{cat.sortOrder}</TableCell>
                <TableCell>
                  {cat.isActive ? (
                    <Badge className="bg-emerald-500/5 text-emerald-450 border border-emerald-500/10 rounded-full text-[10px] px-2.5 py-0.5 font-medium hover:bg-transparent">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 mr-1.5 inline-block"></span>
                      Active
                    </Badge>
                  ) : (
                    <Badge className="bg-slate-800/20 text-slate-500 border border-slate-800/50 rounded-full text-[10px] px-2.5 py-0.5 font-medium hover:bg-transparent">
                      <span className="w-1.5 h-1.5 rounded-full bg-slate-500 mr-1.5 inline-block"></span>
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
                      Add Feature
                    </Button>
                    <Button
                      onClick={() => openEditCategoryModal(cat)}
                      variant="ghost"
                      size="icon"
                      className="text-slate-450 hover:text-white hover:bg-slate-800/40 rounded-lg w-8.5 h-8.5 border border-transparent hover:border-slate-800/60"
                    >
                      <Edit className="w-4 h-4" />
                    </Button>
                    <Button
                      onClick={() => handleDeleteCategory(cat.id)}
                      variant="ghost"
                      size="icon"
                      className="text-red-450 hover:text-red-400 hover:bg-red-500/10 rounded-lg w-8.5 h-8.5 border border-transparent hover:border-red-500/10"
                    >
                      <Trash className="w-4 h-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>

              {/* Expandable sub-list of features inside the category */}
              {isExpanded && (
                <TableRow className="bg-slate-950/20 hover:bg-slate-950/20 border-slate-800/30">
                  <TableCell colSpan={columns.length} className="p-5 pl-14">
                    <div className="relative pl-6 border-l border-slate-800/80 space-y-4">
                      {/* Features Sub-Header */}
                      <div className="flex items-center justify-between">
                        <h4 className="text-xs font-bold uppercase tracking-wider text-slate-450 flex items-center gap-1.5">
                          <Sparkles className="w-3.5 h-3.5 text-indigo-400 animate-pulse" />
                          Associated Features: <span className="text-indigo-400 font-semibold lowercase capitalize pl-1">{cat.name}</span>
                        </h4>
                      </div>

                      {catFeatures.length === 0 ? (
                        <div className="text-center py-8 border border-dashed border-slate-800/40 rounded-xl bg-slate-950/20">
                          <p className="text-xs text-slate-500">No specific features registered inside this category yet.</p>
                          <Button
                            onClick={() => openAddFeatureModal(cat.id)}
                            variant="ghost"
                            size="sm"
                            className="text-indigo-400 hover:text-indigo-300 text-xs mt-2 gap-1"
                          >
                            <PlusCircle className="w-3.5 h-3.5" />
                            Add first feature now
                          </Button>
                        </div>
                      ) : (
                        <div className="overflow-hidden border border-slate-800/60 rounded-xl bg-slate-950/30 shadow-sm">
                          <table className="w-full text-left text-xs border-collapse">
                            <thead>
                              <tr className="border-b border-slate-800 text-slate-450 font-medium bg-slate-900/30">
                                <th className="p-3 w-8"></th>
                                <th className="p-3">Feature Details</th>
                                <th className="p-3">Pricing Formula</th>
                                <th className="p-3">Default Selected</th>
                                <th className="p-3">Status</th>
                                <th className="p-3 text-right">Actions</th>
                              </tr>
                            </thead>
                            <tbody>
                              {catFeatures
                                .sort((a, b) => a.sortOrder - b.sortOrder)
                                .map((feat, index) => {
                                  const isDraggingOverThis = draggedIndex !== null && draggedCatId === feat.categoryId && draggedIndex !== index;
                                  return (
                                    <tr 
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
                                        
                                        const updatedCatFeatures = [...catFeatures];
                                        const [movedFeature] = updatedCatFeatures.splice(draggedIndex, 1);
                                        updatedCatFeatures.splice(index, 0, movedFeature);
                                        
                                        // Map new order positions
                                        const newCatFeatures = updatedCatFeatures.map((f, i) => ({
                                          ...f,
                                          sortOrder: i + 1,
                                        }));
                                        
                                        // Update state
                                        setFeatures((prev) => {
                                          const rest = prev.filter((f) => f.categoryId !== feat.categoryId);
                                          return [...rest, ...newCatFeatures];
                                        });
                                        
                                        // Call server action to save order
                                        const orderedIds = newCatFeatures.map((f) => f.id);
                                        reorderFeaturesAction(orderedIds).then((res) => {
                                          if (!res.success) {
                                            alert(res.error || 'Failed to save new order.');
                                          }
                                        });
                                        
                                        setDraggedIndex(null);
                                        setDraggedCatId(null);
                                      }}
                                      className={`border-b border-slate-850/40 hover:bg-slate-900/10 text-slate-350 transition-all ${
                                        isDraggingOverThis ? 'border-t-2 border-t-indigo-500' : ''
                                      }`}
                                    >
                                      <td className="p-3 text-slate-600 cursor-grab active:cursor-grabbing w-8">
                                        <GripVertical className="w-3.5 h-3.5 text-slate-500 hover:text-slate-300" />
                                      </td>
                                      <td className="p-3 font-medium text-slate-200">
                                        <div className="flex flex-col">
                                          <span className="text-sm font-semibold">{feat.name}</span>
                                          <span className="text-[10px] text-slate-500 font-normal mt-0.5">
                                            {feat.description || 'No description.'}
                                          </span>
                                        </div>
                                      </td>
                                      <td className="p-3 font-medium text-indigo-400 text-sm">
                                        {formatPrice(feat.price, feat.pricingType)}
                                      </td>
                                      <td className="p-3">
                                        {feat.defaultSelected ? (
                                          <Badge className="bg-indigo-500/5 text-indigo-400 border border-indigo-500/10 hover:bg-transparent rounded-lg text-[10px]">
                                            Pre-selected
                                          </Badge>
                                        ) : (
                                          <span className="text-slate-550 font-normal text-[11px]">Optional</span>
                                        )}
                                      </td>
                                      <td className="p-3">
                                        <button
                                          onClick={() => handleToggleFeatureActive(feat.id, feat.isActive)}
                                          className="text-slate-400 hover:text-white transition-colors cursor-pointer"
                                          title={feat.isActive ? 'Deactivate Feature' : 'Activate Feature'}
                                        >
                                          {feat.isActive ? (
                                            <ToggleRight className="w-8 h-8 text-emerald-400" />
                                          ) : (
                                            <ToggleLeft className="w-8 h-8 text-slate-550" />
                                          )}
                                        </button>
                                      </td>
                                      <td className="p-3 text-right">
                                        <div className="flex items-center justify-end gap-1">
                                          <Button
                                            onClick={() => openEditFeatureModal(feat)}
                                            variant="ghost"
                                            size="icon"
                                            className="text-slate-450 hover:text-white hover:bg-slate-800/40 rounded-lg w-7.5 h-7.5 border border-transparent hover:border-slate-800/40"
                                          >
                                            <Edit className="w-3.5 h-3.5" />
                                          </Button>
                                          <Button
                                            onClick={() => handleDeleteFeature(feat.id)}
                                            variant="ghost"
                                            size="icon"
                                            className="text-red-450 hover:text-red-400 hover:bg-red-500/10 rounded-lg w-7.5 h-7.5 border border-transparent hover:border-red-500/10"
                                          >
                                            <Trash className="w-3.5 h-3.5" />
                                          </Button>
                                        </div>
                                      </td>
                                    </tr>
                                  );
                                })}
                            </tbody>
                          </table>
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
        <DialogContent className="bg-slate-900 border border-slate-800 shadow-2xl rounded-2xl w-full max-w-lg sm:max-w-lg max-h-[85vh] overflow-y-auto p-6 relative">
          <DialogHeader>
            <DialogTitle className="text-lg font-bold text-white">
              {editingCategory ? 'Edit Feature Category' : 'Create Feature Category'}
            </DialogTitle>
          </DialogHeader>
          <form onSubmit={handleCategorySubmit} className="space-y-4">
            {categoryErrorMsg && (
              <p className="text-xs text-red-400 bg-red-500/10 border border-red-500/20 p-2.5 rounded-lg">
                {categoryErrorMsg}
              </p>
            )}
            <div className="space-y-1">
              <Label className="text-slate-400 text-xs">Category Name</Label>
              <Input
                required
                value={catName}
                onChange={(e) => setCatName(e.target.value)}
                placeholder="e.g. Core Design & Layout"
                className="bg-slate-950/60 border-slate-800 text-white rounded-xl h-10 text-sm"
              />
            </div>
            <div className="space-y-1">
              <Label className="text-slate-400 text-xs">Description</Label>
              <Textarea
                rows={2}
                value={catDescription}
                onChange={(e) => setCatDescription(e.target.value)}
                placeholder="Describe what features will be listed in this section..."
                className="bg-slate-950/60 border-slate-800 text-white rounded-xl"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <Label className="text-slate-400 text-xs">Lucide Icon Key</Label>
                <Input
                  required
                  value={catIcon}
                  onChange={(e) => setCatIcon(e.target.value)}
                  placeholder="e.g. Palette, Cpu, Shield, Globe"
                  className="bg-slate-950/60 border-slate-800 text-white rounded-xl h-10 text-sm"
                />
              </div>
              <div className="space-y-1">
                <Label className="text-slate-400 text-xs">Display Order Position</Label>
                <Input
                  required
                  type="number"
                  value={catSortOrder}
                  onChange={(e) => setCatSortOrder(Number(e.target.value))}
                  className="bg-slate-950/60 border-slate-800 text-white rounded-xl h-10 text-sm"
                />
              </div>
            </div>

            <div className="flex items-center space-x-2 pt-2">
              <Checkbox
                id="catIsActive"
                checked={catIsActive}
                onCheckedChange={(checked) => setCatIsActive(!!checked)}
              />
              <Label htmlFor="catIsActive" className="text-sm font-medium text-slate-350 cursor-pointer select-none">
                Active Category
              </Label>
            </div>

            <div className="flex justify-end gap-3 pt-4 border-t border-slate-800/60">
              <Button
                type="button"
                variant="ghost"
                onClick={() => setIsCategoryModalOpen(false)}
                className="text-slate-400 hover:text-white rounded-xl h-10 px-5"
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
        <DialogContent className="bg-slate-900 border border-slate-800 shadow-2xl rounded-2xl w-full max-w-lg sm:max-w-lg max-h-[85vh] overflow-y-auto p-6 relative">
          <DialogHeader>
            <DialogTitle className="text-lg font-bold text-white">
              {editingFeature ? 'Edit Feature' : 'Create Feature'}
            </DialogTitle>
          </DialogHeader>
          <form onSubmit={handleFeatureSubmit} className="space-y-4">
            {featureErrorMsg && (
              <p className="text-xs text-red-400 bg-red-500/10 border border-red-500/20 p-2.5 rounded-lg">
                {featureErrorMsg}
              </p>
            )}
            
            <div className="space-y-1">
              <Label className="text-slate-400 text-xs">Parent Category</Label>
              <Input
                disabled
                value={categories.find((c) => c.id === featureCategoryId)?.name || ''}
                className="bg-slate-950/20 border-slate-800/50 text-slate-500 rounded-xl h-10 text-sm cursor-not-allowed"
              />
            </div>

            <div className="space-y-1">
              <Label className="text-slate-400 text-xs">Feature Name</Label>
              <Input
                required
                value={featureName}
                onChange={(e) => setFeatureName(e.target.value)}
                placeholder="e.g. Multi-language Support"
                className="bg-slate-950/60 border-slate-800 text-white rounded-xl h-10 text-sm"
              />
            </div>

            <div className="space-y-1">
              <Label className="text-slate-400 text-xs">Description</Label>
              <Textarea
                rows={2}
                value={featureDescription}
                onChange={(e) => setFeatureDescription(e.target.value)}
                placeholder="Describe what client requirements this feature satisfies..."
                className="bg-slate-950/60 border-slate-800 text-white rounded-xl"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <Label className="text-slate-400 text-xs">Pricing Formula</Label>
                <select
                  value={featurePricingType}
                  onChange={(e) => setFeaturePricingType(e.target.value as PricingType)}
                  className="w-full h-10 px-3 bg-slate-950/60 border border-slate-800 text-white rounded-xl text-sm focus:outline-none focus:border-indigo-500/50 transition-colors"
                >
                  <option value="fixed">Fixed Cost (INR)</option>
                  <option value="per_page">Per Page (INR)</option>
                  <option value="percentage">Percentage Markup (%)</option>
                </select>
              </div>
              <div className="space-y-1">
                <Label className="text-slate-400 text-xs">Rate Value</Label>
                <Input
                  required
                  type="number"
                  value={featurePrice}
                  onChange={(e) => setFeaturePrice(Number(e.target.value))}
                  placeholder="e.g. 5000"
                  className="bg-slate-950/60 border-slate-800 text-white rounded-xl h-10 text-sm"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <Label className="text-slate-400 text-xs">Sort Order Position</Label>
                <Input
                  required
                  type="number"
                  value={featureSortOrder}
                  onChange={(e) => setFeatureSortOrder(Number(e.target.value))}
                  className="bg-slate-950/60 border-slate-800 text-white rounded-xl h-10 text-sm"
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
                <Label htmlFor="featDefaultSelected" className="text-sm font-medium text-slate-350 cursor-pointer select-none">
                  Pre-selected
                </Label>
              </div>

              <div className="flex items-center space-x-2">
                <Checkbox
                  id="featIsActive"
                  checked={featureIsActive}
                  onCheckedChange={(checked) => setFeatureIsActive(!!checked)}
                />
                <Label htmlFor="featIsActive" className="text-sm font-medium text-slate-350 cursor-pointer select-none">
                  Active Feature
                </Label>
              </div>
            </div>

            <div className="flex justify-end gap-3 pt-4 border-t border-slate-800/60">
              <Button
                type="button"
                variant="ghost"
                onClick={() => setIsFeatureModalOpen(false)}
                className="text-slate-400 hover:text-white rounded-xl h-10 px-5"
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
