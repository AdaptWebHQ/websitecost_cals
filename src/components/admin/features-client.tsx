'use client';

import { useState } from 'react';
import DataTable from '@/components/shared/data-table';
import { Button } from '@/components/ui/button';
import { TableRow, TableCell } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { formatCurrency } from '@/lib/utils';
import { PlusCircle, Edit, Trash, X, Loader2 } from 'lucide-react';
import {
  createFeatureAction,
  updateFeatureAction,
  deleteFeatureAction,
} from '@/actions/features';
import type { Feature, FeatureCategory } from '@/types';

interface FeaturesClientPageProps {
  initialFeatures: Feature[];
  categories: FeatureCategory[];
}

export default function FeaturesClientPage({ initialFeatures, categories }: FeaturesClientPageProps) {
  const [features, setFeatures] = useState<Feature[]>(initialFeatures);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingFeature, setEditingFeature] = useState<Feature | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Form Fields
  const [categoryId, setCategoryId] = useState(categories[0]?.id || '');
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [pricingType, setPricingType] = useState<'fixed' | 'per_page' | 'percentage'>('fixed');
  const [price, setPrice] = useState(0);
  const [defaultSelected, setDefaultSelected] = useState(false);
  const [isActive, setIsActive] = useState(true);
  const [sortOrder, setSortOrder] = useState(0);

  const categoryMap = categories.reduce<Record<string, string>>((acc, cat) => {
    acc[cat.id] = cat.name;
    return acc;
  }, {});

  const openAddModal = () => {
    setEditingFeature(null);
    setCategoryId(categories[0]?.id || '');
    setName('');
    setDescription('');
    setPricingType('fixed');
    setPrice(2500);
    setDefaultSelected(false);
    setIsActive(true);
    setSortOrder(features.length + 1);
    setErrorMsg(null);
    setIsModalOpen(true);
  };

  const openEditModal = (feat: Feature) => {
    setEditingFeature(feat);
    setCategoryId(feat.categoryId);
    setName(feat.name);
    setDescription(feat.description || '');
    setPricingType(feat.pricingType);
    setPrice(feat.price);
    setDefaultSelected(feat.defaultSelected);
    setIsActive(feat.isActive);
    setSortOrder(feat.sortOrder);
    setErrorMsg(null);
    setIsModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrorMsg(null);

    const formData = {
      categoryId,
      name,
      description,
      pricingType,
      price,
      defaultSelected,
      isActive,
      sortOrder,
    };

    try {
      if (editingFeature) {
        const res = await updateFeatureAction(editingFeature.id, formData);
        if (res.success && res.data) {
          setFeatures((prev) =>
            prev.map((f) => (f.id === editingFeature.id ? res.data! : f))
          );
          setIsModalOpen(false);
        } else {
          setErrorMsg(res.error || 'Failed to update feature.');
        }
      } else {
        const res = await createFeatureAction(formData);
        if (res.success && res.data) {
          setFeatures((prev) => [...prev, res.data!]);
          setIsModalOpen(false);
        } else {
          setErrorMsg(res.error || 'Failed to create feature.');
        }
      }
    } catch (err) {
      console.error(err);
      setErrorMsg('An unexpected error occurred.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteFeature = async (id: string) => {
    if (!confirm('Are you sure you want to delete this custom module feature?')) return;
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

  const columns = [
    { key: 'name', label: 'Feature Name', className: 'pl-6' },
    { key: 'category', label: 'Category' },
    { key: 'pricingType', label: 'Pricing Model' },
    { key: 'price', label: 'Value / Rate' },
    { key: 'status', label: 'Status' },
    { key: 'actions', label: 'Actions', className: 'text-right py-4 pr-6' },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground">Quotation Features</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Manage extra services/additions that users can add during quotation calculation.
          </p>
        </div>
        <Button
          onClick={openAddModal}
          className="bg-indigo-600 hover:bg-indigo-500 text-white gap-2 rounded-xl h-11 px-5"
        >
          <PlusCircle className="w-5 h-5" />
          Add Feature
        </Button>
      </div>

      {/* Listing Table */}
      <DataTable
        columns={columns}
        data={features}
        emptyMessage="No features configured yet. Get started by clicking Add Feature."
        renderRow={(feat) => (
          <TableRow key={feat.id} className="hover:bg-muted/40 border-border">
            <TableCell className="font-semibold text-foreground py-4 pl-6">
              <div className="flex flex-col">
                <span>{feat.name}</span>
                <span className="text-xs text-muted-foreground font-normal mt-0.5 max-w-sm truncate">
                  {feat.description || 'No description provided.'}
                </span>
              </div>
            </TableCell>
            <TableCell className="text-muted-foreground font-medium">
              <Badge variant="outline" className="border-border text-muted-foreground hover:bg-transparent">
                {categoryMap[feat.categoryId] || 'Unknown Category'}
              </Badge>
            </TableCell>
            <TableCell className="text-muted-foreground capitalize">
              {feat.pricingType === 'per_page' ? 'Per Page Rate' : feat.pricingType === 'percentage' ? 'Percentage of Package' : 'Fixed Cost'}
            </TableCell>
            <TableCell className="text-muted-foreground font-semibold">
              {feat.pricingType === 'percentage' ? `${feat.price}%` : formatCurrency(feat.price)}
            </TableCell>
            <TableCell>
              {feat.isActive ? (
                <Badge className="bg-emerald-500/10 text-emerald-400 border-emerald-500/20 hover:bg-transparent">
                  Active
                </Badge>
              ) : (
                <Badge className="bg-slate-500/5 text-slate-400 border-slate-500/10 hover:bg-transparent">
                  Inactive
                </Badge>
              )}
              {feat.defaultSelected && (
                <Badge className="ml-2 bg-indigo-500/10 text-indigo-400 border-indigo-500/20 hover:bg-transparent">
                  Default Option
                </Badge>
              )}
            </TableCell>
            <TableCell className="text-right py-4 pr-6">
              <div className="flex items-center justify-end gap-2">
                <Button
                  onClick={() => openEditModal(feat)}
                  variant="ghost"
                  size="icon"
                  className="text-muted-foreground hover:text-foreground rounded-lg"
                >
                  <Edit className="w-4 h-4" />
                </Button>
                <Button
                  onClick={() => handleDeleteFeature(feat.id)}
                  variant="ghost"
                  size="icon"
                  className="text-red-400 hover:text-red-300 rounded-lg"
                >
                  <Trash className="w-4 h-4" />
                </Button>
              </div>
            </TableCell>
          </TableRow>
        )}
      />

      {/* Custom Modal Dialog */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <Card className="bg-popover border border-border shadow-2xl rounded-2xl w-full max-w-lg p-6 relative animate-scale-up text-popover-foreground">
            <button
              onClick={() => setIsModalOpen(false)}
              className="absolute top-4 right-4 text-muted-foreground hover:text-foreground"
            >
              <X className="w-5 h-5" />
            </button>
            <h2 className="text-lg font-bold text-foreground mb-4">
              {editingFeature ? 'Edit Quotation Feature' : 'Create Quotation Feature'}
            </h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              {errorMsg && (
                <p className="text-xs text-red-400 bg-red-500/10 border border-red-500/20 p-2.5 rounded-lg">
                  {errorMsg}
                </p>
              )}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <Label className="text-muted-foreground text-xs">Feature Name</Label>
                  <Input
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. Booking Engine"
                    className="bg-background border-border text-foreground rounded-xl h-10 text-sm"
                  />
                </div>
                <div className="space-y-1">
                  <Label className="text-muted-foreground text-xs">Feature Category</Label>
                  <select
                    value={categoryId}
                    onChange={(e) => setCategoryId(e.target.value)}
                    className="w-full h-10 bg-background border border-border text-foreground rounded-xl px-3 text-sm focus:outline-none focus:border-indigo-500"
                  >
                    {categories.map((cat) => (
                      <option key={cat.id} value={cat.id} className="bg-popover text-foreground">
                        {cat.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="space-y-1">
                <Label className="text-muted-foreground text-xs">Description</Label>
                <textarea
                  rows={2}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Explain what value addition this module offers..."
                  className="w-full bg-background border border-border text-foreground rounded-xl p-3 text-sm focus:outline-none focus:border-indigo-500 resize-none leading-normal"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <Label className="text-muted-foreground text-xs">Pricing Model</Label>
                  <select
                    value={pricingType}
                    onChange={(e) => setPricingType(e.target.value as any)}
                    className="w-full h-10 bg-background border border-border text-foreground rounded-xl px-3 text-sm focus:outline-none focus:border-indigo-500"
                  >
                    <option value="fixed" className="bg-popover text-foreground">Fixed Cost</option>
                    <option value="per_page" className="bg-popover text-foreground">Per Page Rate</option>
                    <option value="percentage" className="bg-popover text-foreground">Percentage of Base</option>
                  </select>
                </div>
                <div className="space-y-1">
                  <Label className="text-muted-foreground text-xs">Rate / Value (INR or %)</Label>
                  <Input
                    required
                    type="number"
                    value={price}
                    onChange={(e) => setPrice(Number(e.target.value))}
                    className="bg-background border-border text-foreground rounded-xl h-10 text-sm"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <Label className="text-muted-foreground text-xs">Display Position Order</Label>
                  <Input
                    required
                    type="number"
                    value={sortOrder}
                    onChange={(e) => setSortOrder(Number(e.target.value))}
                    className="bg-background border-border text-foreground rounded-xl h-10 text-sm"
                  />
                </div>
              </div>

              <div className="flex gap-6 pt-2">
                <label className="flex items-center gap-2 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={defaultSelected}
                    onChange={(e) => setDefaultSelected(e.target.checked)}
                    className="w-4 h-4 rounded border-border bg-background accent-indigo-500 text-foreground"
                  />
                  <span className="text-sm text-foreground">Selected by Default</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={isActive}
                    onChange={(e) => setIsActive(e.target.checked)}
                    className="w-4 h-4 rounded border-border bg-background accent-indigo-500 text-foreground"
                  />
                  <span className="text-sm text-foreground">Active Feature</span>
                </label>
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-border">
                <Button
                  type="button"
                  variant="ghost"
                  onClick={() => setIsModalOpen(false)}
                  className="text-muted-foreground hover:text-foreground rounded-xl h-10 px-5"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl h-10 px-6 font-semibold shadow-lg shadow-indigo-600/10 disabled:opacity-50"
                >
                  {isSubmitting ? (
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
          </Card>
        </div>
      )}
    </div>
  );
}
