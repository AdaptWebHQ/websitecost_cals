'use client';

import { useState, useEffect, useTransition, useMemo } from 'react';
import { toast } from 'sonner';
import { Plus, Search, Edit, Trash, ToggleLeft, ToggleRight, Loader2, GripVertical, Layers } from 'lucide-react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import AdminCategoryHeader from './admin-category-header';
import { useAdminCategoryStore } from '@/store/admin-category-store';
import {
  createServiceTypeAction,
  updateServiceTypeAction,
  deleteServiceTypeAction,
  toggleServiceTypeStatusAction,
  getServiceTypesAction,
  reorderServiceTypesAction,
} from '@/actions/service-types';
import type { ServiceCategory, ServiceType } from '@/types';
import { slugify } from '@/lib/utils';

interface ServiceTypesClientPageProps {
  categories: ServiceCategory[];
  initialCategoryId: string;
  initialServiceTypes: ServiceType[];
}

interface ServiceTypeForm {
  name: string;
  description: string;
  icon: string;
  sortOrder: number;
  isActive: boolean;
}

export default function ServiceTypesClientPage({
  categories,
  initialCategoryId,
  initialServiceTypes,
}: ServiceTypesClientPageProps) {
  const { selectedCategoryId } = useAdminCategoryStore();
  const [serviceTypes, setServiceTypes] = useState<ServiceType[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingServiceType, setEditingServiceType] = useState<ServiceType | null>(null);
  const [isPending, startTransition] = useTransition();

  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);

  const defaultForm: ServiceTypeForm = {
    name: '',
    description: '',
    icon: 'Layers',
    sortOrder: 0,
    isActive: true,
  };

  const [formData, setFormData] = useState<ServiceTypeForm>(defaultForm);
  const [errors, setErrors] = useState<Partial<Record<keyof ServiceTypeForm, string>>>({});

  // Reload data on category change
  useEffect(() => {
    if (!selectedCategoryId) {
      setServiceTypes([]);
      return;
    }
    startTransition(async () => {
      const res = await getServiceTypesAction(selectedCategoryId!);
      if (res.success && res.data) {
        setServiceTypes(res.data.sort((a, b) => a.sortOrder - b.sortOrder));
      } else {
        setServiceTypes([]);
      }
    });
  }, [selectedCategoryId]);

  const validate = (data: ServiceTypeForm): boolean => {
    const newErrors: Partial<Record<keyof ServiceTypeForm, string>> = {};
    if (!data.name.trim()) newErrors.name = 'Name is required.';
    if (!data.description.trim()) newErrors.description = 'Description is required.';
    if (data.description.length > 500) newErrors.description = 'Max 500 characters.';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const openCreateDialog = () => {
    if (!selectedCategoryId) {
      toast.error('Select a service category first.');
      return;
    }
    setEditingServiceType(null);
    setFormData({ ...defaultForm, sortOrder: serviceTypes.length + 1 });
    setErrors({});
    setIsDialogOpen(true);
  };

  const openEditDialog = (item: ServiceType) => {
    setEditingServiceType(item);
    setFormData({
      name: item.name,
      description: item.description || '',
      icon: item.icon || 'Layers',
      sortOrder: item.sortOrder || 0,
      isActive: item.isActive,
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

      if (editingServiceType) {
        const response = await updateServiceTypeAction(editingServiceType.id, payload);
        if (response.success) {
          setServiceTypes((prev) =>
            prev.map((s) =>
              s.id === editingServiceType.id
                ? { ...s, ...formData, serviceCategoryId: selectedCategoryId!, updatedAt: new Date() }
                : s
            ).sort((a, b) => a.sortOrder - b.sortOrder)
          );
          toast.success('Service type updated successfully.');
          setIsDialogOpen(false);
        } else {
          toast.error(response.error || 'Failed to update service type.');
        }
      } else {
        const response = await createServiceTypeAction(payload);
        if (response.success && response.data) {
          const newType: ServiceType = {
            id: response.data,
            serviceCategoryId: selectedCategoryId!,
            slug: slugify(formData.name),
            ...formData,
            createdAt: new Date(),
            updatedAt: new Date(),
          };
          setServiceTypes((prev) => [...prev, newType].sort((a, b) => a.sortOrder - b.sortOrder));
          toast.success('Service type created successfully.');
          setIsDialogOpen(false);
        } else {
          toast.error(response.error || 'Failed to create service type.');
        }
      }
    });
  };

  const handleToggleActive = async (id: string, currentStatus: boolean) => {
    startTransition(async () => {
      const response = await toggleServiceTypeStatusAction(id, !currentStatus);
      if (response.success) {
        setServiceTypes((prev) =>
          prev.map((s) => (s.id === id ? { ...s, isActive: !currentStatus, updatedAt: new Date() } : s))
        );
        toast.success('Status updated successfully.');
      } else {
        toast.error(response.error || 'Failed to update status.');
      }
    });
  };

  const handleDelete = async (id: string) => {
    toast('Delete this service type?', {
      description: 'Ensure it is not referenced in active calculations.',
      action: {
        label: 'Delete',
        onClick: async () => {
          startTransition(async () => {
            const response = await deleteServiceTypeAction(id);
            if (response.success) {
              setServiceTypes((prev) => prev.filter((s) => s.id !== id));
              toast.success('Service type deleted successfully.');
            } else {
              toast.error(response.error || 'Unable to delete service type.');
            }
          });
        },
      },
    });
  };

  const handleReorder = (orderedIds: string[]) => {
    // Optimistic update
    const sorted = [...serviceTypes].sort((a, b) => {
      const aIdx = orderedIds.indexOf(a.id);
      const bIdx = orderedIds.indexOf(b.id);
      return aIdx - bIdx;
    }).map((item, idx) => ({ ...item, sortOrder: idx + 1 }));

    setServiceTypes(sorted);

    startTransition(async () => {
      const res = await reorderServiceTypesAction(orderedIds);
      if (res.success) {
        toast.success('Sort order saved.');
      } else {
        toast.error(res.error || 'Failed to save sort order.');
      }
    });
  };

  const filteredServiceTypes = useMemo(() => {
    return serviceTypes.filter((s) => {
      const search = searchTerm.toLowerCase();
      return (
        s.name.toLowerCase().includes(search) ||
        (s.description || '').toLowerCase().includes(search)
      );
    });
  }, [serviceTypes, searchTerm]);

  return (
    <div className="space-y-6">
      {/* Category persistent Header */}
      <AdminCategoryHeader />

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 border border-border rounded-2xl bg-card">
        <div className="relative w-full sm:max-w-md">
          <Search className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search service type..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full h-10 bg-background border border-border rounded-xl pl-10 pr-4 text-sm text-foreground placeholder:text-muted-foreground/60 focus:outline-none focus:border-primary/50 transition-colors"
          />
        </div>
        <Button onClick={openCreateDialog} className="gap-2 self-start sm:self-auto rounded-xl h-10 px-5">
          <Plus className="w-4 h-4" />
          Add Service Type
        </Button>
      </div>

      {isPending && (
        <div className="flex items-center justify-center p-12">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
          <span className="ml-3 text-muted-foreground">Loading service types...</span>
        </div>
      )}

      {/* Table view */}
      {!isPending && serviceTypes.length > 0 && (
        <div className="rounded-2xl border border-border bg-card overflow-hidden">
          <Table>
            <TableHeader className="bg-muted/40">
              <TableRow className="border-b border-border">
                <TableHead className="w-8"></TableHead>
                <TableHead className="w-12 text-muted-foreground font-semibold text-xs tracking-wider uppercase py-4">#</TableHead>
                <TableHead className="text-muted-foreground font-semibold text-xs tracking-wider uppercase py-4">Service Type Name</TableHead>
                <TableHead className="text-muted-foreground font-semibold text-xs tracking-wider uppercase py-4">Description</TableHead>
                <TableHead className="w-24 text-muted-foreground font-semibold text-xs tracking-wider uppercase py-4">Status</TableHead>
                <TableHead className="w-24"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredServiceTypes.map((item, index) => (
                <TableRow
                  key={item.id}
                  draggable
                  onDragStart={(e) => {
                    setDraggedIndex(index);
                    e.dataTransfer.effectAllowed = 'move';
                  }}
                  onDragOver={(e) => e.preventDefault()}
                  onDrop={(e) => {
                    e.preventDefault();
                    if (draggedIndex === null || draggedIndex === index) return;
                    const updated = [...serviceTypes];
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
                  <TableCell className="font-semibold text-muted-foreground text-xs py-4">{item.sortOrder}</TableCell>
                  <TableCell className="font-bold text-foreground text-sm py-4">{item.name}</TableCell>
                  <TableCell className="text-muted-foreground text-sm max-w-md truncate py-4">
                    {item.description || 'No description provided.'}
                  </TableCell>
                  <TableCell className="py-4">
                    <Badge variant={item.isActive ? 'default' : 'secondary'} className="rounded-lg px-2.5 py-0.5 text-xs font-semibold">
                      {item.isActive ? 'Active' : 'Inactive'}
                    </Badge>
                  </TableCell>
                  <TableCell className="py-4 text-right pr-6">
                    <div className="flex items-center justify-end gap-1">
                      <button
                        onClick={() => handleToggleActive(item.id, item.isActive)}
                        className="text-slate-400 hover:text-white transition-colors cursor-pointer mr-2"
                        title={item.isActive ? 'Deactivate' : 'Activate'}
                      >
                        {item.isActive ? (
                          <ToggleRight className="w-8 h-8 text-emerald-400" />
                        ) : (
                          <ToggleLeft className="w-8 h-8 text-slate-500" />
                        )}
                      </button>
                      <Button
                        onClick={() => openEditDialog(item)}
                        variant="ghost"
                        size="icon"
                        className="text-slate-400 hover:text-white hover:bg-slate-800/40 rounded-lg w-8 h-8"
                      >
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button
                        onClick={() => handleDelete(item.id)}
                        variant="ghost"
                        size="icon"
                        className="text-red-400 hover:text-red-300 hover:bg-red-500/10 rounded-lg w-8 h-8"
                      >
                        <Trash className="w-4 h-4" />
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
      {!isPending && serviceTypes.length === 0 && (
        <div className="flex flex-col items-center justify-center p-12 border border-dashed border-border rounded-2xl bg-card space-y-4">
          <div className="p-4 bg-primary/10 rounded-full text-primary">
            <Layers className="w-10 h-10" />
          </div>
          <div className="text-center space-y-1">
            <h3 className="text-base font-bold">No service types found</h3>
            <p className="text-sm text-muted-foreground max-w-sm">
              No service types found for this Service Category. Start by creating a template.
            </p>
          </div>
          <Button onClick={openCreateDialog} className="rounded-xl h-10 px-5">
            Create Service Type
          </Button>
        </div>
      )}

      {/* dialog for add / edit */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-[600px] rounded-2xl border-border bg-popover text-popover-foreground">
          <form onSubmit={handleSubmit} className="space-y-5">
            <DialogHeader>
              <DialogTitle className="text-lg font-bold text-foreground">
                {editingServiceType ? 'Edit Service Type' : 'Create Service Type'}
              </DialogTitle>
              <DialogDescription className="text-muted-foreground text-sm">
                Define the service type characteristics and baseline settings.
              </DialogDescription>
            </DialogHeader>

            <div className="grid grid-cols-1 gap-5">
              <div className="space-y-1.5">
                <Label htmlFor="type-name" className="text-sm font-medium text-foreground">
                  Service Type Name
                </Label>
                <Input
                  id="type-name"
                  placeholder="e.g. Informational Website"
                  value={formData.name}
                  onChange={(e) => setFormData((p) => ({ ...p, name: e.target.value }))}
                  className="bg-background border-border text-foreground rounded-xl"
                  disabled={isPending}
                />
                {errors.name && <p className="text-xs text-destructive">{errors.name}</p>}
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="type-description" className="text-sm font-medium text-foreground">
                  Description
                </Label>
                <Textarea
                  id="type-description"
                  placeholder="e.g. Multi-page custom informational or business showcase website with CMS."
                  className="resize-none h-24 bg-background border-border text-foreground rounded-xl"
                  value={formData.description}
                  onChange={(e) => setFormData((p) => ({ ...p, description: e.target.value }))}
                  disabled={isPending}
                />
                {errors.description && <p className="text-xs text-destructive">{errors.description}</p>}
              </div>


            </div>

            <DialogFooter className="gap-2 sm:gap-0">
              <Button
                type="button"
                variant="ghost"
                onClick={() => setIsDialogOpen(false)}
                className="rounded-xl border border-border"
                disabled={isPending}
              >
                Cancel
              </Button>
              <Button type="submit" className="rounded-xl" disabled={isPending}>
                {isPending && <Loader2 className="w-4 h-4 animate-spin mr-2" />}
                {editingServiceType ? 'Save Changes' : 'Create Service Type'}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
