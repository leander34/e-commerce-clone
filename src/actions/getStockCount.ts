import { prismadb } from '@/lib/prismadb'

export const getStockCount = async (storeId: string) => {
  const stockCount = await prismadb.product.count({
    where: {
      store_id: storeId,
      isArchived: false,
    },
  })

  return stockCount
}
