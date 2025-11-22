import { NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import Product, { IProduct } from "@/model/Product";

export async function DELETE(req: Request, { params }: { params: { id: string } }) {
  try {
    await dbConnect();
    const { id } = params;

    const deletedProduct = await Product.findByIdAndDelete(id);

    if (!deletedProduct) {
      return NextResponse.json({ message: "Product not found." }, { status: 404 });
    }

    return NextResponse.json({ message: "Product deleted successfully." }, { status: 200 });
  } catch (error: any) {
    console.error("Error deleting product:", error);
    return NextResponse.json(
      { message: "Internal Server Error", error: error.message },
      { status: 500 }
    );
  }
}

export async function GET(req: Request, { params }: { params: { id: string } }) {
  try {
    await dbConnect();
    const { id } = params;

    const product = await Product.findById(id);

    if (!product) {
      return NextResponse.json({ message: "Product not found." }, { status: 404 });
    }

    return NextResponse.json({ product }, { status: 200 });
  } catch (error: any) {
    console.error("Error fetching single product:", error);
    return NextResponse.json(
      { message: "Internal Server Error", error: error.message },
      { status: 500 }
    );
  }
}

export async function PUT(req: Request, { params }: { params: { id: string } }) {
  try {
    await dbConnect();
    const { id } = params;
    const body = await req.json();

    const updatedProduct = await Product.findByIdAndUpdate(id, body, { new: true, runValidators: true });

    if (!updatedProduct) {
      return NextResponse.json({ message: "Product not found." }, { status: 404 });
    }

    return NextResponse.json(
      {
        status: "success",
        message: "Product updated successfully",
        product: updatedProduct,
      },
      { status: 200 }
    );
  } catch (error: any) {
    console.error("Error updating product:", error);

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
