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
import { ChevronDown, LogOut, Settings, User, Star, Bell } from "lucide-react";
import TokenSearch from "./TokenSearch";
import BalanceWidget from './BalanceWidget';

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

  const navigateToPage = (page: string) => {
    router.push(`/${page}`);
  };

  return (
    <nav className="w-full px-4 border-b border-gray-700">
      <div className="flex h-16 items-center justify-between">
        {/* Left side: Logo and Navigation */}
        <div className="flex items-center space-x-6">
          <button 
            onClick={() => navigateToPage("home")}
            className="hover:opacity-80 transition-opacity"
          >
            <Logo />
          </button>
          
          <NavigationMenu>
            <NavigationMenuList>
              <NavigationMenuItem>
                <NavigationMenuLink asChild>
                  <Button
                    variant={router.pathname === "/home" ? "default" : "ghost"}
                    size="sm"
                    className="text-white hover:text-white hover:bg-gray-700"
                    onClick={() => navigateToPage("home")}
                  >
                    Home
                  </Button>
                </NavigationMenuLink>
              </NavigationMenuItem>
              
              <NavigationMenuItem>
                <NavigationMenuLink asChild>
                  <Button
                    variant={router.pathname === "/trade" ? "default" : "ghost"}
                    size="sm"
                    className="text-white hover:text-white hover:bg-gray-700"
                    onClick={() => navigateToPage("trade")}
                  >
                    Trade
                  </Button>
                </NavigationMenuLink>
              </NavigationMenuItem>
              
              <NavigationMenuItem>
                <NavigationMenuLink asChild>
                  <Button
                    variant={router.pathname === "/discover" ? "default" : "ghost"}
                    size="sm"
                    className="text-white hover:text-white hover:bg-gray-700"
                    onClick={() => navigateToPage("discover")}
                  >
                    Discover
                  </Button>
                </NavigationMenuLink>
              </NavigationMenuItem>
              
              <NavigationMenuItem>
                <NavigationMenuLink asChild>
                  <Button
                    variant={router.pathname === "/portfolio" ? "default" : "ghost"}
                    size="sm"
                    className="text-white hover:text-white hover:bg-gray-700"
                    onClick={() => navigateToPage("portfolio")}
                  >
                    Portfolio
                  </Button>
                </NavigationMenuLink>
              </NavigationMenuItem>
              
              <NavigationMenuItem>
                <NavigationMenuLink asChild>
                  <Button
                    variant={router.pathname === "/track" ? "default" : "ghost"}
                    size="sm"
                    className="text-white hover:text-white hover:bg-gray-700"
                    onClick={() => navigateToPage("track")}
                  >
                    Track
                  </Button>
                </NavigationMenuLink>
              </NavigationMenuItem>
              
              {items?.map((item) => (
                <NavigationMenuItem key={item.id}>
                  <NavigationMenuLink asChild>
                    <Button
                      variant={selected === item.id ? "default" : "ghost"}
                      size="sm"
                      className="text-white hover:text-white hover:bg-gray-700"
                      onClick={() => navigateTo(item)}
                    >
                      {item.name}
                    </Button>
                  </NavigationMenuLink>
                </NavigationMenuItem>
              ))}
            </NavigationMenuList>
          </NavigationMenu>
        </div>

        {/* Right side: Search, Icons, and User Menu */}
        <div className="flex items-center space-x-4">
          {/* Search Bar */}
          <TokenSearch onTokenSelect={onTokenSelect} />
          
          {/* Favorite Icon */}
          <Button
            variant="ghost"
            size="sm"
            className="text-white hover:text-white hover:bg-gray-700"
          >
            <Star className="h-5 w-5" />
          </Button>
          
          {/* Notifications Icon */}
          <Button
            variant="ghost"
            size="sm"
            className="text-white hover:text-white hover:bg-gray-700 relative"
          >
            <Bell className="h-5 w-5" />
            {/* Notification badge */}
            <span className="absolute -top-1 -right-1 h-3 w-3 rounded-full bg-crimson text-white text-xs flex items-center justify-center">
              3
            </span>
          </Button>

          {/* Balance Widget */}
          <BalanceWidget />
          
          {/* User Menu */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="flex items-center space-x-2 p-0 h-auto text-white hover:text-white hover:bg-gray-700">
                <Avatar className="h-8 w-8">
                  <AvatarImage src="/images/avatar.png" />
                  <AvatarFallback>
                    {user?.email?.address?.[0] || user?.wallet?.address?.slice(-4) || 'U'}
                  </AvatarFallback>
                </Avatar>
                <ChevronDown className="ml-1 h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48">
              <DropdownMenuLabel>My Account</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => router.push('/account')}>
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