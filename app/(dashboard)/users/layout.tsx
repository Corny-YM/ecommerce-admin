import Link from "next/link";
import { UserButton } from "@clerk/nextjs";
import { ArrowBigLeftDash } from "lucide-react";

import { CustomerContextProvider } from "@/providers/customers-provider";
import { ThemeToggle } from "@/components/theme-toggle";
import { Button } from "@/components/ui/button";
import Tabs from "./components/tabs";

interface Props {
  children: React.ReactNode;
}

const LayoutUsers = ({ children }: Props) => {
  return (
    <div>
      <div className="border-b">
        <div className="flex h-16 items-center px-4">
          <Link href="/">
            <Button size="sm">
              <ArrowBigLeftDash size={20} />
            </Button>
          </Link>
          <div className="px-4 font-bold text-xl">List Customers</div>
          <div className="ml-auto flex items-center space-x-4">
            <ThemeToggle />
            <UserButton afterSignOutUrl="/" />
          </div>
        </div>
      </div>

      <CustomerContextProvider>
        <div className="w-full flex flex-col mt-4 px-4">
          <Tabs />
          {children}
        </div>
      </CustomerContextProvider>
    </div>
  );
};

export default LayoutUsers;
