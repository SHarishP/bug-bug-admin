import { db } from "@/lib/prisma";
import { NextResponse } from "next/server";

// Method to get all users
export async function GET(req: Request) {
  try {
    const users = await db.user.findMany();
    return NextResponse.json(
      {
        message: "Users retrieved successfully",
        data: users,
      },
      { status: 200 }
    );
  } catch (error: any) {
    return NextResponse.json(
      {
        message:
          error.message ||
          "[USERS_GET]: An error occurred while retrieving users",
      },
      { status: 400 }
    );
  }
}
