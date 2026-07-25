"use client";

import React, { useState, useEffect } from "react";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

import {
  createPackageFeatureCategoryAction,
  updatePackageFeatureCategoryAction,
} from "@/actions/package-feature-categories";
import type { PackageFeatureCategory } from "@/types";

interface CategoryDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  editingCategory: PackageFeatureCategory | null;
  selectedCategoryId: string;
  categoriesCount: number;
  onSuccess: (category: PackageFeatureCategory, isEdit: boolean) => void;
}

export function CategoryDialog({
  isOpen,
  onOpenChange,
  editingCategory,
  selectedCategoryId,
  categoriesCount,
  onSuccess,
}: CategoryDialogProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Form Fields
  const [catName, setCatName] = useState("");
  const [catDescription, setCatDescription] = useState("");
  const [catIcon, setCatIcon] = useState("Layers");
  const [catIsActive, setCatIsActive] = useState(true);
  const [catDisplayOrder, setCatDisplayOrder] = useState(0);

  // Sync edit mode fields
  useEffect(() => {
    if (isOpen) {
      if (editingCategory) {
        setCatName(editingCategory.name);
        setCatDescription(editingCategory.description || "");
        setCatIcon(editingCategory.icon || "Layers");
        setCatIsActive(editingCategory.isActive);
        setCatDisplayOrder(editingCategory.displayOrder);
      } else {
        setCatName("");
        setCatDescription("");
        setCatIcon("Layers");
        setCatIsActive(true);
        setCatDisplayOrder(categoriesCount + 1);
      }
      setErrorMsg(null);
    }
  }, [isOpen, editingCategory, categoriesCount]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isSubmitting) return;

    if (!catName.trim()) {
      setErrorMsg("Category name is required.");
      return;
    }

    setIsSubmitting(true);
    setErrorMsg(null);

    const formData = {
      serviceCategoryId: selectedCategoryId,
      name: catName.trim(),
      description: catDescription.trim(),
      icon: catIcon.trim(),
      isActive: catIsActive,
      displayOrder: catDisplayOrder,
    };

    try {
      if (editingCategory) {
        const res = await updatePackageFeatureCategoryAction(editingCategory.id, formData);
        if (res.success && res.data) {
          onSuccess(res.data, true);
          onOpenChange(false);
          toast.success("Category updated successfully.");
        } else {
          setErrorMsg(res.error || "Failed to update category.");
        }
      } else {
        const res = await createPackageFeatureCategoryAction(formData);
        if (res.success && res.data) {
          const newCat: PackageFeatureCategory = {
            id: res.data!,
            ...formData,
            createdAt: new Date(),
            updatedAt: new Date(),
          };
          onSuccess(newCat, false);
          onOpenChange(false);
          toast.success("Category created successfully.");
        } else {
          setErrorMsg(res.error || "Failed to create category.");
        }
      }
    } catch (err) {
      console.error(err);
      setErrorMsg("An unexpected error occurred.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="bg-popover border border-border shadow-2xl rounded-2xl w-full max-w-lg p-6 text-popover-foreground">
        <DialogHeader>
          <DialogTitle className="text-lg font-bold text-foreground">
            {editingCategory ? "Edit Feature Category" : "Create Feature Category"}
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          {errorMsg && (
            <p className="text-xs text-red-400 bg-red-500/10 border border-red-500/20 p-2.5 rounded-lg">
              {errorMsg}
            </p>
          )}
          <div className="space-y-1">
            <Label className="text-muted-foreground text-xs">Category Name</Label>
            <Input
              required
              value={catName}
              onChange={(e) => setCatName(e.target.value)}
              placeholder="e.g. Website Structure"
              className="bg-background border-border text-foreground rounded-xl h-10 text-sm"
            />
          </div>
          <div className="space-y-1">
            <Label className="text-muted-foreground text-xs">Description</Label>
            <Textarea
              rows={2}
              value={catDescription}
              onChange={(e) => setCatDescription(e.target.value)}
              placeholder="Describe what features will be listed in this section..."
              className="bg-background border-border text-foreground rounded-xl"
            />
          </div>


          <div className="flex items-center space-x-2 py-1">
            <Checkbox
              id="catIsActive"
              checked={catIsActive}
              onCheckedChange={(checked) => setCatIsActive(!!checked)}
            />
            <label
              htmlFor="catIsActive"
              className="text-xs font-medium leading-none cursor-pointer"
            >
              Category is active and visible
            </label>
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t border-border">
            <Button
              type="button"
              variant="ghost"
              onClick={() => onOpenChange(false)}
              className="rounded-xl border border-border"
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              className="bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl"
              disabled={isSubmitting}
            >
              {isSubmitting && <Loader2 className="w-4 h-4 animate-spin mr-2" />}
              {editingCategory ? "Update Category" : "Create Category"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
