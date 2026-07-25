"use client";

import { useMemo, useState } from "react";
import { Edit, Layers, Power, Trash2, GripVertical } from "lucide-react";
import {
    ColumnDef,
    flexRender,
    getCoreRowModel,
    useReactTable,
} from "@tanstack/react-table";

import type { ServiceCategory } from "@/types";

import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

interface ServiceCategoryTableProps {
    categories: ServiceCategory[];
    onEdit(category: ServiceCategory): void;
    onDelete(id: string): void;
    onToggle(id: string): void;
    onReorder?(orderedIds: string[]): void;
}

export function ServiceCategoryTable({
    categories,
    onEdit,
    onDelete,
    onToggle,
    onReorder,
}: ServiceCategoryTableProps) {
    const [draggedIndex, setDraggedIndex] = useState<number | null>(null);

    const columns = useMemo<ColumnDef<ServiceCategory>[]>(
        () => [
            {
                id: "drag-handle",
                header: "",
                cell: () => (
                    <div className="flex items-center justify-center text-muted-foreground w-6 cursor-grab active:cursor-grabbing">
                        <GripVertical className="h-4 w-4" />
                    </div>
                ),
            },
            {
                accessorKey: "icon",
                header: "Icon",
                cell: ({ row }) => (
                    <div className="text-center font-bold text-lg text-primary">{row.original.icon || 'Layers'}</div>
                ),
            },
            {
                accessorKey: "name",
                header: "Name",
                cell: ({ row }) => (
                    <div className="font-bold text-foreground text-sm">{row.original.name}</div>
                ),
            },
            {
                accessorKey: "description",
                header: "Description",
                cell: ({ row }) => (
                    <div className="max-w-xs truncate text-xs text-muted-foreground">
                        {row.original.description || 'No description.'}
                    </div>
                ),
            },
            {
                accessorKey: "sortOrder",
                header: "Sort Order",
                cell: ({ row }) => (
                    <span className="font-mono text-xs text-muted-foreground">Pos {row.original.sortOrder}</span>
                ),
            },
            {
                accessorKey: "isActive",
                header: "Status",
                cell: ({ row }) => (
                    <Badge
                        variant={row.original.isActive ? "default" : "secondary"}
                        className="rounded-lg text-xs font-semibold px-2.5 py-0.5"
                    >
                        {row.original.isActive ? "Active" : "Inactive"}
                    </Badge>
                ),
            },
            {
                id: "actions",
                header: "",
                cell: ({ row }) => {
                    const category = row.original;

                    return (
                        <div className="flex items-center justify-end gap-2 pr-4">
                            <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => onEdit(category)}
                                className="w-8 h-8 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800/40"
                            >
                                <Edit className="h-4 w-4" />
                            </Button>

                            <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => onToggle(category.id)}
                                className="w-8 h-8 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800/40"
                            >
                                <Power className="h-4 w-4" />
                            </Button>

                            <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => onDelete(category.id)}
                                className="w-8 h-8 rounded-lg text-red-400 hover:text-red-300 hover:bg-red-500/10"
                            >
                                <Trash2 className="h-4 w-4" />
                            </Button>
                        </div>
                    );
                },
            },
        ],
        [onEdit, onDelete, onToggle]
    );

    const table = useReactTable({
        data: categories,
        columns,
        getCoreRowModel: getCoreRowModel(),
    });

    return (
        <div className="rounded-2xl border border-border bg-card overflow-hidden">
            <Table>
                <TableHeader className="bg-muted/40 border-b border-border">
                    {table.getHeaderGroups().map((group) => (
                        <TableRow key={group.id} className="hover:bg-transparent border-none">
                            {group.headers.map((header) => (
                                <TableHead key={header.id} className="text-muted-foreground font-semibold text-xs tracking-wider uppercase py-4">
                                    {header.isPlaceholder
                                        ? null
                                        : flexRender(
                                            header.column.columnDef.header,
                                            header.getContext()
                                        )}
                                </TableHead>
                            ))}
                        </TableRow>
                    ))}
                </TableHeader>

                <TableBody>
                    {table.getRowModel().rows.length ? (
                        table.getRowModel().rows.map((row, index) => (
                            <TableRow 
                                key={row.id}
                                draggable
                                onDragStart={(e) => {
                                    setDraggedIndex(index);
                                    e.dataTransfer.effectAllowed = "move";
                                }}
                                onDragOver={(e) => {
                                    e.preventDefault();
                                }}
                                onDrop={(e) => {
                                    e.preventDefault();
                                    if (draggedIndex === null || draggedIndex === index || !onReorder) return;
                                    const updated = [...categories];
                                    const [moved] = updated.splice(draggedIndex, 1);
                                    updated.splice(index, 0, moved);
                                    onReorder(updated.map(c => c.id));
                                    setDraggedIndex(null);
                                }}
                                className="hover:bg-muted/30 border-b border-border transition-all"
                            >
                                {row.getVisibleCells().map((cell) => (
                                    <TableCell key={cell.id} className="py-4">
                                        {flexRender(
                                            cell.column.columnDef.cell,
                                            cell.getContext()
                                        )}
                                    </TableCell>
                                ))}
                            </TableRow>
                        ))
                    ) : (
                        <TableRow>
                          <TableCell
                                colSpan={columns.length}
                                className="h-48"
                            >
                                <div className="flex flex-col items-center justify-center gap-3 text-muted-foreground">
                                    <Layers className="h-10 w-10 opacity-40" />
                                    <p>No service categories found.</p>
                                </div>
                            </TableCell>
                        </TableRow>
                    )}
                </TableBody>
            </Table>
        </div>
    );
}