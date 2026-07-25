'use client';

import React, { useState, useEffect, useTransition, useMemo, useCallback } from 'react';
import { toast } from 'sonner';
import { Plus, Pencil, Trash2, Loader2, Search, GripVertical, ToggleLeft, ToggleRight, Check, Package as PackageIcon } from 'lucide-react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';

import type { ServiceCategory, Package, PackageFeatureCategory, PackageFeature, ServiceType } from '@/types';
import {
  createPackageAction,
  updatePackageAction,
  deletePackageAction,
  togglePackageActiveAction,
  getPackagesAction,
  reorderPackagesAction,
  getPackageStatsAction,
} from '@/actions/packages';
import { getPackageFeatureCategoriesAction } from '@/actions/package-feature-categories';
import { getPackageFeaturesAction } from '@/actions/package-features';
import { getServiceTypesAction } from '@/actions/service-types';
import { useAdminCategoryStore } from '@/store/admin-category-store';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import AdminCategoryHeader from './admin-category-header';
import { slugify } from '@/lib/utils';

interface PackagesClientPageProps {
  categories: ServiceCategory[];
  initialCategoryId: string;
  initialServiceTypes: ServiceType[];
  initialServiceTypeId: string;
  initialPackages: Package[];
}

export default function PackagesClientPage({
  categories: initialCategoriesData,
  initialCategoryId,
  initialServiceTypes,
  initialServiceTypeId,
  initialPackages,
}: PackagesClientPageProps) {
  const { selectedCategoryId, categories } = useAdminCategoryStore();
  const [packages, setPackages] = useState<Package[]>([]);
  const [serviceTypes, setServiceTypes] = useState<ServiceType[]>(initialServiceTypes);
  const [selectedServiceTypeId, setSelectedServiceTypeId] = useState<string>(initialServiceTypeId);
  const [packageStats, setPackageStats] = useState<Record<string, number>>({});
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingPackage, setEditingPackage] = useState<Package | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);

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
  const [formServiceTypeId, setFormServiceTypeId] = useState('');

  // Centralized package features checklist selection state
  const [includedFeatureIds, setIncludedFeatureIds] = useState<string[]>([]);

  // Global library states
  const [globalCategories, setGlobalCategories] = useState<PackageFeatureCategory[]>([]);
  const [globalFeatures, setGlobalFeatures] = useState<PackageFeature[]>([]);
  const [isLoadingGlobal, setIsLoadingGlobal] = useState(true);

  const loadGlobalFeatures = useCallback(async (catId: string) => {
    setIsLoadingGlobal(true);
    try {
      const [catsRes, featsRes] = await Promise.all([
        getPackageFeatureCategoriesAction(catId, true), // only active
        getPackageFeaturesAction(catId, true), // only active
      ]);
      if (catsRes.success && catsRes.data) {
        setGlobalCategories(catsRes.data.sort((a, b) => a.displayOrder - b.displayOrder));
      } else {
        setGlobalCategories([]);
      }
      if (featsRes.success && featsRes.data) {
        setGlobalFeatures(featsRes.data.sort((a, b) => a.displayOrder - b.displayOrder));
      } else {
        setGlobalFeatures([]);
      }
    } catch (err) {
      console.error('Failed to load global features:', err);
    } finally {
      setIsLoadingGlobal(false);
    }
  }, []);

  const loadPackageStats = useCallback(async (catId: string) => {
    try {
      const res = await getPackageStatsAction(catId);
      if (res.success && res.data) {
        setPackageStats(res.data);
      }
    } catch (err) {
      console.error('Failed to load package stats:', err);
    }
  }, []);

  // Reload service types on category change
  useEffect(() => {
    if (!selectedCategoryId) {
      setServiceTypes([]);
      setSelectedServiceTypeId('');
      return;
    }
    startTransition(async () => {
      const typesRes = await getServiceTypesAction(selectedCategoryId!, true);
      if (typesRes.success && typesRes.data) {
        setServiceTypes(typesRes.data);
        if (typesRes.data.length > 0) {
          setSelectedServiceTypeId(typesRes.data[0].id);
        } else {
          setSelectedServiceTypeId('');
        }
      } else {
        setServiceTypes([]);
        setSelectedServiceTypeId('');
      }
      await loadGlobalFeatures(selectedCategoryId!);
      await loadPackageStats(selectedCategoryId!);
    });
  }, [selectedCategoryId, loadGlobalFeatures, loadPackageStats]);

  // Reload packages when service type changes
  useEffect(() => {
    if (!selectedCategoryId || !selectedServiceTypeId) {
      setPackages([]);
      return;
    }
    startTransition(async () => {
      const res = await getPackagesAction(selectedCategoryId!, selectedServiceTypeId);
      if (res.success && res.data) {
        setPackages(res.data.sort((a, b) => (a.sortOrder || 0) - (b.sortOrder || 0)));
      } else {
        setPackages([]);
      }
    });
  }, [selectedCategoryId, selectedServiceTypeId]);

  const openCreateModal = (defaultServiceTypeId?: string) => {
    if (!selectedCategoryId) {
      toast.error('Select a service category first.');
      return;
    }
    setEditingPackage(null);
    setName('');
    setDescription('');
    setBasePrice(0);
    setDeliveryDays(14);
    setPagesIncluded(5);
    setPageLimitType('custom');
    setRevisions(3);
    setIsPopular(false);
    setIsActive(true);
    setIncludedFeatureIds([]);
    setFormServiceTypeId(defaultServiceTypeId || selectedServiceTypeId || (serviceTypes[0]?.id || ''));
    setErrorMsg(null);
    setIsModalOpen(true);
  };

  const openEditModal = (pkg: Package) => {
    setEditingPackage(pkg);
    setName(pkg.name);
    setDescription(pkg.description || '');
    setBasePrice(pkg.basePrice);
    setDeliveryDays(pkg.deliveryDays || 14);
    setPagesIncluded(pkg.pagesIncluded === -1 ? 0 : pkg.pagesIncluded || 5);
    setPageLimitType(pkg.pagesIncluded === -1 ? 'unlimited' : 'custom');
    setRevisions(pkg.revisions || 3);
    setIsPopular(pkg.isPopular || false);
    setIsActive(pkg.isActive);
    setIncludedFeatureIds(pkg.includedFeatureIds || []);
    setFormServiceTypeId(pkg.serviceTypeId || '');
    setErrorMsg(null);
    setIsModalOpen(true);
  };

  const handleToggleActive = async (id: string, currentStatus: boolean) => {
    const newStatus = !currentStatus;
    startTransition(async () => {
      const response = await togglePackageActiveAction(id, newStatus);
      if (response.success) {
        setPackages(prev => prev.map(p => p.id === id ? { ...p, isActive: newStatus } : p));
        await loadPackageStats(selectedCategoryId!);
        toast.success('Package status updated.');
      } else {
        toast.error(response.error || 'Failed to update status.');
      }
    });
  };

  const handleDelete = (id: string) => {
    toast('Delete this package?', {
      description: 'This action cannot be undone and will fail if the package is referenced in active calculations.',
      action: {
        label: 'Delete',
        onClick: () => {
          startTransition(async () => {
            const response = await deletePackageAction(id);
            if (response.success) {
              setPackages(prev => prev.filter(p => p.id !== id));
              await loadPackageStats(selectedCategoryId!);
              toast.success('Package deleted successfully.');
            } else {
              toast.error(response.error || 'Failed to delete package.');
            }
          });
        },
      },
    });
  };

  const handleReorder = (orderedIds: string[]) => {
    const sorted = [...packages].sort((a, b) => {
      const aIdx = orderedIds.indexOf(a.id);
      const bIdx = orderedIds.indexOf(b.id);
      return aIdx - bIdx;
    }).map((item, idx) => ({ ...item, sortOrder: idx + 1 }));

    setPackages(sorted);

    startTransition(async () => {
      const res = await reorderPackagesAction(orderedIds);
      if (res.success) {
        toast.success('Sort order saved.');
      } else {
        toast.error(res.error || 'Failed to save sort order.');
      }
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      setErrorMsg('Package name is required.');
      return;
    }
    if (!selectedCategoryId) return;
    if (!formServiceTypeId) {
      setErrorMsg('Service Type is required.');
      return;
    }

    setIsSubmitting(true);
    setErrorMsg(null);

    const payload = {
      serviceCategoryId: selectedCategoryId!,
      serviceTypeId: formServiceTypeId,
      name: name.trim(),
      description: description.trim(),
      basePrice: Number(basePrice),
      deliveryDays: Number(deliveryDays),
      pagesIncluded: pageLimitType === 'unlimited' ? -1 : Number(pagesIncluded),
      revisions: Number(revisions),
      isPopular,
      isActive,
      includedFeatureIds,
      sortOrder: editingPackage ? editingPackage.sortOrder || 0 : packages.length + 1,
    };

    try {
      if (editingPackage) {
        const res = await updatePackageAction(editingPackage.id, payload);
        if (res.success && res.data) {
          if (formServiceTypeId !== selectedServiceTypeId) {
            setPackages(prev => prev.filter(p => p.id !== editingPackage.id));
          } else {
            setPackages(prev => prev.map(p => p.id === editingPackage.id ? res.data! : p).sort((a, b) => (a.sortOrder || 0) - (b.sortOrder || 0)));
          }
          await loadPackageStats(selectedCategoryId!);
          toast.success('Package updated successfully.');
          setIsModalOpen(false);
        } else {
          setErrorMsg(res.error || 'Failed to update package.');
        }
      } else {
        const res = await createPackageAction(payload);
        if (res.success && res.data) {
          if (formServiceTypeId === selectedServiceTypeId) {
            setPackages(prev => [...prev, res.data!].sort((a, b) => (a.sortOrder || 0) - (b.sortOrder || 0)));
          }
          await loadPackageStats(selectedCategoryId!);
          toast.success('Package created successfully.');
          setIsModalOpen(false);
        } else {
          setErrorMsg(res.error || 'Failed to create package.');
        }
      }
    } catch (err: any) {
      setErrorMsg(err.message || 'An error occurred.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleFeatureToggle = (featureId: string) => {
    setIncludedFeatureIds(prev =>
      prev.includes(featureId) ? prev.filter(id => id !== featureId) : [...prev, featureId]
    );
  };

  const filteredPackages = useMemo(() => {
    return packages.filter((pkg) => {
      const search = searchTerm.toLowerCase();
      return (
        pkg.name.toLowerCase().includes(search) ||
        (pkg.description || '').toLowerCase().includes(search)
      );
    });
  }, [packages, searchTerm]);

  return (
    <div className="space-y-6">
      {/* Category Header */}
      <AdminCategoryHeader />

      {/* Service Type tabs selector */}
      {serviceTypes.length > 0 && (
        <div className="flex items-center gap-2 overflow-x-auto pb-2 border-b border-border">
          {serviceTypes.map((type) => (
            <button
              key={type.id}
              onClick={() => setSelectedServiceTypeId(type.id)}
              className={`px-4 py-2 text-xs font-semibold rounded-xl border transition-all whitespace-nowrap cursor-pointer ${
                selectedServiceTypeId === type.id
                  ? 'bg-primary text-white border-primary shadow-sm'
                  : 'bg-card text-muted-foreground border-border hover:border-muted-foreground/30 hover:text-foreground'
              }`}
            >
              {type.name}
              {packageStats[type.id] !== undefined && (
                <Badge className="ml-2 bg-primary-foreground/20 text-white border-none text-[10px] py-0 px-1.5 font-bold">
                  {packageStats[type.id]}
                </Badge>
              )}
            </button>
          ))}
        </div>
      )}

      {/* Selected Service Type header & section */}
      {selectedServiceTypeId && (
        <div className="p-4 border border-border bg-card rounded-2xl flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h3 className="text-sm font-bold text-foreground">
              {serviceTypes.find((t) => t.id === selectedServiceTypeId)?.name}
            </h3>
            <p className="text-xs text-muted-foreground mt-1">
              {serviceTypes.find((t) => t.id === selectedServiceTypeId)?.description || 'Configure baseline pricing options for this service type.'}
            </p>
          </div>
          <Button onClick={() => openCreateModal(selectedServiceTypeId)} className="gap-2 rounded-xl h-9 px-4 text-xs self-start md:self-auto">
            <Plus className="w-3.5 h-3.5" />
            Add Package to {serviceTypes.find((t) => t.id === selectedServiceTypeId)?.name}
          </Button>
        </div>
      )}

      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-4 border border-border rounded-2xl bg-card">
        <div className="relative w-full sm:max-w-md">
          <Search className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search package name..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full h-10 bg-background border border-border rounded-xl pl-10 pr-4 text-sm text-foreground placeholder:text-muted-foreground/60 focus:outline-none focus:border-primary/50 transition-colors"
          />
        </div>
        <Button onClick={() => openCreateModal()} className="gap-2 rounded-xl h-10 px-5">
          <Plus className="w-4 h-4" />
          Add Package
        </Button>
      </div>

      {isPending && (
        <div className="flex items-center justify-center p-12">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
          <span className="ml-3 text-muted-foreground">Loading packages...</span>
        </div>
      )}

      {/* Table view */}
      {!isPending && packages.length > 0 && (
        <div className="rounded-2xl border border-border bg-card overflow-hidden">
          <Table>
            <TableHeader className="bg-muted/40">
              <TableRow className="border-b border-border">
                <TableHead className="w-8"></TableHead>
                <TableHead className="w-12 text-muted-foreground font-semibold text-xs tracking-wider uppercase py-4">#</TableHead>
                <TableHead className="text-muted-foreground font-semibold text-xs tracking-wider uppercase py-4">Package Name</TableHead>
                <TableHead className="text-muted-foreground font-semibold text-xs tracking-wider uppercase py-4">Service Type</TableHead>
                <TableHead className="text-muted-foreground font-semibold text-xs tracking-wider uppercase py-4">Price</TableHead>
                <TableHead className="text-muted-foreground font-semibold text-xs tracking-wider uppercase py-4">Status</TableHead>
                <TableHead className="w-32 text-muted-foreground font-semibold text-xs tracking-wider uppercase py-4">Created Date</TableHead>
                <TableHead className="w-24"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredPackages.map((pkg, index) => (
                <TableRow
                  key={pkg.id}
                  draggable
                  onDragStart={(e) => {
                    setDraggedIndex(index);
                    e.dataTransfer.effectAllowed = 'move';
                  }}
                  onDragOver={(e) => e.preventDefault()}
                  onDrop={(e) => {
                    e.preventDefault();
                    if (draggedIndex === null || draggedIndex === index) return;
                    const updated = [...packages];
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
                  <TableCell className="font-mono text-xs text-muted-foreground py-3">{pkg.sortOrder || index + 1}</TableCell>
                  <TableCell className="py-3">
                    <div className="flex flex-col gap-0.5">
                      <div className="flex items-center gap-2">
                        <span className="font-semibold text-foreground text-sm">{pkg.name}</span>
                        {pkg.isPopular && (
                          <Badge className="bg-amber-500/10 text-amber-500 hover:bg-amber-500/20 border-amber-500/30 text-[10px] py-0 px-1.5 font-bold">POPULAR</Badge>
                        )}
                      </div>
                      {pkg.description && (
                        <span className="text-xs text-muted-foreground truncate max-w-md">{pkg.description}</span>
                      )}
                    </div>
                  </TableCell>
                  <TableCell className="text-sm text-muted-foreground py-3">
                    {serviceTypes.find(t => t.id === pkg.serviceTypeId)?.name || 'N/A'}
                  </TableCell>
                  <TableCell className="text-sm font-semibold text-foreground py-3">
                    ₹{pkg.basePrice.toLocaleString()}
                  </TableCell>
                  <TableCell className="py-3">
                    <button
                      onClick={() => handleToggleActive(pkg.id, pkg.isActive)}
                      className="text-slate-400 hover:text-white transition-colors cursor-pointer mr-2"
                      title={pkg.isActive ? 'Deactivate' : 'Activate'}
                      disabled={isPending}
                    >
                      {pkg.isActive ? (
                        <ToggleRight className="w-8 h-8 text-emerald-400" />
                      ) : (
                        <ToggleLeft className="w-8 h-8 text-slate-500" />
                      )}
                    </button>
                  </TableCell>
                  <TableCell className="text-sm text-muted-foreground py-3">
                    {pkg.createdAt ? new Date(pkg.createdAt).toLocaleDateString() : 'N/A'}
                  </TableCell>
                  <TableCell className="py-3 text-right pr-6">
                    <div className="flex items-center justify-end gap-2">
                      <Button variant="ghost" size="icon" onClick={() => openEditModal(pkg)} disabled={isPending} className="w-8 h-8">
                        <Pencil className="w-4 h-4" />
                      </Button>
                      <Button variant="ghost" size="icon" className="text-destructive w-8 h-8" onClick={() => handleDelete(pkg.id)} disabled={isPending}>
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
      {!isPending && packages.length === 0 && (
        <div className="flex flex-col items-center justify-center p-12 border border-dashed border-border rounded-2xl bg-card space-y-4">
          <div className="p-4 bg-primary/10 rounded-full text-primary">
            <PackageIcon className="w-10 h-10" />
          </div>
          <div className="text-center space-y-1">
            <h3 className="text-base font-bold">No packages found</h3>
            <p className="text-sm text-muted-foreground max-w-sm">
              No packages found for this Service Type. Start by creating a package offering.
            </p>
          </div>
          <Button onClick={() => openCreateModal()} className="rounded-xl h-10 px-5">
            Create Package
          </Button>
        </div>
      )}

      {/* dialog for add / edit */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="sm:max-w-[700px] border-border bg-popover text-popover-foreground rounded-2xl max-h-[85vh] overflow-y-auto">
          <form onSubmit={handleSubmit} className="space-y-5">
            <DialogHeader>
              <DialogTitle className="text-lg font-bold text-foreground">
                {editingPackage ? 'Edit Package Offering' : 'Create Package Offering'}
              </DialogTitle>
              <DialogDescription className="text-muted-foreground text-sm">
                Configure baseline pricing configurations, revisions limits, delivery periods and checked features list.
              </DialogDescription>
            </DialogHeader>

            {errorMsg && (
              <div className="p-3 text-xs bg-destructive/10 border border-destructive/20 text-destructive rounded-xl">
                {errorMsg}
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div className="space-y-4">
                <div className="space-y-1.5">
                  <Label htmlFor="pkg-name">Package Name</Label>
                  <Input
                    id="pkg-name"
                    placeholder="e.g. Starter Package"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="bg-background border-border rounded-xl"
                  />
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="pkg-service-type">Service Type</Label>
                  <select
                    id="pkg-service-type"
                    value={formServiceTypeId}
                    onChange={(e) => setFormServiceTypeId(e.target.value)}
                    className="w-full h-10 px-3 bg-background border border-border rounded-xl text-sm focus:outline-none focus:border-primary/50 text-foreground"
                  >
                    <option value="" disabled>Select Service Type</option>
                    {serviceTypes.map((type) => (
                      <option key={type.id} value={type.id}>
                        {type.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="pkg-desc">Description</Label>
                  <Textarea
                    id="pkg-desc"
                    placeholder="Brief package summary..."
                    className="resize-none h-24 bg-background border-border rounded-xl"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <Label htmlFor="pkg-price">Base Price (₹)</Label>
                    <Input
                      id="pkg-price"
                      type="number"
                      value={basePrice}
                      onChange={(e) => setBasePrice(Number(e.target.value))}
                      className="bg-background border-border rounded-xl"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <Label htmlFor="pkg-delivery">Delivery Days</Label>
                    <Input
                      id="pkg-delivery"
                      type="number"
                      value={deliveryDays}
                      onChange={(e) => setDeliveryDays(Number(e.target.value))}
                      className="bg-background border-border rounded-xl"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <Label htmlFor="page-limit-type">Pages Limit Type</Label>
                    <select
                      id="page-limit-type"
                      value={pageLimitType}
                      onChange={(e: any) => setPageLimitType(e.target.value)}
                      className="w-full h-10 px-3 bg-background border border-border rounded-xl text-sm focus:outline-none focus:border-primary/50 text-foreground"
                    >
                      <option value="custom">Fixed Count</option>
                      <option value="unlimited">Unlimited / Dynamic</option>
                    </select>
                  </div>

                  {pageLimitType === 'custom' && (
                    <div className="space-y-1.5">
                      <Label htmlFor="pkg-pages">Pages Included</Label>
                      <Input
                        id="pkg-pages"
                        type="number"
                        value={pagesIncluded}
                        onChange={(e) => setPagesIncluded(Number(e.target.value))}
                        className="bg-background border-border rounded-xl"
                      />
                    </div>
                  )}
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <Label htmlFor="pkg-revisions">Revisions</Label>
                    <Input
                      id="pkg-revisions"
                      type="number"
                      value={revisions}
                      onChange={(e) => setRevisions(Number(e.target.value))}
                      className="bg-background border-border rounded-xl"
                    />
                  </div>

                  <div className="flex items-center gap-6 pt-7">
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="pkg-popular"
                        checked={isPopular}
                        onCheckedChange={(checked) => setIsPopular(!!checked)}
                      />
                      <label htmlFor="pkg-popular" className="text-sm font-medium leading-none cursor-pointer">
                        Featured / Popular
                      </label>
                    </div>
                  </div>
                </div>
              </div>

              {/* Features library checklist selection section */}
              <div className="space-y-3 border-t md:border-t-0 md:border-l border-border/80 pt-4 md:pt-0 md:pl-5">
                <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground block">
                  Included Library Features
                </span>
                {isLoadingGlobal ? (
                  <div className="flex items-center gap-2 text-xs text-muted-foreground py-6">
                    <Loader2 className="w-4 h-4 animate-spin text-primary" />
                    Loading library features checklist...
                  </div>
                ) : globalCategories.length === 0 ? (
                  <div className="text-xs text-muted-foreground py-6">
                    No features configured in this category. Configure library features first.
                  </div>
                ) : (
                  <div className="space-y-4 max-h-[45vh] overflow-y-auto pr-1">
                    {globalCategories.map(cat => {
                      const catFeats = globalFeatures.filter(f => f.categoryId === cat.id);
                      if (catFeats.length === 0) return null;
                      return (
                        <div key={cat.id} className="space-y-2">
                          <span className="text-xs font-bold text-foreground bg-muted/40 px-2 py-0.5 rounded-lg border border-border/40">
                            {cat.name}
                          </span>
                          <div className="space-y-1.5 pl-2">
                            {catFeats.map(feat => (
                              <div key={feat.id} className="flex items-start space-x-2.5">
                                <Checkbox
                                  id={`feat-${feat.id}`}
                                  checked={includedFeatureIds.includes(feat.id)}
                                  onCheckedChange={() => handleFeatureToggle(feat.id)}
                                  className="mt-0.5"
                                />
                                <label htmlFor={`feat-${feat.id}`} className="text-xs font-medium leading-tight text-muted-foreground cursor-pointer hover:text-foreground">
                                  {feat.name}
                                </label>
                              </div>
                            ))}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>

            <DialogFooter className="gap-2 sm:gap-0 pt-4 border-t border-border/40">
              <Button
                type="button"
                variant="ghost"
                onClick={() => setIsModalOpen(false)}
                className="rounded-xl border border-border"
                disabled={isSubmitting}
              >
                Cancel
              </Button>
              <Button type="submit" className="rounded-xl" disabled={isSubmitting}>
                {isSubmitting && <Loader2 className="w-4 h-4 animate-spin mr-2" />}
                {editingPackage ? 'Save Changes' : 'Create Package'}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}