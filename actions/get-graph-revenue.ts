import prismadb from "@/lib/prismadb";

interface GraphData {
  name: string;
  total: number;
}

export const getGraphRevenue = async (storeId: string) => {
  const paidOrders = await prismadb.order.findMany({
    where: {
      isPaid: true,
    },
    include: {
      orderItems: {
        where: { storeId },
        include: {
          product: true,
        },
      },
    },
  });

  const monthlyRevenue: Record<number, number> = {};

  for (const order of paidOrders) {
    const month = order.createdAt.getMonth();
    let revenueOrder = 0;

    for (const item of order.orderItems) {
      revenueOrder += item.product.price.toNumber();
    }

    monthlyRevenue[month] = (monthlyRevenue[month] || 0) + revenueOrder;
  }

  const graphData: GraphData[] = [
    { name: "Jan", total: 0 },
    { name: "Feb", total: 0 },
    { name: "Mar", total: 0 },
    { name: "Apr", total: 0 },
    { name: "May", total: 0 },
    { name: "Jun", total: 0 },
    { name: "Jul", total: 0 },
    { name: "Aug", total: 0 },
    { name: "Sep", total: 0 },
    { name: "Oct", total: 0 },
    { name: "Nov", total: 0 },
    { name: "Dec", total: 0 },
  ];

  for (const month in monthlyRevenue) {
    graphData[parseInt(month)].total = monthlyRevenue[parseInt(month)];
  }

  return graphData;
};

// const aggregateByMonth = (data: (Order & { orderItems: OrderItem[] })[]) => {
//   const result: Record<string, any> = {};
//   data.forEach((order) => {
//     const month = format(order.createdAt, "MMMM yyyy");
//     if (!result[month]) {
//       result[month] = 0;
//     }
//     result[month] += order.orderItems.reduce(
//       (sum, item) => sum + item.quantity,
//       0
//     );
//   });
//   return Object.entries(result).map(([name, total]) => ({ name, total }));
// };

// const aggregateByWeek = (data: (Order & { orderItems: OrderItem[] })[]) => {
//   const result: Record<string, any> = {};
//   data.forEach((order) => {
//     const week = `Week ${format(startOfWeek(order.createdAt), "w yyyy")}`;
//     if (!result[week]) {
//       result[week] = 0;
//     }
//     result[week] += order.orderItems.reduce(
//       (sum, item) => sum + item.quantity,
//       0
//     );
//   });
//   return Object.entries(result).map(([name, total]) => ({ name, total }));
// };

// const aggregateByDay = (data: (Order & { orderItems: OrderItem[] })[]) => {
//   const result: Record<string, any> = {};
//   data.forEach((order) => {
//     const day = format(order.createdAt, "yyyy-MM-dd");
//     if (!result[day]) {
//       result[day] = 0;
//     }
//     result[day] += order.orderItems.reduce(
//       (sum, item) => sum + item.quantity,
//       0
//     );
//   });
//   return Object.entries(result).map(([name, total]) => ({ name, total }));
// };
