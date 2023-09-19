/* eslint-disable camelcase */
import { prismadb } from '@/lib/prismadb'
import { auth } from '@clerk/nextjs'
import { NextResponse } from 'next/server'
import { z } from 'zod'
export async function PATCH(
  req: Request,
  { params }: { params: { storeId: string; sizeId: string } },
) {
  const { storeId, sizeId } = params
  try {
    const { userId } = auth()
    const body = await req.json()

    if (!userId) {
      return new NextResponse('Unauthorized', { status: 401 })
    }

    if (!storeId) {
      return new NextResponse('Store ID is required', { status: 400 })
    }

    if (!sizeId) {
      return new NextResponse('Size ID is required', { status: 400 })
    }

    const updateSizeSchema = z.object({
      name: z.string().min(1),
      value: z.string().min(1),
    })

    const data = updateSizeSchema.safeParse(body)

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

    const size = await prismadb.size.update({
      where: {
        id: sizeId,
      },
      data: {
        name,
        value,
      },
    })

    return NextResponse.json(size)
  } catch (error) {
    console.log('[SIZE_PATCH]', error)
    return new NextResponse('Internal error', { status: 500 })
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: { storeId: string; sizeId: string } },
) {
  const { storeId, sizeId } = params
  try {
    const { userId } = auth()

    if (!userId) {
      return new NextResponse('Unauthorized', { status: 401 })
    }

    if (!storeId) {
      return new NextResponse('Store ID is required', { status: 400 })
    }

    if (!sizeId) {
      return new NextResponse('Size ID is required', { status: 400 })
    }

    const storeByUserId = await prismadb.store.findFirst({
      where: {
        id: storeId,
        user_id: userId,
      },
    })

    if (!storeByUserId) {
      return new NextResponse('Unauthorized', { status: 403 })
    }

    const size = await prismadb.size.delete({
      where: {
        id: sizeId,
      },
    })

    return NextResponse.json(size)
  } catch (error) {
    console.log('[SIZE_DELETE]', error)
    return new NextResponse('Internal error', { status: 500 })
  }
}

export async function GET(
  req: Request,
  { params }: { params: { storeId: string; sizeId: string } },
) {
  const { storeId, sizeId } = params
  try {
    if (!storeId) {
      return new NextResponse('Store ID is required', { status: 400 })
    }

    if (!sizeId) {
      return new NextResponse('Size ID is required', { status: 400 })
    }

    const size = await prismadb.size.findFirst({
      where: {
        id: sizeId,
      },
    })

    return NextResponse.json(size)
  } catch (error) {
    console.log('[SIZE_GET]', error)
    return new NextResponse('Internal error', { status: 500 })
  }
}
