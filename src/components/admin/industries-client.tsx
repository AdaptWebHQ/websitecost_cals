// @/components/admin/industries-client.tsx
'use client';

import React, { useState, useTransition } from 'react';
import { toast } from 'sonner';
import { Plus, Pencil, Trash2, Loader2, Building2 } from 'lucide-react';

import type { Industry, Package } from '@/types';
import {
  createIndustryAction,
  updateIndustryAction,
  deleteIndustryAction,
  toggleIndustryActiveAction
} from '@/actions/industries';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
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
import DataTable from '@/components/shared/data-table';
import { TableCell, TableRow } from '@/components/ui/table';

interface Props {
  initialIndustries: Industry[];
  packages: Package[];
}

interface IndustryFormData {
  name: string;
  description: string;
  basePrice: number;
  recommendedPackageId: string;
  isActive: boolean;
  sortOrder: number;
}

const COLUMNS = [
  { key: 'sortOrder', label: '#', className: 'w-12 text-muted-foreground font-semibold text-xs tracking-wider uppercase py-4' },
  { key: 'name', label: 'Industry Name', className: 'text-muted-foreground font-semibold text-xs tracking-wider uppercase py-4' },
  { key: 'recommendedPackageId', label: 'Rec. Package', className: 'text-muted-foreground font-semibold text-xs tracking-wider uppercase py-4' },
  { key: 'isActive', label: 'Status', className: 'w-24 text-muted-foreground font-semibold text-xs tracking-wider uppercase py-4' },
  { key: 'actions', label: '', className: 'w-24' },
];

export default function IndustriesClientPage({ initialIndustries, packages }: Props) {
  const [industries, setIndustries] = useState<Industry[]>(initialIndustries);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingIndustry, setEditingIndustry] = useState<Industry | null>(null);
  const [isPending, startTransition] = useTransition();

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

  const validate = (data: IndustryFormData): boolean => {
    const newErrors: Partial<Record<keyof IndustryFormData, string>> = {};
    if (!data.name.trim()) newErrors.name = 'Name is required.';
    if (data.description && data.description.length > 500) newErrors.description = 'Max 500 characters.';
    if (!data.recommendedPackageId) newErrors.recommendedPackageId = 'Package is required.';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const openCreateDialog = () => {
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

    startTransition(async () => {
      if (editingIndustry) {
        const response = await updateIndustryAction(editingIndustry.id, formData);
        if (response.success && response.data) {
          setIndustries(prev => prev.map(ind => ind.id === editingIndustry.id ? response.data! : ind));
          toast.success('Industry updated successfully.');
          setIsDialogOpen(false);
        } else {
          toast.error(response.error || 'Failed to update industry.');
        }
      } else {
        const response = await createIndustryAction(formData);
        if (response.success && response.data) {
          setIndustries(prev => [...prev, response.data!]);
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
      description: 'This action cannot be undone.',
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
    setIndustries(prev => prev.map(ind => ind.id === id ? { ...ind, isActive: newStatus } : ind));

    const response = await toggleIndustryActiveAction(id, newStatus);
    if (!response.success) {
      setIndustries(prev => prev.map(ind => ind.id === id ? { ...ind, isActive: currentStatus } : ind));
      toast.error(response.error || 'Failed to update status.');
    }
  };

  const renderRow = (industry: Industry, index: number) => (
    <TableRow key={industry.id} className="hover:bg-muted/30 border-border transition-colors">
      <TableCell className="font-mono text-xs text-muted-foreground py-3">{industry.sortOrder}</TableCell>
      <TableCell className="py-3">
        <div className="flex flex-col gap-0.5">
          <span className="font-semibold text-foreground text-sm">{industry.name}</span>
          {industry.description && (
            <span className="text-xs text-muted-foreground truncate max-w-md">{industry.description}</span>
          )}
        </div>
      </TableCell>
      <TableCell className="text-sm text-muted-foreground py-3">
        {packages.find(p => p.id === industry.recommendedPackageId)?.name || 'N/A'}
      </TableCell>
      <TableCell className="py-3">
        <Switch
          checked={industry.isActive}
          onCheckedChange={() => handleToggleActive(industry.id, industry.isActive)}
          disabled={isPending}
        />
      </TableCell>
      <TableCell className="py-3">
        <div className="flex items-center justify-end gap-2">
          <Button variant="ghost" size="icon" onClick={() => openEditDialog(industry)} disabled={isPending}>
            <Pencil className="w-4 h-4" />
          </Button>
          <Button variant="ghost" size="icon" className="text-destructive" onClick={() => handleDelete(industry.id)} disabled={isPending}>
            <Trash2 className="w-4 h-4" />
          </Button>
        </div>
      </TableCell>
    </TableRow>
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="p-3 rounded-xl bg-primary/10 text-primary">
            <Building2 className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Industry Verticals</h1>
            <p className="text-muted-foreground">Manage industries used for personalization and recommended routing.</p>
          </div>
        </div>
        <Button onClick={openCreateDialog} className="gap-2">
          <Plus className="w-4 h-4" />
          Add Industry
        </Button>
      </div>

      <DataTable
        columns={COLUMNS}
        data={industries}
        emptyMessage="No industries found. Create your first one!"
        renderRow={renderRow}
      />

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <form onSubmit={handleSubmit} className="space-y-5">
            <DialogHeader>
              <DialogTitle>{editingIndustry ? 'Edit Industry' : 'Create Industry'}</DialogTitle>
              <DialogDescription>
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
                />
                {errors.name && <p className="text-xs text-destructive">{errors.name}</p>}
              </div>

              {/* Description */}
              <div className="space-y-1.5">
                <Label htmlFor="industry-description">Calculator Description</Label>
                <Textarea
                  id="industry-description"
                  placeholder="Briefly describe web needs (e.g., Patient scheduling, secure HIPAA intake forms...)"
                  className="resize-none h-24 font-sans text-sm"
                  value={formData.description}
                  onChange={e => setFormData(p => ({ ...p, description: e.target.value }))}
                />
                <p className="text-xs text-muted-foreground">Visible on the public pricing page. Max 500 characters.</p>
                {errors.description && <p className="text-xs text-destructive">{errors.description}</p>}
              </div>

              <div className="grid grid-cols-2 gap-5">
                {/* Recommended Package */}
                <div className="space-y-1.5">
                  <Label>Recommended Base Package</Label>
                  <Select
                    value={formData.recommendedPackageId}
                    onValueChange={val => setFormData(p => ({ ...p, recommendedPackageId: val ?? '' }))}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select package" />
                    </SelectTrigger>
                    <SelectContent>
                      {packages.map(pkg => (
                        <SelectItem key={pkg.id} value={pkg.id}>{pkg.name}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <p className="text-xs text-muted-foreground">Calculator auto-selects this.</p>
                  {errors.recommendedPackageId && <p className="text-xs text-destructive">{errors.recommendedPackageId}</p>}
                </div>

                {/* Sort Order */}
                <div className="space-y-1.5">
                  <Label htmlFor="industry-sort">Sort Order</Label>
                  <Input
                    id="industry-sort"
                    type="number"
                    value={formData.sortOrder}
                    onChange={e => setFormData(p => ({ ...p, sortOrder: parseInt(e.target.value) || 0 }))}
                  />
                </div>
              </div>
            </div>

            <DialogFooter className="pt-5 border-t">
              <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)} disabled={isPending}>
                Cancel
              </Button>
              <Button type="submit" className="gap-2" disabled={isPending}>
                {isPending ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : editingIndustry ? (
                  'Update Industry'
                ) : (
                  'Create Industry'
                )}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}