import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs";
import prismadb from "@/lib/prismadb";

export async function GET(
  req: Request,
  { params }: { params: { storeId: string; billboardId: string } }
) {
  try {
    if (!params.billboardId)
      return new NextResponse("Billboard ID is required", { status: 400 });

    const billboards = await prismadb.billboard.findUnique({
      where: {
        id: params.billboardId,
      },
    });

    return NextResponse.json(billboards);
  } catch (err) {
    console.log("[BILLBOARD_GET]", err);
    return new NextResponse("Internal error", { status: 500 });
  }
}

export async function PATCH(
  req: Request,
  { params }: { params: { storeId: string; billboardId: string } }
) {
  try {
    const { userId } = auth();
    const body = await req.json();
    const { label, imageUrl } = body;

    if (!userId) return new NextResponse("Unauthenticated", { status: 401 });

    if (!label) return new NextResponse("Label is required", { status: 400 });

    if (!imageUrl)
      return new NextResponse("Image url is required", { status: 400 });

    if (!params.billboardId)
      return new NextResponse("Billboard ID is required", { status: 400 });

    const storeByUserId = await prismadb.store.findFirst({
      where: {
        id: params.storeId,
        userId,
      },
    });

    // User login but don't have permission modified
    if (!storeByUserId)
      return new NextResponse("Unauthorized", { status: 403 });

    const billboard = await prismadb.billboard.updateMany({
      where: {
        id: params.billboardId,
      },
      data: { label, imageUrl },
    });

    return NextResponse.json(billboard);
  } catch (err) {
    console.log("[BILLBOARD_PATCH]", err);
    return new NextResponse("Internal error", { status: 500 });
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: { storeId: string; billboardId: string } }
) {
  try {
    const { userId } = auth();

    if (!userId) return new NextResponse("Unauthenticated", { status: 401 });

    if (!params.billboardId)
      return new NextResponse("Billboard ID is required", { status: 400 });

    const storeByUserId = await prismadb.store.findFirst({
      where: {
        id: params.storeId,
        userId,
      },
    });

    // User login but don't have permission modified
    if (!storeByUserId)
      return new NextResponse("Unauthorized", { status: 403 });

    const billboards = await prismadb.billboard.deleteMany({
      where: {
        id: params.billboardId,
      },
    });

    return NextResponse.json(billboards);
  } catch (err) {
    console.log("[BILLBOARD_DELETE]", err);
    return new NextResponse("Internal error", { status: 500 });
  }
}
