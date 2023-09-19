import { prismadb } from '@/lib/prismadb'
import { OrderClient } from './components/Client'
import { OrderColumn } from './components/Columns'
import { format } from 'date-fns'
import { formatter } from '@/lib/utils'
interface OrdersPageProps {
  params: { storeId: string }
}
export default async function OrdersPage({
  params: { storeId },
}: OrdersPageProps) {
  const orders = await prismadb.order.findMany({
    where: {
      store_id: storeId,
    },
    orderBy: {
      created_at: 'desc',
    },
    include: {
      orderItems: {
        include: {
          product: true,
        },
      },
    },
  })

  const formatedOrders: OrderColumn[] = orders.map((order) => ({
    id: order.id,
    phone: order.phone,
    address: order.address,
    products: order.orderItems
      .map((orderItem) => orderItem.product.name)
      .join(','),
    totalPrice: formatter.format(
      order.orderItems.reduce(
        (sum, order) => sum + order.product.price.toNumber(),
        0,
      ),
    ),
    is_paid: order.is_paid,
    created_at: format(order.created_at, 'MMMM do, yyyy'),
  }))
  return (
    <div className="flex-col">
      <div className="flex-1 space-y-4 p-8 pt-6">
        <OrderClient data={formatedOrders} />
      </div>
    </div>
  )
}
