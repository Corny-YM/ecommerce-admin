"use client";

import { Badge } from "@/components/ui/badge";
import { ColumnDef } from "@tanstack/react-table";
import Image from "next/image";

// This type is used to define the shape of our data.
// You can use a Zod schema here if you want.
export type Column = {
  imageUrl: string;
  firstName: string;
  lastName: string;
  fullName: string;
  email: string;
  quantity: number;
  lastSignInAt: string;
};

export const columns: ColumnDef<Column>[] = [
  {
    accessorKey: "imageUrl",
    header: "Avatar",
    cell({ row }) {
      return (
        <div className="relative flex justify-center items-center w-10 h-10 rounded-md overflow-hidden">
          <Image
            className="absolute w-full h-full"
            src={row.original.imageUrl}
            alt={row.original.fullName}
            fill
          />
        </div>
      );
    },
  },
  { accessorKey: "firstName", header: "First name" },
  { accessorKey: "lastName", header: "Last name" },
  { accessorKey: "fullName", header: "Full name" },
  {
    accessorKey: "email",
    header: "Email",
    cell({ row }) {
      return <Badge>{row.original.email}</Badge>;
    },
  },
  {
    accessorKey: "quantity",
    header: "Order quantities",

    cell({ row }) {
      const quantity = row.original.quantity || 0;
      return (
        <div className="w-full flex items-center">
          <Badge>{quantity}</Badge>
        </div>
      );
    },
  },
  { accessorKey: "lastSignInAt", header: "Last sign-in" },
];
