"use client";

import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

import BigIconButton from "./NavbarButton";
import {
  Check,
  LogIn,
  LogOut,
  Menu,
  Monitor,
  Moon,
  Sun,
  UserIcon,
} from "lucide-react";
import { useEffect, useState } from "react";
import { collections } from "@wix/stores";
import Link from "next/link";
import { members } from "@wix/members";
import { usePathname, useSearchParams } from "next/navigation";
import { twConfig } from "@/lib/utils";
import { ButtonProps } from "@/components/ui/button";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import useAuth from "@/hooks/auth";
import { useTheme } from "next-themes";

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

  const { login, logout } = useAuth();
  const { theme, setTheme } = useTheme();

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
      <SheetContent side="left" className="flex flex-col">
        <SheetHeader>
          <SheetTitle>Navegação</SheetTitle>
        </SheetHeader>
        <div className="flex grow flex-col space-y-10 overflow-y-auto py-5">
          <ul className="space-y-5 text-center text-lg">
            <li>
              <Link
                href="/loja"
                className="block px-4 py-2 font-semibold transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground focus:outline-none"
              >
                Loja
              </Link>
            </li>
            {collections.map((collection) => (
              <li key={collection._id}>
                <Link
                  href={`/colecoes/${collection.slug}`}
                  className="block px-4 py-2 font-semibold transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground focus:outline-none"
                >
                  {collection.name}
                </Link>
              </li>
            ))}
          </ul>

          <Accordion type="single" collapsible>
            <AccordionItem value="item-user" className="border-b-0">
              <AccordionTrigger className="w-full flex-initial py-2.5 hover:no-underline">
                <div className="mx-auto inline-flex items-center gap-2">
                  <UserIcon className="size-10" />
                  {loggedInMember ? (
                    <p className="text-sm">
                      {loggedInMember.contact?.firstName ??
                        loggedInMember.loginEmail}
                    </p>
                  ) : (
                    <p className="text-sm">
                      <strong>Entre ou cadastre-se</strong>
                      <br />
                      para ver seus pedidos
                    </p>
                  )}
                </div>
              </AccordionTrigger>
              <AccordionContent className="divide-y text-base">
                {loggedInMember && (
                  <>
                    <Link
                      className="flex cursor-default select-none items-center justify-center gap-2 rounded-sm px-2 py-2.5 outline-none transition-colors focus:bg-accent focus:text-accent-foreground [&_svg]:pointer-events-none [&_svg]:size-6 [&_svg]:shrink-0"
                      href="/perfil"
                    >
                      <UserIcon />
                      Perfil
                    </Link>
                  </>
                )}

                <Accordion type="single" collapsible>
                  <AccordionItem value="item-theme" className="border-b-0">
                    <AccordionTrigger className="w-full flex-initial py-2.5 hover:no-underline">
                      <div className="mx-auto inline-flex items-center gap-2">
                        <Monitor />
                        Tema
                      </div>
                    </AccordionTrigger>
                    <AccordionContent className="divide-y text-base">
                      <div
                        className="flex cursor-default select-none items-center justify-center gap-2 rounded-sm px-2 py-2.5 outline-none transition-colors focus:bg-accent focus:text-accent-foreground [&_svg]:pointer-events-none [&_svg]:size-6 [&_svg]:shrink-0"
                        onClick={() => setTheme("system")}
                      >
                        <Monitor />
                        Padrão do sistema
                        {theme === "system" && <Check />}
                      </div>
                      <div
                        className="flex cursor-default select-none items-center justify-center gap-2 rounded-sm px-2 py-2.5 outline-none transition-colors focus:bg-accent focus:text-accent-foreground [&_svg]:pointer-events-none [&_svg]:size-6 [&_svg]:shrink-0"
                        onClick={() => setTheme("light")}
                      >
                        <Sun />
                        Claro
                        {theme === "light" && <Check />}
                      </div>
                      <div
                        className="flex cursor-default select-none items-center justify-center gap-2 rounded-sm px-2 py-2.5 outline-none transition-colors focus:bg-accent focus:text-accent-foreground [&_svg]:pointer-events-none [&_svg]:size-6 [&_svg]:shrink-0"
                        onClick={() => setTheme("dark")}
                      >
                        <Moon />
                        Escuro
                        {theme === "dark" && <Check />}
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                </Accordion>

                {loggedInMember ? (
                  <div
                    className="flex cursor-default select-none items-center justify-center gap-2 rounded-sm px-2 py-2.5 outline-none transition-colors focus:bg-accent focus:text-accent-foreground [&_svg]:pointer-events-none [&_svg]:size-6 [&_svg]:shrink-0"
                    onClick={() => logout()}
                  >
                    <LogOut />
                    Sair
                  </div>
                ) : (
                  <div
                    className="flex cursor-default select-none items-center justify-center gap-2 rounded-sm px-2 py-2.5 outline-none transition-colors focus:bg-accent focus:text-accent-foreground [&_svg]:pointer-events-none [&_svg]:size-6 [&_svg]:shrink-0"
                    onClick={() => login()}
                  >
                    <LogIn />
                    Entrar
                  </div>
                )}
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </div>
      </SheetContent>
    </Sheet>
  );
}
