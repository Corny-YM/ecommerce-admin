import prismadb from "@/lib/prismadb";

export const getTotalRevenue = async (storeId: string) => {
  const paidOrders = await prismadb.order.findMany({
    where: { isPaid: true },
    include: {
      orderItems: {
        where: { storeId },
        include: {
          product: true,
        },
      },
    },
  });

  const totalRevenue = paidOrders.reduce((total, order) => {
    const orderTotal = order.orderItems.reduce((orderSum, item) => {
      const price = item.product.price.toNumber();
      const quantity = item.quantity;
      const total = price * quantity;
      return orderSum + total;
    }, 0);
    return total + orderTotal;
  }, 0);

  return totalRevenue;
};
