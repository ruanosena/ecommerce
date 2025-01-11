"use client";

import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

import NavbarButton from "./NavbarButton";
import { Menu } from "lucide-react";
import { useState } from "react";
import { collections } from "@wix/stores";
import Link from "next/link";

interface MainNavigationButtonProps {
  collections: collections.Collection[];
}

export default function MainNavigationButton({
  collections,
}: MainNavigationButtonProps) {
  const [sheetOpen, setSheetOpen] = useState(false);

  return (
    <Sheet open={sheetOpen} onOpenChange={setSheetOpen}>
      <SheetTrigger asChild className="md:hidden">
        <NavbarButton>
          <Menu />
        </NavbarButton>
      </SheetTrigger>
      <SheetContent side="left">
        <SheetHeader className="sr-only">
          <SheetTitle>Menu principal</SheetTitle>
          <SheetDescription>
            Acesse as coleções e navegue pela loja.
          </SheetDescription>
        </SheetHeader>
        <div className="flex grow flex-col space-y-3 overflow-y-auto">
          <Link
            href="/loja"
            className="block h-10 w-full justify-start whitespace-nowrap rounded-md bg-background px-4 py-2 text-base font-medium transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground focus:outline-none disabled:pointer-events-none disabled:opacity-50"
            onClick={() => setSheetOpen(false)}
          >
            Loja
          </Link>
          <div>
            <h2 className="px-4 py-2 font-bold">Coleções</h2>
            <ul>
              {collections.map((collection) => (
                <li key={collection._id}>
                  <Link
                    href={`/colecoes/${collection.slug}`}
                    className="block h-10 w-full justify-start whitespace-nowrap rounded-md bg-background px-4 py-2 text-base font-medium transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground focus:outline-none disabled:pointer-events-none disabled:opacity-50"
                    onClick={() => setSheetOpen(false)}
                  >
                    {collection.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
