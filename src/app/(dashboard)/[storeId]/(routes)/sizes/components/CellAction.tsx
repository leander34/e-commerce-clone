'use client'
import { FC, useState } from 'react'
import { SizeColumn } from './Columns'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Button } from '@/components/ui/button'
import { Copy, Edit, MoreHorizontal, Trash } from 'lucide-react'
import { useToast } from '@/components/ui/use-toast'
import { useParams, useRouter } from 'next/navigation'
import { api } from '@/service/axios'
import { AlertModal } from '@/components/modals/alertModal'

interface CellActionProps {
  data: SizeColumn
}

export const CellAction: FC<CellActionProps> = ({ data }) => {
  const { toast } = useToast()
  const [loading, setLoading] = useState(false)
  const [open, setOpen] = useState(false)
  const router = useRouter()
  const params = useParams()
  const { storeId } = params
  const onCopy = (id: string) => {
    navigator.clipboard.writeText(id)
    toast({ title: 'Size Id copied to the clipboard' })
  }
  const onDelete = async (id: string) => {
    try {
      setLoading(true)
      await api.delete(`/api/${storeId}/sizes/${id}`)
      router.refresh()
      toast({ title: 'Size deleted!' })
    } catch (error) {
      toast({
        title: 'Make sure you removed all product using this size first.',
      })
    } finally {
      setLoading(false)
      setOpen(false)
    }
  }

  return (
    <>
      <AlertModal
        onConfirm={() => onDelete(data.id)}
        isOpen={open}
        onClose={() => setOpen(false)}
        loading={loading}
      />
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="h-8 w-8 p-0">
            <span className="sr-only">Open menu</span>
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuLabel>Actions</DropdownMenuLabel>
          <DropdownMenuItem onClick={() => onCopy(data.id)}>
            <Copy className="mr-2 h-4 w-4" />
            Copy Id
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={() => router.push(`/${storeId}/sizes/${data.id}`)}
          >
            <Edit className="mr-2 h-4 w-4" />
            Update
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => setOpen(true)}>
            <Trash className="mr-2 h-4 w-4" />
            Delete
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  )
}
