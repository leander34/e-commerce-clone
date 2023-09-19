import { prismadb } from '@/lib/prismadb'
import { SizeForm } from './components/SizeForm'

interface SizePageProps {
  params: { sizeId: string }
}

export default async function SizePage({ params: { sizeId } }: SizePageProps) {
  const size = await prismadb.size.findUnique({
    where: {
      id: sizeId,
    },
  })
  return (
    <div className="flex-col">
      <div className="flex-1 space-y-4 p-8 pt-6">
        <SizeForm initialData={size} />
      </div>
    </div>
  )
}
