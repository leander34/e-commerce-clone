'use client'
import { FC, useState } from 'react'
import { Billboard, Category } from '@prisma/client'
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

interface CategoryFormProps {
  initialData: Category | null
  billboards: Billboard[]
}

const schemaCategoryForm = z.object({
  name: z.string().min(1, { message: 'Nome inválido' }),
  billboard_id: z.string().min(1),
})

type SchemaCategoryData = z.infer<typeof schemaCategoryForm>

export const CategoryForm: FC<CategoryFormProps> = ({
  initialData,
  billboards,
}) => {
  const { toast } = useToast()
  const [loading, setLoading] = useState(false)
  const params = useParams()
  const router = useRouter()
  const [open, setOpen] = useState(false)
  const title = initialData ? 'Edit category' : 'Create category'
  const description = initialData ? 'Edit a category' : 'Add a new category'
  const toastMessage = initialData ? 'Category updated!' : 'Category created!'
  const action = initialData ? 'Save changes' : 'Create'
  const { storeId, categoryId } = params

  const form = useForm<SchemaCategoryData>({
    resolver: zodResolver(schemaCategoryForm),
    defaultValues: initialData || { name: '', billboard_id: '' },
  })

  const onSubmit: SubmitHandler<SchemaCategoryData> = async (inputs) => {
    try {
      if (initialData) {
        await api.patch(`/api/${storeId}/categories/${categoryId}`, inputs)
      } else {
        await api.post(`/api/${storeId}/categories`, inputs)
      }
      router.refresh()
      router.push(`/${storeId}/categories`)
      toast({ title: toastMessage })
    } catch (error) {
      console.log(error)
      toast({ title: 'Something went wrong.' })
    }
  }

  const onDelete = async () => {
    try {
      setLoading(true)
      await api.delete(`/api/${storeId}/categories/${categoryId}`)
      router.refresh()
      router.push(`/${storeId}/categories`)
      toast({ title: 'Category deleted!' })
    } catch (error) {
      toast({
        title: 'Make sure you removed all products using this category first.',
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
                      placeholder="Category name"
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
              name="billboard_id"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Billboard</FormLabel>
                  <Select
                    disabled={isSubmitting}
                    onValueChange={field.onChange}
                    value={field.value}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue
                          defaultValue={field.value}
                          placeholder="Select a billboard"
                        />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {billboards.map((billboard) => (
                        <SelectItem key={billboard.id} value={billboard.id}>
                          {billboard.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
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
