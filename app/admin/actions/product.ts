"use server";

import { prisma } from "@/lib";
 import { revalidatePath } from "next/cache";
 
// Types
interface CreateProductData {
  title: string;
  description: string;
  price: number;
  images: string[];
}

interface UpdateProductData extends Partial<CreateProductData> {
  id: string;
}

// Create a new product
export async function createProduct(data: CreateProductData) {
  try {
    // Validate required fields
    if (!data.title.trim()) {
      return { error: "Title is required" };
    }
    
    if (!data.price || data.price <= 0) {
      return { error: "Valid price is required" };
    }

    // Create product in database
    const product = await prisma.product.create({
      data: {
        title: data.title.trim(),
        description: data.description.trim(),
        price: data.price,
        images: data.images,
      },
    });

    // Revalidate relevant pages
    revalidatePath("/admin/products");
    revalidatePath("/products");

    return { success: true, product };
  } catch (error) {
    console.error("Error creating product:", error);
    return { error: "Failed to create product" };
  }
}

// Get all products
export async function getProducts() {
  try {
    const products = await prisma.product.findMany({
      orderBy: {
        createdAt: "desc",
      },
      include: {
        _count: {
          select: {
            comments: true,
            orderItems: true,
          },
        },
      },
    });

    return products;
  } catch (error) {
    console.error("Error fetching products:", error);
    return [];
  }
}

// Get single product by ID
export async function getProductById(id: string) {
  try {
    const product = await prisma.product.findUnique({
      where: { id },
      include: {
        comments: {
          orderBy: {
            createdAt: "desc",
          },
        },
        _count: {
          select: {
            comments: true,
            orderItems: true,
          },
        },
      },
    });

    return product;
  } catch (error) {
    console.error("Error fetching product:", error);
    return null;
  }
}

// Update product
export async function updateProduct(data: UpdateProductData) {
  try {
    const { id, ...updateData } = data;

    // Remove undefined values
    const cleanData = Object.fromEntries(
      Object.entries(updateData).filter(([_, value]) => value !== undefined)
    );

    const product = await prisma.product.update({
      where: { id },
      data: cleanData,
    });

    revalidatePath("/admin/products");
    revalidatePath("/products");
    revalidatePath(`/products/${id}`);

    return { success: true, product };
  } catch (error) {
    console.error("Error updating product:", error);
    return { error: "Failed to update product" };
  }
}

// Delete product
export async function deleteProduct(id: string) {
  try {
    await prisma.product.delete({
      where: { id },
    });

    revalidatePath("/admin/products");
    revalidatePath("/products");

    return { success: true };
  } catch (error) {
    console.error("Error deleting product:", error);
    return { error: "Failed to delete product" };
  }
}

// Increment buyer count
export async function incrementBuyerCount(id: string) {
  try {
    const product = await prisma.product.update({
      where: { id },
      data: {
        buyerCount: {
          increment: 1,
        },
      },
    });

    revalidatePath(`/products/${id}`);
    return { success: true, product };
  } catch (error) {
    console.error("Error incrementing buyer count:", error);
    return { error: "Failed to update buyer count" };
  }
}