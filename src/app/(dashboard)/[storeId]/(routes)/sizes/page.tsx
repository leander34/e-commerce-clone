import { prismadb } from '@/lib/prismadb'
import { SizesClient } from './components/Client'
import { format } from 'date-fns'
import { SizeColumn } from './components/Columns'
interface SizesPageProps {
  params: { storeId: string }
}
export default async function SizesPage({
  params: { storeId },
}: SizesPageProps) {
  const sizes = await prismadb.size.findMany({
    where: {
      store_id: storeId,
    },
    orderBy: {
      created_at: 'desc',
    },
  })

  const formatedSizes: SizeColumn[] = sizes.map((size) => ({
    id: size.id,
    name: size.name,
    value: size.value,
    created_at: format(size.created_at, 'MMMM do, yyyy'),
  }))
  return (
    <div className="flex-col">
      <div className="flex-1 space-y-4 p-8 pt-6">
        <SizesClient data={formatedSizes} />
      </div>
    </div>
  )
}
