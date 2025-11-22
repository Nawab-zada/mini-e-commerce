import mongoose, { Schema, Document } from 'mongoose';

// Interface to define the structure of a Product document
export interface IProduct extends Document {
  name: string;
  description: string;
  price: number;
  category: string;
  images: string[];
  stock: number;
  createdAt: Date;
  updatedAt: Date;
}

// Product Schema
const ProductSchema: Schema = new Schema(
  {
    name: {
      type: String,
      required: [true, 'Product name is required'],
      trim: true,
      maxlength: [100, 'Product name cannot be more than 100 characters'],
    },
    description: {
      type: String,
      required: [true, 'Product description is required'],
      maxlength: [1000, 'Product description cannot be more than 1000 characters'],
    },
    price: {
      type: Number,
      required: [true, 'Product price is required'],
      default: 0,
    },
    category: {
      type: String,
      required: [true, 'Product category is required'],
    },
    images: [
      {
        type: String,
      },
    ],
    stock: {
      type: Number,
      required: [true, 'Product stock is required'],
      default: 0,
      min: [0, 'Stock cannot be negative'],
    },
  },
  { timestamps: true } // Adds createdAt and updatedAt fields automatically
);

// Check if the model already exists before defining it
const Product = mongoose.models.Product || mongoose.model<IProduct>('Product', ProductSchema);

export default Product;
