/* eslint-disable camelcase */
import { prismadb } from '@/lib/prismadb'
import { auth } from '@clerk/nextjs'
import { NextResponse } from 'next/server'
import { z } from 'zod'
export async function PATCH(
  req: Request,
  { params }: { params: { storeId: string; billboardId: string } },
) {
  const { storeId, billboardId } = params
  try {
    const { userId } = auth()
    const body = await req.json()

    if (!userId) {
      return new NextResponse('Unauthorized', { status: 401 })
    }

    if (!storeId) {
      return new NextResponse('Store ID is required', { status: 400 })
    }

    if (!billboardId) {
      return new NextResponse('Billboard ID is required', { status: 400 })
    }

    const updateBillboardSchema = z.object({
      label: z.string().min(1),
      image_url: z.string().url(),
    })

    const data = updateBillboardSchema.safeParse(body)

    if (data.success === false) {
      return new NextResponse(JSON.stringify(data.error.format()), {
        status: 400,
      })
    }

    const { label, image_url } = data.data

    const storeByUserId = await prismadb.store.findFirst({
      where: {
        id: storeId,
        user_id: userId,
      },
    })

    if (!storeByUserId) {
      return new NextResponse('Unauthorized', { status: 403 })
    }

    const billboard = await prismadb.billboard.update({
      where: {
        id: billboardId,
      },
      data: {
        label,
        image_url,
      },
    })

    return NextResponse.json(billboard)
  } catch (error) {
    console.log('[BILLBOARD_PATCH]', error)
    return new NextResponse('Internal error', { status: 500 })
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: { storeId: string; billboardId: string } },
) {
  const { storeId, billboardId } = params
  try {
    const { userId } = auth()

    if (!userId) {
      return new NextResponse('Unauthorized', { status: 401 })
    }

    if (!storeId) {
      return new NextResponse('Store ID is required', { status: 400 })
    }

    if (!billboardId) {
      return new NextResponse('Billboard ID is required', { status: 400 })
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

    const billboard = await prismadb.billboard.delete({
      where: {
        id: billboardId,
      },
    })

    return NextResponse.json(billboard)
  } catch (error) {
    console.log('[BILLBOARD_DELETE]', error)
    return new NextResponse('Internal error', { status: 500 })
  }
}

export async function GET(
  req: Request,
  { params }: { params: { storeId: string; billboardId: string } },
) {
  const { storeId, billboardId } = params
  try {
    if (!storeId) {
      return new NextResponse('Store ID is required', { status: 400 })
    }

    if (!billboardId) {
      return new NextResponse('Billboard ID is required', { status: 400 })
    }

    const billboard = await prismadb.billboard.findFirst({
      where: {
        id: billboardId,
      },
    })
    console.log('odjaodjaojdaojdoaj')

    return NextResponse.json(billboard)
  } catch (error) {
    console.log('[BILLBOARD_GET]', error)
    return new NextResponse('Internal error', { status: 500 })
  }
}
