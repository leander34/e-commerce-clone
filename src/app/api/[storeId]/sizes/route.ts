/* eslint-disable camelcase */
import { prismadb } from '@/lib/prismadb'
import { auth } from '@clerk/nextjs'
import { NextResponse } from 'next/server'
import { z } from 'zod'
export async function POST(
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

    const createSizeSchema = z.object({
      name: z.string().min(1),
      value: z.string().min(1),
    })

    const data = createSizeSchema.safeParse(body)

    if (data.success === false) {
      return new NextResponse(JSON.stringify(data.error.format()), {
        status: 400,
      })
    }

    const { name, value } = data.data

    const storeByUserId = await prismadb.store.findFirst({
      where: {
        id: storeId,
        user_id: userId,
      },
    })

    if (!storeByUserId) {
      return new NextResponse('Unauthorized', { status: 403 })
    }

    const size = await prismadb.size.create({
      data: {
        name,
        value,
        store_id: storeId,
      },
    })

    return NextResponse.json(size)
  } catch (error) {
    console.log('[SIZE_POST]', error)
    return new NextResponse('Internal error', { status: 500 })
  }
}
export async function GET(
  req: Request,
  { params }: { params: { storeId: string } },
) {
  const { storeId } = params
  try {
    if (!storeId) {
      return new NextResponse('Store ID is required', { status: 400 })
    }

    const sizes = await prismadb.size.findMany({
      where: {
        store_id: storeId,
      },
    })

    return NextResponse.json(sizes)
  } catch (error) {
    console.log('[SIZE_GET]', error)
    return new NextResponse('Internal error', { status: 500 })
  }
}
