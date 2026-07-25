// components/admin/service-category/service-category-form.tsx
"use client"

import { useEffect, useTransition } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { toast } from "sonner"
import { Loader2 } from "lucide-react"

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { Button } from "@/components/ui/button"

import {
  createServiceCategoryAction,
  updateServiceCategoryAction,
} from "@/actions/service-category"
import type { ServiceCategory } from "@/types";

import {
  serviceCategorySchema,
  type ServiceCategoryFormData,
} from "@/schemas";

const DEFAULT_VALUES: ServiceCategoryFormData = {
  name: "",
  description: "",
  icon: "",
  sortOrder: 0,
  isActive: true,
}

interface ServiceCategoryFormProps {
  open: boolean
  onOpenChange(open: boolean): void
  category?: ServiceCategory | null
  onSuccess(category: ServiceCategory): void
}

export function ServiceCategoryForm({
  open,
  onOpenChange,
  category,
  onSuccess,
}: ServiceCategoryFormProps) {
  const [isPending, startTransition] = useTransition()
  const isEditing = !!category

  const form = useForm<ServiceCategoryFormData>({
    resolver: zodResolver(serviceCategorySchema),
    defaultValues: DEFAULT_VALUES,
  })

  useEffect(() => {
    if (open) {
      form.reset(category ? {
        name: category.name,
        description: category.description,
        icon: category.icon,
        sortOrder: category.sortOrder,
        isActive: category.isActive,
      } : DEFAULT_VALUES)
    }
  }, [open, category, form])

  const handleOpenChange = (newOpen: boolean) => {
    if (!newOpen) {
      form.reset(DEFAULT_VALUES)
    }
    onOpenChange(newOpen)
  }

  function onSubmit(values: ServiceCategoryFormData) {
    startTransition(async () => {
      try {
        const action = isEditing && category
          ? updateServiceCategoryAction(category.id, values)
          : createServiceCategoryAction(values)

        const result = await action

        if (!result.success) {
          toast.error(result.error)
          return
        }

        toast.success(
          isEditing
            ? "Service category updated successfully."
            : "Service category created successfully."
        )

        if (result.data) {
          onSuccess(result.data)
        }
        
        handleOpenChange(false)
      } catch (error) {
        toast.error("An unexpected error occurred. Please try again.")
      }
    })
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>
            {isEditing ? "Edit Service Category" : "Create Service Category"}
          </DialogTitle>
          <DialogDescription>
            {isEditing
              ? "Update the details of the service category below."
              : "Add a new service category to your platform."}
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g. Web Development" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Brief description of this category..."
                      className="resize-none"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />



            <FormField
              control={form.control}
              name="isActive"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm">
                  <div className="space-y-0.5">
                    <FormLabel>Active Status</FormLabel>
                    <div className="text-[0.8rem] text-muted-foreground">
                      Determine if this category is visible to users.
                    </div>
                  </div>
                  <FormControl>
                    <Switch
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                </FormItem>
              )}
            />

            <DialogFooter className="pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => handleOpenChange(false)}
                disabled={isPending}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={isPending}>
                {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                {isPending ? "Saving..." : "Save"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}