/* eslint-disable camelcase */
import { prismadb } from '@/lib/prismadb'
import { auth } from '@clerk/nextjs'
import { NextResponse } from 'next/server'
import { z } from 'zod'
export async function PATCH(
  req: Request,
  { params }: { params: { storeId: string; colorId: string } },
) {
  const { storeId, colorId } = params
  try {
    const { userId } = auth()
    const body = await req.json()

    if (!userId) {
      return new NextResponse('Unauthorized', { status: 401 })
    }

    if (!storeId) {
      return new NextResponse('Store ID is required', { status: 400 })
    }

    if (!colorId) {
      return new NextResponse('Color ID is required', { status: 400 })
    }

    const updateColorSchema = z.object({
      name: z.string().min(1),
      value: z.string().min(4, { message: 'Valor inválido' }).regex(/^#/, {
        message: 'Only hex code',
      }),
    })

    const data = updateColorSchema.safeParse(body)

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

    const color = await prismadb.color.update({
      where: {
        id: colorId,
      },
      data: {
        name,
        value,
      },
    })

    return NextResponse.json(color)
  } catch (error) {
    console.log('[COLOR_PATCH]', error)
    return new NextResponse('Internal error', { status: 500 })
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: { storeId: string; colorId: string } },
) {
  const { storeId, colorId } = params
  try {
    const { userId } = auth()

    if (!userId) {
      return new NextResponse('Unauthorized', { status: 401 })
    }

    if (!storeId) {
      return new NextResponse('Store ID is required', { status: 400 })
    }

    if (!colorId) {
      return new NextResponse('Color ID is required', { status: 400 })
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

    const color = await prismadb.color.delete({
      where: {
        id: colorId,
      },
    })

    return NextResponse.json(color)
  } catch (error) {
    console.log('[COLOR_DELETE]', error)
    return new NextResponse('Internal error', { status: 500 })
  }
}

export async function GET(
  req: Request,
  { params }: { params: { storeId: string; colorId: string } },
) {
  const { storeId, colorId } = params
  try {
    if (!storeId) {
      return new NextResponse('Store ID is required', { status: 400 })
    }

    if (!colorId) {
      return new NextResponse('Color ID is required', { status: 400 })
    }

    const color = await prismadb.color.findFirst({
      where: {
        id: colorId,
      },
    })

    return NextResponse.json(color)
  } catch (error) {
    console.log('[COLOR_GET]', error)
    return new NextResponse('Internal error', { status: 500 })
  }
}
