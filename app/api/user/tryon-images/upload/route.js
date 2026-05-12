import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import User from "@/models/User";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { v2 as cloudinary } from "cloudinary";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export async function POST(req) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const formData = await req.formData();

    const file = formData.get("file");

    if (!file) {
      return Response.json(
        {
          success: false,
          message: "File is required",
        },
        { status: 400 }
      );
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    const base64 = `data:${file.type};base64,${buffer.toString(
      "base64"
    )}`;

    const result = await cloudinary.uploader.upload(base64, {
      folder: `wearo/users/${session.user.id}/tryon-images`,
      public_id: `${session.user.id}-${file.name}`,
    });

    const updatedUser = await User.findOneAndUpdate(
      { email: session.user.email },
      { $push: { tryOnImages: result.secure_url } },
      { new: true }
    );

    console.log(result)

    return Response.json({
      success: true,
      imageUrl: result.secure_url,
    });
  } catch (error) {
    console.log(error);

    return Response.json(
      {
        success: false,
        message: error.message,
      },
      { status: 500 }
    );
  }
}

