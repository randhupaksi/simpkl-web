import { File, UploadCloud, X } from 'lucide-react'
import { useDropzone, type Accept } from 'react-dropzone'

import {
  Alert,
  AlertDescription,
  Button,
  IconButton,
} from '@/shared/components/ui'
import { Typography } from '@/shared/design-system/typography'
import { cn } from '@/shared/lib/utils'

type FileDropzoneProps = {
  value?: File
  onChange: (file?: File) => void
  accept?: Accept
  maxSize?: number
  disabled?: boolean
  label?: string
}

export function FileDropzone({
  value,
  onChange,
  accept,
  maxSize = 5 * 1024 * 1024,
  disabled,
  label = 'Tarik file ke sini atau pilih dari perangkat',
}: FileDropzoneProps) {
  const {
    getRootProps,
    getInputProps,
    isDragActive,
    isDragReject,
    fileRejections,
  } = useDropzone({
    accept,
    maxSize,
    disabled,
    multiple: false,
    onDropAccepted: ([file]) => onChange(file),
  })

  if (value) {
    return (
      <div className="border-border bg-surface-subtle flex items-center gap-3 rounded-[var(--radius-md)] border p-3">
        <span className="bg-primary-subtle text-primary grid size-10 place-items-center rounded-[var(--radius-sm)]">
          <File className="size-5" />
        </span>
        <div className="min-w-0 flex-1">
          <p className="truncate text-sm font-semibold">{value.name}</p>
          <Typography variant="caption">
            {(value.size / 1024 / 1024).toFixed(2)} MB
          </Typography>
        </div>
        <IconButton
          aria-label="Hapus file"
          variant="ghost"
          size="sm"
          onClick={() => onChange(undefined)}
        >
          <X />
        </IconButton>
      </div>
    )
  }

  return (
    <div>
      <div
        {...getRootProps()}
        className={cn(
          'interactive-surface border-border-strong bg-surface-subtle hover:border-border-form-hover hover:bg-surface-hover active:bg-surface-pressed focus-visible:border-border-selected grid min-h-44 cursor-pointer place-items-center rounded-[var(--radius-lg)] border border-dashed p-6 text-center outline-none focus-visible:shadow-[var(--shadow-focus)]',
          isDragActive && 'border-border-selected bg-surface-selected',
          isDragReject && 'border-danger bg-danger-subtle',
          disabled &&
            'border-border-disabled bg-surface-disabled text-disabled-foreground pointer-events-none',
        )}
      >
        <input {...getInputProps()} />
        <div>
          <span className="bg-primary-subtle text-primary mx-auto grid size-11 place-items-center rounded-[var(--radius-md)]">
            <UploadCloud className="size-5" />
          </span>
          <p className="mt-3 text-sm font-semibold">{label}</p>
          <Typography variant="caption" className="mt-1">
            Maksimal {(maxSize / 1024 / 1024).toFixed(0)} MB
          </Typography>
          <Button variant="outline" size="sm" className="mt-4" tabIndex={-1}>
            Pilih file
          </Button>
        </div>
      </div>
      {fileRejections.length > 0 ? (
        <Alert tone="danger" className="mt-3">
          <AlertDescription>
            File tidak sesuai format atau melebihi batas ukuran.
          </AlertDescription>
        </Alert>
      ) : null}
    </div>
  )
}
