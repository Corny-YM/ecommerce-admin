import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs";
import prismadb from "@/lib/prismadb";

export async function GET(
  req: Request,
  { params }: { params: { storeId: string; categoryId: string } }
) {
  try {
    if (!params.categoryId)
      return new NextResponse("Category ID is required", { status: 400 });

    const categories = await prismadb.category.findUnique({
      where: {
        id: params.categoryId,
      },
      include: {
        billboard: true,
      },
    });

    return NextResponse.json(categories);
  } catch (err) {
    console.log("[CATEGORY_GET]", err);
    return new NextResponse("Internal error", { status: 500 });
  }
}

export async function PATCH(
  req: Request,
  { params }: { params: { storeId: string; categoryId: string } }
) {
  try {
    const { userId } = auth();
    const body = await req.json();
    const { name, billboardId } = body;

    if (!userId) return new NextResponse("Unauthenticated", { status: 401 });

    if (!name) return new NextResponse("Name is required", { status: 400 });

    if (!billboardId)
      return new NextResponse("Billboard ID is required", { status: 400 });

    if (!params.categoryId)
      return new NextResponse("Category ID is required", { status: 400 });

    const storeByUserId = await prismadb.store.findFirst({
      where: {
        id: params.storeId,
        userId,
      },
    });

    // User login but don't have permission modified
    if (!storeByUserId)
      return new NextResponse("Unauthorized", { status: 403 });

    const category = await prismadb.category.updateMany({
      where: {
        id: params.categoryId,
      },
      data: { name, billboardId },
    });

    return NextResponse.json(category);
  } catch (err) {
    console.log("[CATEGORY_PATCH]", err);
    return new NextResponse("Internal error", { status: 500 });
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: { storeId: string; categoryId: string } }
) {
  try {
    const { userId } = auth();

    if (!userId) return new NextResponse("Unauthenticated", { status: 401 });

    if (!params.categoryId)
      return new NextResponse("Category ID is required", { status: 400 });

    const storeByUserId = await prismadb.store.findFirst({
      where: {
        id: params.storeId,
        userId,
      },
    });

    // User login but don't have permission modified
    if (!storeByUserId)
      return new NextResponse("Unauthorized", { status: 403 });

    const categories = await prismadb.category.deleteMany({
      where: {
        id: params.categoryId,
      },
    });

    return NextResponse.json(categories);
  } catch (err) {
    console.log("[CATEGORY_DELETE]", err);
    return new NextResponse("Internal error", { status: 500 });
  }
}
