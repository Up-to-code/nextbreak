/* eslint-disable @typescript-eslint/no-explicit-any */
'use server';

import { prisma } from '@/lib/';
import { revalidatePath } from 'next/cache';
import { OrderStatus, Role } from '@prisma/client';

// Types for server actions
export interface OrderWithUser {
  id: string;
  userId: string;
  totalPrice: number;
  pointsEarned: number;
  status: OrderStatus;
  paymentMethod: string;
  shippingMethod: string;
  createdAt: Date;
  updatedAt: Date;
  user: {
    id: string;
    name: string;
    email: string;
    phone: string;
    password: string;
    points: number;
    role: Role;
    emailVerified: Date | null;
    image: string | null;
    createdAt: Date;
    updatedAt: Date;
  };
  items: Array<{
    [x: string]: any;
    id: string;
    title: string;
    price: number;
    images: string[];
  }>;
}

export interface UserWithOrders {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: Role;
  points: number;
  grade: string; // Added missing grade field
  createdAt: Date;
  updatedAt: Date;
  orders: Array<{
    id: string;
    totalPrice: number;
    pointsEarned: number;
    status: string;
    createdAt: Date;
  }>;
}

export interface ProductWithStats {
  id: string;
  title: string;
  images: string[];
  price: number;
  description: string;
  buyerCount: number;
  createdAt: Date;
  updatedAt: Date;
  comments: Array<{
    id: string;
    content: string;
    user: {
      name: string;
      email: string;
    };
  }>;
  orderItems: Array<{
    id: string;
    quantity: number;
    order: {
      status: string;
    };
  }>;
}

export interface DashboardStats {
  totalRevenue: number;
  totalCustomers: number;
  totalOrders: number;
  conversionRate: string;
  ordersByStatus: Record<string, number>;
  recentOrders: Array<{
    id: string;
    totalPrice: number;
    status: string;
    createdAt: Date;
    user: {
      name: string;
      email: string;
      grade: string;
    };
  }>;
  recentUsers: Array<{
    id: string;
    name: string;
    email: string;
    grade: string;
    createdAt: Date;
    orders: Array<{
      id: string;
      totalPrice: number;
      status: string;
      createdAt: Date;
    }>;
  }>;
}

