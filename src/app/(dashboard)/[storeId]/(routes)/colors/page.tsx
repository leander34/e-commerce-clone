import { prismadb } from '@/lib/prismadb'
import { ColorsClient } from './components/Client'
import { format } from 'date-fns'
import { ColorColumn } from './components/Columns'
interface ColorsPageProps {
  params: { storeId: string }
}
export default async function ColorsPage({
  params: { storeId },
}: ColorsPageProps) {
  const colors = await prismadb.color.findMany({
    where: {
      store_id: storeId,
    },
    orderBy: {
      created_at: 'desc',
    },
  })

  const formatedColors: ColorColumn[] = colors.map((color) => ({
    id: color.id,
    name: color.name,
    value: color.value,
    created_at: format(color.created_at, 'MMMM do, yyyy'),
  }))
  return (
    <div className="flex-col">
      <div className="flex-1 space-y-4 p-8 pt-6">
        <ColorsClient data={formatedColors} />
      </div>
    </div>
  )
}
