import { getWixServerClient } from "@/lib/wix-client.server";
import { getProductById } from "@/wix-api/products";
import { notFound, redirect } from "next/navigation";

interface PageProps {
  params: Promise<{ id: string }>;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  searchParams: Promise<any>;
}

export default async function Page({ params, searchParams }: PageProps) {
  const { id } = await params;
  if (id === "someId") {
    redirect(
      `/produtos/sou-um-produto-1?${new URLSearchParams(await searchParams)}`,
    );
  }

  const product = await getProductById(await getWixServerClient(), id);

  if (!product) notFound();

  redirect(
    `/produto/${product.slug}?${new URLSearchParams(await searchParams)}`,
  );
}
