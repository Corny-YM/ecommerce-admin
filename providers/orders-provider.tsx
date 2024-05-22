"use client";

import { useContext, createContext } from "react";

import { usePathname } from "next/navigation";

interface Props {
  children: React.ReactNode;
}

export interface ContextType {
  pathname: string;
}

const OrderContext = createContext<ContextType>({
  pathname: "",
});

export const OrderContextProvider = ({ children }: Props) => {
  const pathname = usePathname();

  return (
    <OrderContext.Provider value={{ pathname }}>
      {children}
    </OrderContext.Provider>
  );
};

export const useOrderContext = () => {
  return useContext(OrderContext);
};
