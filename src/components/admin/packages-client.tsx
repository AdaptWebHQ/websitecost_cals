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
import { Textarea } from '@/components/ui/textarea';
import {
  createPackageAction,
  updatePackageAction,
  deletePackageAction,
} from '@/actions/packages';
import type { Package } from '@/types';

interface PackagesClientPageProps {
  initialPackages: Package[];
}

export default function PackagesClientPage({ initialPackages }: PackagesClientPageProps) {
  const [packages, setPackages] = useState<Package[]>(initialPackages);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingPackage, setEditingPackage] = useState<Package | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Form Fields
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [basePrice, setBasePrice] = useState(0);
  const [deliveryDays, setDeliveryDays] = useState(7);
  const [pagesIncluded, setPagesIncluded] = useState(5);
  const [revisions, setRevisions] = useState(3);
  const [isPopular, setIsPopular] = useState(false);
  const [isActive, setIsActive] = useState(true);
  const [featuresText, setFeaturesText] = useState('');

  const openAddModal = () => {
    setEditingPackage(null);
    setName('');
    setDescription('');
    setBasePrice(15000);
    setDeliveryDays(7);
    setPagesIncluded(5);
    setRevisions(3);
    setIsPopular(false);
    setIsActive(true);
    setFeaturesText('');
    setErrorMsg(null);
    setIsModalOpen(true);
  };

  const openEditModal = (pkg: Package) => {
    setEditingPackage(pkg);
    setName(pkg.name);
    setDescription(pkg.description);
    setBasePrice(pkg.basePrice);
    setDeliveryDays(pkg.deliveryDays);
    setPagesIncluded(pkg.pagesIncluded);
    setRevisions(pkg.revisions);
    setIsPopular(pkg.isPopular);
    setIsActive(pkg.isActive);
    setFeaturesText((pkg.features || []).join('\n'));
    setErrorMsg(null);
    setIsModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrorMsg(null);

    const features = featuresText
      .split('\n')
      .map((f) => f.trim())
      .filter(Boolean);

    const formData = {
      name,
      description,
      basePrice,
      deliveryDays,
      pagesIncluded,
      revisions,
      isPopular,
      isActive,
      features,
      sortOrder: editingPackage ? editingPackage.sortOrder : packages.length,
    };

    try {
      if (editingPackage) {
        // Update Action
        const res = await updatePackageAction(editingPackage.id, formData);
        if (res.success && res.data) {
          setPackages((prev) =>
            prev.map((p) => (p.id === editingPackage.id ? res.data! : p))
          );
          setIsModalOpen(false);
        } else {
          setErrorMsg(res.error || 'Failed to update package.');
        }
      } else {
        // Create Action
        const res = await createPackageAction(formData);
        if (res.success && res.data) {
          setPackages((prev) => [...prev, res.data!]);
          setIsModalOpen(false);
        } else {
          setErrorMsg(res.error || 'Failed to create package.');
        }
      }
    } catch (err) {
      console.error(err);
      setErrorMsg('An unexpected error occurred.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeletePackage = async (id: string) => {
    if (!confirm('Are you sure you want to delete this package?')) return;
    try {
      const res = await deletePackageAction(id);
      if (res.success) {
        setPackages((prev) => prev.filter((p) => p.id !== id));
      } else {
        alert(res.error || 'Failed to delete package.');
      }
    } catch (err) {
      console.error(err);
      alert('Failed to delete package.');
    }
  };

  const columns = [
    { key: 'name', label: 'Package Name' },
    { key: 'basePrice', label: 'Base Price' },
    { key: 'delivery', label: 'Delivery' },
    { key: 'pages', label: 'Pages Included' },
    { key: 'status', label: 'Status' },
    { key: 'actions', label: 'Actions', className: 'text-right py-4 pr-6' },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground">Quotation Packages</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Manage your pricing tiers (Starter, Business, Premium, etc.) shown to calculator users.
          </p>
        </div>
        <Button
          onClick={openAddModal}
          className="bg-indigo-600 hover:bg-indigo-500 text-white gap-2 rounded-xl h-11 px-5"
        >
          <PlusCircle className="w-5 h-5" />
          Add Package
        </Button>
      </div>

      {/* Listing table */}
      <DataTable
        columns={columns}
        data={packages}
        emptyMessage="No packages configured yet. Use the button above to add one."
        renderRow={(pkg) => (
          <TableRow key={pkg.id} className="hover:bg-muted/40 border-border transition-colors">
            <TableCell className="font-semibold text-foreground py-4 pl-6">
              <div className="flex flex-col">
                <span className="text-sm font-semibold">{pkg.name}</span>
                <span className="text-xs text-muted-foreground font-normal mt-0.5 max-w-sm truncate">
                  {pkg.description}
                </span>
              </div>
            </TableCell>
            <TableCell className="text-muted-foreground font-medium text-xs">{formatCurrency(pkg.basePrice)}</TableCell>
            <TableCell className="text-muted-foreground text-xs">{pkg.deliveryDays} Days</TableCell>
            <TableCell className="text-muted-foreground text-xs">{pkg.pagesIncluded} Pages</TableCell>
            <TableCell>
              {pkg.isActive ? (
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
              {pkg.isPopular && (
                <Badge className="ml-2 bg-indigo-500/5 text-indigo-400 border border-indigo-500/10 rounded-full text-[10px] px-2.5 py-0.5 font-medium hover:bg-transparent">
                  Popular
                </Badge>
              )}
            </TableCell>
            <TableCell className="text-right py-4 pr-6">
              <div className="flex items-center justify-end gap-2">
                <Button
                  onClick={() => openEditModal(pkg)}
                  variant="ghost"
                  size="icon"
                  className="text-muted-foreground hover:text-foreground rounded-lg"
                >
                  <Edit className="w-4 h-4" />
                </Button>
                <Button
                  onClick={() => handleDeletePackage(pkg.id)}
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
        <DialogContent className="bg-popover border border-border shadow-2xl rounded-2xl w-full max-w-lg p-6 relative text-popover-foreground">
          <DialogHeader>
            <DialogTitle className="text-lg font-bold text-foreground">
              {editingPackage ? 'Edit Quotation Package' : 'Create Quotation Package'}
            </DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4">
            {errorMsg && (
              <p className="text-xs text-red-400 bg-red-500/10 border border-red-500/20 p-2.5 rounded-lg">
                {errorMsg}
              </p>
            )}
            <div className="space-y-1">
              <Label className="text-muted-foreground text-xs">Package Name</Label>
              <Input
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Basic Brochure"
                className="bg-background border-border text-foreground rounded-xl h-10 text-sm"
              />
            </div>
            <div className="space-y-1">
              <Label className="text-muted-foreground text-xs">Description</Label>
              <Textarea
                required
                rows={2}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Summarize target audience and main values..."
                className="bg-background border-border text-foreground rounded-xl"
              />
            </div>
            <div className="space-y-1">
              <Label className="text-muted-foreground text-xs">Included Features / Bullets (One per line)</Label>
              <Textarea
                rows={3}
                value={featuresText}
                onChange={(e) => setFeaturesText(e.target.value)}
                placeholder="e.g.&#10;Up to 5 Responsive Pages&#10;Basic SEO Optimization"
                className="bg-background border-border text-foreground rounded-xl"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <Label className="text-muted-foreground text-xs">Base Price (INR)</Label>
                <Input
                  required
                  type="number"
                  value={basePrice}
                  onChange={(e) => setBasePrice(Number(e.target.value))}
                  className="bg-background border-border text-foreground rounded-xl h-10 text-sm"
                />
              </div>
              <div className="space-y-1">
                <Label className="text-muted-foreground text-xs">Pages Included</Label>
                <Input
                  required
                  type="number"
                  value={pagesIncluded}
                  onChange={(e) => setPagesIncluded(Number(e.target.value))}
                  className="bg-background border-border text-foreground rounded-xl h-10 text-sm"
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <Label className="text-muted-foreground text-xs">Delivery (Days)</Label>
                <Input
                  required
                  type="number"
                  value={deliveryDays}
                  onChange={(e) => setDeliveryDays(Number(e.target.value))}
                  className="bg-background border-border text-foreground rounded-xl h-10 text-sm"
                />
              </div>
              <div className="space-y-1">
                <Label className="text-muted-foreground text-xs">Revisions Allowed</Label>
                <Input
                  required
                  type="number"
                  value={revisions}
                  onChange={(e) => setRevisions(Number(e.target.value))}
                  className="bg-background border-border text-foreground rounded-xl h-10 text-sm"
                />
              </div>
            </div>

            <div className="flex gap-6 pt-2">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="isPopular"
                  checked={isPopular}
                  onCheckedChange={(checked) => setIsPopular(!!checked)}
                />
                <Label htmlFor="isPopular" className="text-sm font-medium text-foreground cursor-pointer select-none">
                  Mark as Popular
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="isActive"
                  checked={isActive}
                  onCheckedChange={(checked) => setIsActive(!!checked)}
                />
                <Label htmlFor="isActive" className="text-sm font-medium text-foreground cursor-pointer select-none">
                  Active Listing
                </Label>
              </div>
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
        </DialogContent>
      </Dialog>
    </div>
  );
}
