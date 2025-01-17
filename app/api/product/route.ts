import { User } from "@/lib/custom";
import { validateProduct, verifyToken } from "@/lib/middleware";
import { db } from "@/lib/prisma";
import { NextResponse } from "next/server";

// Method to create product
export async function POST(req: Request) {
  try {
    // user verifyToken middleware
    const verifiedUser = verifyToken(req);
    // if verify error
    if (verifiedUser instanceof NextResponse) {
      return verifiedUser;
    }

    // Get the user
    const { id: userId } = verifiedUser as User;

    // Get product name and description after validation
    const { name, desc } = await validateProduct(req);

    // check if product already exist on DB
    const findProduct = await db.product.findFirst({
      where: { name },
    });
    if (findProduct) throw new Error("Product already exist");

    // input new product to database
    const newProduct = await db.product.create({
      data: {
        name,
        desc,
        userId,
      },
    });

    return NextResponse.json(
      {
        message: "Product created successfully",
        data: newProduct,
      },
      { status: 200 }
    );
  } catch (error: any) {
    return NextResponse.json(
      {
        message:
          error.message || "[PRODUCT_POST] : Unexpected Error has occured",
      },
      { status: 400 }
    );
  }
}

// API to get product by id
export async function GET(req: Request) {
  try {
    // Parse URL and take parameter from query
    const { searchParams } = new URL(req.url);
    // console.log(searchParams);
    const productId = searchParams.get("id");

    // if productId dosent exist on query
    if (!productId) {
      return NextResponse.json(
        {
          message: "Product ID is required",
        },
        { status: 400 }
      );
    }

    // Find the product in database
    const product = await db.product.findUnique({
      where: {
        id: productId,
      },
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

    // return error if product not found
    if (!product) {
      return NextResponse.json(
        {
          message: "Product not found",
        },
        { status: 400 }
      );
    }

    const response = NextResponse.json(
      {
        message: "Product found",
        data: product,
      },
      { status: 200 }
    );
    return response;
  } catch (error: any) {
    return NextResponse.json({
      message: error.message || "[PRODUCT_GET]: An error occured",
    });
  }
}

// API to edit product by Id
export async function PATCH(req: Request) {
  try {
    // user verifyToken
    const verifiedUser = verifyToken(req);
    if (verifiedUser instanceof NextResponse) {
      return verifiedUser;
    }

    // Get the user
    const { id: userId } = verifiedUser as User;

    if (!userId) {
      throw new Error("Unauthorized!");
    }

    // Parse URL and take productId from query
    const { searchParams } = new URL(req.url);
    const productId = searchParams.get("id");

    // Get product name and description after validation
    const { name, desc } = await validateProduct(req);

    // if productId doesn't exist on query
    if (!productId) {
      return NextResponse.json(
        { message: "Product ID is required" },
        { status: 400 }
      );
    }

    // find the product from Id
    const product = await db.product.findUnique({
      where: {
        id: productId,
      },
    });

    // return error if product not found
    if (!product) {
      return NextResponse.json(
        {
          message: "Product not found",
        },
        { status: 400 }
      );
    }

    //   update product name and description
    const updatedProduct = await db.product.update({
      where: { id: productId },
      data: { name, desc },
    });

    const response = NextResponse.json(
      {
        message: "Product updated successfully",
        data: updatedProduct,
      },
      { status: 200 }
    );
    return response;
  } catch (error: any) {
    return NextResponse.json(
      {
        message:
          error.message || "[PRODUCT_PATCH] : Unexpected Error has occured",
      },
      { status: 400 }
    );
  }
}

// API To delete product by Id
export async function DELETE(req: Request) {
  try {
    // verify user token
    const verifiedUser = verifyToken(req);
    if (verifiedUser instanceof NextResponse) {
      return verifiedUser;
    }

    // Parse URL and take productId from query
    const { searchParams } = new URL(req.url);
    const productId = searchParams.get("id");

    // if productId doesn't exist on query
    if (!productId) {
      return NextResponse.json(
        { message: "Product ID is required" },
        { status: 400 }
      );
    }

    // find the product from Id
    const product = await db.product.findUnique({
      where: {
        id: productId,
      },
    });
    // return error if product not found
    if (!product) {
      return NextResponse.json(
        {
          message: "Product not found",
        },
        { status: 400 }
      );
    }

    //   delete product from database
    const deletedProduct = await db.product.delete({
      where: { id: productId },
    });
    return NextResponse.json(
      {
        message: "Product deleted successfully",
        data: deletedProduct,
      },
      { status: 200 }
    );
  } catch (error: any) {
    return NextResponse.json(
      {
        message:
          error.message || "[PRODUCT_DELETE] : Unexpected Error has occured",
      },
      { status: 400 }
    );
  }
}
