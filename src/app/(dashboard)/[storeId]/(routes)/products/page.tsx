import { prismadb } from '@/lib/prismadb'
import { ProductClient } from './components/Client'
import { ProductColumn } from './components/Columns'
import { format } from 'date-fns'
import { formatter } from '@/lib/utils'
interface ProductsPageProps {
  params: { storeId: string }
}
export default async function ProductsPage({
  params: { storeId },
}: ProductsPageProps) {
  const products = await prismadb.product.findMany({
    where: {
      store_id: storeId,
    },
    include: {
      category: true,
      size: true,
      color: true,
    },
    orderBy: {
      created_at: 'desc',
    },
  })

  const formatedProducts: ProductColumn[] = products.map((product) => ({
    id: product.id,
    name: product.name,
    price: formatter.format(product.price.toNumber()),
    isFeatured: product.isFeatured,
    isArchived: product.isArchived,
    category: product.category.name,
    size: product.size.name,
    color: product.color.value,
    created_at: format(product.created_at, 'MMMM do, yyyy'),
  }))
  return (
    <div className="flex-col">
      <div className="flex-1 space-y-4 p-8 pt-6">
        <ProductClient data={formatedProducts} />
      </div>
    </div>
  )
}
