import { prismadb } from '@/lib/prismadb'
import { BillboardClient } from './components/Client'
import { BillboardColumn } from './components/Columns'
import { format } from 'date-fns'
interface BillboardsPageProps {
  params: { storeId: string }
}
export default async function BillboardsPage({
  params: { storeId },
}: BillboardsPageProps) {
  const billboards = await prismadb.billboard.findMany({
    where: {
      store_id: storeId,
    },
    orderBy: {
      created_at: 'desc',
    },
  })

  const formatedBillboards: BillboardColumn[] = billboards.map((billboard) => ({
    id: billboard.id,
    label: billboard.label,
    created_at: format(billboard.created_at, 'MMMM do, yyyy'),
  }))
  return (
    <div className="flex-col">
      <div className="flex-1 space-y-4 p-8 pt-6">
        <BillboardClient data={formatedBillboards} />
      </div>
    </div>
  )
}
