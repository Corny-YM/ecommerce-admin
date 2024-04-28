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

    // Use Prisma's aggregation function to sum the quantities
    const result = await prismadb.cart.findMany({
      where: { userId },
      include: {
        product: { include: { images: true } },
        color: true,
        size: true,
        store: true,
      },
      orderBy: [
        { createdAt: "desc" },
        { storeId: "desc" },
        { product: { name: "desc" } },
      ],
    });

    return NextResponse.json(result);
  } catch (err) {
    console.log("[CARTS_GET_BY_USER_ID]", err);
    return new NextResponse("Internal error", { status: 500 });
  }
}
