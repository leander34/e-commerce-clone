import { prismadb } from '@/lib/prismadb'
import { auth } from '@clerk/nextjs'
import { redirect } from 'next/navigation'
import { SettingsForm } from './components/SettingsForm'

interface SettingsPageProps {
  params: { storeId: string }
}

export default async function SettingsPage({
  params: { storeId },
}: SettingsPageProps) {
  const { userId } = auth()

  if (!userId) {
    redirect('/sing-in')
  }

  const store = await prismadb.store.findFirst({
    where: {
      id: storeId,
      user_id: userId,
    },
  })

  if (!store) {
    redirect('/')
  }

  return (
    <div className="flex-col">
      <div className="flex-1 space-y-4 p-8 pt-6">
        <SettingsForm initialData={store} />
      </div>
    </div>
  )
}
