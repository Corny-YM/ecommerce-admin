"use client";

import Link from "next/link";
import { ColumnDef } from "@tanstack/react-table";
import { Color, OrderItem, Product, Size } from "@prisma/client";

import { Badge } from "@/components/ui/badge";

// This type is used to define the shape of our data.
// You can use a Zod schema here if you want.
export type OrderColumn = {
  id: string;
  phone: string;
  address: string;
  isPaid: boolean;
  orderItems: (OrderItem & { product: Product; size: Size; color: Color })[];
  totalPrice: string;
  createdAt: string;
};

export const columns: ColumnDef<OrderColumn>[] = [
  {
    accessorKey: "products",
    header: "Products",
    cell: ({ row }) => {
      return (
        <div className="max-w-[600px] flex flex-wrap items-center gap-2">
          {row.original.orderItems?.map((orderItem) => {
            const { id, product, size, color, storeId } = orderItem;
            return (
              <Link
                key={id}
                href={`/${storeId}/products/${product.id}`}
                target="_blank"
                className="min-w-fit flex flex-wrap gap-1 bg-[#3498db50] p-2 rounded-md"
              >
                <span>{product.name}</span>
                <div className="flex items-center gap-x-1">
                  <Badge>{size.value}</Badge>
                  <Badge style={{ backgroundColor: color.value }}>
                    {color.value}
                  </Badge>
                </div>
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
