"use client";

import { cn } from "@/lib/utils";
import { useRouter } from "next/navigation";
import { FormHTMLAttributes } from "react";
import { Input } from "./ui/input";
import { SearchIcon } from "lucide-react";

export default function SearchField({
  className,
  ...props
}: FormHTMLAttributes<HTMLFormElement>) {
  const router = useRouter();

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    const form = e.currentTarget;
    const q = (form.q as HTMLInputElement).value.trim();
    if (!q) return;
    router.push(`/loja?q=${encodeURIComponent(q)}`);
  }

  return (
    <form
      onSubmit={handleSubmit}
      className={cn("grow", className)}
      method="GET"
      action="/loja"
      {...props}
    >
      <div className="relative text-foreground">
        <Input
          name="q"
          placeholder="Buscar produto"
          className="border-foreground pe-10"
        />
        <SearchIcon className="absolute right-3 top-1/2 size-5 -translate-y-1/2 transform stroke-foreground text-muted-foreground" />
      </div>
    </form>
  );
}
