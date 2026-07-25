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
  createPackageFeatureAction,
  updatePackageFeatureAction,
} from "@/actions/package-features";
import type { PackageFeature } from "@/types";

interface FeatureDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  editingFeature: PackageFeature | null;
  selectedCategoryId: string;
  featureCategoryId: string;
  categoryName: string;
  featuresCount: number;
  onSuccess: (feature: PackageFeature, isEdit: boolean) => void;
}

export function FeatureDialog({
  isOpen,
  onOpenChange,
  editingFeature,
  selectedCategoryId,
  featureCategoryId,
  categoryName,
  featuresCount,
  onSuccess,
}: FeatureDialogProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Form Fields
  const [featureName, setFeatureName] = useState("");
  const [featureDescription, setFeatureDescription] = useState("");
  const [featureIsActive, setFeatureIsActive] = useState(true);
  const [featureDisplayOrder, setFeatureDisplayOrder] = useState(0);

  // Sync mode fields
  useEffect(() => {
    if (isOpen) {
      if (editingFeature) {
        setFeatureName(editingFeature.name);
        setFeatureDescription(editingFeature.description || "");
        setFeatureIsActive(editingFeature.isActive);
        setFeatureDisplayOrder(editingFeature.displayOrder);
      } else {
        setFeatureName("");
        setFeatureDescription("");
        setFeatureIsActive(true);
        setFeatureDisplayOrder(featuresCount + 1);
      }
      setErrorMsg(null);
    }
  }, [isOpen, editingFeature, featuresCount]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isSubmitting) return;

    if (!featureName.trim()) {
      setErrorMsg("Feature name is required.");
      return;
    }

    setIsSubmitting(true);
    setErrorMsg(null);

    const formData = {
      serviceCategoryId: selectedCategoryId,
      categoryId: featureCategoryId,
      name: featureName.trim(),
      description: featureDescription.trim(),
      isActive: featureIsActive,
      displayOrder: featureDisplayOrder,
      packageIds: editingFeature?.packageIds || [],
      isRequired: editingFeature?.isRequired || false,
    };

    try {
      if (editingFeature) {
        const res = await updatePackageFeatureAction(editingFeature.id, formData);
        if (res.success && res.data) {
          onSuccess(res.data, true);
          onOpenChange(false);
          toast.success("Feature updated successfully.");
        } else {
          setErrorMsg(res.error || "Failed to update feature.");
        }
      } else {
        const res = await createPackageFeatureAction(formData);
        if (res.success && res.data) {
          const newFeat: PackageFeature = {
            id: res.data!,
            ...formData,
            createdAt: new Date(),
            updatedAt: new Date(),
          };
          onSuccess(newFeat, false);
          onOpenChange(false);
          toast.success("Feature created successfully.");
        } else {
          setErrorMsg(res.error || "Failed to create feature.");
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
            {editingFeature ? "Edit Feature" : "Create Feature"}
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          {errorMsg && (
            <p className="text-xs text-red-400 bg-red-500/10 border border-red-500/20 p-2.5 rounded-lg">
              {errorMsg}
            </p>
          )}

          <div className="space-y-1">
            <Label className="text-muted-foreground text-xs">Parent Category</Label>
            <Input
              disabled
              value={categoryName}
              className="bg-muted border-border text-muted-foreground rounded-xl h-10 text-sm cursor-not-allowed"
            />
          </div>

          <div className="space-y-1">
            <Label className="text-muted-foreground text-xs">Feature Name</Label>
            <Input
              required
              value={featureName}
              onChange={(e) => setFeatureName(e.target.value)}
              placeholder="e.g. Home Page"
              className="bg-background border-border text-foreground rounded-xl h-10 text-sm"
              disabled={isSubmitting}
            />
          </div>

          <div className="space-y-1">
            <Label className="text-muted-foreground text-xs">Description</Label>
            <Textarea
              rows={2}
              value={featureDescription}
              onChange={(e) => setFeatureDescription(e.target.value)}
              placeholder="Describe this in-built package feature deliverable..."
              className="bg-background border-border text-foreground rounded-xl"
              disabled={isSubmitting}
            />
          </div>



          <div className="flex items-center space-x-6 pt-2">
            <div className="flex items-center space-x-2">
              <Checkbox
                id="featureIsActive"
                checked={featureIsActive}
                onCheckedChange={(checked) => setFeatureIsActive(!!checked)}
                disabled={isSubmitting}
              />
              <label
                htmlFor="featureIsActive"
                className="text-xs font-medium leading-none cursor-pointer"
              >
                Feature is active
              </label>
            </div>
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
              {editingFeature ? "Update Feature" : "Create Feature"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
