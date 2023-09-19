'use client'
import { FC, useState } from 'react'
import { Billboard } from '@prisma/client'
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
import { ImageUpload } from '@/components/ui/ImageUpload'

interface BillboardFormProps {
  initialData: Billboard | null
}

const schemaBillboardForm = z.object({
  label: z.string().min(1, { message: 'Nome inválido' }),
  image_url: z.string().url('Url inválida'),
})

type SchemaBillboardData = z.infer<typeof schemaBillboardForm>

export const BillboardForm: FC<BillboardFormProps> = ({ initialData }) => {
  const { toast } = useToast()
  const [loading, setLoading] = useState(false)
  const params = useParams()
  const router = useRouter()
  const [open, setOpen] = useState(false)
  const title = initialData ? 'Edit billboard' : 'Create billboard'
  const description = initialData ? 'Edit a billboard' : 'Add a new billboard'
  const toastMessage = initialData ? 'Billboard updated!' : 'Billboard created!'
  const action = initialData ? 'Save changes' : 'Create'
  const { storeId, billboardId } = params

  const form = useForm<SchemaBillboardData>({
    resolver: zodResolver(schemaBillboardForm),
    defaultValues: initialData || { label: '', image_url: '' },
  })

  const onSubmit: SubmitHandler<SchemaBillboardData> = async (inputs) => {
    try {
      if (initialData) {
        await api.patch(`/api/${storeId}/billboards/${billboardId}`, inputs)
      } else {
        await api.post(`/api/${storeId}/billboards`, inputs)
      }
      router.refresh()
      router.push(`/${storeId}/billboards`)
      toast({ title: toastMessage })
    } catch (error) {
      console.log(error)
      toast({ title: 'Something went wrong.' })
    }
  }

  const onDelete = async () => {
    try {
      setLoading(true)
      await api.delete(`/api/${storeId}/billboards/${billboardId}`)
      router.refresh()
      router.push(`/${storeId}/billboards`)
      toast({ title: 'Billboard deleted!' })
    } catch (error) {
      toast({
        title:
          'Make sure you removed all categories using this billboard first.',
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
          <FormField
            control={form.control}
            name="image_url"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Backgroud image</FormLabel>
                <FormControl>
                  <ImageUpload
                    value={field.value ? [field.value] : []}
                    onChange={(url) => field.onChange(url)}
                    onRemove={() => field.onChange('')}
                    disabled={isSubmitting || loading}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <div className="grid grid-cols-3 gap-8">
            <FormField
              control={form.control}
              name="label"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Label</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Billboard label"
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
