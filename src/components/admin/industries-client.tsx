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
import { PlusCircle, Edit, Trash, Loader2 } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Checkbox } from '@/components/ui/checkbox';
import {
  createIndustryAction,
  updateIndustryAction,
  deleteIndustryAction,
} from '@/actions/industries';
import type { Industry, Package } from '@/types';

interface IndustriesClientPageProps {
  initialIndustries: Industry[];
  packages: Package[];
}

export default function IndustriesClientPage({ initialIndustries, packages }: IndustriesClientPageProps) {
  const [industries, setIndustries] = useState<Industry[]>(initialIndustries);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingIndustry, setEditingIndustry] = useState<Industry | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Form Fields
  const [name, setName] = useState('');
  const [basePrice, setBasePrice] = useState(0);
  const [recommendedPackageId, setRecommendedPackageId] = useState(packages[0]?.id || '');
  const [isActive, setIsActive] = useState(true);

  const packageMap = packages.reduce<Record<string, string>>((acc, pkg) => {
    acc[pkg.id] = pkg.name;
    return acc;
  }, {});

  const openAddModal = () => {
    setEditingIndustry(null);
    setName('');
    setBasePrice(5000);
    setRecommendedPackageId(packages[0]?.id || '');
    setIsActive(true);
    setErrorMsg(null);
    setIsModalOpen(true);
  };

  const openEditModal = (ind: Industry) => {
    setEditingIndustry(ind);
    setName(ind.name);
    setBasePrice(ind.basePrice);
    setRecommendedPackageId(ind.recommendedPackageId);
    setIsActive(ind.isActive);
    setErrorMsg(null);
    setIsModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrorMsg(null);

    const formData = {
      name,
      basePrice,
      recommendedPackageId,
      isActive,
    };

    try {
      if (editingIndustry) {
        const res = await updateIndustryAction(editingIndustry.id, formData);
        if (res.success && res.data) {
          setIndustries((prev) =>
            prev.map((i) => (i.id === editingIndustry.id ? res.data! : i))
          );
          setIsModalOpen(false);
        } else {
          setErrorMsg(res.error || 'Failed to update industry.');
        }
      } else {
        const res = await createIndustryAction(formData);
        if (res.success && res.data) {
          setIndustries((prev) => [...prev, res.data!]);
          setIsModalOpen(false);
        } else {
          setErrorMsg(res.error || 'Failed to create industry.');
        }
      }
    } catch (err) {
      console.error(err);
      setErrorMsg('An unexpected error occurred.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteIndustry = async (id: string) => {
    if (!confirm('Are you sure you want to delete this industry?')) return;
    try {
      const res = await deleteIndustryAction(id);
      if (res.success) {
        setIndustries((prev) => prev.filter((i) => i.id !== id));
      } else {
        alert(res.error || 'Failed to delete industry.');
      }
    } catch (err) {
      console.error(err);
      alert('Failed to delete industry.');
    }
  };

  const columns = [
    { key: 'name', label: 'Industry Name', className: 'pl-6' },
    { key: 'basePrice', label: 'Industry Base price' },
    { key: 'recommendedPackage', label: 'Recommended Tier' },
    { key: 'status', label: 'Status' },
    { key: 'actions', label: 'Actions', className: 'text-right py-4 pr-6' },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-white">Industries</h1>
          <p className="text-sm text-slate-400 mt-1">
            Define industry verticals (e.g. Healthcare, Real Estate, Salon) and their baseline pricing offsets.
          </p>
        </div>
        <Button
          onClick={openAddModal}
          className="bg-indigo-600 hover:bg-indigo-500 text-white gap-2 rounded-xl h-11 px-5"
        >
          <PlusCircle className="w-5 h-5" />
          Add Industry
        </Button>
      </div>

      {/* Listing Table */}
      <DataTable
        columns={columns}
        data={industries}
        emptyMessage="No industries configured yet. Click Add Industry above."
        renderRow={(ind) => (
          <TableRow key={ind.id} className="hover:bg-slate-900/10 border-slate-800/40 transition-colors">
            <TableCell className="font-semibold text-white py-4 pl-6 text-sm">
              {ind.name}
            </TableCell>
            <TableCell className="text-slate-355 font-medium text-xs">
              {formatCurrency(ind.basePrice)}
            </TableCell>
            <TableCell className="text-slate-355 font-medium text-xs">
              <Badge variant="outline" className="border-slate-800/60 text-slate-400 hover:bg-transparent rounded-lg">
                {packageMap[ind.recommendedPackageId] || 'Custom'}
              </Badge>
            </TableCell>
            <TableCell>
              {ind.isActive ? (
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
              <div className="flex items-center justify-end gap-2">
                <Button
                  onClick={() => openEditModal(ind)}
                  variant="ghost"
                  size="icon"
                  className="text-slate-400 hover:text-white rounded-lg"
                >
                  <Edit className="w-4 h-4" />
                </Button>
                <Button
                  onClick={() => handleDeleteIndustry(ind.id)}
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

      {/* shadcn Dialog Component */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="bg-slate-900 border border-slate-800 shadow-2xl rounded-2xl w-full max-w-lg p-6 relative">
          <DialogHeader>
            <DialogTitle className="text-lg font-bold text-white">
              {editingIndustry ? 'Edit Industry Vertical' : 'Create Industry Vertical'}
            </DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4">
            {errorMsg && (
              <p className="text-xs text-red-400 bg-red-500/10 border border-red-500/20 p-2.5 rounded-lg">
                {errorMsg}
              </p>
            )}
            <div className="space-y-1">
              <Label className="text-slate-400 text-xs">Industry Name</Label>
              <Input
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Healthcare & Medical"
                className="bg-slate-950/60 border-slate-800 text-white rounded-xl h-10 text-sm"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <Label className="text-slate-400 text-xs">Base Markup Price (INR)</Label>
                <Input
                  required
                  type="number"
                  value={basePrice}
                  onChange={(e) => setBasePrice(Number(e.target.value))}
                  className="bg-slate-950/60 border-slate-800 text-white rounded-xl h-10 text-sm"
                />
              </div>
              <div className="space-y-1">
                <Label className="text-slate-400 text-xs">Recommended Package</Label>
                <select
                  value={recommendedPackageId}
                  onChange={(e) => setRecommendedPackageId(e.target.value)}
                  className="w-full h-10 bg-slate-950/60 border border-slate-800 text-white rounded-xl px-3 text-sm focus:outline-none focus:border-indigo-500"
                >
                  {packages.map((pkg) => (
                    <option key={pkg.id} value={pkg.id} className="bg-slate-950 text-white">
                      {pkg.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="flex items-center space-x-2 pt-2">
              <Checkbox
                id="isActive"
                checked={isActive}
                onCheckedChange={(checked) => setIsActive(!!checked)}
              />
              <Label htmlFor="isActive" className="text-sm font-medium text-slate-300 cursor-pointer select-none">
                Active Industry Vertical
              </Label>
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
        </DialogContent>
      </Dialog>
    </div>
  );
}
