import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'

import { companyContactSchema } from '../schemas/company-contact.schema'
import { ResourceForm, type ResourceField } from '@/shared/components/forms'

const fields: ResourceField[] = [
  { key: 'name', label: 'Nama PIC', required: true },
  { key: 'position', label: 'Jabatan' },
  { key: 'division', label: 'Divisi' },
  { key: 'phone', label: 'Nomor telepon' },
  { key: 'email', label: 'Email', type: 'email' },
  { key: 'is_primary', label: 'Kontak utama', type: 'switch' },
  { key: 'notes', label: 'Catatan', type: 'textarea' },
]

describe('company contact form', () => {
  it('validates required fields and submits normalized field values', async () => {
    const user = userEvent.setup()
    const onSubmit = vi.fn()
    render(
      <>
        <ResourceForm
          id="contact-form"
          fields={fields}
          schema={companyContactSchema}
          defaultValues={{
            name: '',
            position: '',
            division: '',
            phone: '',
            email: '',
            is_primary: false,
            notes: '',
          }}
          onSubmit={onSubmit}
        />
        <button type="submit" form="contact-form">
          Simpan
        </button>
      </>,
    )

    await user.click(screen.getByRole('button', { name: 'Simpan' }))
    expect(screen.getByText('Nama PIC wajib diisi')).toBeInTheDocument()

    await user.type(screen.getByLabelText(/Nama PIC/), 'Siti Rahma')
    await user.click(screen.getByRole('button', { name: 'Simpan' }))
    expect(onSubmit).toHaveBeenCalledWith(
      expect.objectContaining({ name: 'Siti Rahma', is_primary: false }),
      expect.anything(),
    )
  })
})
