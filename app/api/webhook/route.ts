import Stripe from "stripe";

import { headers } from "next/headers";
import { NextResponse } from "next/server";

import { stripe } from "@/lib/stripe";
import prismadb from "@/lib/prismadb";

export async function POST(req: Request) {
  const body = await req.text();
  const signature = headers().get("Stripe-Signature") as string;

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!
    );
  } catch (e: any) {
    return new NextResponse(`Webhook Errors: ${e?.message}`, { status: 400 });
  }

  const session = event.data.object as Stripe.Checkout.Session;
  const address = session?.customer_details?.address;

  const addressComponents = [
    address?.line1,
    address?.line2,
    address?.city,
    address?.state,
    address?.postal_code,
    address?.country,
  ];

  const addressString = addressComponents.filter((c) => c !== null).join(", ");

  if (event.type === "checkout.session.completed") {
    const order = await prismadb.order.update({
      where: {
        id: session?.metadata?.orderId,
      },
      data: {
        isPaid: true,
        address: addressString,
        phone: session?.customer_details?.phone || "",
      },
      include: {
        orderItems: true,
      },
    });

    const objProducts: Record<string, number> = {};
    const storeIds: string[] = [];
    const colorIds: string[] = [];
    const sizeIds: string[] = [];
    order.orderItems.forEach((orderItem) => {
      const { productId, storeId, colorId, sizeId, quantity } = orderItem;
      const tmpQuantity = objProducts[productId] || 0;
      objProducts[productId] = tmpQuantity + quantity;
      storeIds.push(storeId);
      colorIds.push(colorId);
      sizeIds.push(sizeId);
    });

    const productIds = Object.keys(objProducts);

    // Remove all cart items when buy successfully
    await prismadb.cart.deleteMany({
      where: {
        productId: { in: productIds },
        storeId: { in: storeIds },
        colorId: { in: colorIds },
        sizeId: { in: sizeIds },
      },
    });

    // Update quantity & isArchived to products
    await updateQuantities(productIds, objProducts);
  }

  return new NextResponse(null, { status: 200 });
}

async function updateQuantities(
  ids: string[],
  objProducts: Record<string, number>
) {
  let productsToUpdate = await prismadb.product.findMany({
    where: {
      AND: [
        { id: { in: ids } },
        { quantity: { gt: 0 } }, // Only fetch products with quantity > 0
      ],
    },
  });

  // Update quantities in a transaction
  const updateOperations = productsToUpdate.map((product) => {
    const quantity = objProducts?.[product.id] || 0;
    return prismadb.product.update({
      where: { id: product.id },
      data: { quantity: product.quantity - quantity },
    });
  });

  await prismadb.product.updateMany({
    where: { id: { in: ids }, quantity: 0 },
    data: { isArchived: true },
  });

  try {
    await prismadb.$transaction(updateOperations);
    console.log("Quantities updated successfully.");
  } catch (error) {
    console.error("Error updating quantities:", error);
  } finally {
    await prismadb.$disconnect();
  }
}
