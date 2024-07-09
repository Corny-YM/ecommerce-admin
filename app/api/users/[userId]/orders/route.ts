import { NextResponse } from "next/server";

import prismadb from "@/lib/prismadb";

export async function GET(
  req: Request,
  { params }: { params: { userId: string } }
) {
  try {
    const userId = params.userId;

    if (!userId)
      return new NextResponse("User id is required", { status: 400 });

    const orders = await prismadb.order.findMany({
      include: { orderItems: { include: { product: true } } },
      where: { userId: userId, OR: [{ isPaid: true }, { type: "COD" }] },
      orderBy: { updatedAt: "desc" },
    });

    return NextResponse.json(orders);
  } catch (err) {
    console.log("[USER_ORDERS_GET]", err);
    return new NextResponse("Internal error", { status: 500 });
  }
}
