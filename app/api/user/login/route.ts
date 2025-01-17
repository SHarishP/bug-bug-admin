import { validateLogin } from "@/lib/middleware";
import { db } from "@/lib/prisma";
import { NextResponse } from "next/server";
import { compare } from "bcrypt";
import { sign } from "jsonwebtoken";

// Method to Login
export async function POST(req: Request) {
  try {
    // Get email and password after login validation
    const { email, password } = await validateLogin(req);

    // Check if email exist on database and return error if doesn't
    const findUser = await db.user.findUnique({
      where: { email },
    });
    if (!findUser) throw new Error("Email doesn't exist!");

    // Compare password with salt and check if password is valid
    const isValid = await compare(password, findUser.password);
    if (!isValid) throw new Error("Invalid password");

    // Use JWT
    const payload = {
      email,
      id: findUser.id,
      name: findUser.name,
      avatar: findUser.avatar,
    };
    const userToken = sign(payload, process.env.SECRET_KEY as string, {
      expiresIn: "1hr",
    });

    const response = NextResponse.json({
      message: "Login successful",
      access_token: userToken,
    });
    // delete existing cookie if any
    response.cookies.delete("access_token");

    response.cookies.set("access_token", userToken, {
      path: "/",
    });

    return response;
  } catch (error: any) {
    const response = NextResponse.json(
      {
        message: error.message || "[LOGIN_POST]: An unexpected error occured",
      },
      { status: 400 }
    );
    // delete existing cookie if any
    response.cookies.delete("access_token");
    return response;
  }
}
