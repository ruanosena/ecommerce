import Link from "next/link";
import logo from "@/assets/logo.png";
import Image from "next/image";
import { getCart } from "@/wix-api/cart";
import { getWixServerClient } from "@/lib/wix-client.server";
import ShoppingCartButton from "./ShoppingCartButton";
import UserButton from "@/components/UserButton";
import { getLoggedInMember } from "@/wix-api/members";
import { getCollections } from "@/wix-api/collections";
import MainNavigation from "./MainNavigation";
import SearchField from "@/components/SearchField";

export default async function Navbar() {
  const wixClient = await getWixServerClient();

  const [cart, loggedInMember, collections] = await Promise.all([
    getCart(wixClient),
    getLoggedInMember(wixClient),
    getCollections(wixClient),
  ]);

  return (
    <header className="space-y-2 bg-background px-4 shadow-sm">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-2 sm:gap-5">
        <div className="flex flex-row-reverse flex-wrap items-center gap-3.5 sm:gap-5 md:flex-row">
          <Link
            href="/"
            className="flex items-center gap-2 text-nowrap sm:gap-4"
          >
            <Image src={logo} alt="Ruan Store logo" width={40} height={40} />
            <span className="hidden text-xl font-bold sm:inline md:hidden xl:inline">
              Ruan Store
            </span>
          </Link>

          <MainNavigation collections={collections} />
        </div>

        <SearchField className="hidden max-w-md md:block" />

        <div className="flex items-center justify-center gap-2">
          <UserButton loggedInMember={loggedInMember} />
          <ShoppingCartButton initialData={cart} />
        </div>
      </div>

      <SearchField className="md:hidden" />
    </header>
  );
}
