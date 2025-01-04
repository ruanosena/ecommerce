import Link from "next/link";
import logo from "@/assets/logo.png";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Plus, ShoppingBag } from "lucide-react";
import { cn } from "@/lib/utils";
import { getCart } from "@/wix-api/cart";

export default async function Navbar() {
  const cart = await getCart();

  const totalQuantity =
    cart?.lineItems.reduce((acc, item) => acc + (item.quantity ?? 0), 0) ?? 0;

  return (
    <header className="bg-background shadow-sm">
      <div className="mx-auto flex min-h-16 max-w-7xl items-center justify-between gap-5 px-4">
        <Link href="/" className="flex items-center gap-4 text-nowrap">
          <Image src={logo} alt="Ruan Store logo" width={40} height={40} />
          <span className="text-xl font-bold">Ruan Store</span>
        </Link>
        <Button variant="link" className="relative h-auto p-2 [&_svg]:size-10">
          <ShoppingBag />
          <span
            className={cn(
              "absolute bottom-0 right-0 flex size-7 items-center justify-center rounded-full border-[3px] border-background bg-violet-400 font-bold text-foreground",
            )}
          >
            {totalQuantity > 99 ? 99 : totalQuantity}
            {totalQuantity > 99 && (
              <Plus className="absolute -right-3.5 !size-4" />
            )}
          </span>
        </Button>
      </div>
    </header>
  );
}
