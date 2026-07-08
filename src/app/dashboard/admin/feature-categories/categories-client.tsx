'use client';

import { useState } from 'react';
import DataTable from '@/components/shared/data-table';
import { Button } from '@/components/ui/button';
import { TableRow, TableCell } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { PlusCircle, Edit, Trash, X, Loader2, HelpCircle } from 'lucide-react';
import * as Icons from 'lucide-react';
import {
  createCategoryAction,
  updateCategoryAction,
  deleteCategoryAction,
} from '@/actions/features/categories';
import type { FeatureCategory } from '@/types';

interface CategoriesClientPageProps {
  initialCategories: FeatureCategory[];
}

export default function CategoriesClientPage({ initialCategories }: CategoriesClientPageProps) {
  const [categories, setCategories] = useState<FeatureCategory[]>(initialCategories);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<FeatureCategory | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Form Fields
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [icon, setIcon] = useState('Palette');
  const [isActive, setIsActive] = useState(true);
  const [sortOrder, setSortOrder] = useState(0);

  const openAddModal = () => {
    setEditingCategory(null);
    setName('');
    setDescription('');
    setIcon('Palette');
    setIsActive(true);
    setSortOrder(categories.length + 1);
    setErrorMsg(null);
    setIsModalOpen(true);
  };

  const openEditModal = (cat: FeatureCategory) => {
    setEditingCategory(cat);
    setName(cat.name);
    setDescription(cat.description || '');
    setIcon(cat.icon);
    setIsActive(cat.isActive);
    setSortOrder(cat.sortOrder);
    setErrorMsg(null);
    setIsModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrorMsg(null);

    const formData = {
      name,
      description,
      icon,
      isActive,
      sortOrder,
    };

    try {
      if (editingCategory) {
        const res = await updateCategoryAction(editingCategory.id, formData);
        if (res.success && res.data) {
          setCategories((prev) =>
            prev.map((c) => (c.id === editingCategory.id ? res.data! : c))
          );
          setIsModalOpen(false);
        } else {
          setErrorMsg(res.error || 'Failed to update category.');
        }
      } else {
        const res = await createCategoryAction(formData);
        if (res.success && res.data) {
          setCategories((prev) => [...prev, res.data!]);
          setIsModalOpen(false);
        } else {
          setErrorMsg(res.error || 'Failed to create category.');
        }
      }
    } catch (err) {
      console.error(err);
      setErrorMsg('An unexpected error occurred.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteCategory = async (id: string) => {
    if (!confirm('Are you sure you want to delete this feature category?')) return;
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

  const columns = [
    { key: 'icon', label: 'Icon', className: 'w-16 pl-6' },
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
          <h1 className="text-2xl font-bold tracking-tight text-white">Feature Categories</h1>
          <p className="text-sm text-slate-400 mt-1">
            Configure logical divisions of website features (e.g., Pages, Core Features, Marketing, Integrity).
          </p>
        </div>
        <Button
          onClick={openAddModal}
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

          return (
            <TableRow key={cat.id} className="hover:bg-slate-900/20 border-slate-800/60">
              <TableCell className="py-4 pl-6 text-slate-400">
                <div className="w-10 h-10 rounded-xl bg-slate-900/60 border border-slate-800 flex items-center justify-center">
                  <IconComponent className="w-5 h-5 text-indigo-400" />
                </div>
              </TableCell>
              <TableCell className="font-semibold text-white">
                <div className="flex flex-col">
                  <span>{cat.name}</span>
                  <span className="text-xs text-slate-500 font-normal mt-0.5 max-w-sm truncate">
                    {cat.description || 'No description provided.'}
                  </span>
                </div>
              </TableCell>
              <TableCell className="text-slate-300 font-medium">Position #{cat.sortOrder}</TableCell>
              <TableCell>
                {cat.isActive ? (
                  <Badge className="bg-emerald-500/10 text-emerald-400 border-emerald-500/20 hover:bg-transparent">
                    Active
                  </Badge>
                ) : (
                  <Badge className="bg-slate-800 text-slate-500 border-slate-800 hover:bg-transparent">
                    Inactive
                  </Badge>
                )}
              </TableCell>
              <TableCell className="text-right py-4 pr-6">
                <div className="flex items-center justify-end gap-2">
                  <Button
                    onClick={() => openEditModal(cat)}
                    variant="ghost"
                    size="icon"
                    className="text-slate-400 hover:text-white rounded-lg"
                  >
                    <Edit className="w-4 h-4" />
                  </Button>
                  <Button
                    onClick={() => handleDeleteCategory(cat.id)}
                    variant="ghost"
                    size="icon"
                    className="text-red-400 hover:text-red-300 rounded-lg"
                  >
                    <Trash className="w-4 h-4" />
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          );
        }}
      />

      {/* Custom Modal Dialog */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <Card className="bg-slate-900 border border-slate-800 shadow-2xl rounded-2xl w-full max-w-lg p-6 relative animate-scale-up">
            <button
              onClick={() => setIsModalOpen(false)}
              className="absolute top-4 right-4 text-slate-450 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>
            <h2 className="text-lg font-bold text-white mb-4">
              {editingCategory ? 'Edit Feature Category' : 'Create Feature Category'}
            </h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              {errorMsg && (
                <p className="text-xs text-red-450 bg-red-500/10 border border-red-500/20 p-2.5 rounded-lg">
                  {errorMsg}
                </p>
              )}
              <div className="space-y-1">
                <Label className="text-slate-450 text-xs">Category Name</Label>
                <Input
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Core Design & Layout"
                  className="bg-slate-950/60 border-slate-800 text-white rounded-xl h-10 text-sm"
                />
              </div>
              <div className="space-y-1">
                <Label className="text-slate-450 text-xs">Description</Label>
                <textarea
                  rows={2}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Describe what features will be listed in this section..."
                  className="w-full bg-slate-950/60 border border-slate-800 text-white rounded-xl p-3 text-sm focus:outline-none focus:border-indigo-500 resize-none leading-normal"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <Label className="text-slate-450 text-xs">Lucide Icon Key</Label>
                  <Input
                    required
                    value={icon}
                    onChange={(e) => setIcon(e.target.value)}
                    placeholder="e.g. Palette, Cpu, Shield, Globe"
                    className="bg-slate-950/60 border-slate-800 text-white rounded-xl h-10 text-sm"
                  />
                </div>
                <div className="space-y-1">
                  <Label className="text-slate-450 text-xs">Display Order Position</Label>
                  <Input
                    required
                    type="number"
                    value={sortOrder}
                    onChange={(e) => setSortOrder(Number(e.target.value))}
                    className="bg-slate-950/60 border-slate-800 text-white rounded-xl h-10 text-sm"
                  />
                </div>
              </div>

              <div className="flex gap-6 pt-2">
                <label className="flex items-center gap-2 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={isActive}
                    onChange={(e) => setIsActive(e.target.checked)}
                    className="w-4 h-4 rounded border-slate-850 bg-slate-950 accent-indigo-500 text-white"
                  />
                  <span className="text-sm text-slate-300">Active Category</span>
                </label>
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-slate-800/60">
                <Button
                  type="button"
                  variant="ghost"
                  onClick={() => setIsModalOpen(false)}
                  className="text-slate-400 hover:text-white rounded-xl h-10 px-5"
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
