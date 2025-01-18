"use client";

import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

import BigIconButton from "./NavbarButton";
import { Menu } from "lucide-react";
import { useEffect, useState } from "react";
import { collections } from "@wix/stores";
import Link from "next/link";
import { members } from "@wix/members";
import UserButton from "@/components/UserButton";
import { usePathname, useSearchParams } from "next/navigation";
import { twConfig } from "@/lib/utils";
import { ButtonProps } from "@/components/ui/button";

interface MobileMenuProps extends ButtonProps {
  collections: collections.Collection[];
  loggedInMember: members.Member | null;
}

export default function MobileMenu({
  collections,
  loggedInMember,
  className,
  ...props
}: MobileMenuProps) {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const handleSize = () => {
      if (window.innerWidth > parseInt(twConfig.theme.screens.lg)) {
        setIsOpen(false);
      }
    };
    window.addEventListener("resize", handleSize);
    return () => window.removeEventListener("resize", handleSize);
  }, []);

  useEffect(() => {
    setIsOpen(false);
  }, [pathname, searchParams]);

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger asChild>
        <BigIconButton className={className} {...props}>
          <Menu />
        </BigIconButton>
      </SheetTrigger>
      <SheetContent side="left">
        <SheetHeader>
          <SheetTitle>Navegação</SheetTitle>
        </SheetHeader>
        <div className="flex flex-col space-y-10 overflow-y-auto py-10">
          <ul className="space-y-5 text-center text-lg">
            <li>
              <Link
                href="/loja"
                className="block px-4 py-2 font-semibold transition-colors hover:bg-accent hover:text-accent-foreground hover:underline focus:bg-accent focus:text-accent-foreground focus:outline-none disabled:pointer-events-none disabled:opacity-50"
              >
                Loja
              </Link>
            </li>
            {collections.map((collection) => (
              <li key={collection._id}>
                <Link
                  href={`/colecoes/${collection.slug}`}
                  className="block px-4 py-2 font-semibold transition-colors hover:bg-accent hover:text-accent-foreground hover:underline focus:bg-accent focus:text-accent-foreground focus:outline-none disabled:pointer-events-none disabled:opacity-50"
                >
                  {collection.name}
                </Link>
              </li>
            ))}
          </ul>

          <UserButton loggedInMember={loggedInMember} />
        </div>
      </SheetContent>
    </Sheet>
  );
}
