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

  return (
    <nav className="w-full px-4 border-b border-gray-700">
      <div className="flex h-16 items-center justify-between">
        {/* Left side: Logo and Navigation */}
        <div className="flex items-center space-x-6">
          <Logo />
          
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
        </div>

        {/* Right side: Search, Icons, and User Menu */}
        <div className="flex items-center space-x-4">
          {/* Search Bar */}
          <TokenSearch onTokenSelect={onTokenSelect} />
          
          {/* Favorite Icon */}
          <Button
            variant="ghost"
            size="sm"
            className="text-muted-foreground hover:text-foreground"
          >
            <Star className="h-5 w-5" />
          </Button>
          
          {/* Notifications Icon */}
          <Button
            variant="ghost"
            size="sm"
            className="text-muted-foreground hover:text-foreground relative"
          >
            <Bell className="h-5 w-5" />
            {/* Notification badge */}
            <span className="absolute -top-1 -right-1 h-3 w-3 bg-destructive rounded-full text-xs text-destructive-foreground flex items-center justify-center">
              3
            </span>
          </Button>

          {/* Balance Widget */}
          <BalanceWidget />

          {/* Logout Button */}
          <Button
            onClick={logout}
            variant="outline"
            size="sm"
          >
            Logout
          </Button>
          
          {/* User Menu */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="flex items-center space-x-2 p-0 h-auto">
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