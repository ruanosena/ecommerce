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
import MainNavigationButton from "./MainNavigationButton";

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
