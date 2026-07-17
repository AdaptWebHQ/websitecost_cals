'use client';

import { useState, useEffect, useCallback } from 'react';
import { toast } from 'sonner';
import DataTable from '@/components/shared/data-table';
import { Button } from '@/components/ui/button';
import { TableRow, TableCell } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { formatCurrency, cn } from '@/lib/utils';
import { PlusCircle, Edit, Trash, Loader2, Search } from 'lucide-react';
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
import {
  getPackageFeatureCategoriesAction,
  getPackageFeaturesAction,
} from '@/actions/package-features-library/index';
import type { Package, PackageFeatureCategory, PackageFeature } from '@/types';

interface PackagesClientPageProps {
  initialPackages: Package[];
}

export default function PackagesClientPage({
  initialPackages,
}: PackagesClientPageProps) {
  const [packages, setPackages] = useState<Package[]>(initialPackages);
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingPackage, setEditingPackage] = useState<Package | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Form Fields for Package
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [basePrice, setBasePrice] = useState(0);
  const [deliveryDays, setDeliveryDays] = useState(7);
  const [pagesIncluded, setPagesIncluded] = useState(5);
  const [pageLimitType, setPageLimitType] = useState<'custom' | 'unlimited'>('custom');
  const [revisions, setRevisions] = useState(3);
  const [isPopular, setIsPopular] = useState(false);
  const [isActive, setIsActive] = useState(true);

  // Centralized package features checklist selection state
  const [includedFeatureIds, setIncludedFeatureIds] = useState<string[]>([]);

  // Global library states
  const [globalCategories, setGlobalCategories] = useState<PackageFeatureCategory[]>([]);
  const [globalFeatures, setGlobalFeatures] = useState<PackageFeature[]>([]);
  const [isLoadingGlobal, setIsLoadingGlobal] = useState(true);

  const loadGlobalFeatures = useCallback(async () => {
    try {
      const [catsRes, featsRes] = await Promise.all([
        getPackageFeatureCategoriesAction(true), // only active
        getPackageFeaturesAction(undefined, true), // only active
      ]);
      if (catsRes.success && catsRes.data) {
        setGlobalCategories(catsRes.data.sort((a, b) => a.displayOrder - b.displayOrder));
      }
      if (featsRes.success && featsRes.data) {
        setGlobalFeatures(featsRes.data.sort((a, b) => a.displayOrder - b.displayOrder));
      }
    } catch (err) {
      console.error('Failed to load global features:', err);
    } finally {
      setIsLoadingGlobal(false);
    }
  }, []);

  // Load global feature catalog on mount
  useEffect(() => {
    setTimeout(() => {
      loadGlobalFeatures();
    }, 0);
  }, [loadGlobalFeatures]);

  const openAddModal = useCallback(() => {
    setEditingPackage(null);
    setName('');
    setDescription('');
    setBasePrice(15000);
    setDeliveryDays(7);
    setPagesIncluded(5);
    setPageLimitType('custom');
    setRevisions(3);
    setIsPopular(false);
    setIsActive(true);
    setIncludedFeatureIds([]);
    setErrorMsg(null);
    setIsModalOpen(true);
  }, []);

  const openEditModal = useCallback((pkg: Package) => {
    setEditingPackage(pkg);
    setName(pkg.name);
    setDescription(pkg.description);
    setBasePrice(pkg.basePrice);
    setDeliveryDays(pkg.deliveryDays);
    setPagesIncluded(pkg.pagesIncluded);
    setPageLimitType(pkg.pagesIncluded === -1 ? 'unlimited' : 'custom');
    setRevisions(pkg.revisions);
    setIsPopular(pkg.isPopular);
    setIsActive(pkg.isActive);
    setIncludedFeatureIds(pkg.includedFeatureIds || []);
    setErrorMsg(null);
    setIsModalOpen(true);
  }, []);

  const handleSubmit = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();
    if (isSubmitting) return;

    const trimmedName = name.trim();
    const trimmedDescription = description.trim();

    if (!trimmedName || !trimmedDescription) {
      setErrorMsg('Package name and description are required.');
      return;
    }

    setIsSubmitting(true);
    setErrorMsg(null);

    const finalPages = pageLimitType === 'unlimited' ? -1 : pagesIncluded;
    const formData = {
      name: trimmedName,
      description: trimmedDescription,
      basePrice,
      deliveryDays,
      pagesIncluded: finalPages,
      revisions,
      isPopular,
      isActive,
      includedFeatureIds,
      sortOrder: editingPackage ? editingPackage.sortOrder : packages.length,
    };

    try {
      if (editingPackage) {
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
        const res = await createPackageAction(formData);
        if (res.success && res.data) {
          setPackages((prev) => [...prev, res.data!]);
          setIsModalOpen(false);
        } else {
          setErrorMsg(res.error || 'Failed to create package.');
        }
      }
    } catch (err) {
      console.error('Error saving package:', err);
      setErrorMsg('An unexpected error occurred while saving the package.');
    } finally {
      setIsSubmitting(false);
    }
  }, [
    isSubmitting,
    name,
    description,
    basePrice,
    deliveryDays,
    pagesIncluded,
    revisions,
    isPopular,
    isActive,
    includedFeatureIds,
    editingPackage,
    packages.length,
  ]);

  const handleDeletePackage = useCallback(async (id: string) => {
    toast('Delete this package?', {
      description: 'This action cannot be undone.',
      action: {
        label: 'Delete',
        onClick: async () => {
          try {
            const res = await deletePackageAction(id);
            if (res.success) {
              setPackages((prev) => prev.filter((p) => p.id !== id));
              toast.success('Package deleted successfully.');
            } else {
              toast.error(res.error || 'Failed to delete package.');
            }
          } catch (err) {
            console.error('Error deleting package:', err);
            toast.error('Failed to delete package.');
          }
        },
      },
      cancel: { label: 'Cancel', onClick: () => {} },
    });
  }, []);

  const columns = [
    { key: 'name', label: 'Package Name' },
    { key: 'basePrice', label: 'Base Price' },
    { key: 'delivery', label: 'Delivery' },
    { key: 'pages', label: 'Pages Included' },
    { key: 'status', label: 'Status' },
    { key: 'actions', label: 'Actions', className: 'text-right py-4 pr-6' },
  ];

  const filteredPackages = packages.filter((pkg) => {
    const search = searchTerm.toLowerCase();
    return (
      pkg.name?.toLowerCase().includes(search) ||
      pkg.description?.toLowerCase().includes(search)
    );
  });

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

      {/* Search Filter */}
      <div className="relative max-w-md">
        <Search className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />
        <input
          type="text"
          placeholder="Search package name or description..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full h-10 bg-background border border-border rounded-xl pl-10 pr-4 text-sm text-foreground placeholder:text-muted-foreground/60 focus:outline-none focus:border-indigo-500/50 transition-colors"
        />
      </div>

      {/* Listing table */}
      <DataTable
        columns={columns}
        data={filteredPackages}
        emptyMessage={searchTerm ? "No packages match your search criteria." : "No packages configured yet. Use the button above to add one."}
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
            <TableCell className="text-muted-foreground text-xs">
              {pkg.pagesIncluded === -1 ? 'Unlimited Pages' : `${pkg.pagesIncluded} Pages`}
            </TableCell>
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
                  aria-label="Edit package"
                >
                  <Edit className="w-4 h-4" />
                </Button>
                <Button
                  onClick={() => handleDeletePackage(pkg.id)}
                  variant="ghost"
                  size="icon"
                  className="text-red-400 hover:text-red-300 rounded-lg"
                  aria-label="Delete package"
                >
                  <Trash className="w-4 h-4" />
                </Button>
              </div>
            </TableCell>
          </TableRow>
        )}
      />

      {/* Package Dialog */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="bg-popover border border-border shadow-2xl rounded-2xl w-full sm:max-w-4xl max-h-[90vh] overflow-y-auto p-6 relative text-popover-foreground">
          <DialogHeader>
            <DialogTitle className="text-lg font-bold text-foreground">
              {editingPackage ? 'Edit Quotation Package' : 'Create Quotation Package'}
            </DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-6">
            {errorMsg && (
              <p className="text-xs text-red-400 bg-red-500/10 border border-red-500/20 p-2.5 rounded-lg">
                {errorMsg}
              </p>
            )}

            <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
              {/* Left Column: Package Details (Col-span 3) */}
              <div className="lg:col-span-3 space-y-4">
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
                    rows={3}
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Summarize target audience and main values..."
                    className="bg-background border-border text-foreground rounded-xl resize-none"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <Label className="text-muted-foreground text-xs">Base Price (INR)</Label>
                    <Input
                      required
                      type="number"
                      min="0"
                      step="1"
                      value={basePrice}
                      onChange={(e) => setBasePrice(Number(e.target.value))}
                      className="bg-background border-border text-foreground rounded-xl h-10 text-sm"
                    />
                  </div>
                  <div className="space-y-1 flex flex-col justify-end pb-1">
                    <Label className="text-muted-foreground text-xs mb-1">Page Limit Mode</Label>
                    <div className="flex gap-4 items-center h-10">
                      <label className="flex items-center gap-1.5 text-xs text-foreground cursor-pointer select-none">
                        <input
                          type="radio"
                          name="pageLimitType"
                          value="custom"
                          checked={pageLimitType === 'custom'}
                          onChange={() => {
                            setPageLimitType('custom');
                            if (pagesIncluded === -1) setPagesIncluded(5);
                          }}
                          className="w-3.5 h-3.5 text-indigo-600 border-border focus:ring-indigo-500/50 bg-background accent-indigo-600"
                        />
                        <span>Custom Number</span>
                      </label>
                      <label className="flex items-center gap-1.5 text-xs text-foreground cursor-pointer select-none">
                        <input
                          type="radio"
                          name="pageLimitType"
                          value="unlimited"
                          checked={pageLimitType === 'unlimited'}
                          onChange={() => {
                            setPageLimitType('unlimited');
                            setPagesIncluded(-1);
                          }}
                          className="w-3.5 h-3.5 text-indigo-600 border-border focus:ring-indigo-500/50 bg-background accent-indigo-600"
                        />
                        <span>Unlimited Pages</span>
                      </label>
                    </div>
                  </div>
                </div>

                {pageLimitType === 'custom' && (
                  <div className="space-y-1">
                    <Label className="text-muted-foreground text-xs">Pages Included</Label>
                    <Input
                      required
                      type="number"
                      min="1"
                      step="1"
                      value={pagesIncluded === -1 ? 5 : pagesIncluded}
                      onChange={(e) => setPagesIncluded(Number(e.target.value))}
                      className="bg-background border-border text-foreground rounded-xl h-10 text-sm"
                    />
                  </div>
                )}
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <Label className="text-muted-foreground text-xs">Delivery (Days)</Label>
                    <Input
                      required
                      type="number"
                      min="1"
                      step="1"
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
                      min="0"
                      step="1"
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
              </div>

              {/* Right Column: In-Built Features Checklist */}
              <div className="lg:col-span-2 flex flex-col space-y-4">
                <div>
                  <Label className="text-xs font-semibold text-foreground uppercase tracking-wider">
                    Included Features
                  </Label>
                  <p className="text-[11px] text-muted-foreground mt-0.5">
                    Select in-built features from the central library to include in this package tier.
                  </p>
                </div>

                <div className="flex-1 bg-background border border-border rounded-xl p-4 space-y-4 max-h-[340px] overflow-y-auto scrollbar-thin">
                  {isLoadingGlobal ? (
                    <div className="flex items-center justify-center py-12">
                      <Loader2 className="w-5 h-5 animate-spin text-indigo-500" />
                    </div>
                  ) : globalCategories.length === 0 ? (
                    <div className="text-center py-12 text-xs text-muted-foreground border border-dashed border-border rounded-xl">
                      No categories defined in the library yet. Set them up under the Feature Library menu first.
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {globalCategories.map((cat) => {
                        const catFeatures = globalFeatures.filter((f) => f.categoryId === cat.id);
                        if (catFeatures.length === 0) return null;
                        return (
                          <div key={cat.id} className="space-y-2 border-b border-border/40 pb-3 last:border-0 last:pb-0">
                            <span className="text-[11px] font-bold text-indigo-400 block uppercase tracking-wider">
                              {cat.name}
                            </span>
                            <div className="grid grid-cols-1 gap-2 pl-2">
                              {catFeatures.map((feat) => {
                                const isChecked = includedFeatureIds.includes(feat.id);
                                return (
                                  <div key={feat.id} className="flex items-start space-x-2">
                                    <Checkbox
                                      id={`feat-${feat.id}`}
                                      checked={isChecked}
                                      onCheckedChange={(checked) => {
                                        if (checked) {
                                          setIncludedFeatureIds((prev) => [...prev, feat.id]);
                                        } else {
                                          setIncludedFeatureIds((prev) => prev.filter((id) => id !== feat.id));
                                        }
                                      }}
                                    />
                                    <Label
                                      htmlFor={`feat-${feat.id}`}
                                      className="text-xs font-medium text-foreground cursor-pointer leading-snug select-none"
                                    >
                                      {feat.name}
                                    </Label>
                                  </div>
                                );
                              })}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div className="flex justify-end gap-3 pt-4 border-t border-border">
              <Button
                type="button"
                variant="ghost"
                onClick={() => setIsModalOpen(false)}
                className="text-muted-foreground hover:text-foreground rounded-xl h-10 px-5"
                disabled={isSubmitting}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={isSubmitting}
                className="bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl h-10 px-6 font-semibold shadow-lg shadow-indigo-600/10 disabled:opacity-50"
              >
                {isSubmitting ? (
                  <span className="flex items-center gap-2">
                    <Loader2 className="w-4 h-4 animate-spin shrink-0" />
                    Saving...
                  </span>
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