import { NextResponse } from "next/server";

import prismadb from "@/lib/prismadb";
import { Color, Image, Product, Size } from "@prisma/client";

export async function GET(
  req: Request,
  { params }: { params: { storeId: string } }
) {
  try {
    if (!params?.storeId)
      return new NextResponse("Store ID is required", { status: 400 });

    const url = new URL(req.url);
    const type = url.searchParams.get("type") || "all";
    const date = getClauseDate(type);

    const orderItems = await prismadb.orderItem.findMany({
      include: {
        product: { include: { images: true } },
        color: true,
        size: true,
      },
      where: {
        storeId: params.storeId,
        order: {
          isPaid: true,
          ...(date && { createdAt: { gte: date } }),
        },
      },
    });

    const productQuantities = orderItems.reduce((acc, item) => {
      const color = item.color;
      const size = item.size;
      const product = item.product;
      const key = `${product.id}-${color.id}-${size.id}`;
      if (!acc[key]) acc[key] = { ...product, size, color, quantity: 0 };
      acc[key].quantity += item.quantity;
      return acc;
    }, {} as Record<string, Product & { size: Size; color: Color; images: Image[]; quantity: number }>);

    const products = Object.values(productQuantities);
    return NextResponse.json(products);
  } catch (err) {
    console.log("[ORDERS_PRODUCTS_GET]", err);
    return new NextResponse("Internal error", { status: 500 });
  }
}

const getClauseDate = (type: string) => {
  const now = new Date();
  let startDate: Date | undefined;

  switch (type) {
    case "months":
      startDate = new Date(now.getFullYear(), now.getMonth(), 1);
      break;
    case "weeks":
      const firstDayOfWeek = now.getDate() - now.getDay();
      startDate = new Date(now.setDate(firstDayOfWeek));
      break;
    case "days":
      startDate = new Date(now.getFullYear(), now.getMonth(), now.getDate());
      break;
  }
  return startDate;
};
