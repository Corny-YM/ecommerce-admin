"use client";

import Image from "next/image";
import { ColumnDef } from "@tanstack/react-table";
import { Image as TypeImage, Size, Color } from "@prisma/client";

import { CellAction } from "./cell-action";
import { Badge } from "@/components/ui/badge";
import NoImg from "@/public/imgs/no-img.jpg";

// This type is used to define the shape of our data.
// You can use a Zod schema here if you want.
export type ProductColumn = {
  id: string;
  name: string;
  price: string;
  isFeatured: boolean;
  isArchived: boolean;
  images: TypeImage[];
  sizes: Size[];
  colors: Color[];
  createdAt: string;
};

export const columns: ColumnDef<ProductColumn>[] = [
  {
    id: "images",
    accessorKey: "images",
    header: "Images",
    cell: ({ row }) => {
      const name = row.original.name;
      const images = row.original.images;
      return (
        <div className="flex flex-wrap gap-1 items-center">
          <div className="flex relative justify-center items-center w-10 h-10 rounded-lg overflow-hidden">
            <Image
              className="absolute w-full h-full"
              src={images?.[0]?.url || NoImg}
              alt={name}
              fill
            />
          </div>
        </div>
      );
    },
  },
  { accessorKey: "name", header: "Name" },
  {
    accessorKey: "sizes",
    header: "Sizes",
    cell: ({ row }) => {
      const sizes = row.original.sizes;
      return (
        <div className="flex flex-wrap items-center gap-1">
          {sizes.map((size) => (
            <Badge key={size.id}>{size.value}</Badge>
          ))}
        </div>
      );
    },
  },
  {
    accessorKey: "colors",
    header: "Colors",
    cell: ({ row }) => {
      const colors = row.original.colors;
      return (
        <div className="flex flex-wrap items-center gap-1">
          {colors.map((color) => (
            <Badge key={color.id}>{color.value}</Badge>
          ))}
        </div>
      );
    },
  },
  {
    accessorKey: "isArchived",
    header: "Archived",
    cell: ({ row }) => (
      <div className="flex items-center text-xl">
        {!!row.original.isArchived ? "✅" : "❌"}
      </div>
    ),
  },
  {
    accessorKey: "isFeatured",
    header: "Featured",
    cell: ({ row }) => (
      <div className="flex items-center text-xl">
        {!!row.original.isFeatured ? "✅" : "❌"}
      </div>
    ),
  },
  { accessorKey: "price", header: "Price" },
  { accessorKey: "createdAt", header: "Created At" },
  { id: "actions", cell: ({ row }) => <CellAction data={row.original} /> },
];
