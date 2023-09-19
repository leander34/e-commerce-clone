'use client'

import { useOrigin } from '@/hooks/use-origin'
import { useParams } from 'next/navigation'
import { FC } from 'react'
import { ApiAlert } from './apiAlert'

interface ApiListProps {
  entityName: string
  entityIdName: string
}

export const ApiList: FC<ApiListProps> = ({ entityName, entityIdName }) => {
  const params = useParams()
  const { origin } = useOrigin()
  const { storeId } = params

  const baseUrl = `${origin}/api/${storeId}`
  return (
    <>
      <ApiAlert
        title="GET"
        variant="public"
        description={`${baseUrl}/${entityName}`}
      />
      <ApiAlert
        title="GET"
        variant="public"
        description={`${baseUrl}/${entityName}/{${entityIdName}}`}
      />
      <ApiAlert
        title="POST"
        variant="admin"
        description={`${baseUrl}/${entityName}`}
      />

      <ApiAlert
        title="PATCH"
        variant="admin"
        description={`${baseUrl}/${entityName}/{${entityIdName}}`}
      />

      <ApiAlert
        title="DELETE"
        variant="admin"
        description={`${baseUrl}/${entityName}/{${entityIdName}}`}
      />
    </>
  )
}
