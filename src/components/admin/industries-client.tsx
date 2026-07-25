'use client';

import React, { useState, useEffect, useTransition, useMemo } from 'react';
import { toast } from 'sonner';
import { Plus, Pencil, Trash2, Loader2, Search, GripVertical, ToggleLeft, ToggleRight, Building2 } from 'lucide-react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';

import type { Industry, Package, ServiceCategory } from '@/types';
import {
  createIndustryAction,
  updateIndustryAction,
  deleteIndustryAction,
  toggleIndustryActiveAction,
  getIndustriesAction,
  reorderIndustriesAction,
} from '@/actions/industries';
import { getPackagesAction } from '@/actions/packages';
import { useAdminCategoryStore } from '@/store/admin-category-store';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import AdminCategoryHeader from './admin-category-header';

interface IndustriesClientPageProps {
  categories: ServiceCategory[];
  initialCategoryId: string;
  initialIndustries: Industry[];
  initialPackages?: Package[];
}

interface IndustryFormData {
  name: string;
  description: string;
  basePrice: number;
  recommendedPackageId: string;
  isActive: boolean;
  sortOrder: number;
}

export default function IndustriesClientPage({
  categories: initialCategoriesData,
  initialCategoryId,
  initialIndustries,
  initialPackages = [],
}: IndustriesClientPageProps) {
  const { selectedCategoryId, categories } = useAdminCategoryStore();
  const [industries, setIndustries] = useState<Industry[]>([]);
  const [packages, setPackages] = useState<Package[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingIndustry, setEditingIndustry] = useState<Industry | null>(null);
  const [isPending, startTransition] = useTransition();

  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);

  const defaultForm: IndustryFormData = {
    name: '',
    description: '',
    basePrice: 0,
    recommendedPackageId: packages[0]?.id || '',
    isActive: true,
    sortOrder: 0,
  };

  const [formData, setFormData] = useState<IndustryFormData>(defaultForm);
  const [errors, setErrors] = useState<Partial<Record<keyof IndustryFormData, string>>>({});

  // Reload data on category change
  useEffect(() => {
    if (!selectedCategoryId) {
      setIndustries([]);
      setPackages([]);
      return;
    }
    startTransition(async () => {
      const [indRes, pkgRes] = await Promise.all([
        getIndustriesAction(selectedCategoryId!),
        getPackagesAction(selectedCategoryId!),
      ]);
      if (indRes.success && indRes.data) {
        setIndustries(indRes.data.sort((a, b) => a.sortOrder - b.sortOrder));
      } else {
        setIndustries([]);
      }
      if (pkgRes.success && pkgRes.data) {
        setPackages(pkgRes.data);
      } else {
        setPackages([]);
      }
    });
  }, [selectedCategoryId]);

  const validate = (data: IndustryFormData): boolean => {
    const newErrors: Partial<Record<keyof IndustryFormData, string>> = {};
    if (!data.name.trim()) newErrors.name = 'Name is required.';
    if (data.description && data.description.length > 500) newErrors.description = 'Max 500 characters.';
    if (!data.recommendedPackageId) newErrors.recommendedPackageId = 'Package is required.';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const openCreateDialog = () => {
    if (!selectedCategoryId) {
      toast.error('Select a service category first.');
      return;
    }
    setEditingIndustry(null);
    setFormData({ ...defaultForm, sortOrder: industries.length + 1, recommendedPackageId: packages[0]?.id || '' });
    setErrors({});
    setIsDialogOpen(true);
  };

  const openEditDialog = (industry: Industry) => {
    setEditingIndustry(industry);
    setFormData({
      name: industry.name,
      description: industry.description || '',
      basePrice: industry.basePrice,
      recommendedPackageId: industry.recommendedPackageId,
      isActive: industry.isActive,
      sortOrder: industry.sortOrder || 0,
    });
    setErrors({});
    setIsDialogOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate(formData)) return;
    if (!selectedCategoryId) return;

    startTransition(async () => {
      const payload = {
        serviceCategoryId: selectedCategoryId!,
        ...formData,
      };

      if (editingIndustry) {
        const response = await updateIndustryAction(editingIndustry.id, payload);
        if (response.success && response.data) {
          setIndustries(prev => prev.map(ind => ind.id === editingIndustry.id ? response.data! : ind).sort((a, b) => a.sortOrder - b.sortOrder));
          toast.success('Industry updated successfully.');
          setIsDialogOpen(false);
        } else {
          toast.error(response.error || 'Failed to update industry.');
        }
      } else {
        const response = await createIndustryAction(payload);
        if (response.success && response.data) {
          setIndustries(prev => [...prev, response.data!].sort((a, b) => a.sortOrder - b.sortOrder));
          toast.success('Industry created successfully.');
          setIsDialogOpen(false);
        } else {
          toast.error(response.error || 'Failed to create industry.');
        }
      }
    });
  };

  const handleDelete = (id: string) => {
    toast('Delete this industry?', {
      description: 'This action cannot be undone and will fail if the industry is referenced in active estimates.',
      action: {
        label: 'Delete',
        onClick: () => {
          startTransition(async () => {
            const response = await deleteIndustryAction(id);
            if (response.success) {
              setIndustries(prev => prev.filter(ind => ind.id !== id));
              toast.success('Industry deleted successfully.');
            } else {
              toast.error(response.error || 'Failed to delete industry.');
            }
          });
        },
      },
      cancel: { label: 'Cancel', onClick: () => {} },
    });
  };

  const handleToggleActive = async (id: string, currentStatus: boolean) => {
    const newStatus = !currentStatus;
    startTransition(async () => {
      const response = await toggleIndustryActiveAction(id, newStatus);
      if (response.success) {
        setIndustries(prev => prev.map(ind => ind.id === id ? { ...ind, isActive: newStatus } : ind));
        toast.success('Status updated successfully.');
      } else {
        toast.error(response.error || 'Failed to update status.');
      }
    });
  };

  const handleReorder = (orderedIds: string[]) => {
    const sorted = [...industries].sort((a, b) => {
      const aIdx = orderedIds.indexOf(a.id);
      const bIdx = orderedIds.indexOf(b.id);
      return aIdx - bIdx;
    }).map((item, idx) => ({ ...item, sortOrder: idx + 1 }));

    setIndustries(sorted);

    startTransition(async () => {
      const res = await reorderIndustriesAction(orderedIds);
      if (res.success) {
        toast.success('Sort order saved.');
      } else {
        toast.error(res.error || 'Failed to save sort order.');
      }
    });
  };

  const filteredIndustries = useMemo(() => {
    return industries.filter((ind) => {
      const search = searchTerm.toLowerCase();
      const recommendedPackageName = packages.find(p => p.id === ind.recommendedPackageId)?.name || '';
      return (
        ind.name?.toLowerCase().includes(search) ||
        ind.description?.toLowerCase().includes(search) ||
        recommendedPackageName.toLowerCase().includes(search)
      );
    });
  }, [industries, packages, searchTerm]);

  return (
    <div className="space-y-6">
      {/* Category persistent Header */}
      <AdminCategoryHeader />

      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-4 border border-border rounded-2xl bg-card">
        <div className="relative w-full sm:max-w-md">
          <Search className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search industry name or package..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full h-10 bg-background border border-border rounded-xl pl-10 pr-4 text-sm text-foreground placeholder:text-muted-foreground/60 focus:outline-none focus:border-primary/50 transition-colors"
          />
        </div>
        <Button onClick={openCreateDialog} className="gap-2 rounded-xl h-10 px-5">
          <Plus className="w-4 h-4" />
          Add Industry
        </Button>
      </div>

      {isPending && (
        <div className="flex items-center justify-center p-12">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
          <span className="ml-3 text-muted-foreground">Loading industries...</span>
        </div>
      )}

      {/* Table view */}
      {!isPending && industries.length > 0 && (
        <div className="rounded-2xl border border-border bg-card overflow-hidden">
          <Table>
            <TableHeader className="bg-muted/40">
              <TableRow className="border-b border-border">
                <TableHead className="w-8"></TableHead>
                <TableHead className="w-12 text-muted-foreground font-semibold text-xs tracking-wider uppercase py-4">#</TableHead>
                <TableHead className="text-muted-foreground font-semibold text-xs tracking-wider uppercase py-4">Industry Name</TableHead>
                <TableHead className="text-muted-foreground font-semibold text-xs tracking-wider uppercase py-4">Service Category</TableHead>
                <TableHead className="text-muted-foreground font-semibold text-xs tracking-wider uppercase py-4">Rec. Package</TableHead>
                <TableHead className="w-24 text-muted-foreground font-semibold text-xs tracking-wider uppercase py-4">Status</TableHead>
                <TableHead className="w-32 text-muted-foreground font-semibold text-xs tracking-wider uppercase py-4">Created Date</TableHead>
                <TableHead className="w-24"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredIndustries.map((ind, index) => (
                <TableRow
                  key={ind.id}
                  draggable
                  onDragStart={(e) => {
                    setDraggedIndex(index);
                    e.dataTransfer.effectAllowed = 'move';
                  }}
                  onDragOver={(e) => e.preventDefault()}
                  onDrop={(e) => {
                    e.preventDefault();
                    if (draggedIndex === null || draggedIndex === index) return;
                    const updated = [...industries];
                    const [moved] = updated.splice(draggedIndex, 1);
                    updated.splice(index, 0, moved);
                    handleReorder(updated.map((s) => s.id));
                    setDraggedIndex(null);
                  }}
                  className="hover:bg-muted/40 border-b border-border transition-colors cursor-grab active:cursor-grabbing"
                >
                  <TableCell className="text-muted-foreground p-3">
                    <GripVertical className="w-4 h-4" />
                  </TableCell>
                  <TableCell className="font-mono text-xs text-muted-foreground py-3">{ind.sortOrder}</TableCell>
                  <TableCell className="py-3">
                    <div className="flex flex-col gap-0.5">
                      <span className="font-semibold text-foreground text-sm">{ind.name}</span>
                      {ind.description && (
                        <span className="text-xs text-muted-foreground truncate max-w-md">{ind.description}</span>
                      )}
                    </div>
                  </TableCell>
                  <TableCell className="text-sm text-muted-foreground py-3">
                    {categories.find(c => c.id === selectedCategoryId)?.name || 'N/A'}
                  </TableCell>
                  <TableCell className="text-sm text-muted-foreground py-3">
                    {packages.find(p => p.id === ind.recommendedPackageId)?.name || 'N/A'}
                  </TableCell>
                  <TableCell className="py-3">
                    <button
                      onClick={() => handleToggleActive(ind.id, ind.isActive)}
                      className="text-slate-400 hover:text-white transition-colors cursor-pointer mr-2"
                      title={ind.isActive ? 'Deactivate' : 'Activate'}
                      disabled={isPending}
                    >
                      {ind.isActive ? (
                        <ToggleRight className="w-8 h-8 text-emerald-400" />
                      ) : (
                        <ToggleLeft className="w-8 h-8 text-slate-500" />
                      )}
                    </button>
                  </TableCell>
                  <TableCell className="text-sm text-muted-foreground py-3">
                    {ind.createdAt ? new Date(ind.createdAt).toLocaleDateString() : 'N/A'}
                  </TableCell>
                  <TableCell className="py-3 text-right pr-6">
                    <div className="flex items-center justify-end gap-2">
                      <Button variant="ghost" size="icon" onClick={() => openEditDialog(ind)} disabled={isPending} className="w-8 h-8">
                        <Pencil className="w-4 h-4" />
                      </Button>
                      <Button variant="ghost" size="icon" className="text-destructive w-8 h-8" onClick={() => handleDelete(ind.id)} disabled={isPending}>
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}

      {/* Empty State Banner */}
      {!isPending && industries.length === 0 && (
        <div className="flex flex-col items-center justify-center p-12 border border-dashed border-border rounded-2xl bg-card space-y-4">
          <div className="p-4 bg-primary/10 rounded-full text-primary">
            <Building2 className="w-10 h-10" />
          </div>
          <div className="text-center space-y-1">
            <h3 className="text-base font-bold">No industries found</h3>
            <p className="text-sm text-muted-foreground max-w-sm">
              No industries have been created for this Service Category yet.
            </p>
          </div>
          <Button onClick={openCreateDialog} className="rounded-xl h-10 px-5">
            Create Industry
          </Button>
        </div>
      )}

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-[600px] border-border bg-popover text-popover-foreground rounded-2xl">
          <form onSubmit={handleSubmit} className="space-y-5">
            <DialogHeader>
              <DialogTitle className="text-lg font-bold text-foreground">
                {editingIndustry ? 'Edit Industry' : 'Create Industry'}
              </DialogTitle>
              <DialogDescription className="text-muted-foreground text-sm">
                Define the industry vertical name and brief description for the public calculator.
              </DialogDescription>
            </DialogHeader>

            <div className="grid grid-cols-1 gap-5">
              {/* Name */}
              <div className="space-y-1.5">
                <Label htmlFor="industry-name">Industry Vertical Name</Label>
                <Input
                  id="industry-name"
                  placeholder="e.g. Luxury Salons & Spas"
                  value={formData.name}
                  onChange={e => setFormData(p => ({ ...p, name: e.target.value }))}
                  className="bg-background border-border text-foreground rounded-xl"
                  disabled={isPending}
                />
                {errors.name && <p className="text-xs text-destructive">{errors.name}</p>}
              </div>

              {/* Description */}
              <div className="space-y-1.5">
                <Label htmlFor="industry-description">Calculator Description</Label>
                <Textarea
                  id="industry-description"
                  placeholder="Briefly describe web needs (e.g., Patient scheduling, secure HIPAA intake forms...)"
                  className="resize-none h-24 bg-background border-border text-foreground rounded-xl font-sans text-sm"
                  value={formData.description}
                  onChange={e => setFormData(p => ({ ...p, description: e.target.value }))}
                  disabled={isPending}
                />
                {errors.description && <p className="text-xs text-destructive">{errors.description}</p>}
              </div>

              {/* Recommended Package */}
              <div className="space-y-1.5">
                <Label htmlFor="recommended-pkg">Recommended Package Option</Label>
                <Select
                  value={formData.recommendedPackageId}
                  onValueChange={val => setFormData(p => ({ ...p, recommendedPackageId: val || '' }))}
                  disabled={isPending}
                >
                  <SelectTrigger id="recommended-pkg" className="bg-background border-border text-foreground rounded-xl h-10">
                    <SelectValue placeholder="Select recommended package" />
                  </SelectTrigger>
                  <SelectContent className="bg-popover border-border rounded-xl">
                    {packages.map(p => (
                      <SelectItem key={p.id} value={p.id} className="cursor-pointer">
                        {p.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.recommendedPackageId && (
                  <p className="text-xs text-destructive">{errors.recommendedPackageId}</p>
                )}
              </div>
            </div>

            <DialogFooter className="gap-2 sm:gap-0">
              <Button type="button" variant="ghost" onClick={() => setIsDialogOpen(false)} className="rounded-xl border border-border" disabled={isPending}>
                Cancel
              </Button>
              <Button type="submit" className="rounded-xl" disabled={isPending}>
                {isPending && <Loader2 className="w-4 h-4 animate-spin mr-2" />}
                {editingIndustry ? 'Save Changes' : 'Create Industry'}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}