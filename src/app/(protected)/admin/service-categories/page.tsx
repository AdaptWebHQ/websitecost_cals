// src/app/admin/service-categories/page.tsx

import { Metadata } from "next";

import { getServiceCategoriesAction } from "@/actions/service-category";
import { ServiceCategoriesClient } from "@/components/admin/service-category/service-category-client";

export const metadata: Metadata = {
  title: "Service Categories",
  description: "Manage service categories",
};

export default async function ServiceCategoriesPage() {
  const result = await getServiceCategoriesAction();

  if (!result.success) {
    return (
      <div className="flex h-[60vh] items-center justify-center">
        <div className="space-y-2 text-center">
          <h2 className="text-xl font-semibold">
            Failed to load service categories
          </h2>
          <p className="text-muted-foreground">
            {result.error ?? "Something went wrong."}
          </p>
        </div>
      </div>
    );
  }

  return (
    <ServiceCategoriesClient
      initialCategories={result.data ?? []}
    />
  );
}