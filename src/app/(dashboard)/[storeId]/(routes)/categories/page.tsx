import { prismadb } from '@/lib/prismadb'
import { format } from 'date-fns'
import { CategoryColumn } from './components/Columns'
import { CategoryClient } from './components/Client'
interface CategoriesPageProps {
  params: { storeId: string }
}
export default async function CategoriesPage({
  params: { storeId },
}: CategoriesPageProps) {
  const categories = await prismadb.category.findMany({
    where: {
      store_id: storeId,
    },
    include: {
      billboard: true,
    },
    orderBy: {
      created_at: 'desc',
    },
  })

  const formatedCategories: CategoryColumn[] = categories.map((category) => ({
    id: category.id,
    name: category.name,
    billboardLabel: category.billboard.label,
    created_at: format(category.created_at, 'MMMM do, yyyy'),
  }))
  return (
    <div className="flex-col">
      <div className="flex-1 space-y-4 p-8 pt-6">
        <CategoryClient data={formatedCategories} />
      </div>
    </div>
  )
}
