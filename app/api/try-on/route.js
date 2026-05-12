import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import User from "@/models/User";

export async function POST(req) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await connectDB();
    const user = await User.findOne({ email: session.user.email });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Rate limit check for non-admin users
    if (user.role !== "admin") {
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      const lastDate = user.lastTryOnDate ? new Date(user.lastTryOnDate) : null;
      if (lastDate) lastDate.setHours(0, 0, 0, 0);

      if (!lastDate || lastDate.getTime() < today.getTime()) {
        // Reset count for a new day
        user.dailyTryOnCount = 0;
        user.lastTryOnDate = new Date();
      }

      if (user.dailyTryOnCount >= 5) {
        return NextResponse.json(
          { error: "Daily limit of 5 images reached. Please try again tomorrow." },
          { status: 429 }
        );
      }
    }

    const { userImage, productImage, garment_des } = await req.json();
    //   {
    // "human_img": "https://prod-img.thesouledstore.com/public/theSoul/uploads/catalog/product/1778165449_4769385.jpg",
    // "garm_img": "https://prod-img.thesouledstore.com/public/theSoul/uploads/catalog/product/1777538628_1811963.jpg",
    // "garment_des": "Oversized Polos"
    // }

    if (!userImage || !productImage) {
      return NextResponse.json(
        { error: "User image and product image are required" },
        { status: 400 }
      );
    }

    // Mocking the try-on process
    console.log("Virtual Try-On requested:", {
      user: session.user.email,
      userImage,
      productImage,
      garment_des
    });

    const response = await fetch(`${process.env.SERVICE_URL}/api/tryon`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        human_img: userImage,
        garm_img: productImage,
        garment_des: garment_des,
      }),
    });

    const result = await response.json();
    console.log(result);

    // Increment count after successful generation
    if (user.role !== "admin") {
      user.dailyTryOnCount += 1;
      user.lastTryOnDate = new Date();
      await user.save();
    }

    return NextResponse.json({
      success: true,
      message: "Virtual try-on processing started",
      resultUrl: result.imageUrl,
    });
  } catch (error) {
    console.error("Try-on error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}