import { prismadb } from '@/lib/prismadb'
import { auth } from '@clerk/nextjs'
import { NextResponse } from 'next/server'
import { z } from 'zod'
export async function PATCH(
  req: Request,
  { params }: { params: { storeId: string } },
) {
  const { storeId } = params
  try {
    const { userId } = auth()
    const body = await req.json()

    if (!userId) {
      return new NextResponse('Unautheticated', { status: 401 })
    }

    if (!storeId) {
      return new NextResponse('Store ID is required', { status: 400 })
    }

    const updateStoreSchema = z.object({
      name: z.string().min(1),
    })

    const data = updateStoreSchema.safeParse(body)

    if (data.success === false) {
      return new NextResponse('Name is required', { status: 400 })
    }

    const { name } = data.data

    const store = await prismadb.store.update({
      where: {
        id: storeId,
        user_id: userId,
      },
      data: {
        name,
      },
    })

    return NextResponse.json(store)
  } catch (error) {
    console.log('[STORES_PATCH]', error)
    return new NextResponse('Internal error', { status: 500 })
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: { storeId: string } },
) {
  const { storeId } = params
  try {
    const { userId } = auth()

    if (!userId) {
      return new NextResponse('Unauthorized', { status: 401 })
    }

    if (!storeId) {
      return new NextResponse('Store ID is required', { status: 400 })
    }

    const store = await prismadb.store.delete({
      where: {
        id: storeId,
        user_id: userId,
      },
    })

    return NextResponse.json(store)
  } catch (error) {
    console.log('[STORES_PATCH]', error)
    return new NextResponse('Internal error', { status: 500 })
  }
}
