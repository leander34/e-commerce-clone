import { prismadb } from '@/lib/prismadb'
import { CategoryForm } from './components/CategoryForm'

interface CategoryPageProps {
  params: { storeId: string; categoryId: string }
}

export default async function CategoryPage({
  params: { storeId, categoryId },
}: CategoryPageProps) {
  const category = await prismadb.category.findUnique({
    where: {
      id: categoryId,
    },
  })

  const billboards = await prismadb.billboard.findMany({
    where: {
      store_id: storeId,
    },
  })
  return (
    <div className="flex-col">
      <div className="flex-1 space-y-4 p-8 pt-6">
        <CategoryForm initialData={category} billboards={billboards} />
      </div>
    </div>
  )
}
