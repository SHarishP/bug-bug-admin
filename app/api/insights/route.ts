import { db } from "@/lib/prisma";
import { NextResponse } from "next/server";

// API to get all insights
export async function GET(req: Request) {
  try {
    const insights = await db.insight.findMany({
      select: {
        id: true,
        name: true,
        category: {
          select: {
            name: true,
          },
        },
        user: {
          select: {
            name: true,
          },
        },
        createdAt: true,
        updatedAt: true,
      },
    });

    // return error if no insights found
    if (insights.length === 0) {
      return NextResponse.json(
        {
          message: "No insights found",
        },
        { status: 400 }
      );
    }

    const response = NextResponse.json(
      {
        message: "Insights retrieved successfully",
        insights: insights,
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
