import type { ColumnDef } from '@tanstack/react-table'
import { CheckCircle2, FileSpreadsheet, Upload } from 'lucide-react'
import { useState } from 'react'
import { toast } from 'sonner'

import {
  type StudentImportError,
  useStudentImportMutation,
} from '../api/student-import.mutations'
import { StatCard } from '@/shared/components/data-display'
import { FileDropzone } from '@/shared/components/forms'
import { DataTable } from '@/shared/components/tables'
import { Alert, Button, Card, CardContent } from '@/shared/components/ui'
import { PageHeader } from '@/shared/design-system/page'
import { SectionTitle, Typography } from '@/shared/design-system/typography'

const errorColumns: ColumnDef<StudentImportError>[] = [
  { accessorKey: 'row', header: 'Baris' },
  { accessorKey: 'field', header: 'Kolom' },
  { accessorKey: 'message', header: 'Masalah' },
]

export function StudentImportPage() {
  const [file, setFile] = useState<File>()
  const mutation = useStudentImportMutation()
  const result = mutation.data

  const submit = (commit: boolean) => {
    if (!file) {
      toast.error('Pilih file Excel terlebih dahulu')
      return
    }
    mutation.mutate(
      { file, commit },
      {
        onSuccess: (data) =>
          toast.success(
            commit
              ? `${data.imported} siswa berhasil diimpor`
              : 'Validasi file selesai',
          ),
      },
    )
  }

  return (
    <div className="enter-animation space-y-6">
      <PageHeader
        eyebrow="Data Master"
        title="Impor Siswa"
        description="Validasi file Excel terlebih dahulu, tinjau setiap kesalahan, lalu simpan hanya baris yang valid."
        backTo="/students"
      />
      <Card>
        <CardContent className="space-y-5">
          <div>
            <SectionTitle>File sumber</SectionTitle>
            <Typography variant="muted" className="mt-1">
              Kolom wajib: nis, name, class_id, dan major_id. Format
              yang diterima adalah XLSX atau XLS dengan ukuran maksimal 5 MB.
            </Typography>
          </div>
          <FileDropzone
            value={file}
            onChange={(next) => {
              setFile(next)
              mutation.reset()
            }}
            accept={{
              'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet':
                ['.xlsx'],
              'application/vnd.ms-excel': ['.xls'],
            }}
            disabled={mutation.isPending}
            label="Tarik file Excel siswa ke sini"
          />
          {mutation.isError ? (
            <Alert tone="danger" title="File belum dapat diproses">
              Pastikan format dan nama kolom sesuai template backend.
            </Alert>
          ) : null}
          <div className="flex flex-wrap justify-end gap-2">
            <Button
              variant="outline"
              startIcon={<FileSpreadsheet />}
              isLoading={mutation.isPending}
              onClick={() => submit(false)}
            >
              Validasi dan pratinjau
            </Button>
            <Button
              startIcon={<Upload />}
              disabled={!result || result.valid === 0}
              isLoading={mutation.isPending}
              onClick={() => submit(true)}
            >
              Impor data valid
            </Button>
          </div>
        </CardContent>
      </Card>

      {result ? (
        <>
          <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            <StatCard
              label="Total baris"
              value={result.total}
              icon={FileSpreadsheet}
            />
            <StatCard
              label="Data valid"
              value={result.valid}
              icon={CheckCircle2}
              tone="success"
            />
            <StatCard
              label="Data bermasalah"
              value={result.failed}
              icon={FileSpreadsheet}
              tone={result.failed > 0 ? 'danger' : 'neutral'}
            />
            <StatCard
              label="Sudah diimpor"
              value={result.imported}
              icon={Upload}
              tone="info"
            />
          </section>
          <DataTable
            columns={errorColumns}
            data={result.errors}
            rowId={(row) => `${row.row}-${row.field}-${row.message}`}
            emptyTitle="Semua baris valid"
            emptyDescription="Tidak ditemukan masalah pada file. Data siap diimpor."
          />
        </>
      ) : null}
    </div>
  )
}
