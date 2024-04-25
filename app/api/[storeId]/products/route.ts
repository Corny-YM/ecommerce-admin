import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs";
import prismadb from "@/lib/prismadb";

export async function POST(
  req: Request,
  { params }: { params: { storeId: string } }
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

    // User not login
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

    if (!params?.storeId)
      return new NextResponse("Store ID is required", { status: 400 });

    const storeByUserId = await prismadb.store.findFirst({
      where: {
        id: params.storeId,
        userId,
      },
    });

    // User login but don't have permission modified
    if (!storeByUserId)
      return new NextResponse("Unauthorized", { status: 403 });

    const product = await prismadb.product.create({
      data: {
        name,
        price,
        isArchived,
        isFeatured,
        storeId: params.storeId,
        productHasColors: {
          createMany: {
            data: [
              ...colorIds.map((colorId: number) => ({
                colorId,
              })),
            ],
          },
        },
        productHasSizes: {
          createMany: {
            data: [
              ...sizeIds.map((sizeId: number) => ({
                sizeId,
              })),
            ],
          },
        },
        categoryHasProducts: {
          createMany: {
            data: [
              ...categoryIds.map((categoryId: number) => ({
                categoryId,
              })),
            ],
          },
        },
        images: {
          createMany: {
            data: [...images.map((img: { url: string }) => img)],
          },
        },
      },
    });

    return NextResponse.json(product);
  } catch (err) {
    console.log("[PRODUCTS_POST]", err);
    return new NextResponse("Internal error", { status: 500 });
  }
}

export async function GET(
  req: Request,
  { params }: { params: { storeId: string } }
) {
  try {
    const { searchParams } = new URL(req.url);
    const categoryId = searchParams.get("categoryId") || undefined;
    const colorId = searchParams.get("colorId") || undefined;
    const sizeId = searchParams.get("sizeId") || undefined;
    const isFeatured = searchParams.get("isFeatured");

    if (!params?.storeId)
      return new NextResponse("Store ID is required", { status: 400 });

    const products = await prismadb.product.findMany({
      where: {
        storeId: params.storeId,
        categoryHasProducts: { some: { categoryId: categoryId } },
        productHasColors: { some: { colorId: colorId } },
        productHasSizes: { some: { sizeId: sizeId } },
        isFeatured: isFeatured ? true : undefined,
        isArchived: false,
      },
      include: {
        images: true,
        categoryHasProducts: true,
        productHasColors: true,
        productHasSizes: true,
        // categoryHasProducts: { select: { categoryId: true, productId: true } },
        // productHasColors: { select: { colorId: true, productId: true } },
        // productHasSizes: { select: { sizeId: true, productId: true } },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return NextResponse.json(products);
  } catch (err) {
    console.log("[PRODUCTS_GET]", err);
    return new NextResponse("Internal error", { status: 500 });
  }
}
