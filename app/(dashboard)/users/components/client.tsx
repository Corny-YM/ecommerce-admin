"use client";

import { DataTable } from "@/components/ui/data-table";
import { Column, columns } from "./columns";

interface ClientProps {
  data: Column[];
}

export const Client = ({ data }: ClientProps) => {
  return <DataTable searchKey="fullName" columns={columns} data={data} />;
};
