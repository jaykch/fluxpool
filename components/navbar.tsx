import Image from "next/image";
import { useRouter } from "next/router";
import { Fragment } from "react";
import { Disclosure } from "@headlessui/react";
import {
  Bars3Icon,
  XMarkIcon,
} from "@heroicons/react/24/outline";
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
import { ChevronDown, LogOut, Settings, User } from "lucide-react";

function classNames(...classes: Array<string | boolean>): string {
  return classes.filter(Boolean).join(" ");
}

/**
 * make sure you are passing router.pathname and not
 * router.asPath since we want to have stripped any
 * fragments, query params, or trailing slashes
 */
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
};

export default function Navbar({ items, accountId, appName }: NavbarProps) {
  const router = useRouter();
  const resourceId = router.query.id;
  const selected = extractTabFromPath(router.pathname);
  const {
    ready,
    authenticated,
    user,
    logout,
    linkEmail,
    linkWallet,
    unlinkEmail,
    linkPhone,
    unlinkPhone,
    unlinkWallet,
    linkGoogle,
    unlinkGoogle,
    linkTwitter,
    unlinkTwitter,
    linkDiscord,
    unlinkDiscord,
  } = usePrivy();

  // Navigate to a resource sub-page:
  // /apps/:appId/settings
  // /accounts/:accountId/users
  const navigateTo = (item: NavbarItem) => {
    router.push(`/${item.resource}/${resourceId}/${item.id}`);
  };

  return (
    <Disclosure as="nav" className="bg-gray-800">
      {({ open }) => (
        <>
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-4">
            <div className="flex h-16 items-center justify-between">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <div className="block h-8 w-auto lg:hidden mb-2">
                    <Logo />
                  </div>
                  <div className="hidden h-8 w-auto lg:block mb-2 hover:cursor-pointer">
                    <Logo />
                  </div>
                </div>
                <div className="hidden sm:ml-6 sm:block">
                  <div className="flex space-x-4">
                    {items ? (
                      items.map((item) => {
                        return (
                          <Button
                            key={item.id}
                            onClick={() => {
                              navigateTo(item);
                            }}
                            variant={selected === item.id ? "default" : "ghost"}
                            className="text-lg"
                          >
                            {item.name}
                          </Button>
                        );
                      })
                    ) : (
                      <div></div>
                    )}
                  </div>
                </div>
              </div>
              <div className="hidden sm:ml-6 sm:block">
                <div className="flex items-center space-x-4">
                  <Button
                    onClick={logout}
                    variant="outline"
                    size="sm"
                    className="text-violet-700 border-violet-200 hover:bg-violet-100"
                  >
                    Logout
                  </Button>
                  
                  {/* Profile dropdown with shadcn */}
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
              <div className="-mr-2 flex sm:hidden">
                {/* Mobile menu button */}
                <Disclosure.Button className="inline-flex items-center justify-center rounded-md p-2 text-gray-400 hover:bg-gray-700 hover:text-white focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white">
                  <span className="sr-only">Open main menu</span>
                  {open ? (
                    <XMarkIcon className="block h-6 w-6" aria-hidden="true" />
                  ) : (
                    <Bars3Icon className="block h-6 w-6" aria-hidden="true" />
                  )}
                </Disclosure.Button>
              </div>
            </div>
          </div>
        </>
      )}
    </Disclosure>
  );
}
