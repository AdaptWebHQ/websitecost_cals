'use client';

import { useState, useEffect, useCallback } from 'react';
import DataTable from '@/components/shared/data-table';
import { Button } from '@/components/ui/button';
import { TableRow, TableCell } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
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
import {
  getPackageFeaturesAction,
  createPackageFeatureAction,
  updatePackageFeatureAction,
  deletePackageFeatureAction,
} from '@/actions/package-feature/index';
import type { Package, PackageFeature } from '@/types';

interface PackagesClientPageProps {
  initialPackages: Package[];
}

export default function PackagesClientPage({ initialPackages }: PackagesClientPageProps) {
  const [packages, setPackages] = useState<Package[]>(initialPackages);
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
  const [revisions, setRevisions] = useState(3);
  const [isPopular, setIsPopular] = useState(false);
  const [isActive, setIsActive] = useState(true);

  // Package Features State
  const [packageFeatures, setPackageFeatures] = useState<PackageFeature[]>([]);
  const [isLoadingFeatures, setIsLoadingFeatures] = useState(false);

  // Feature Dialog State
  const [isFeatureModalOpen, setIsFeatureModalOpen] = useState(false);
  const [editingFeature, setEditingFeature] = useState<PackageFeature | null>(null);
  const [featureName, setFeatureName] = useState('');
  const [featureDescription, setFeatureDescription] = useState('');
  const [isFeatureSubmitting, setIsFeatureSubmitting] = useState(false);
  const [featureErrorMsg, setFeatureErrorMsg] = useState<string | null>(null);

  const loadPackageFeatures = useCallback(async (packageId: string) => {
    setIsLoadingFeatures(true);
    try {
      const response = await getPackageFeaturesAction(packageId);

      if (response.success && response.data) {
        setPackageFeatures(response.data);
      } else {
        setPackageFeatures([]);
        console.error(response.error);
      }
    } catch (err) {
      console.error('Failed to load package features:', err);
    } finally {
      setIsLoadingFeatures(false);
    }
  }, []);

  // Load features when editing package changes
  useEffect(() => {
    if (editingPackage) {
      loadPackageFeatures(editingPackage.id);
    } else {
      setPackageFeatures([]);
    }
  }, [editingPackage, loadPackageFeatures]);

  const openAddModal = useCallback(() => {
    setEditingPackage(null);
    setName('');
    setDescription('');
    setBasePrice(15000);
    setDeliveryDays(7);
    setPagesIncluded(5);
    setRevisions(3);
    setIsPopular(false);
    setIsActive(true);
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
    setRevisions(pkg.revisions);
    setIsPopular(pkg.isPopular);
    setIsActive(pkg.isActive);
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

    // Explicit type casting inline matches the schema's required features parameter dynamically
    const formData = {
      name: trimmedName,
      description: trimmedDescription,
      basePrice,
      deliveryDays,
      pagesIncluded,
      revisions,
      isPopular,
      isActive,
      features: editingPackage?.features || [],
      sortOrder: editingPackage ? editingPackage.sortOrder : packages.length,
    } as any;

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
    editingPackage,
    packages.length,
  ]);

  const handleDeletePackage = useCallback(async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this package?')) return;

    try {
      const res = await deletePackageAction(id);
      if (res.success) {
        setPackages((prev) => prev.filter((p) => p.id !== id));
      } else {
        window.alert(res.error || 'Failed to delete package.');
      }
    } catch (err) {
      console.error('Error deleting package:', err);
      window.alert('Failed to delete package.');
    }
  }, []);

  // Feature Handlers
  const openAddFeatureModal = useCallback(() => {
    setEditingFeature(null);
    setFeatureName('');
    setFeatureDescription('');
    setFeatureErrorMsg(null);
    setIsFeatureModalOpen(true);
  }, []);

  const openEditFeatureModal = useCallback((feat: PackageFeature) => {
    setEditingFeature(feat);
    setFeatureName(feat.name);
    setFeatureDescription(feat.description || '');
    setFeatureErrorMsg(null);
    setIsFeatureModalOpen(true);
  }, []);

  const handleFeatureSubmit = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingPackage || isFeatureSubmitting) return;

    const trimmedFeatureName = featureName.trim();
    const trimmedFeatureDescription = featureDescription.trim();

    if (!trimmedFeatureName) {
      setFeatureErrorMsg('Feature name is required.');
      return;
    }

    setIsFeatureSubmitting(true);
    setFeatureErrorMsg(null);

    try {
      if (editingFeature) {
        await updatePackageFeatureAction(editingPackage.id, editingFeature.id, {
          name: trimmedFeatureName,
          description: trimmedFeatureDescription,
        });
      } else {
        await createPackageFeatureAction(editingPackage.id, {
          name: trimmedFeatureName,
          description: trimmedFeatureDescription,
          sortOrder: packageFeatures.length + 1,
        });
      }
      await loadPackageFeatures(editingPackage.id);
      setIsFeatureModalOpen(false);
    } catch (err) {
      console.error('Error saving feature:', err);
      setFeatureErrorMsg('Failed to save feature.');
    } finally {
      setIsFeatureSubmitting(false);
    }
  }, [
    editingPackage,
    isFeatureSubmitting,
    featureName,
    featureDescription,
    editingFeature,
    packageFeatures.length,
    loadPackageFeatures,
  ]);

  const handleDeleteFeature = useCallback(async (featureId: string) => {
    if (!editingPackage || !window.confirm('Are you sure you want to delete this feature?')) return;
    try {
      await deletePackageFeatureAction(editingPackage.id, featureId);
      await loadPackageFeatures(editingPackage.id);
    } catch (err) {
      console.error('Error deleting feature:', err);
      window.alert('Failed to delete feature.');
    }
  }, [editingPackage, loadPackageFeatures]);

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

            {/* Included Features Section */}
            <div className="space-y-2">
              <Label className="text-muted-foreground text-xs font-semibold">Included Features</Label>
              {editingPackage ? (
                <div className="bg-background border border-border rounded-xl p-4 space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-muted-foreground font-medium">Manage specific package details</span>
                    <Button
                      type="button"
                      onClick={openAddFeatureModal}
                      variant="ghost"
                      size="sm"
                      className="text-indigo-400 hover:text-indigo-300 gap-1 text-xs px-2 h-8 rounded-lg"
                    >
                      <PlusCircle className="w-3.5 h-3.5" />
                      Add Feature
                    </Button>
                  </div>
                  {isLoadingFeatures ? (
                    <div className="flex items-center justify-center py-6">
                      <Loader2 className="w-5 h-5 animate-spin text-muted-foreground" />
                    </div>
                  ) : packageFeatures.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-8 bg-background border border-border border-dashed rounded-xl space-y-2">
                      <span className="text-3xl mb-1">📦</span>
                      <p className="text-sm font-semibold text-foreground">No included features yet.</p>
                      <p className="text-xs text-muted-foreground">Add your first package feature.</p>
                    </div>
                  ) : (
                    <div className="max-h-[160px] overflow-y-auto space-y-2 scrollbar-thin pr-1">
                      {packageFeatures.map((feat) => (
                        <div key={feat.id} className="flex items-center justify-between p-2 rounded-lg border border-border bg-muted/20">
                          <div className="flex flex-col min-w-0 flex-1 pr-2">
                            <span className="text-xs font-semibold text-foreground truncate">{feat.name}</span>
                            {feat.description && (
                              <span className="text-[10px] text-muted-foreground truncate">{feat.description}</span>
                            )}
                          </div>
                          <div className="flex items-center gap-1 shrink-0">
                            <Button
                              type="button"
                              onClick={() => openEditFeatureModal(feat)}
                              variant="ghost"
                              size="icon"
                              className="h-7 w-7 text-muted-foreground hover:text-foreground rounded-md"
                              aria-label="Edit feature"
                            >
                              <Edit className="w-3.5 h-3.5" />
                            </Button>
                            <Button
                              type="button"
                              onClick={() => handleDeleteFeature(feat.id)}
                              variant="ghost"
                              size="icon"
                              className="h-7 w-7 text-red-400 hover:text-red-300 rounded-md"
                              aria-label="Delete feature"
                            >
                              <Trash className="w-3.5 h-3.5" />
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ) : (
                <p className="text-xs text-muted-foreground italic bg-background border border-border border-dashed rounded-xl p-3 text-center">
                  Save this package first before managing included features.
                </p>
              )}
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
              <div className="space-y-1">
                <Label className="text-muted-foreground text-xs">Pages Included</Label>
                <Input
                  required
                  type="number"
                  min="1"
                  step="1"
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

      {/* Feature Dialog */}
      <Dialog open={isFeatureModalOpen} onOpenChange={setIsFeatureModalOpen}>
        <DialogContent className="bg-popover border border-border shadow-2xl rounded-2xl w-full max-w-md p-6 relative text-popover-foreground z-[60]">
          <DialogHeader>
            <DialogTitle className="text-lg font-bold text-foreground">
              {editingFeature ? 'Edit Feature' : 'Add Feature'}
            </DialogTitle>
          </DialogHeader>
          <form onSubmit={handleFeatureSubmit} className="space-y-4">
            {featureErrorMsg && (
              <p className="text-xs text-red-400 bg-red-500/10 border border-red-500/20 p-2.5 rounded-lg">
                {featureErrorMsg}
              </p>
            )}
            <div className="space-y-1">
              <Label className="text-muted-foreground text-xs">Feature Name</Label>
              <Input
                required
                value={featureName}
                onChange={(e) => setFeatureName(e.target.value)}
                placeholder="e.g. Responsive Design"
                className="bg-background border-border text-foreground rounded-xl h-10 text-sm"
              />
            </div>
            <div className="space-y-1">
              <Label className="text-muted-foreground text-xs">Description</Label>
              <Textarea
                rows={3}
                value={featureDescription}
                onChange={(e) => setFeatureDescription(e.target.value)}
                placeholder="Describe the feature details..."
                className="bg-background border-border text-foreground rounded-xl"
              />
            </div>

            <div className="flex justify-end gap-3 pt-4 border-t border-border">
              <Button
                type="button"
                variant="ghost"
                onClick={() => setIsFeatureModalOpen(false)}
                className="text-muted-foreground hover:text-foreground rounded-xl h-10 px-5"
                disabled={isFeatureSubmitting}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={isFeatureSubmitting}
                className="bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl h-10 px-6 font-semibold shadow-lg shadow-indigo-600/10 disabled:opacity-50"
              >
                {isFeatureSubmitting ? (
                  <span className="flex items-center gap-2">
                    <Loader2 className="w-4 h-4 animate-spin shrink-0" />
                    Saving...
                  </span>
                ) : (
                  'Save Feature'
                )}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}