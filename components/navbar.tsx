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
import { ChevronDown, LogOut, Settings, User, Star, Bell, MessageCircle, UserPlus, ArrowUpRight, BarChart3 } from "lucide-react";
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

// Helper to get the user's Fluxpool ENS subname from their wallet address
function toFluxpoolENS(address: string | undefined) {
  if (!address) return '';
  // For demo, use the address (or a substring) as the subname
  // In production, replace with actual ENS logic
  return `${address.toLowerCase().replace(/^0x/, '').slice(0, 8)}.fluxpool.eth`;
}

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
          
          {/* Favorite or Edit Icon (conditionally rendered) */}
          {router.pathname.startsWith("/profile/") && user?.wallet?.address ? (
            (() => {
              const ens = router.query.ens as string | undefined;
              const userEns = toFluxpoolENS(user.wallet.address);
              if (ens && userEns && ens.toLowerCase() === userEns.toLowerCase()) {
                return (
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-white hover:text-white hover:bg-gray-700"
                    onClick={() => router.push("/account")}
                  >
                    <Settings className="h-5 w-5" />
                  </Button>
                );
              } else {
                return (
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-white hover:text-white hover:bg-gray-700"
                  >
                    <Star className="h-5 w-5" />
                  </Button>
                );
              }
            })()
          ) : null}
          
          {/* Notifications Dropdown */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size="sm"
                className="text-white hover:text-white hover:bg-gray-700 relative"
              >
                <Bell className="h-5 w-5" />
                {/* Notification badge */}
                <span className="absolute -top-1 -right-1 h-4 w-4 rounded-full bg-red-600 text-white text-xs flex items-center justify-center font-bold">
                  3
                </span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-64 bg-white/10 dark:bg-black/20 backdrop-blur-lg shadow-2xl border-0 rounded-2xl text-white">
              <DropdownMenuLabel>Notifications</DropdownMenuLabel>
              <DropdownMenuSeparator className="bg-white/10 dark:bg-black/30" />
              {/* Mock notifications - more visual */}
              <DropdownMenuItem className="flex items-center gap-3 py-1 rounded-xl hover:bg-violet-500/10 transition">
                <span className="w-8 h-8 flex items-center justify-center rounded-full bg-blue-500/20 text-blue-400"><UserPlus className="h-5 w-5" /></span>
                <span className="flex-1 text-sm">New follower: <span className="font-semibold text-white">trader123</span></span>
              </DropdownMenuItem>
              <DropdownMenuItem className="flex items-center gap-3 py-1 rounded-xl hover:bg-green-500/10 transition">
                <span className="w-8 h-8 flex items-center justify-center rounded-full bg-green-500/20 text-green-400"><ArrowUpRight className="h-5 w-5" /></span>
                <span className="flex-1 text-sm">Trade executed: <span className="font-semibold text-white">+2.5 ETH</span></span>
              </DropdownMenuItem>
              <DropdownMenuItem className="flex items-center gap-3 py-1 rounded-xl hover:bg-fuchsia-500/10 transition">
                <span className="w-8 h-8 flex items-center justify-center rounded-full bg-fuchsia-500/20 text-fuchsia-400"><BarChart3 className="h-5 w-5" /></span>
                <span className="flex-1 text-sm">PnL update: <span className="font-semibold text-white">+$1,200</span></span>
              </DropdownMenuItem>
              <DropdownMenuSeparator className="bg-white/10 dark:bg-black/30" />
              <DropdownMenuItem className="text-center text-xs text-gray-400">View all notifications</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Messages Icon */}
          <Button
            variant="ghost"
            size="sm"
            className="text-white hover:text-white hover:bg-gray-700 relative"
            onClick={() => router.push("/messages")}
          >
            <MessageCircle className="h-5 w-5" />
            {/* Unread messages badge */}
            <span className="absolute -top-1 -right-1 h-4 w-4 rounded-full bg-red-600 text-white text-xs flex items-center justify-center font-bold">
              2
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
            <DropdownMenuContent align="end" className="w-48 bg-white/10 dark:bg-black/20 backdrop-blur-lg shadow-2xl border-0 rounded-2xl text-white">
              <DropdownMenuLabel>My Account</DropdownMenuLabel>
              <DropdownMenuSeparator className="bg-white/10 dark:bg-black/30" />
              {user && user.wallet && user.wallet.address && (
                <DropdownMenuItem onClick={() => router.push(`/profile/${toFluxpoolENS(user.wallet?.address)}`)}>
                  <User className="mr-2 h-4 w-4" />
                  My Profile
                </DropdownMenuItem>
              )}
              <DropdownMenuItem onClick={() => router.push('/account')}>
                <User className="mr-2 h-4 w-4" />
                Your account
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Settings className="mr-2 h-4 w-4" />
                Settings
              </DropdownMenuItem>
              <DropdownMenuSeparator className="bg-white/10 dark:bg-black/30" />
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