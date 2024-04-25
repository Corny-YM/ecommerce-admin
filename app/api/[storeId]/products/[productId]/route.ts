import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs";
import prismadb from "@/lib/prismadb";

export async function GET(
  req: Request,
  { params }: { params: { storeId: string; productId: string } }
) {
  try {
    if (!params.productId)
      return new NextResponse("Product ID is required", { status: 400 });

    const products = await prismadb.product.findUnique({
      where: {
        id: params.productId,
      },
      include: {
        images: true,
        categoryHasProducts: { include: { category: true } },
        productHasColors: { include: { color: true } },
        productHasSizes: { include: { size: true } },
      },
    });

    return NextResponse.json(products);
  } catch (err) {
    console.log("[PRODUCT_GET]", err);
    return new NextResponse("Internal error", { status: 500 });
  }
}

export async function PATCH(
  req: Request,
  { params }: { params: { storeId: string; productId: string } }
) {
  try {
    const { userId } = auth();
    const body = await req.json();
    const {
      name,
      price,
      categoryIds,
      colorIds,
      sizeIds,
      images,
      isFeatured,
      isArchived,
    } = body;

    if (!userId) return new NextResponse("Unauthenticated", { status: 401 });

    // Check body data
    if (!name) return new NextResponse("Name is required", { status: 400 });
    if (!price) return new NextResponse("Price is required", { status: 400 });
    if (!colorIds || !colorIds?.length)
      return new NextResponse("Colors ID required", { status: 400 });
    if (!sizeIds || !sizeIds?.length)
      return new NextResponse("Sizes ID required", { status: 400 });
    if (!categoryIds || !categoryIds?.length)
      return new NextResponse("Categories ID is required", { status: 400 });
    if (!images || !images?.length)
      return new NextResponse("Images is required", { status: 400 });

    if (!params.productId)
      return new NextResponse("Product ID is required", { status: 400 });

    const storeByUserId = await prismadb.store.findFirst({
      where: {
        id: params.storeId,
        userId,
      },
    });

    // User login but don't have permission modified
    if (!storeByUserId)
      return new NextResponse("Unauthorized", { status: 403 });

    await prismadb.product.update({
      where: {
        id: params.productId,
      },
      data: {
        name,
        price,
        isArchived,
        isFeatured,
        productHasSizes: { deleteMany: {} },
        productHasColors: { deleteMany: {} },
        categoryHasProducts: { deleteMany: {} },
        images: { deleteMany: {} },
      },
    });

    const product = await prismadb.product.update({
      where: {
        id: params.productId,
      },
      data: {
        images: {
          createMany: {
            data: [...images.map((img: { url: string }) => img)],
          },
        },
      },
    });

    await prismadb.productHasColor.createMany({
      data: [
        ...colorIds.map((colorId: number) => ({
          colorId,
          productId: params.productId,
        })),
      ],
    });
    await prismadb.productHasSize.createMany({
      data: [
        ...sizeIds.map((sizeId: number) => ({
          sizeId,
          productId: params.productId,
        })),
      ],
    });
    await prismadb.categoryHasProduct.createMany({
      data: [
        ...categoryIds.map((categoryId: number) => ({
          categoryId,
          productId: params.productId,
        })),
      ],
    });

    return NextResponse.json(product);
  } catch (err) {
    console.log("[PRODUCT_PATCH]", err);
    return new NextResponse("Internal error", { status: 500 });
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: { storeId: string; productId: string } }
) {
  try {
    const { userId } = auth();

    if (!userId) return new NextResponse("Unauthenticated", { status: 401 });

    if (!params.productId)
      return new NextResponse("Product ID is required", { status: 400 });

    const storeByUserId = await prismadb.store.findFirst({
      where: {
        id: params.storeId,
        userId,
      },
    });

    // User login but don't have permission modified
    if (!storeByUserId)
      return new NextResponse("Unauthorized", { status: 403 });

    const products = await prismadb.product.deleteMany({
      where: {
        id: params.productId,
      },
    });

    return NextResponse.json(products);
  } catch (err) {
    console.log("[PRODUCT_DELETE]", err);
    return new NextResponse("Internal error", { status: 500 });
  }
}
