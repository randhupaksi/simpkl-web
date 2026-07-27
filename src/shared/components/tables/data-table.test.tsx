import type { ColumnDef } from '@tanstack/react-table'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it } from 'vitest'

import { DataTable } from './data-table'

type Row = { id: string; name: string; status: string }

const columns: ColumnDef<Row>[] = [
  { accessorKey: 'name', header: 'Nama' },
  { accessorKey: 'status', header: 'Status' },
]

describe('DataTable', () => {
  it('allows users to toggle column visibility', async () => {
    const user = userEvent.setup()
    render(
      <DataTable
        columns={columns}
        data={[{ id: '1', name: 'Andi', status: 'Aktif' }]}
        rowId={(row) => row.id}
      />,
    )

    expect(screen.getByText('Aktif')).toBeInTheDocument()
    await user.click(screen.getByRole('button', { name: 'Kolom' }))
    await user.click(screen.getByRole('menuitemcheckbox', { name: 'Status' }))
    expect(screen.queryByText('Aktif')).not.toBeInTheDocument()
  })
})
