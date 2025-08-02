/* eslint-disable @typescript-eslint/no-explicit-any */
"use server";

import { prisma } from "@/lib";
import { auth } from "@/lib/auth";
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
// app/actions/product.ts

interface GetProductsParams {
  search?: string;
  sort?: string;
  minPrice?: number;
  maxPrice?: number;
}

export async function getProducts(params: GetProductsParams = {}) {
  try {
    const { search, sort, minPrice, maxPrice } = params;

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const where: any = {};
    
    if (search) {
      where.title = {
        contains: search,
        mode: 'insensitive',
      };
    }

    if (minPrice !== undefined || maxPrice !== undefined) {
      where.price = {};
      if (minPrice !== undefined) where.price.gte = minPrice;
      if (maxPrice !== undefined) where.price.lte = maxPrice;
    }

    const orderBy: any = {};
    if (sort) {
      switch (sort) {
        case 'price-asc':
          orderBy.price = 'asc';
          break;
        case 'price-desc':
          orderBy.price = 'desc';
          break;
        case 'popular':
          orderBy.buyerCount = 'desc';
          break;
        case 'newest':
          orderBy.createdAt = 'desc';
          break;
      }
    } else {
      orderBy.createdAt = 'desc';
    }

    const products = await prisma.product.findMany({
      where,
      orderBy,
      include: {
        comments: true,
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

// Define the Comment type
interface Comment {
  id?: string;
  content: string;
  userId: string;
  productId: string;
}


export async function addComment(data: Comment) {
  try {
    // Get the current session to verify user
    const session = await auth(); 
    
    if (!session?.user?.id) {
      return { error: "You must be logged in to add a comment" };
    }

    const comment = await prisma.comment.create({
      data: {
        content: data.content,
        userId: session.user.id, // Use session user ID for security
        productId: data.productId,
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    });

    revalidatePath(`/products/${data.productId}`);
    return { success: true, comment };
  } catch (error) {
    console.error("Error adding comment:", error);
    return { error: "Failed to add comment" };
  }
}

export async function deleteComment(id: string, productId: string) {
  try {
    // Get the current session to verify user ownership
    const session = await auth();
    
    if (!session?.user?.id) {
      return { error: "You must be logged in to delete a comment" };
    }

    // Check if the comment belongs to the current user
    const existingComment = await prisma.comment.findUnique({
      where: { id },
      select: { userId: true },
    });

    if (!existingComment) {
      return { error: "Comment not found" };
    }

    if (existingComment.userId !== session.user.id) {
      return { error: "You can only delete your own comments" };
    }

    await prisma.comment.delete({
      where: { id },
    });

    revalidatePath(`/products/${productId}`);
    return { success: true };
  } catch (error) {
    console.error("Error deleting comment:", error);
    return { error: "Failed to delete comment" };
  }
}

export async function updateComment(data: Comment) {
  try {
    // Get the current session to verify user ownership
    const session = await auth();
    
    if (!session?.user?.id) {
      return { error: "You must be logged in to update a comment" };
    }

    if (!data.id) {
      return { error: "Comment ID is required" };
    }

    // Check if the comment belongs to the current user
    const existingComment = await prisma.comment.findUnique({
      where: { id: data.id },
      select: { userId: true, productId: true },
    });

    if (!existingComment) {
      return { error: "Comment not found" };
    }

    if (existingComment.userId !== session.user.id) {
      return { error: "You can only update your own comments" };
    }

    const { id, ...updateData } = data;

    // Remove undefined values
    const cleanData = Object.fromEntries(
      Object.entries(updateData).filter(([_, value]) => value !== undefined)
    );

    const comment = await prisma.comment.update({
      where: { id },
      data: cleanData,
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    });

    revalidatePath(`/products/${existingComment.productId}`);
    return { success: true, comment };
  } catch (error) {
    console.error("Error updating comment:", error);
    return { error: "Failed to update comment" };
  }
}

export async function getComments(productId: string) {
  try {
    const comments = await prisma.comment.findMany({
      where: { productId },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    return { success: true, comments };
  } catch (error) {
    console.error("Error fetching comments:", error);
    return { error: "Failed to fetch comments" };
  }
}