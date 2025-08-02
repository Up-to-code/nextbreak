"use server";
import { prisma } from "@/lib/";

export async function createAddress(addressData: {
  userId: string;
  street: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
  isDefault?: boolean;
}) {
  try {
    const newAddress = await prisma.address.create({
      data: {
        userId: addressData.userId,
        street: addressData.street,
        city: addressData.city,
        state: addressData.state,
        postalCode: addressData.postalCode,
        country: addressData.country,
        isDefault: addressData.isDefault || false,
      },
    });

    return {
      success: true,
      address: newAddress,
      error: null,
    };
  } catch (error) {
    console.error("Address creation failed:", error);
    return {
      success: false,
      address: null,
      error: "Internal server error",
    };
  }
}
export async function deleteAddress(addressId: string) {
  try {
    await prisma.address.delete({
      where: { id: addressId },
    });
    return { success: true };
  } catch (error) {
    console.error("Failed to delete address:", error);
    return { success: false, error: "Failed to delete address" };
  }
}

export async function getUserAddresses(userId: string) {
  try {
    return await prisma.address.findMany({
      where: { userId },
      orderBy: {
        isDefault: "desc",
      },
    });
  } catch (error) {
    console.error("Failed to fetch addresses:", error);
    return [];
  }
}
