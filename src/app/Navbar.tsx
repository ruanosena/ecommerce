import Link from "next/link";
import logo from "@/assets/logo.png";
import Image from "next/image";
import { getCart } from "@/wix-api/cart";
import { getWixServerClient } from "@/lib/wix-client.server";
import ShoppingCartButton from "./ShoppingCartButton";

export default async function Navbar() {
  const cart = await getCart(await getWixServerClient());

  return (
    <header className="bg-background shadow-sm">
      <div className="mx-auto flex min-h-16 max-w-7xl items-center justify-between gap-5 px-4">
        <Link href="/" className="flex items-center gap-4 text-nowrap">
          <Image src={logo} alt="Ruan Store logo" width={40} height={40} />
          <span className="text-xl font-bold">Ruan Store</span>
        </Link>

        <ShoppingCartButton initialData={cart} />
      </div>
    </header>
  );
}
