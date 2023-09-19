'use client'

import { useStoreModal } from '@/store/zustand/use-store-modal'
import { Modal } from '../ui/modal'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { SubmitHandler, useForm } from 'react-hook-form'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '../ui/form'
import { Input } from '../ui/input'
import { Button } from '../ui/button'
import { api } from '@/service/axios'
import { useToast } from '../ui/use-toast'
import { redirect, useRouter } from 'next/navigation'
const schemaStoreForm = z.object({
  name: z.string().min(1, { message: 'Digite um nome valido para sua loja' }),
})

type SchemaStoreData = z.infer<typeof schemaStoreForm>
export const StoreModal = () => {
  const router = useRouter()
  const { isOpen, onClose } = useStoreModal()
  const { toast } = useToast()
  const form = useForm<SchemaStoreData>({
    resolver: zodResolver(schemaStoreForm),
    defaultValues: {
      name: '',
    },
  })

  const onSubmit: SubmitHandler<SchemaStoreData> = async (inputs) => {
    try {
      const { data } = await api.post('/api/stores', inputs)
      toast({
        title: 'Store created.',
      })

      // setTimeout(() => {
      //   router.push(`/${data.id}`)
      // }, 2000)
      window.location.assign(`/${data.id}`)
    } catch (error) {
      console.log(error)
      toast({
        title: 'Something went wrong.',
      })
    }
  }

  return (
    <Modal
      title="Create Store"
      description="Add a new store to manage products and categories"
      isOpen={isOpen}
      onClose={onClose}
    >
      <div>
        <div className="space-y-4 py-2 pb-4">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)}>
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Name</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="E-Commerce"
                        disabled={form.formState.isSubmitting}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className="pt-6 space-x-2 flex items-center justify-end w-full">
                <Button
                  type="button"
                  variant="outline"
                  disabled={form.formState.isSubmitting}
                  onClick={() => onClose()}
                >
                  Cancel
                </Button>
                <Button type="submit" disabled={form.formState.isSubmitting}>
                  Continue
                </Button>
              </div>
            </form>
          </Form>
        </div>
      </div>
    </Modal>
  )
}
