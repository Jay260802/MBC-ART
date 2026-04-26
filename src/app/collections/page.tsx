import type { Metadata } from "next";
import { getCollections } from "@/lib/collections-server";
import { CollectionsPageClient } from "@/components/layout/CollectionsPageClient";

export const metadata: Metadata = {
  title: "Collections",
  description:
    "Browse MBC ART's full range of ethnic wear — Kurtis, Suits, Co-ords & Tunics.",
};

interface Props {
  searchParams: Promise<{ category?: string }>;
}

export default async function CollectionsPage({ searchParams }: Props) {
  const { category } = await searchParams;
  const allCategories = getCollections();
  const activeCategories = category
    ? allCategories.filter((c) => c.value === category)
    : allCategories;

  return (
    <CollectionsPageClient
      allCategories={allCategories}
      activeCategories={activeCategories}
      category={category}
    />
  );
}
