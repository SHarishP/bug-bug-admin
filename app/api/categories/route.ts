import { db } from "@/lib/prisma";
import { NextResponse } from "next/server";

// API to get all categories
export async function GET(req: Request) {
  try {
    const categories = await db.category.findMany({
      select: {
        id: true,
        name: true,
        user: {
          select: {
            name: true,
          },
        },
      },
    });

    // return error if no categories found
    if (categories.length === 0) {
      return NextResponse.json(
        {
          message: "No categories found",
        },
        { status: 400 }
      );
    }

    const response = NextResponse.json(
      {
        message: "Categories retrieved successfully",
        categories: categories,
      },
      { status: 200 }
    );
    return response;
  } catch (error: any) {
    return NextResponse.json(
      {
        message:
          error.message || "[CATEGORIES_GET] : Unexpected Error has occured",
      },
      { status: 400 }
    );
  }
}
