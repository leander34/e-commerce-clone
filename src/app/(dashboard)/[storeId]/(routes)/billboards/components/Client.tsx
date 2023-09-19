'use client'

import { Heading } from '@/components/ui/Heading'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import { Plus } from 'lucide-react'
import { useParams, useRouter } from 'next/navigation'
import { FC } from 'react'
import { BillboardColumn, columns } from './Columns'
import { DataTable } from '@/components/ui/DataTable'
import { ApiList } from '@/components/ui/ApiList'
interface BillboardClientProps {
  data: BillboardColumn[]
}
export const BillboardClient: FC<BillboardClientProps> = ({ data }) => {
  const router = useRouter()
  const params = useParams()
  return (
    <>
      <div className="flex items-center justify-between">
        <Heading
          title={`BIllboards (${data.length})`}
          description="Manage billboards for your store"
        />

        <Button
          onClick={() => router.push(`/${params.storeId}/billboards/new`)}
        >
          <Plus className="mr-2 h-4 w-4" />
          Add new
        </Button>
      </div>
      <Separator />
      <DataTable columns={columns} data={data} searchKey="label" />
      <Heading title="API" description="API calls for billboards" />
      <Separator />
      <ApiList entityName="billboards" entityIdName="billboardsId" />
    </>
  )
}
