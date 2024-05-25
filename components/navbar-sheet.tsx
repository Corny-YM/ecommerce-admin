"use client";

import Link from "next/link";
import { ChevronLast, Menu, ScanEye } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { ScrollArea } from "@/components/ui/scroll-area";

interface Props {
  routes: {
    href: string;
    label: string;
    active: boolean;
  }[];
}

const NavbarSheet = ({ routes }: Props) => {
  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="outline" size="icon">
          <Menu />
        </Button>
      </SheetTrigger>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>
            <Link href="/">
              <p className="font-bold text-xl">STORE</p>
            </Link>
          </SheetTitle>
          <SheetDescription className="">All categories</SheetDescription>
        </SheetHeader>
        <div className="w-full flex flex-col">
          <ScrollArea className="h-[calc(100vh-160px)] -mx-6 my-2 px-4">
            <div className="flex flex-col gap-1">
              {routes.map((route) => (
                <Link
                  key={route.href}
                  href={route.href}
                  className={cn(
                    "flex w-full items-center justify-between",
                    "p-2 font-bold transition rounded-lg",
                    "hover:bg-primary/20",
                    "hover:text-black dark:hover:text-white hover:font-bold",
                    route.active
                      ? "text-black dark:text-white font-bold bg-primary/10"
                      : "text-neutral-500"
                  )}
                >
                  <div>{route.label}</div>
                  {!route.active ? (
                    <ChevronLast size={20} />
                  ) : (
                    <ScanEye size={20} />
                  )}
                </Link>
              ))}
            </div>
          </ScrollArea>
        </div>
        <SheetFooter>
          <SheetClose asChild>
            <Button variant="outline" size="sm">
              Close
            </Button>
          </SheetClose>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
};

export default NavbarSheet;
