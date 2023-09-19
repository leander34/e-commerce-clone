import { prismadb } from '@/lib/prismadb'
import { ProductForm } from './components/ProductForm'

interface ProductPageProps {
  params: { storeId: string; productId: string }
}

export default async function ProductPage({
  params: { storeId, productId },
}: ProductPageProps) {
  const product = await prismadb.product.findUnique({
    where: {
      id: productId,
    },
    include: {
      images: true,
    },
  })

  const categories = await prismadb.category.findMany({
    where: {
      store_id: storeId,
    },
  })

  const sizes = await prismadb.size.findMany({
    where: {
      store_id: storeId,
    },
  })

  const colors = await prismadb.color.findMany({
    where: {
      store_id: storeId,
    },
  })
  return (
    <div className="flex-col">
      <div className="flex-1 space-y-4 p-8 pt-6">
        <ProductForm
          categories={categories}
          colors={colors}
          sizes={sizes}
          initialData={product}
        />
      </div>
    </div>
  )
}
