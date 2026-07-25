"use client";

import React, { useState } from "react";
import { GripVertical, Edit, Trash, ToggleLeft, ToggleRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Table, TableHeader, TableHead, TableBody, TableRow, TableCell } from "@/components/ui/table";
import type { PackageFeature } from "@/types";

interface FeatureSubTableProps {
  catId: string;
  catFeatures: PackageFeature[];
  features: PackageFeature[];
  onEdit: (feat: PackageFeature) => void;
  onDelete: (id: string) => void;
  onToggleActive: (id: string, currentActive: boolean) => void;
  onReorder: (catId: string, orderedIds: string[]) => void;
}

export function FeatureSubTable({
  catId,
  catFeatures,
  features,
  onEdit,
  onDelete,
  onToggleActive,
  onReorder,
}: FeatureSubTableProps) {
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);
  const [draggedCatId, setDraggedCatId] = useState<string | null>(null);

  if (catFeatures.length === 0) {
    return (
      <div className="text-xs text-muted-foreground italic py-3 pl-3 border border-dashed rounded-xl">
        No features added to this category yet. Click Add Feature to get started.
      </div>
    );
  }

  return (
    <div className="border border-border rounded-xl overflow-hidden shadow-sm bg-background">
      <Table>
        <TableHeader className="bg-muted/40">
          <TableRow className="border-b border-border">
            <TableHead className="w-8"></TableHead>
            <TableHead className="text-xs font-bold text-muted-foreground uppercase py-2">Feature Name</TableHead>
            <TableHead className="text-xs font-bold text-muted-foreground uppercase py-2 w-28">Status</TableHead>
            <TableHead className="text-xs font-bold text-muted-foreground uppercase py-2 w-28 text-right pr-4">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {catFeatures
            .sort((a, b) => (a.displayOrder || 0) - (b.displayOrder || 0))
            .map((feat, index) => {
              return (
                <TableRow
                  key={feat.id}
                  draggable
                  onDragStart={(e) => {
                    setDraggedIndex(index);
                    setDraggedCatId(feat.categoryId);
                    e.dataTransfer.effectAllowed = "move";
                  }}
                  onDragOver={(e) => e.preventDefault()}
                  onDrop={(e) => {
                    e.preventDefault();
                    if (draggedIndex === null || draggedIndex === index || draggedCatId !== feat.categoryId) return;
                    const subset = features.filter(f => f.categoryId === feat.categoryId);
                    const updatedSubset = [...subset];
                    const [moved] = updatedSubset.splice(draggedIndex, 1);
                    updatedSubset.splice(index, 0, moved);
                    onReorder(feat.categoryId, updatedSubset.map((f) => f.id));
                    setDraggedIndex(null);
                    setDraggedCatId(null);
                  }}
                  className="hover:bg-muted/40 border-b border-border transition-colors cursor-grab active:cursor-grabbing"
                >
                  <TableCell className="p-3 text-muted-foreground w-8">
                    <GripVertical className="w-3.5 h-3.5 text-muted-foreground hover:text-foreground" />
                  </TableCell>
                  <TableCell className="p-3 font-medium text-foreground">
                    <div className="flex flex-col">
                      <span className="text-sm font-semibold">{feat.name}</span>
                      <span className="text-[10px] text-muted-foreground font-normal mt-0.5">
                        {feat.description || "No description."}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell className="p-3">
                    <button
                      onClick={() => onToggleActive(feat.id, feat.isActive)}
                      className="text-slate-400 hover:text-white transition-colors cursor-pointer"
                      title={feat.isActive ? "Deactivate Feature" : "Activate Feature"}
                    >
                      {feat.isActive ? (
                        <ToggleRight className="w-8 h-8 text-emerald-400" />
                      ) : (
                        <ToggleLeft className="w-8 h-8 text-slate-500" />
                      )}
                    </button>
                  </TableCell>
                  <TableCell className="p-3 text-right">
                    <div className="flex items-center justify-end gap-1 pr-2">
                      <Button
                        onClick={() => onEdit(feat)}
                        variant="ghost"
                        size="icon"
                        className="text-slate-400 hover:text-white hover:bg-slate-800/40 rounded-lg w-7.5 h-7.5"
                      >
                        <Edit className="w-3.5 h-3.5" />
                      </Button>
                      <Button
                        onClick={() => onDelete(feat.id)}
                        variant="ghost"
                        size="icon"
                        className="text-red-400 hover:text-red-300 hover:bg-red-500/10 rounded-lg w-7.5 h-7.5"
                      >
                        <Trash className="w-3.5 h-3.5" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              );
            })}
        </TableBody>
      </Table>
    </div>
  );
}
