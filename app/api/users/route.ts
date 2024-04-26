import { NextResponse } from "next/server";

import prismadb from "@/lib/prismadb";
import { User } from "@prisma/client";

export async function GET(req: Request) {
  try {
    const users = await prismadb.user.findMany({});

    return NextResponse.json(users);
  } catch (err) {
    console.log("[USERS_GET]", err);
    return new NextResponse("Internal error", { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { user }: { user: User } = body;

    if (!user || !user.email) {
      return new NextResponse("User email is required", { status: 400 });
    }

    const {
      id,
      email,
      imageUrl,
      fullName,
      firstName,
      createdAt,
      updatedAt,
      lastSignInAt,
    } = user;

    const data = await prismadb.user.upsert({
      where: { email: user.email },
      // Update the user if it exists
      update: { firstName, fullName, lastSignInAt, updatedAt },
      // Create a new user if it doesn't exist
      create: user,
    });

    return NextResponse.json(data);
  } catch (err) {
    console.log("[USERS_POST]", err);
    return new NextResponse("Internal error", { status: 500 });
  }
}
