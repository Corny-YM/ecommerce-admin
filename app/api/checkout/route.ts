import Stripe from "stripe";
import { NextResponse } from "next/server";

import { stripe } from "@/lib/stripe";
import prismadb from "@/lib/prismadb";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization",
};

export async function OPTIONS() {
  return NextResponse.json({}, { headers: corsHeaders });
}

export async function POST(req: Request) {
  const { userId, cartIds } = await req.json();

  if (!userId) return new NextResponse("User id are required", { status: 400 });

  if (!cartIds || !cartIds.length)
    return new NextResponse("Cart ids are required", { status: 400 });

  const carts = await prismadb.cart.findMany({
    where: { id: { in: cartIds } },
    include: { product: true, color: true, size: true },
  });

  const line_items: Stripe.Checkout.SessionCreateParams.LineItem[] = [];

  carts.forEach((cart) => {
    const { id, product, quantity, colorId, sizeId, storeId, productId } = cart;
    const unit_amount = Math.round(product.price.toNumber() * 100);
    line_items.push({
      quantity: quantity,
      price_data: {
        currency: "USD",
        product_data: {
          name: product.name,
          metadata: { colorId, sizeId, storeId, productId, cartId: id },
        },
        unit_amount,
      },
    });
  });

  const order = await prismadb.order.create({
    data: {
      isPaid: false,
      userId: userId,
      orderItems: {
        create: carts.map((cart) => {
          const { quantity, sizeId, colorId, storeId, productId } = cart;
          return { quantity, sizeId, colorId, storeId, productId };
        }),
      },
    },
  });

  const session = await stripe.checkout.sessions.create({
    line_items,
    mode: "payment",
    billing_address_collection: "required",
    phone_number_collection: { enabled: true },
    success_url: `${process.env.FRONTEND_STORE_URL}/cart?success=1`,
    cancel_url: `${process.env.FRONTEND_STORE_URL}/cart?canceled=1`,
    metadata: { orderId: order.id, userId: order.userId },
  });

  return NextResponse.json({ url: session.url }, { headers: corsHeaders });
}
