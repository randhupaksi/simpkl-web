import { useState } from 'react'

export function useListState(defaultPageSize = 20) {
  const [pagination, setPagination] = useState({
    pageIndex: 0,
    pageSize: defaultPageSize,
  })
  const [search, setSearchValue] = useState('')

  function setSearch(value: string) {
    setSearchValue(value)
    setPagination((current) => ({ ...current, pageIndex: 0 }))
  }

  return { pagination, setPagination, search, setSearch }
}
