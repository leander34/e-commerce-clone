import { UserButton, auth } from '@clerk/nextjs'
import { FC } from 'react'
import { MainNav } from './MainNav'
import { StoreSwitcher } from './StoreSwitcher'
import { redirect } from 'next/navigation'
import { prismadb } from '@/lib/prismadb'
import { ThemeToggle } from './ThemeToggle'

export const Navbar = async () => {
  const { userId } = auth()

  if (!userId) {
    redirect('/sign-in')
  }

  const stores = await prismadb.store.findMany({
    where: {
      user_id: userId,
    },
  })
  return (
    <div className="border-b">
      <div className="flex items-center h-16 px-4">
        <StoreSwitcher items={stores} />
        <MainNav className="mx-6" />
        <div className="ml-auto flex items-center space-x-4">
          <ThemeToggle />
          <UserButton afterSignOutUrl="/" />
        </div>
      </div>
    </div>
  )
}
