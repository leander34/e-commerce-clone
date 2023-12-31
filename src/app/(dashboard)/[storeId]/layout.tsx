import { auth } from '@clerk/nextjs'
import { ReactNode } from 'react'
import { redirect } from 'next/navigation'
import { prismadb } from '@/lib/prismadb'
import { Navbar } from '@/components/Navbar'

interface DashboardLayoutProps {
  children: ReactNode
  params: { storeId: string }
}

export default async function DashboardLayout({
  children,
  params,
}: DashboardLayoutProps) {
  const { userId } = auth()

  if (!userId) {
    redirect('/sign-in')
  }

  const store = await prismadb.store.findFirst({
    where: {
      id: params.storeId,
      user_id: userId,
    },
  })

  if (!store) {
    redirect('/')
  }

  return (
    <>
      <Navbar />
      {children}
    </>
  )
}
