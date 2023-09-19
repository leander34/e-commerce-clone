import { prismadb } from '@/lib/prismadb'

export const getTotalRevenue = async (storeId: string) => {
  const paidOrders = await prismadb.order.findMany({
    where: {
      store_id: storeId,
      is_paid: true,
    },
    include: {
      orderItems: {
        include: {
          product: true,
        },
      },
    },
  })

  const totalRevenue = paidOrders.reduce((sum, order) => {
    const orderTotal = order.orderItems.reduce((orderSum, item) => {
      return orderSum + item.product.price.toNumber()
    }, 0)
    return sum + orderTotal
  }, 0)

  return totalRevenue
}
