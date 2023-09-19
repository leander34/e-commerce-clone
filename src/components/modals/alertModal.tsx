'use client'

import { FC, useEffect, useState } from 'react'
import { Modal } from '../ui/modal'
import { Button } from '../ui/button'

interface AlertModalProps {
  isOpen: boolean
  onClose(): void
  onConfirm: () => void
  loading: boolean
}

export const AlertModal: FC<AlertModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  loading,
}) => {
  const [isMounted, setIsMounted] = useState(false)

  useEffect(() => {
    setIsMounted(true)
  }, [])

  if (!isMounted) {
    return null
  }

  return (
    <Modal
      title="Are you sure?"
      description="This action cannot be undone."
      isOpen={isOpen}
      onClose={onClose}
    >
      <div className="pt-6 flex items-center justify-end gap-2 w-full">
        <Button
          disabled={loading}
          variant="outline"
          type="button"
          onClick={onClose}
        >
          Cancel
        </Button>
        <Button
          type="button"
          disabled={loading}
          variant="destructive"
          onClick={onConfirm}
        >
          Continue
        </Button>
      </div>
    </Modal>
  )
}
