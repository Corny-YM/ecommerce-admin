"use client";

import { ColumnDef } from "@tanstack/react-table";

import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import { OrderItem, Product } from "@prisma/client";

// This type is used to define the shape of our data.
// You can use a Zod schema here if you want.
export type OrderColumn = {
  id: string;
  phone: string;
  address: string;
  isPaid: boolean;
  orderItems: (OrderItem & { product: Product })[];
  totalPrice: string;
  createdAt: string;
};

export const columns: ColumnDef<OrderColumn>[] = [
  {
    accessorKey: "products",
    header: "Products",
    cell: ({ row }) => {
      return (
        <div className="flex items-center gap-2">
          {row.original.orderItems?.map((orderItem) => {
            const { id, product, storeId } = orderItem;
            return (
              <Link
                key={id}
                href={`/${storeId}/products/${product.id}`}
                target="_blank"
              >
                <Badge>{product.name}</Badge>
              </Link>
            );
          })}
        </div>
      );
    },
  },
  {
    accessorKey: "phone",
    header: "Phone",
  },
  {
    accessorKey: "address",
    header: "Address",
  },
  {
    accessorKey: "totalPrice",
    header: "Total price",
  },
  {
    accessorKey: "isPaid",
    header: "Paid",
    cell: ({ row }) => (
      <div className="flex items-center text-xl">
        {!!row.original.isPaid ? "✅" : "❌"}
      </div>
    ),
  },
];
