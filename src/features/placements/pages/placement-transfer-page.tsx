import { ArrowRightLeft } from 'lucide-react'
import { useNavigate, useParams } from 'react-router-dom'
import { toast } from 'sonner'

import { usePlacementTransferMutation } from '../api/placement.mutations'
import { placementConfig } from '../components/placement.config'
import { placementTransferSchema } from '../schemas/placement-transfer.schema'
import {
  ResourceForm,
  type ResourceField,
  type ResourceValues,
} from '@/shared/components/forms'
import { Alert, Button } from '@/shared/components/ui'
import { FormActions, FormSection } from '@/shared/design-system/form'
import { PageHeader } from '@/shared/design-system/page'

const fields: ResourceField[] = [
  {
    key: 'current_end_date',
    label: 'Akhir penempatan lama',
    type: 'date',
    required: true,
    hint: 'Menutup penempatan aktif sebelum penempatan pengganti dibuat.',
  },
  {
    key: 'reason',
    label: 'Alasan transfer',
    type: 'textarea',
    required: true,
    hint: 'Alasan tersimpan pada riwayat penempatan dan audit.',
  },
  ...placementConfig.fields.filter(
    (field) =>
      !['previous_placement_id', 'transfer_reason'].includes(field.key),
  ),
]

export function PlacementTransferPage() {
  const { id = '' } = useParams()
  const navigate = useNavigate()
  const mutation = usePlacementTransferMutation()

  const submit = (values: ResourceValues) => {
    const newPlacement = Object.fromEntries(
      Object.entries(placementConfig.normalizeInput?.(values) ?? values).filter(
        ([key]) => !['current_end_date', 'reason'].includes(key),
      ),
    )
    newPlacement.previous_placement_id = id
    newPlacement.transfer_reason = String(values.reason)

    mutation.mutate(
      {
        id,
        end_date: String(values.current_end_date),
        reason: String(values.reason),
        new_placement: newPlacement,
      },
      {
        onSuccess: (placement) => {
          toast.success('Siswa berhasil dipindahkan')
          navigate(`/placements/${placement.id}`)
        },
      },
    )
  }

  return (
    <div className="enter-animation space-y-6">
      <PageHeader
        eyebrow="Manajemen PKL"
        title="Transfer Penempatan"
        description="Tutup penempatan lama dan buat penempatan pengganti dalam satu transaksi backend yang dapat diaudit."
        backTo={`/placements/${id}`}
      />
      <Alert tone="warning" title="Periksa kesiapan lokasi tujuan">
        Pastikan kuota perusahaan, kesesuaian jurusan, PIC, pembimbing, dan
        tanggal sudah dikonfirmasi sebelum menyimpan transfer.
      </Alert>
      <FormSection
        title="Detail transfer dan penempatan baru"
        description="Transfer tidak menghapus riwayat penempatan sebelumnya."
      >
        <ResourceForm
          id="placement-transfer-form"
          fields={fields}
          schema={placementTransferSchema}
          defaultValues={Object.fromEntries(
            fields.map((field) => [
              field.key,
              field.defaultValue ??
                (field.type === 'number'
                  ? 0
                  : field.type === 'switch'
                    ? false
                    : ''),
            ]),
          )}
          onSubmit={submit}
        />
      </FormSection>
      {mutation.isError ? (
        <Alert tone="danger" title="Transfer belum dapat disimpan">
          Backend menolak transfer. Periksa status penempatan lama, kuota,
          kesesuaian jurusan, dan rentang tanggal.
        </Alert>
      ) : null}
      <FormActions>
        <Button variant="outline" onClick={() => navigate(-1)}>
          Batal
        </Button>
        <Button
          type="submit"
          form="placement-transfer-form"
          startIcon={<ArrowRightLeft />}
          isLoading={mutation.isPending}
        >
          Proses transfer
        </Button>
      </FormActions>
    </div>
  )
}
