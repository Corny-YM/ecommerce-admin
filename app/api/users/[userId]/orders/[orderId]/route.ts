import { NextResponse } from "next/server";

import prismadb from "@/lib/prismadb";

export async function GET(
  req: Request,
  { params }: { params: { userId: string; orderId: string } }
) {
  try {
    const userId = params.userId;

    if (!userId)
      return new NextResponse("User id is required", { status: 400 });

    const orderItems = await prismadb.orderItem.findMany({
      include: {
        product: { include: { images: true } },
        color: true,
        size: true,
        store: true,
      },
      where: { orderId: params.orderId },
    });

    return NextResponse.json(orderItems);
  } catch (err) {
    console.log("[USER_ORDER_ITEMS_GET]", err);
    return new NextResponse("Internal error", { status: 500 });
  }
}
