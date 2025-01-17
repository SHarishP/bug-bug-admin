import { db } from "@/lib/prisma";
import { NextResponse } from "next/server";

// API to get all testimonials
export async function GET(req: Request) {
  try {
    const testimonials = await db.testimonial.findMany({
      select: {
        id: true,
        customer: true,
        position: true,
        comment: true,
        user: {
          select: {
            name: true,
          },
        },
      },
    });
    // return error if no insights found
    if (testimonials.length === 0) {
      throw new Error("No testimonials found");
    }

    return NextResponse.json(
      {
        message: "Insights retrieved successfully",
        testimonials: testimonials,
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
        message: "[TESTIMOIALS_GET] : Unexpected Error has occured",
      },
      { status: 500 }
    );
  }
}
