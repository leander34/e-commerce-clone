import { prismadb } from '@/lib/prismadb'
import { auth } from '@clerk/nextjs'
import { NextResponse } from 'next/server'
// import { type NextRequest } from 'next/server'
import { z } from 'zod'
export async function POST(request: Request) {
  try {
    const { userId } = auth()
    const body = await request.json()

    if (!userId) {
      return new NextResponse('Unautheticated', { status: 401 })
    }

    const createStoreSchema = z.object({
      name: z.string().min(1),
    })

    const data = createStoreSchema.safeParse(body)

    if (data.success === false) {
      return new NextResponse('Name is required', { status: 400 })
    }

    const { name } = data.data

    const store = await prismadb.store.create({
      data: {
        name,
        user_id: userId,
      },
    })

    return NextResponse.json(store)
  } catch (error) {
    console.log('[STORES_POST]', error)
    return new NextResponse('Internal error', { status: 500 })
  }
}
