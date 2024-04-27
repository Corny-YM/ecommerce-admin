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
    const result = await prismadb.cart.aggregate({
      where: {
        userId: userId,
      },
      _sum: {
        quantity: true,
      },
    });

    // Access the sum of quantities from the result
    const sumQuantity = result._sum?.quantity ?? 0;

    return NextResponse.json({ quantity: sumQuantity });
  } catch (err) {
    console.log("[CARTS_GET]", err);
    return new NextResponse("Internal error", { status: 500 });
  }
}
