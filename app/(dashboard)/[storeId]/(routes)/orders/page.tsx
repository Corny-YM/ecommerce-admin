import { format } from "date-fns";

import prismadb from "@/lib/prismadb";
import { formatter } from "@/lib/utils";
import { OrderColumn } from "./components/columns";
import { OrderClient } from "./components/client";

const OrdersPage = async ({ params }: { params: { storeId: string } }) => {
  const orders = await prismadb.order.findMany({
    include: {
      orderItems: {
        where: { storeId: params.storeId },
        include: { product: true, size: true, color: true },
      },
    },
    orderBy: { createdAt: "desc" },
  });

  const formattedOrder: OrderColumn[] = orders.map((item) => ({
    id: item.id,
    phone: item.phone || "---",
    address: item.address || "---",
    isPaid: item.isPaid,
    orderItems: item.orderItems,
    totalPrice: formatter.format(
      item.orderItems.reduce((total, item) => {
        return total + Number(item.product.price);
      }, 0)
    ),
    createdAt: format(item.createdAt, "MMMM do, yyyy"),
  }));

  return (
    <div className="flex-col">
      <div className="flex-1 space-y-4 p-8 pt-6">
        <OrderClient storeId={params.storeId} data={formattedOrder} />
      </div>
    </div>
  );
};

export default OrdersPage;
