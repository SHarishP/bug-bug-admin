import { NextResponse } from "next/server";
import {
  CategorySchema,
  InsightSchema,
  LoginSchema,
  ProductSchema,
  RegisterSchema,
  TestimonialSchema,
} from "./schema";
import { verify } from "jsonwebtoken";

export async function validateRegister(req: Request) {
  try {
    const body = await req.json();

    // validate with yup
    await RegisterSchema.validate(body, { abortEarly: true });

    return body;
  } catch (error: any) {
    if (error.name === "ValidationError") {
      throw new Error(error.errors[0]);
    }

    throw new Error("An unexpected error occured during validation");
  }
}

export async function validateLogin(req: Request) {
  try {
    const body = await req.json();

    // validate with yup
    await LoginSchema.validate(body, { abortEarly: true });
    return body;
  } catch (error: any) {
    if (error.name === "ValidationError") {
      throw new Error(error.errors[0]);
    }
    throw new Error("An unexpected error occured during validation");
  }
}

export function verifyToken(req: Request) {
  try {
    // Get token from header authorization
    const userToken = req.headers.get("Authorization")?.replace("Bearer ", "");

    if (!userToken) throw new Error("No token provided");

    // Vereify Token using JWT secret
    const verifyToken = verify(userToken, process.env.SECRET_KEY as string);
    return verifyToken;
  } catch (error: any) {
    if (error.name === "JsonWebTokenError") throw new Error("Invalid token");

    return NextResponse.json(
      { message: `[VERIFY_TOKEN] : ${error.message}` },
      { status: 400 }
    );
  }
}

export async function validateProduct(req: Request) {
  try {
    const body = await req.json();

    // validate with yup
    await ProductSchema.validate(body, { abortEarly: true });
    return body;
  } catch (error: any) {
    if (error.name === "ValidationError") throw new Error(error.errors[0]);
    console.log(error);
    throw new Error("An unexpected error occured during validation");
  }
}

export async function validateCategory(req: Request) {
  try {
    const body = await req.json();
    // validate with yup
    await CategorySchema.validate(body, { abortEarly: true });

    return body;
  } catch (error: any) {
    if (error.name === "ValidationError") throw new Error(error.errors[0]);

    throw new Error("An unexpected error occured during validation");
  }
}

export async function validateInsight(req: Request) {
  try {
    const body = await req.json();
    // validate with yup
    await InsightSchema.validate(body, { abortEarly: true });

    return body;
  } catch (error: any) {
    if (error.name === "ValidationError") throw new Error(error.errors[0]);

    throw new Error("An unexpected error occured during validation");
  }
}

export async function validateTestimonial(req: Request) {
  try {
    const body = await req.json();
    // validate with yup
    await TestimonialSchema.validate(body, { abortEarly: true });
    return body;
  } catch (error: any) {
    if (error.name === "ValidationError") throw new Error(error.errors[0]);
    throw new Error("An unexpected error occured during valdiation");
  }
}
