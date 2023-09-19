import { prismadb } from '@/lib/prismadb'

export const getSalesCount = async (storeId: string) => {
  const salesCount = await prismadb.order.count({
    where: {
      store_id: storeId,
      is_paid: true,
    },
  })

  return salesCount
}
