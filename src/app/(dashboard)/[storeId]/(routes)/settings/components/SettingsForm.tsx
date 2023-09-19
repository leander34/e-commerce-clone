'use client'
import { FC, useState } from 'react'
import { Store } from '@prisma/client'
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
import { ApiAlert } from '@/components/ui/apiAlert'
import { useOrigin } from '@/hooks/use-origin'

interface SettingsFormProps {
  initialData: Store
}

const schemaSettingsForm = z.object({
  name: z.string().min(1, { message: 'Nome inválido' }),
})

type SchemaSettingsData = z.infer<typeof schemaSettingsForm>

export const SettingsForm: FC<SettingsFormProps> = ({ initialData }) => {
  const { toast } = useToast()
  const { origin } = useOrigin()
  const [loading, setLoading] = useState(false)
  const params = useParams()
  const router = useRouter()
  const [open, setOpen] = useState(false)
  const form = useForm<SchemaSettingsData>({
    resolver: zodResolver(schemaSettingsForm),
    defaultValues: {
      name: initialData.name,
    },
  })

  const onSubmit: SubmitHandler<SchemaSettingsData> = async (inputs) => {
    try {
      const { storeId } = params
      await api.patch(`/api/stores/${storeId}`, inputs)
      router.refresh()
      toast({ title: 'Store updated!' })
    } catch (error) {
      toast({ title: 'Somethinf went wrong.' })
    }
  }

  const onDelete = async () => {
    try {
      setLoading(true)
      const { storeId } = params
      await api.delete(`/api/stores/${storeId}`)
      router.refresh()
      router.push('/')
      toast({ title: 'Store deleted!' })
    } catch (error) {
      toast({
        title: 'Make sure you removed all products and categories firts.',
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
        <Heading title="Settings" description="Manage store preferences" />
        <Button
          variant="destructive"
          size="icon"
          disabled={isSubmitting}
          onClick={() => setOpen(true)}
        >
          <Trash className="h-4 w-4" />
        </Button>
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
                      placeholder="Store name"
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
            Save changes
          </Button>
        </form>
      </Form>
      <Separator />
      <ApiAlert
        title="NEXT_PUBLIC_API_URL"
        description={`${origin}/api/${params.storeId}`}
        variant="public"
      />
    </>
  )
}
