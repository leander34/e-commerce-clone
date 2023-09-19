'use client'
import { FC, useState } from 'react'
import { Size } from '@prisma/client'
import { SubmitHandler, useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { Heading } from '@/components/ui/Heading'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import { Trash } from 'lucide-react'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { api } from '@/service/axios'
import { useToast } from '@/components/ui/use-toast'
import { useParams, useRouter } from 'next/navigation'
import { AlertModal } from '@/components/modals/alertModal'

interface SizeFormProps {
  initialData: Size | null
}

const schemaSizeForm = z.object({
  name: z.string().min(1, { message: 'Nome inválido' }),
  value: z.string().min(1, { message: 'Valor inválido' }),
})

type SchemaSizeData = z.infer<typeof schemaSizeForm>

export const SizeForm: FC<SizeFormProps> = ({ initialData }) => {
  const { toast } = useToast()
  const [loading, setLoading] = useState(false)
  const params = useParams()
  const router = useRouter()
  const [open, setOpen] = useState(false)
  const title = initialData ? 'Edit size' : 'Create size'
  const description = initialData ? 'Edit a size' : 'Add a new size'
  const toastMessage = initialData ? 'Size updated!' : 'Size created!'
  const action = initialData ? 'Save changes' : 'Create'
  const { storeId, sizeId } = params

  const form = useForm<SchemaSizeData>({
    resolver: zodResolver(schemaSizeForm),
    defaultValues: initialData || { name: '', value: '' },
  })

  const onSubmit: SubmitHandler<SchemaSizeData> = async (inputs) => {
    try {
      if (initialData) {
        await api.patch(`/api/${storeId}/sizes/${sizeId}`, inputs)
      } else {
        await api.post(`/api/${storeId}/sizes`, inputs)
      }
      router.refresh()
      router.push(`/${storeId}/sizes`)
      toast({ title: toastMessage })
    } catch (error) {
      console.log(error)
      toast({ title: 'Something went wrong.' })
    }
  }

  const onDelete = async () => {
    try {
      setLoading(true)
      await api.delete(`/api/${storeId}/sizes/${sizeId}`)
      router.refresh()
      router.push(`/${storeId}/sizes`)
      toast({ title: 'Size deleted!' })
    } catch (error) {
      toast({
        title: 'Make sure you removed all products using this size first.',
      })
    } finally {
      setLoading(false)
      setOpen(false)
    }
  }

  const { isSubmitting } = form.formState

  return (
    <>
      <AlertModal
        isOpen={open}
        onClose={() => setOpen(false)}
        onConfirm={onDelete}
        loading={isSubmitting}
      />
      <div className="flex items-center justify-between">
        <Heading title={title} description={description} />
        {initialData && (
          <Button
            variant="destructive"
            size="icon"
            disabled={isSubmitting}
            onClick={() => setOpen(true)}
          >
            <Trash className="h-4 w-4" />
          </Button>
        )}
      </div>
      <Separator />
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="space-y-8 w-full"
        >
          <div className="grid grid-cols-3 gap-8">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Size name"
                      disabled={isSubmitting}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="value"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Value</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Size value"
                      disabled={isSubmitting}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <Button disabled={isSubmitting} className="ml-auto" type="submit">
            {action}
          </Button>
        </form>
      </Form>
    </>
  )
}
