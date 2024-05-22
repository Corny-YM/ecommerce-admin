"use client";

import { cn } from "@/lib/utils";
import { useCallback } from "react";
import { useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";
import { useCustomerContext } from "@/providers/customers-provider";

const Tabs = () => {
  const router = useRouter();

  const { tabs, pathname } = useCustomerContext();

  const hasSelected = useCallback(
    (url: string) => {
      const isRoot = pathname?.split("/")?.length === 2;
      if (!url || url === "/") return isRoot;
      return pathname?.includes(url);
    },
    [pathname]
  );
  const handleClickTab = useCallback(
    (e: React.MouseEvent) => {
      const target = e.currentTarget as HTMLButtonElement;
      const url = target.dataset.url;
      if (!url) return;
      router.push(`/users/${url}`);
    },
    [router]
  );

  return (
    <div className="w-full flex items-center gap-x-2">
      {tabs.map(({ url, label }) => (
        <Button
          key={url}
          data-url={url}
          className={cn(
            "transition ",
            hasSelected(url) && "bg-[#3498db50] hover:bg-[#3498db40]"
          )}
          variant="outline"
          onClick={handleClickTab}
        >
          {label}
        </Button>
      ))}
    </div>
  );
};

export default Tabs;
