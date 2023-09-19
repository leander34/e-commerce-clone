/* eslint-disable camelcase */
import { prismadb } from '@/lib/prismadb'
import { auth } from '@clerk/nextjs'
import { NextResponse } from 'next/server'
import { z } from 'zod'
export async function PATCH(
  req: Request,
  { params }: { params: { storeId: string; productId: string } },
) {
  const { storeId, productId } = params
  try {
    const { userId } = auth()
    const body = await req.json()

    if (!userId) {
      return new NextResponse('Unauthorized', { status: 401 })
    }

    if (!storeId) {
      return new NextResponse('Store ID is required', { status: 400 })
    }

    if (!productId) {
      return new NextResponse('Product ID is required', { status: 400 })
    }

    const updateProductSchema = z.object({
      name: z.string().min(1, { message: 'Nome inválido' }),
      images: z.object({ url: z.string().url() }).array(),
      price: z.coerce.number().positive(),
      categoryId: z.string().min(1, { message: 'Categoria inválida' }),
      colorId: z.string().min(1, { message: 'Cor inválida' }),
      sizeId: z.string().min(1, { message: 'Tamanho inválido' }),
      isFeatured: z.boolean().default(false),
      isArchived: z.boolean().default(false),
    })

    const data = updateProductSchema.safeParse(body)

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

    await prismadb.product.update({
      where: {
        id: productId,
      },
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
          deleteMany: {},
        },
      },
    })

    const product = await prismadb.product.update({
      where: {
        id: productId,
      },
      data: {
        images: {
          createMany: {
            data: images,
          },
        },
      },
    })

    return NextResponse.json(product)
  } catch (error) {
    console.log('[PRODUCT_PATCH]', error)
    return new NextResponse('Internal error', { status: 500 })
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: { storeId: string; productId: string } },
) {
  const { storeId, productId } = params
  try {
    const { userId } = auth()

    if (!userId) {
      return new NextResponse('Unauthorized', { status: 401 })
    }

    if (!storeId) {
      return new NextResponse('Store ID is required', { status: 400 })
    }

    if (!productId) {
      return new NextResponse('Product ID is required', { status: 400 })
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

    const product = await prismadb.product.delete({
      where: {
        id: productId,
      },
    })

    return NextResponse.json(product)
  } catch (error) {
    console.log('[PRODUCT_DELETE]', error)
    return new NextResponse('Internal error', { status: 500 })
  }
}

export async function GET(
  req: Request,
  { params }: { params: { storeId: string; productId: string } },
) {
  const { storeId, productId } = params
  try {
    if (!storeId) {
      return new NextResponse('Store ID is required', { status: 400 })
    }

    if (!productId) {
      return new NextResponse('Product ID is required', { status: 400 })
    }

    const product = await prismadb.product.findFirst({
      where: {
        id: productId,
      },
      include: {
        images: true,
        category: true,
        size: true,
        color: true,
      },
    })

    return NextResponse.json(product)
  } catch (error) {
    console.log('[PRODUCT_GET]', error)
    return new NextResponse('Internal error', { status: 500 })
  }
}
