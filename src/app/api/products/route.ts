import { NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import Product, { IProduct } from "@/model/Product";

export async function POST(req: Request) {
  try {
    await dbConnect();

    const body = await req.json();
    const { name, description, price, category, images, stock } = body;

    // Basic validation
    if (!name || !description || !price || !category || !stock) {
      return NextResponse.json(
        { message: "All required product fields (name, description, price, category, stock) are missing." },
        { status: 400 }
      );
    }

    // Ensure price and stock are numbers
    if (typeof price !== 'number' || typeof stock !== 'number') {
      return NextResponse.json(
        { message: "Price and stock must be numbers." },
        { status: 400 }
      );
    }

    // Create a new product instance
    const newProduct: IProduct = new Product({
      name,
      description,
      price,
      category,
      images: images || [], // Default to empty array if no images provided
      stock,
    });

    await newProduct.save();

    return NextResponse.json(
      {
        status: "success",
        message: "Product created successfully",
        product: newProduct,
      },
      { status: 201 }
    );
  } catch (error: any) {
    console.error("Error creating product:", error);

    // Handle Mongoose validation errors
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map((err: any) => err.message);
      return NextResponse.json(
        { message: messages.join(', ') },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { message: "Internal Server Error", error: error.message },
      { status: 500 }
    );
  }
}

export async function GET(req: Request) {
  try {
    await dbConnect();
    
    let name: string | null = null;
    try {
      const { searchParams } = new URL(req.url);
      name = searchParams.get('name');
    } catch (urlError: any) {
      console.error("Error parsing URL or searchParams in GET /api/products:", urlError);
      // Continue without search term if URL parsing fails
    }

    let query: any = {};
    if (name) {
      query.name = { $regex: name, $options: 'i' }; // Case-insensitive search
    }

    const products = await Product.find(query);
    return NextResponse.json({ products }, { status: 200 });
  } catch (error: any) {
    console.error("Error fetching products:", error);
    return NextResponse.json(
      { message: "Internal Server Error", error: error.message },
      { status: 500 }
    );
  }
}
