"use client";

import { Button } from "@/components/ui/button";
import { Heading } from "@/components/ui/heading";
import { Separator } from "@/components/ui/separator";
import { DataTable } from "@/components/ui/data-table";
import { OrderColumn, columns } from "./columns";

interface OrderClientProps {
  data: OrderColumn[];
}

export const OrderClient = ({ data }: OrderClientProps) => {
  return (
    <>
      <Heading
        title={`Orders (${data.length})`}
        description="Manage orders for your store"
      />
      <Separator />
      <DataTable searchKey="products" columns={columns} data={data} />
      <div>
        <div className="flex ml-2 items-center gap-2">
          {/* TODO: layout, api for getting orders */}
          <Button className="w-24" variant="secondary" size="sm">
            All
          </Button>
          <Button className="w-24" variant="secondary" size="sm">
            Months
          </Button>
          <Button className="w-24" variant="secondary" size="sm">
            Weeks
          </Button>
          <Button className="w-24" variant="secondary" size="sm">
            Days
          </Button>
        </div>
      </div>
    </>
  );
};
