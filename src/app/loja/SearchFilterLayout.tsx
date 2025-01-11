"use client";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ProductsSort } from "@/wix-api/products";
import { collections } from "@wix/stores";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useOptimistic, useState, useTransition } from "react";

interface SearchFilterLayoutProps {
  collections: collections.Collection[];
  children: React.ReactNode;
}

export default function SearchFilterLayout({
  collections,
  children,
}: SearchFilterLayoutProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [optimisticFilters, setOptimisticFilters] = useOptimistic({
    colecao: searchParams.getAll("colecao"),
    preco_min: searchParams.get("preco_min") ?? "",
    preco_max: searchParams.get("preco_max") ?? "",
    ordenacao: searchParams.get("ordenacao") ?? "",
  });

  const [isPending, startTransition] = useTransition();

  function updateFilters(updates: Partial<typeof optimisticFilters>) {
    const newState = { ...optimisticFilters, ...updates };
    const newSearchParams = new URLSearchParams(searchParams);

    Object.entries(newState).forEach(([key, value]) => {
      newSearchParams.delete(key);

      if (Array.isArray(value)) {
        value.forEach((v) => newSearchParams.append(key, v));
      } else if (value) {
        newSearchParams.set(key, value);
      }
    });

    newSearchParams.delete("pagina");

    startTransition(() => {
      setOptimisticFilters(newState);
      router.push(`?${newSearchParams.toString()}`);
    });
  }

  return (
    <main className="group flex flex-col items-center justify-center gap-10 px-5 py-10 lg:flex-row lg:items-start">
      <aside
        className="h-fit max-w-80 space-y-5 lg:sticky lg:top-10 lg:w-64"
        data-pending={isPending ? "" : undefined}
      >
        <CollectionsFilter
          collections={collections}
          selectedCollectionIds={optimisticFilters.colecao}
          updateCollectionIds={(collectionIds) =>
            updateFilters({ colecao: collectionIds })
          }
        />
        <PriceFilter
          minDefaultInput={optimisticFilters.preco_min}
          maxDefaultInput={optimisticFilters.preco_max}
          updatePriceRange={(priceMin, priceMax) =>
            updateFilters({ preco_min: priceMin, preco_max: priceMax })
          }
        />
      </aside>
      <div className="w-full max-w-7xl space-y-5">
        <div className="flex justify-center lg:justify-end">
          <SortFilter
            sort={optimisticFilters.ordenacao}
            updateSort={(sort) => updateFilters({ ordenacao: sort })}
          />
        </div>
        {children}
      </div>
    </main>
  );
}

interface CollectionsFilterProps {
  collections: collections.Collection[];
  selectedCollectionIds: string[];
  updateCollectionIds: (collectionIds: string[]) => void;
}

function CollectionsFilter({
  collections,
  selectedCollectionIds,
  updateCollectionIds,
}: CollectionsFilterProps) {
  return (
    <div className="space-y-3">
      <div className="font-bold">Coleções</div>
      <ul className="space-y-1.5">
        {collections.map((collection) => {
          const collectionId = collection._id;
          if (!collectionId) return null;

          return (
            <li key={collectionId}>
              <label className="flex cursor-pointer items-center gap-2 font-medium">
                <Checkbox
                  id={collectionId}
                  checked={selectedCollectionIds.includes(collectionId)}
                  onCheckedChange={(checked) => {
                    updateCollectionIds(
                      checked
                        ? [...selectedCollectionIds, collectionId]
                        : selectedCollectionIds.filter(
                            (id) => id !== collectionId,
                          ),
                    );
                  }}
                />
                <span className="line-clamp-1 break-all">
                  {collection.name}
                </span>
              </label>
            </li>
          );
        })}
      </ul>
      {selectedCollectionIds.length > 0 && (
        <button
          onClick={() => updateCollectionIds([])}
          className="text-sm text-primary hover:underline"
        >
          Limpar
        </button>
      )}
    </div>
  );
}

interface PriceFilterProps {
  minDefaultInput: string | undefined;
  maxDefaultInput: string | undefined;
  updatePriceRange: (min: string | undefined, max: string | undefined) => void;
}

function PriceFilter({
  minDefaultInput,
  maxDefaultInput,
  updatePriceRange,
}: PriceFilterProps) {
  const [minInput, setMinInput] = useState(minDefaultInput);
  const [maxInput, setMaxInput] = useState(maxDefaultInput);
  const [lastMinInput, setLastMinInput] = useState(minInput);
  const [lastMaxInput, setLastMaxInput] = useState(maxInput);

  useEffect(() => {
    setMinInput(minDefaultInput ?? "");
    setMaxInput(maxDefaultInput ?? "");
  }, [minDefaultInput, maxDefaultInput]);

  function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    updatePriceRange(minInput, maxInput);
    setLastMinInput(minInput);
    setLastMaxInput(maxInput);
  }

  return (
    <div className="space-y-3">
      <div className="font-bold">Preço</div>
      <form className="flex flex-col gap-2" onSubmit={onSubmit}>
        <div className="grid grid-cols-2 gap-2">
          <Input
            type="number"
            name="min"
            placeholder="Mín"
            value={minInput}
            onChange={(e) => setMinInput(e.target.value)}
            className="min-w-20"
          />
          <Input
            type="number"
            name="max"
            placeholder="Máx"
            value={maxInput}
            onChange={(e) => setMaxInput(e.target.value)}
            className="min-w-20"
          />
        </div>
        <Button
          type="submit"
          className="w-full"
          disabled={lastMinInput === minInput && lastMaxInput === maxInput}
        >
          Aplicar filtro
        </Button>
      </form>
      {(!!minDefaultInput || !!maxDefaultInput) && (
        <button
          onClick={() => {
            updatePriceRange("", "");
            setLastMinInput("");
            setLastMaxInput("");
          }}
          className="text-sm text-primary hover:underline"
        >
          Limpar
        </button>
      )}
    </div>
  );
}

interface SortFilterProps {
  sort: string | undefined;
  updateSort: (value: ProductsSort) => void;
}

function SortFilter({ sort, updateSort }: SortFilterProps) {
  return (
    <Select value={sort || "last_updated"} onValueChange={updateSort}>
      <SelectTrigger className="w-fit gap-2 text-start">
        <span>
          Ordernar por <SelectValue />
        </span>
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="last_updated">Lançamento</SelectItem>
        <SelectItem value="price_asc">Menor Preço</SelectItem>
        <SelectItem value="price_desc">Maior Preço</SelectItem>
      </SelectContent>
    </Select>
  );
}
