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
  shippingMethod: string;
  shippingAddressId: string; // Now required
}

export async function createOrder(orderData: CreateOrderParams) {
  try {
    if (!orderData.userId || !orderData.items.length || !orderData.shippingAddressId) {
      return {
        success: false,
        error: "Missing required fields",
        order: null,
      };
    }

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

    // Verify address exists
    const addressExists = await prisma.address.findUnique({
      where: { id: orderData.shippingAddressId },
    });
    
    if (!addressExists) {
      return {
        success: false,
        error: "Shipping address not found",
        order: null,
      };
    }

    const pointsEarned = Math.floor(orderData.totalPrice / 10);

    const newOrder = await prisma.$transaction(async (tx) => {
      // Create the order
      const order = await tx.order.create({
        data: {
          userId: orderData.userId,
          totalPrice: orderData.totalPrice,
          pointsEarned,
          status: OrderStatus.PENDING,
          paymentMethod: orderData.paymentMethod,
          shippingMethod: orderData.shippingMethod,
          shippingAddressId: orderData.shippingAddressId,
          items: {
            create: orderData.items.map((item) => ({
              productId: item.productId,
              quantity: item.quantity,
              priceAtPurchase: item.priceAtPurchase,
            })),
          },
        },
        include: { items: true }
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

      return order;
    });

    revalidatePath("/orders");
    revalidatePath("/profile");

    return {
      success: true,
      error: null,
      order: newOrder,
    };

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
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
          shippingAddress: true
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