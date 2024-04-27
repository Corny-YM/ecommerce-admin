import { NextResponse } from "next/server";

import prismadb from "@/lib/prismadb";

export async function GET(req: Request) {
  try {
    const carts = await prismadb.cart.findMany({});

    return NextResponse.json(carts);
  } catch (err) {
    console.log("[CARTS_GET]", err);
    return new NextResponse("Internal error", { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { userId, storeId, productId, colorId, sizeId } = body;

    if (!userId) {
      return new NextResponse("User id is required", { status: 400 });
    }
    if (!storeId) {
      return new NextResponse("Store id is required", { status: 400 });
    }
    if (!productId) {
      return new NextResponse("Product id is required", { status: 400 });
    }
    if (!colorId) {
      return new NextResponse("Color id is required", { status: 400 });
    }
    if (!sizeId) {
      return new NextResponse("Size id is required", { status: 400 });
    }

    const data = await prismadb.cart.upsert({
      where: {
        userId_storeId_productId_sizeId_colorId: {
          userId,
          storeId,
          productId,
          colorId,
          sizeId,
        },
      },
      // Update the cart if it exists
      update: { quantity: { increment: 1 } },
      // Create a new cart if it doesn't exist
      create: { userId, storeId, productId, sizeId, colorId, quantity: 1 },
    });

    return NextResponse.json(data);
  } catch (err) {
    console.log("[CART_POST]", err);
    return new NextResponse("Internal error", { status: 500 });
  }
}
