import { db } from "@/lib/prisma";
import { NextResponse } from "next/server";
import { genSalt, hash } from "bcrypt";
import { validateRegister } from "@/lib/middleware";

// Metho to create new User
export async function POST(req: Request) {
  try {
    // get email from request body
    const { name, email, password } = await validateRegister(req);

    // check if email already exist
    const findEmail = await db.user.findUnique({
      where: {
        email,
      },
    });
    if (findEmail) throw new Error("Email already exist");

    // Convert plain password to hash
    const salt = await genSalt(10);
    const hashPassword = await hash(password, salt);

    // input new user data to database
    const newUser = await db.user.create({
      data: {
        name,
        email,
        password: hashPassword,
      },
    });

    const response = NextResponse.json(
      {
        message: "User created successfully",
        data: newUser,
      },
      { status: 200 }
    );
    response.cookies.delete("access_token");
    return response;
  } catch (error: any) {
    const response = NextResponse.json(
      {
        message: error.message || "[NEWUSER_POST]: An unexpected error occured",
      },
      { status: 400 }
    );
    response.cookies.delete("access_token");
    return response;
  }
}
