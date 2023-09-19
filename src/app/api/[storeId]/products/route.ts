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

    const createProductSchema = z.object({
      name: z.string().min(1, { message: 'Nome inválido' }),
      images: z.object({ url: z.string().url() }).array(),
      price: z.coerce.number().positive(),
      categoryId: z.string().min(1, { message: 'Categoria inválida' }),
      colorId: z.string().min(1, { message: 'Cor inválida' }),
      sizeId: z.string().min(1, { message: 'Tamanho inválido' }),
      isFeatured: z.boolean().default(false),
      isArchived: z.boolean().default(false),
    })

    const data = createProductSchema.safeParse(body)

    if (data.success === false) {
      return new NextResponse(JSON.stringify(data.error.format()), {
        status: 400,
      })
    }

    const {
      name,
      price,
      images,
      categoryId,
      colorId,
      isArchived,
      isFeatured,
      sizeId,
    } = data.data

    const storeByUserId = await prismadb.store.findFirst({
      where: {
        id: storeId,
        user_id: userId,
      },
    })

    if (!storeByUserId) {
      return new NextResponse('Unauthorized', { status: 403 })
    }

    const product = await prismadb.product.create({
      data: {
        name,
        price,
        category_id: categoryId,
        color_id: colorId,
        size_id: sizeId,
        isArchived,
        isFeatured,
        store_id: storeId,
        images: {
          createMany: {
            data: images,
          },
        },
      },
    })

    return NextResponse.json(product)
  } catch (error) {
    console.log('[PRODUCT_POST]', error)
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

    const getProductParamsSchema = z.object({
      categoryId: z
        .string()
        .nullable()
        .default(null)
        .transform((value) => (value === null ? undefined : value)),
      colorId: z
        .string()
        .nullable()
        .default(null)
        .transform((value) => (value === null ? undefined : value)),
      sizeId: z
        .string()
        .nullable()
        .default(null)
        .transform((value) => (value === null ? undefined : value)),
      isFeatured: z
        .enum(['true', 'false'])
        .nullable()
        .default(null)
        .transform((value) => {
          if (value === null) {
            return undefined
          }

          if (value === 'false') {
            return false
          }

          if (value === 'true') {
            return true
          }
        }),
    })

    const { searchParams } = new URL(req.url)

    const productsParams = Array.from(searchParams.entries()).reduce<any>(
      (acc, [key, value]) => {
        acc[key] = value
        return acc
      },
      {},
    )

    console.log(productsParams)
    const data = getProductParamsSchema.safeParse(productsParams)
    if (data.success === false) {
      return new NextResponse(JSON.stringify(data.error.format()), {
        status: 400,
      })
    }

    const { categoryId, colorId, isFeatured, sizeId } = data.data
    console.log(data.data)

    const products = await prismadb.product.findMany({
      where: {
        store_id: storeId,
        category_id: categoryId,
        color_id: colorId,
        size_id: sizeId,
        isFeatured,
        isArchived: false,
      },
      include: {
        images: true,
        category: true,
        color: true,
        size: true,
      },
      orderBy: {
        created_at: 'desc',
      },
    })

    console.log(products.length)
    console.log(products)

    return NextResponse.json(products)
  } catch (error) {
    console.log('[PRODUCT_GET]', error)
    return new NextResponse('Internal error', { status: 500 })
  }
}
