import { User } from "@/lib/custom";
import { validateInsight, verifyToken } from "@/lib/middleware";
import { db } from "@/lib/prisma";
import { NextResponse } from "next/server";

// API to create Insight
export async function POST(req: Request) {
  try {
    // verify user
    const verifiedUser = verifyToken(req);
    if (verifiedUser instanceof NextResponse) {
      return verifiedUser;
    }

    // Catch the user
    const { id: userId } = verifiedUser as User;

    // Catch insight title and category after validation
    const { name, category } = await validateInsight(req);

    // Check if Insight name already exist on db
    const findInsight = await db.insight.findFirst({
      where: { name },
    });
    if (findInsight) throw new Error("Insight already exist");

    // Check if category exist on db
    const findCategory = await db.category.findFirst({
      where: { name: category },
    });

    if (!findCategory) {
      // Get all categories
      const categories = await db.category.findMany({
        select: { name: true },
      });
      const allCategories = categories.map((item) => item.name).join(", ");
      throw new Error(
        `Category ${category} not found. Available categories: ${allCategories}`
      );
    }

    // Input new Insight to db
    const newInsight = await db.insight.create({
      data: {
        name,
        userId,
        categoryId: findCategory.id,
      },
    });
    return NextResponse.json(
      {
        message: "Insight created successfully",
        data: newInsight,
      },
      { status: 200 }
    );
  } catch (error: any) {
    return NextResponse.json(
      { message: error.message || "[INSIGHT_POST: Unexpected error occured]" },
      { status: 400 }
    );
  }
}

// API to get Insight by Id
export async function GET(req: Request) {
  try {
    // Parse URL and take aprameter from query
    const { searchParams } = new URL(req.url);
    const insightId = searchParams.get("id");

    // if no id is provided
    if (!insightId) {
      return NextResponse.json(
        {
          message: "Insight ID is required",
        },
        { status: 400 }
      );
    }

    // Find insight in db
    const insight = await db.insight.findUnique({
      where: { id: insightId },
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
        images: {
          select: {
            url: true,
          },
        },
      },
    });

    // return error if insight not found
    if (!insight) throw new Error("Insight not found");

    const response = NextResponse.json(
      {
        message: "Insight found",
        data: insight,
      },
      { status: 200 }
    );
    return response;
  } catch (error: any) {
    if (error.message !== null) {
      return NextResponse.json(
        {
          message: error.message,
        },
        { status: 400 }
      );
    }
    return NextResponse.json(
      {
        message: "[INSIGHT_GET: Unexpected error occured]",
      },
      { status: 500 }
    );
  }
}

// API to delete Insight by ID
export async function DELETE(req: Request) {
  try {
    // verify user token
    const verifiedUser = verifyToken(req);
    if (verifiedUser instanceof NextResponse) {
      return verifiedUser;
    }

    // Parse URL and take insightId from query
    const { searchParams } = new URL(req.url);
    const insightId = searchParams.get("id");

    // if insightId doesn't exist on query
    if (!insightId) throw new Error("Insight ID required");

    // Check if insightId exist on DB
    const insight = await db.insight.findUnique({
      where: { id: insightId },
    });
    if (!insight) throw new Error("Insight not found");

    // delete insight from database
    const deletedInsight = await db.insight.delete({
      where: { id: insightId },
    });

    return NextResponse.json(
      {
        message: "Insight deleted successfully",
        data: deletedInsight,
      },
      { status: 200 }
    );
  } catch (error: any) {
    if (error.message !== null) {
      return NextResponse.json(
        {
          message: error.message,
        },
        { status: 400 }
      );
    }
    return NextResponse.json(
      {
        message: "[INSIGHT_DELETE] : Unexpected Error has occured",
      },
      { status: 500 }
    );
  }
}

// API to update Insight by ID
export async function PATCH(req: Request) {
  try {
    const verifiedUser = verifyToken(req);
    if (verifiedUser instanceof NextResponse) {
      return verifiedUser;
    }

    // Parse URL and take the insightId from query
    const { searchParams } = new URL(req.url);
    const insightId = searchParams.get("id");
    if (!insightId) throw new Error("Insight ID is required");

    // Catch input after valdiation
    const { name, category } = await validateInsight(req);

    // Find the insight by ID
    const insight = await db.insight.findUnique({
      where: { id: insightId },
    });
    if (!insight) throw new Error("Insight not found");

    // Check if category exist on db
    const findCategory = await db.category.findFirst({
      where: { name: category },
    });

    if (!findCategory) {
      // Get all categories
      const categories = await db.category.findMany({
        select: { name: true },
      });
      const allCategories = categories.map((item) => item.name).join(", ");
      throw new Error(
        `Category ${category} not found. Available categories: ${allCategories}`
      );
    }

    // update insight
    const updatedInsight = await db.insight.update({
      where: { id: insightId },
      data: {
        name: name,
        categoryId: findCategory.id,
      },
    });

    return NextResponse.json(
      {
        message: "Insight updated successfully",
        data: updatedInsight,
      },
      { status: 200 }
    );
  } catch (error: any) {
    if (error.message !== null) {
      return NextResponse.json(
        {
          message: error.message,
        },
        { status: 400 }
      );
    }
    return NextResponse.json(
      {
        message: "[INSIGHT_UPDATE] : Unexpected Error has occured",
      },
      { status: 500 }
    );
  }
}