// Orders Actions
export async function getOrders(params: {
  page?: number;
  limit?: number;
  status?: string;
  search?: string;
}) {
  try {
    const { page = 1, limit = 10, status, search } = params;
    const skip = (page - 1) * limit;

    const where: {
      status?: OrderStatus;
      OR?: Array<{
        id?: { contains: string; mode: 'insensitive' };
        user?: { 
          name?: { contains: string; mode: 'insensitive' }; 
          email?: { contains: string; mode: 'insensitive' } 
        };
      }>;
    } = {};
    
    if (status && status !== 'all') {
      where.status = status as OrderStatus;
    }
    
    if (search) {
      where.OR = [
        { id: { contains: search, mode: 'insensitive' } },
        { user: { name: { contains: search, mode: 'insensitive' } } },
        { user: { email: { contains: search, mode: 'insensitive' } } }
      ];
    }

    const orders = await prisma.order.findMany({
      where,
      include: {
        user: true,
        items: {
          include: {
            product: true
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      },
      skip,
      take: limit
    });

    const transformedOrders = orders.map(order => ({
      ...order,
      items: order.items.map(item => item.product)
    }));

    const total = await prisma.order.count({ where });

    return {
      orders: transformedOrders,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    };
  } catch (error) {
    console.error('Error fetching orders:', error);
    throw new Error('Failed to fetch orders');
  }
}

export async function updateOrderStatus(orderId: string, status: string) {
  try {
    const updatedOrder = await prisma.order.update({
      where: { id: orderId },
      data: { status: status as OrderStatus }, // Explicit type conversion
      include: {
        user: true,
        items: {
          include: {
            product: true
          }
        }
      }
    });

    const transformedOrder = {
      ...updatedOrder,
      items: updatedOrder.items.map(item => item.product)
    };

    revalidatePath('/admin/orders');
    return transformedOrder;
  } catch (error) {
    console.error('Error updating order:', error);
    throw new Error('Failed to update order status');
  }
}

// Users Actions
export async function getUsers(params: {
  page?: number;
  limit?: number;
  role?: string;
  search?: string;
}) {
  try {
    const { page = 1, limit = 10, role, search } = params;
    const skip = (page - 1) * limit;

    const where: {
      role?: Role;
      OR?: Array<{
        name?: { contains: string; mode: 'insensitive' };
        email?: { contains: string; mode: 'insensitive' };
        phone?: { contains: string; mode: 'insensitive' };
      }>;
    } = {};
    
    if (role && role !== 'all') {
      where.role = role as Role;
    }
    
    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { email: { contains: search, mode: 'insensitive' } },
        { phone: { contains: search, mode: 'insensitive' } }
      ];
    }

    const users = await prisma.user.findMany({
      where,
      select: {
        id: true,
        name: true,
        email: true,
        phone: true,
        role: true,
        points: true,
        grade: true,
        createdAt: true,
        updatedAt: true,
        orders: {
          select: {
            id: true,
            totalPrice: true,
            pointsEarned: true,
            status: true,
            createdAt: true
          },
          orderBy: {
            createdAt: 'desc'
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      },
      skip,
      take: limit
    });

    const total = await prisma.user.count({ where });

    return {
      users: users as UserWithOrders[],
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    };
  } catch (error) {
    console.error('Error fetching users:', error);
    throw new Error('Failed to fetch users');
  }
}
 export async function getUserData(userId: string) {
  try {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        name: true,
        email: true,
        phone: true,
        role: true,
        points: true,
        grade: true,
        createdAt: true,
        updatedAt: true,
        orders: {
          select: {
            id: true,
            totalPrice: true,
            pointsEarned: true,
            status: true,
            createdAt: true
          }
        }
      },
  
    });

    return user;
  } catch (error) {
    console.error('Error fetching user:', error);
    throw new Error('Failed to fetch user');
  }
}
export async function updateUserRole(userId: string, role: Role) {
  try {
    await prisma.user.update({
      where: { id: userId },
      data: { role }
    });

    revalidatePath('/admin/users');
    return { success: true };
  } catch (error) {
    console.error('Error updating user:', error);
    throw new Error('Failed to update user role');
  }
}

