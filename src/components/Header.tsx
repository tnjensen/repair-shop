import { HomeIcon, File, UsersRound, LogOut } from "lucide-react";
import Link from "next/link";
import { LogoutLink } from "@kinde-oss/kinde-auth-nextjs/components";
import { Button } from "./ui/button";
import { ModeToggle } from "./ModeToggle";
import { NavButtonMenu } from "./NavButtonMenu";
import { NavButton } from "./NavButton";

export function Header() {
  return (
    <header className="animate-slide bg-background h-12 p-2 border-b sticky top-0 z-20">
      <div className="flex h-8 items-center justify-between w-full">
        <div className="flex items-center gap-2">
          <Link
            href="/tickets"
            className="flex justify-center items-center gap-2 ml-0"
            title="Tickets"
          >
            <HomeIcon />
            <h1 className="hidden sm:block text-xl font-bold m-0 mt-1">
              Computer Repair Shop
            </h1>
          </Link>
        </div>
        <div className="flex items-center gap-2">
        <Link
            href="/tickets"
            className="flex justify-center items-center gap-2 ml-0"
            title="Tickets"
          >
            <File className="w-5" />
            <h1 className="hidden sm:block text-xl font-bold m-0 mt-1">
            </h1>
        </Link>
        <Link
            href="/customers"
            className="flex justify-center items-center gap-2 ml-0"
            title="Customers"
          >
            {/* <UsersRound /> */}
            <NavButtonMenu
            icon={UsersRound}
            label="Customers Menu"
            choices={[
              {title: "Search Customers", href: "/customers"}, 
              {title: "New Customer", href: "/customers/form"}, 
            ]} 
          />
            <h1 className="hidden sm:block text-xl font-bold m-0 mt-1">
            </h1>
          </Link>
          
          <ModeToggle />
          <Button
            variant="ghost"
            size="icon"
            aria-label="LogOut"
            title="LogOut"
            className="rounded-full"
            asChild
          >
            <LogoutLink>
              <LogOut />
            </LogoutLink>
          </Button>
        </div>
      </div>
    </header>
  );
}
