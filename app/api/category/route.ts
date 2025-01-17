import { User } from "@/lib/custom";
import { validateCategory, verifyToken } from "@/lib/middleware";
import { db } from "@/lib/prisma";
import { NextResponse } from "next/server";

// API to create Category
export async function POST(req: Request) {
  try {
    // verify user
    const verifiedUser = verifyToken(req);
    if (verifiedUser instanceof NextResponse) {
      return verifiedUser;
    }

    // Get the user
    const { id: userId } = verifiedUser as User;

    // Get category name after validation
    const { name } = await validateCategory(req);

    // check if category already exist on DB
    const findCategory = await db.category.findFirst({
      where: { name },
    });
    if (findCategory) throw new Error("Category already exist");

    // input new category to database
    const newCategory = await db.category.create({
      data: {
        name,
        userId,
      },
    });

    return NextResponse.json(
      {
        message: "Category creaetd successfully",
        data: newCategory,
      },
      { status: 200 }
    );
  } catch (error: any) {
    return NextResponse.json(
      {
        message:
          error.message || "[CATEGORY_POST] : Unexpected Error has occured",
      },
      { status: 400 }
    );
  }
}

// API to delete category by id
export async function DELETE(req: Request) {
  try {
    // verify user token
    const verifiedUser = verifyToken(req);
    if (verifiedUser instanceof NextResponse) {
      return verifiedUser;
    }

    // Parse URL and take productId from query
    const { searchParams } = new URL(req.url);
    const categoryId = searchParams.get("id");

    // if categoryId doesn't exist on query
    if (!categoryId) {
      return NextResponse.json(
        { message: "Category ID is required" },
        { status: 400 }
      );
    }

    //   delete product from database
    const deletedCategory = await db.category.delete({
      where: { id: categoryId },
    });
    return NextResponse.json(
      {
        message: "Product deleted successfully",
        data: deletedCategory,
      },
      { status: 200 }
    );
  } catch (error: any) {
    return NextResponse.json(
      {
        message:
          error.message || "[CATEGORY_DELETE] : Unexpected Error has occured",
      },
      { status: 400 }
    );
  }
}
