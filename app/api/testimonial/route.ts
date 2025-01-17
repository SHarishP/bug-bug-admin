import { User } from "@/lib/custom";
import { validateTestimonial, verifyToken } from "@/lib/middleware";
import { db } from "@/lib/prisma";
import { NextResponse } from "next/server";

// API to create testimonial
export async function POST(req: Request) {
  try {
    // verify user
    const verifiedUser = verifyToken(req);
    if (verifiedUser instanceof NextResponse) {
      return verifiedUser;
    }

    // catch the user
    const { id: userId } = verifiedUser as User;

    // Catch testimonial after validation
    const { customer, position, comment } = await validateTestimonial(req);

    // Check if customer already exist on db
    const findTestimonial = await db.testimonial.findFirst({
      where: { customer },
    });
    if (findTestimonial) throw new Error("Customer already exist");

    // Add new testimonial to db
    const newTestimonial = await db.testimonial.create({
      data: {
        customer,
        position,
        comment,
        userId,
      },
    });
    return NextResponse.json(
      {
        message: "Testimonial created successfully",
        data: newTestimonial,
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
        message: "[TESTIMOIAL_POST] : Unexpected Error has occured",
      },
      { status: 500 }
    );
  }
}

// API to delete testimonial by ID
export async function DELETE(req: Request) {
  try {
    // verify user token
    const verifiedUser = verifyToken(req);
    if (verifiedUser instanceof NextResponse) {
      return verifiedUser;
    }

    // Parse URL and take insightId from query
    const { searchParams } = new URL(req.url);
    const testimonialId = searchParams.get("id");

    // if insightId doesn't exist on query
    if (!testimonialId) throw new Error("Testimonial ID required");

    // Check if testimonialId exist on DB
    const testimonial = await db.testimonial.findFirst({
      where: { id: testimonialId },
    });
    if (!testimonial) throw new Error("Testimonial not found!");

    // Delete testimonial from DB
    const deletedTestimonial = await db.testimonial.delete({
      where: { id: testimonialId },
    });
    return NextResponse.json(
      {
        message: "Testimonial deleted successfully",
        data: deletedTestimonial,
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
        message: "[TESTIMOIAL_DELETE] : Unexpected Error has occured",
      },
      { status: 500 }
    );
  }
}

// API to path testimonial by ID
export async function PATCH(req: Request) {
  try {
    // verify user token
    const verifiedUser = verifyToken(req);
    if (verifiedUser instanceof NextResponse) {
      return verifiedUser;
    }

    // catch the user
    const { id: userId } = verifiedUser as User;

    // Parse URL and take insightId from query
    const { searchParams } = new URL(req.url);
    const testimonialId = searchParams.get("id");

    // if insightId doesn't exist on query
    if (!testimonialId) throw new Error("Testimonial ID required");

    // Check if testimonialId exist on DB
    const testimonial = await db.testimonial.findFirst({
      where: { id: testimonialId },
    });
    if (!testimonial) throw new Error("Testimonial not found!");

    // Catch input after validation
    const { customer, position, comment } = await validateTestimonial(req);

    // PATCH new testimonial to db
    const updatedTestimonial = await db.testimonial.update({
      where: { id: testimonialId },
      data: {
        customer,
        position,
        comment,
        userId,
      },
    });
    return NextResponse.json(
      {
        message: "Testimonial updated successfully",
        data: updatedTestimonial,
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
        message: "[TESTIMONIAL_PATCH] : Unexpected Error has occured",
      },
      { status: 500 }
    );
  }
}
