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

    const createColorSchema = z.object({
      name: z.string().min(1),
      value: z.string().min(4, { message: 'Valor inválido' }).regex(/^#/, {
        message: 'Only hex code',
      }),
    })

    const data = createColorSchema.safeParse(body)

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

    const color = await prismadb.color.create({
      data: {
        name,
        value,
        store_id: storeId,
      },
    })

    return NextResponse.json(color)
  } catch (error) {
    console.log('[COLOR_POST]', error)
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

    const colors = await prismadb.color.findMany({
      where: {
        store_id: storeId,
      },
    })

    return NextResponse.json(colors)
  } catch (error) {
    console.log('[COLOR_GET]', error)
    return new NextResponse('Internal error', { status: 500 })
  }
}
