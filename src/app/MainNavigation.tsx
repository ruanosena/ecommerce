"use client";

import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu";
import { cn } from "@/lib/utils";
import { NavigationMenuProps } from "@radix-ui/react-navigation-menu";
import { collections } from "@wix/stores";
import Link from "next/link";
import NavbarButton from "./NavbarButton";
import { Menu } from "lucide-react";
import { useState } from "react";

interface MainNavigationProps extends NavigationMenuProps {
  collections: collections.Collection[];
}

export default function MainNavigation({
  collections,
  className,
  ...props
}: MainNavigationProps) {
  return (
    <>
      <NavigationMenu className={cn(className, "hidden md:flex")} {...props}>
        <NavigationMenuList>
          <NavigationMenuItem>
            <Link href="/loja" legacyBehavior passHref>
              <NavigationMenuLink className={navigationMenuTriggerStyle()}>
                Loja
              </NavigationMenuLink>
            </Link>
          </NavigationMenuItem>
          <NavigationMenuItem>
            <NavigationMenuTrigger>Coleções</NavigationMenuTrigger>
            <NavigationMenuContent>
              <ul className="p-4">
                {collections.map((collection) => (
                  <li key={collection._id}>
                    <Link
                      href={`/colecoes/${collection.slug}`}
                      legacyBehavior
                      passHref
                    >
                      <NavigationMenuLink
                        className={cn(
                          navigationMenuTriggerStyle(),
                          "w-full justify-start whitespace-nowrap",
                        )}
                      >
                        {collection.name}
                      </NavigationMenuLink>
                    </Link>
                  </li>
                ))}
              </ul>
            </NavigationMenuContent>
          </NavigationMenuItem>
        </NavigationMenuList>
      </NavigationMenu>

      <MainNavigationButton collections={collections} />
    </>
  );
}

interface MainNavigationButtonProps {
  collections: collections.Collection[];
}

function MainNavigationButton({ collections }: MainNavigationButtonProps) {
  "use client";

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
