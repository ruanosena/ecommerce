"use client";

import useAuth from "@/hooks/auth";
import { ButtonProps } from "./ui/button";
import { members } from "@wix/members";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuPortal,
  DropdownMenuSeparator,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import {
  Check,
  LogIn,
  LogOut,
  Monitor,
  Moon,
  Sun,
  UserIcon,
} from "lucide-react";
import NavbarButton from "@/app/NavbarButton";
import Link from "next/link";
import { useTheme } from "next-themes";

interface UserButtonProps extends ButtonProps {
  loggedInMember: members.Member | null;
}

export default function UserButton({
  loggedInMember,
  className,
  ...props
}: UserButtonProps) {
  const { login, logout } = useAuth();
  const { theme, setTheme } = useTheme();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <NavbarButton className={className} {...props}>
          <UserIcon />
          {!loggedInMember && (
            <p className="hidden text-[0.8125rem]/[1rem] sm:block">
              <strong>Entre ou cadastre-se</strong>
              <br />
              para ver seus pedidos
            </p>
          )}
        </NavbarButton>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="min-w-[var(--radix-dropdown-menu-trigger-width)] max-w-64">
        {loggedInMember && (
          <>
            <DropdownMenuLabel>
              {loggedInMember.contact?.firstName ?? loggedInMember.loginEmail}
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <Link href="/perfil">
              <DropdownMenuItem>
                <UserIcon />
                Perfil
              </DropdownMenuItem>
            </Link>
            <DropdownMenuSeparator />
          </>
        )}
        <DropdownMenuSub>
          <DropdownMenuSubTrigger>
            <Monitor />
            Tema
          </DropdownMenuSubTrigger>
          <DropdownMenuPortal>
            <DropdownMenuSubContent>
              <DropdownMenuItem onClick={() => setTheme("system")}>
                <Monitor />
                Padrão do sistema
                {theme === "system" && <Check />}
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setTheme("light")}>
                <Sun />
                Claro
                {theme === "light" && <Check />}
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setTheme("dark")}>
                <Moon />
                Escuro
                {theme === "dark" && <Check />}
              </DropdownMenuItem>
            </DropdownMenuSubContent>
          </DropdownMenuPortal>
        </DropdownMenuSub>
        <DropdownMenuSeparator />
        {loggedInMember ? (
          <DropdownMenuItem onClick={() => logout()}>
            <LogOut />
            Sair
          </DropdownMenuItem>
        ) : (
          <DropdownMenuItem onClick={() => login()}>
            <LogIn />
            Entrar
          </DropdownMenuItem>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
