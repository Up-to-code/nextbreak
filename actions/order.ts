/* eslint-disable @typescript-eslint/no-explicit-any */
"use server";

import { prisma } from "@/lib/";
import { OrderStatus } from "@prisma/client";
import { revalidatePath } from "next/cache";

interface OrderItem {
  productId: string;
  quantity: number;
  priceAtPurchase: number;
}

interface CreateOrderParams {
  userId: string;
  items: OrderItem[];
  totalPrice: number;
  paymentMethod: string;
 
  pointsUsed: number;
  pointsEarned: number;
  discount: number;
  originalPrice: number;
}

export async function createOrder(orderData: CreateOrderParams) {
  try {
    // Validate required fields
    if (!orderData.userId || !orderData.items.length) {
      return {
        success: false,
        error: "Missing required fields",
        order: null,
      };
    }

    // Check if user exists
    const userExists = await prisma.user.findUnique({
      where: { id: orderData.userId },
    });

    if (!userExists) {
      return {
        success: false,
        error: "User not found",
        order: null,
      };
    }

    // Calculate points earned (5 point per 1 SAR spent)
    const pointsEarned = Math.floor(orderData.totalPrice * 5);

    // Create order in a transaction
    const newOrder = await prisma.$transaction(async (tx) => {
      // Create the order
      const order = await tx.order.create({
        data: {
          userId: orderData.userId,
          totalPrice: orderData.totalPrice,
          pointsEarned,
          status: OrderStatus.PENDING,
          paymentMethod: orderData.paymentMethod || "Cash on Delivery",
           items: {
            create: orderData.items.map((item) => ({
              productId: item.productId,
              quantity: item.quantity,
              priceAtPurchase: item.priceAtPurchase,
            })),
          },
        },
        include: { 
          items: true
        }
      });

      // Update product buyer counts
      await Promise.all(
        orderData.items.map((item) =>
          tx.product.update({
            where: { id: item.productId },
            data: { buyerCount: { increment: 1 } },
          })
        )
      );
      
      // Update user's total points (using atomic operation)
      await tx.user.update({
        where: { id: orderData.userId },
        data: { 
          points: {
            increment: pointsEarned
          }
        }
      });

      return order;
    });

    // Revalidate relevant paths
    revalidatePath("/orders");
    revalidatePath("/profile");
    revalidatePath("/dashboard");

    return {
      success: true,
      error: null,
      order: newOrder,
    };

  } catch (error: any) {
    console.error("Order creation failed:", error);
    return {
      success: false,
      error: error.message || "Internal server error",
      order: null,
    };
  }
}

export async function getOrderById(orderId: string) {
  try {
    return await prisma.order.findUnique({
      where: { id: orderId },
      include: {
        items: {
          include: {
            product: {
              select: {
                title: true,
                images: true
              }
            }
          }
        },
        user: {
          select: {
            name: true,
            email: true,
            phone: true
          }
        }
      }
    });
  } catch (error) {
    console.error("Failed to fetch order:", error);
    return null;
  }
}

export async function getOrdersByUserId(userId: string) {
  try {
    return await prisma.order.findMany({
      where: { userId },
      include: {
        items: {
          include: {
            product: {
              select: {
                title: true,
                images: true
              }
            }
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    });
  } catch (error) {
    console.error("Failed to fetch orders:", error);
    return [];
  }
}


export async function updateOrderStatus(orderId: string, status: OrderStatus) {
  try {
    const updatedOrder = await prisma.order.update({
      where: { id: orderId },
      data: { status }
    });

    revalidatePath(`/admin/orders/${orderId}`);
    revalidatePath('/admin/dashboard');

    return {
      success: true,
      order: updatedOrder,
      error: null
    };
  } catch (error: any) {
    console.error("Error updating order status:", error);
    return {
      success: false,
      order: null,
      error: error.message || "Failed to update order status"
    };
  }
}