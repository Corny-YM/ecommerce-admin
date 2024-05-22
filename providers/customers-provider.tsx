"use client";

import { usePathname } from "next/navigation";
import { useContext, createContext } from "react";

interface Props {
  children: React.ReactNode;
}

export interface ContextType {
  tabs: Array<{ url: string; label: string }>;
  pathname: string;
}

const tabs = [
  { url: "/", label: "All customers" },
  { url: "/purchases", label: "Have purchased before" },
  { url: "/non-purchases", label: "Never made a purchase" },
];

const CustomerContext = createContext<ContextType>({ tabs, pathname: "" });

export const CustomerContextProvider = ({ children }: Props) => {
  const pathname = usePathname();
  return (
    <CustomerContext.Provider value={{ pathname, tabs }}>
      {children}
    </CustomerContext.Provider>
  );
};

export const useCustomerContext = () => {
  return useContext(CustomerContext);
};
