import { useRouter } from "next/router";
import { Logo } from "./logo";
import { usePrivy } from "@privy-io/react-auth";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu";
import { ChevronDown, LogOut, Settings, User } from "lucide-react";
import TokenSearch from "./TokenSearch";

const extractTabFromPath = (path: string) => {
  return path.split("/").pop() as string;
};

export type NavbarItem = {
  id: string;
  name: string;
  resource: string;
};

type NavbarProps = {
  accountId: string;
  appName: string;
  items: Array<NavbarItem>;
  onTokenSelect?: (token: any) => void;
};

export default function Navbar({ items, accountId, appName, onTokenSelect }: NavbarProps) {
  const router = useRouter();
  const resourceId = router.query.id;
  const selected = extractTabFromPath(router.pathname);
  const {
    authenticated,
    user,
    logout,
  } = usePrivy();

  const navigateTo = (item: NavbarItem) => {
    router.push(`/${item.resource}/${resourceId}/${item.id}`);
  };

  return (
    <nav className="w-full px-4">
      <div className="flex h-16 items-center justify-between">
        {/* Logo */}
        <div className="flex items-center">
          <Logo />
        </div>

        {/* Navigation Menu */}
        <NavigationMenu>
          <NavigationMenuList>
            {items?.map((item) => (
              <NavigationMenuItem key={item.id}>
                <NavigationMenuLink asChild>
                  <Button
                    variant={selected === item.id ? "default" : "ghost"}
                    className="text-lg"
                    onClick={() => navigateTo(item)}
                  >
                    {item.name}
                  </Button>
                </NavigationMenuLink>
              </NavigationMenuItem>
            ))}
          </NavigationMenuList>
        </NavigationMenu>

        {/* Search Bar */}
        <div className="flex-1 flex justify-center">
          <TokenSearch onTokenSelect={onTokenSelect} />
        </div>

        {/* User Menu */}
        <div className="flex items-center space-x-4">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="flex items-center space-x-2 p-0 h-auto">
                <Avatar className="h-8 w-8">
                  <AvatarImage src="/images/avatar.png" />
                  <AvatarFallback>
                    {user?.email?.address?.[0] || user?.wallet?.address?.slice(-4) || 'U'}
                  </AvatarFallback>
                </Avatar>
                <ChevronDown className="ml-1 h-4 w-4 text-white" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48">
              <DropdownMenuLabel>My Account</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem>
                <User className="mr-2 h-4 w-4" />
                Your account
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Settings className="mr-2 h-4 w-4" />
                Settings
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={logout}>
                <LogOut className="mr-2 h-4 w-4" />
                Sign out
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </nav>
  );
}