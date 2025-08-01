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
  shippingAddressId: string | null;
  createdAt: Date;
  updatedAt: Date;
  user: {
    id: string;
    name: string;
    email: string;
    phone: string;
    password: string;
    role: Role;
    emailVerified: Date | null;
    image: string | null;
    createdAt: Date;
    updatedAt: Date;
  };
  items: Array<{
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
  createdAt: Date;
  updatedAt: Date;
  orders: Array<{
    id: string;
    totalPrice: number;
    status: string;
    createdAt: Date;
  }>;
  addresses: Array<{
    id: string;
    city: string;
    state: string;
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
    };
  }>;
  recentUsers: Array<{
    id: string;
    name: string;
    email: string;
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
        },
        shippingAddress: true
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
      data: { status: status as OrderStatus },
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
      include: {
        orders: {
          select: {
            id: true,
            totalPrice: true,
            status: true,
            createdAt: true
          },
          orderBy: {
            createdAt: 'desc'
          }
        },
        addresses: {
          select: {
            id: true,
            city: true,
            state: true
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
      users,
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

export async function updateUserRole(userId: string, role: Role) {
  try {
    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: { role },
      include: {
        orders: {
          select: {
            id: true,
            totalPrice: true,
            status: true,
            createdAt: true
          }
        }
      }
    });

    revalidatePath('/admin/users');
    return updatedUser;
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
        price: parseFloat(data.price.toString()),
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
            email: true
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    });

    // Get recent user activity
    const recentUsers = await prisma.user.findMany({
      take: 5,
      include: {
        orders: {
          take: 1,
          orderBy: {
            createdAt: 'desc'
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