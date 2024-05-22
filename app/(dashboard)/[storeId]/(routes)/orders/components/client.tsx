"use client";

import { OrderContextProvider } from "@/providers/orders-provider";
import { Heading } from "@/components/ui/heading";
import { Separator } from "@/components/ui/separator";
import { DataTable } from "@/components/ui/data-table";
import { OrderColumn, columns } from "./columns";
import ProductOrders from "./product-orders";

interface OrderClientProps {
  data: OrderColumn[];
  storeId: string;
}

export const OrderClient = ({ data, storeId }: OrderClientProps) => {
  return (
    <>
      <Heading
        title={`Orders (${data.length})`}
        description="Manage orders for your store"
      />
      <Separator />
      <DataTable searchKey="products" columns={columns} data={data} />
      <OrderContextProvider>
        <ProductOrders storeId={storeId} />
      </OrderContextProvider>
    </>
  );
};
