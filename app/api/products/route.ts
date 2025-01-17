import { db } from "@/lib/prisma";
import { NextResponse } from "next/server";

// Method to get all products
export async function GET(req: Request) {
  try {
    const products = await db.product.findMany({
      select: {
        id: true,
        name: true,
        desc: true,
        user: {
          select: {
            name: true,
          },
        },
      },
    });

    // return error if no product found
    if (products.length === 0) {
      return NextResponse.json(
        {
          message: "No product found",
        },
        { status: 400 }
      );
    }

    const response = NextResponse.json(
      {
        message: "Products retrieved successfully",
        products: products,
      },
      { status: 200 }
    );
    return response;
  } catch (error: any) {
    return NextResponse.json(
      {
        message:
          error.message || "[PRODUCTS_GET] : Unexpected Error has occured",
      },
      { status: 400 }
    );
  }
}
