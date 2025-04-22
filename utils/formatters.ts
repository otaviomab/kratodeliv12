export function formatEstablishmentResponse(establishment: any) {
  return {
    id: establishment.$id,
    name: establishment.name,
    slug: establishment.slug,
    description: establishment.description || "",
    logoUrl: establishment.logoUrl || "",
    coverImageUrl: establishment.coverImageUrl || "",
    type: establishment.type || "restaurant",
    address: establishment.address || {},
    businessHours: establishment.businessHours || [],
    deliverySettings: establishment.deliverySettings || {
      hasDelivery: false,
      minimumOrderValue: 0,
      deliveryFee: 0,
      estimatedDeliveryTime: 0,
      deliveryZones: []
    },
    paymentMethods: establishment.paymentMethods || [],
    phoneNumber: establishment.phoneNumber || "",
    whatsappNumber: establishment.whatsappNumber || "",
    isOpen: establishment.isOpen !== undefined ? establishment.isOpen : false,
    ownerId: establishment.ownerId,
    createdAt: establishment.$createdAt,
    updatedAt: establishment.$updatedAt
  };
} 