// Products Actions
export async function getProducts(params: {
  page?: number;
  limit?: number;
  search?: string;
}) {
  try {
    const { page = 1, limit = 10, search } = params;
    const skip = (page - 1) * limit;

    const where: {
      OR?: Array<{
        title?: { contains: string; mode: 'insensitive' };
        description?: { contains: string; mode: 'insensitive' };
      }>;
    } = {};
    
    if (search) {
      where.OR = [
        { title: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } }
      ];
    }

    const products = await prisma.product.findMany({
      where,
      include: {
        comments: {
          include: {
            user: {
              select: {
                name: true,
                email: true
              }
            }
          }
        },
        orderItems: {
          include: {
            order: {
              select: {
                status: true
              }
            }
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      },
      skip,
      take: limit
    });

    const total = await prisma.product.count({ where });

    return {
      products,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    };
  } catch (error) {
    console.error('Error fetching products:', error);
    throw new Error('Failed to fetch products');
  }
}

export async function createProduct(data: {
  title: string;
  description: string;
  price: number;
  images?: string[];
}) {
  try {
    const product = await prisma.product.create({
      data: {
        title: data.title,
        description: data.description,
        price: data.price, // Removed unnecessary parseFloat
        images: data.images || []
      }
    });

    revalidatePath('/admin/products');
    return product;
  } catch (error) {
    console.error('Error creating product:', error);
    throw new Error('Failed to create product');
  }
}

export async function updateProduct(productId: string, data: Partial<{
  title: string;
  description: string;
  price: number;
  images: string[];
}>) {
  try {
    const product = await prisma.product.update({
      where: { id: productId },
      data
    });

    revalidatePath('/admin/products');
    return product;
  } catch (error) {
    console.error('Error updating product:', error);
    throw new Error('Failed to update product');
  }
}

export async function deleteProduct(productId: string) {
  try {
    await prisma.product.delete({
      where: { id: productId }
    });

    revalidatePath('/admin/products');
    return { success: true };
  } catch (error) {
    console.error('Error deleting product:', error);
    throw new Error('Failed to delete product');
  }
}

// Stats Actions
export async function getDashboardStats(): Promise<DashboardStats> {
  try {
    // Get total revenue
    const totalRevenue = await prisma.order.aggregate({
      where: {
        status: 'COMPLETED'
      },
      _sum: {
        totalPrice: true
      }
    });

    // Get total customers
    const totalCustomers = await prisma.user.count({
      where: {
        role: 'USER'
      }
    });

    // Get total orders
    const totalOrders = await prisma.order.count();

    // Get orders by status
    const ordersByStatus = await prisma.order.groupBy({
      by: ['status'],
      _count: {
        status: true
      }
    });

    // Get recent orders
    const recentOrders = await prisma.order.findMany({
      take: 5,
      include: {
        user: {
          select: {
            name: true,
            email: true,
            grade: true
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    });

    // Get recent user activity - FIXED FIELD SELECTION
    const recentUsers = await prisma.user.findMany({
      take: 5,
      select: {
        id: true,
        name: true,
        email: true,
        grade: true,
        createdAt: true,
        orders: {
          take: 1,
          orderBy: {
            createdAt: 'desc'
          },
          select: {
            id: true,
            totalPrice: true,
            status: true,
            createdAt: true
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    });

    // Calculate conversion rate (orders / users)
    const conversionRate = totalCustomers > 0 ? (totalOrders / totalCustomers * 100).toFixed(1) : '0';

    return {
      totalRevenue: totalRevenue._sum.totalPrice || 0,
      totalCustomers,
      totalOrders,
      conversionRate: `${conversionRate}%`,
      ordersByStatus: ordersByStatus.reduce((acc, item) => {
        acc[item.status.toLowerCase()] = item._count.status;
        return acc;
      }, {} as Record<string, number>),
      recentOrders,
      recentUsers
    };
  } catch (error) {
    console.error('Error fetching stats:', error);
    throw new Error('Failed to fetch dashboard stats');
  }
}

// Order creation with points system
export interface CreateOrderParams {
  userId: string;
  items: Array<{
    productId: string;
    quantity: number;
    priceAtPurchase: number;
  }>;
  totalPrice: number;
  paymentMethod: string;
}

export async function createOrder(orderData: CreateOrderParams & {
  discount: number;
  pointsUsed: number;
}) {
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
    const user = await prisma.user.findUnique({
      where: { id: orderData.userId },
    });

    if (!user) {
      return {
        success: false,
        error: "User not found",
        order: null,
      };
    }

    // Calculate final price after discount
    const finalTotal = orderData.totalPrice - orderData.discount;
    
    // Calculate points earned based on FINAL amount paid
    const pointsEarned = Math.floor(finalTotal / 5);

    // Create order in a transaction
    const newOrder = await prisma.$transaction(async (tx) => {
      // Create the order
      const order = await tx.order.create({
        data: {
          userId: orderData.userId,
          totalPrice: finalTotal, // Store final price after discount
          originalPrice: orderData.totalPrice, // Store original price
          discount: orderData.discount,
          pointsUsed: orderData.pointsUsed,
          pointsEarned,
          status: OrderStatus.PENDING,
          paymentMethod: orderData.paymentMethod,
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
      
      // Update user's points: 
      // - Subtract points used for discount
      // - Add points earned from purchase
      await tx.user.update({
        where: { id: orderData.userId },
        data: { 
          points: {
            decrement: orderData.pointsUsed,
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

// Add to your existing actions
export async function updateUserPoints(userId: string, points: number) {
  try {
    await prisma.user.update({
      where: { id: userId },
      data: { points }
    });
    
    revalidatePath('/admin/users');
    return { success: true };
  } catch (error) {
    console.error('Error updating user points:', error);
    throw new Error('Failed to update user points');
  }
}