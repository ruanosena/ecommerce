"use client";

import useAuth from "@/hooks/auth";
import { ButtonProps } from "./ui/button";
import { members } from "@wix/members";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { LogIn, LogOut, UserIcon } from "lucide-react";
import NavbarButton from "@/app/NavbarButton";
import Link from "next/link";

interface UserButtonProps extends ButtonProps {
  loggedInMember: members.Member | null;
}

export default function UserButton({
  loggedInMember,
  className,
  ...props
}: UserButtonProps) {
  const { login, logout } = useAuth();

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
      <DropdownMenuContent className="min-w-44 max-w-64 text-lg">
        {loggedInMember && (
          <>
            <DropdownMenuLabel>
              {loggedInMember.contact?.firstName ?? loggedInMember.loginEmail}
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <Link href="/perfil">
              <DropdownMenuItem>
                <UserIcon className="mr-2 size-6" />
                Perfil
              </DropdownMenuItem>
            </Link>
            <DropdownMenuSeparator />
          </>
        )}
        {loggedInMember ? (
          <DropdownMenuItem onClick={() => logout()}>
            <LogOut className="mr-2 size-6" />
            Sair
          </DropdownMenuItem>
        ) : (
          <DropdownMenuItem onClick={() => login()}>
            <LogIn className="mr-2 size-6" />
            Entrar
          </DropdownMenuItem>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
