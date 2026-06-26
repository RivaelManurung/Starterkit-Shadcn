"use client"

import * as React from "react"
import { Button } from "@/components/ui/button"
import { SearchInput } from "@/components/shared/search-input"
import { DatePickerWithRange } from "@/components/shared/date-range-picker"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { useCategoryStore } from "@/stores/category-store"
import { DateRange } from "react-day-picker"
import { useArtikelFilters } from "../hooks/useArtikelFilters"

export function ArtikelFilters() {
  const [filters, setFilters] = useArtikelFilters()
  const { search, status, kategori, dateFrom, dateTo } = filters

  const categories = useCategoryStore((state) => state.categories)

  const selectedCategoryName = React.useMemo(() => {
    if (!kategori || kategori === "all") return "Semua Kategori"
    return categories.find(c => c.id === kategori)?.name || kategori
  }, [kategori, categories])

  const selectedStatusLabel = React.useMemo(() => {
    if (!status || status === "all") return "Semua Status"
    const labels: Record<string, string> = {
      published: "Published",
      draft: "Draft",
      scheduled: "Scheduled",
      archived: "Archived",
    }
    return labels[status] || status
  }, [status])

  const handleDateChange = (range: DateRange | undefined) => {
    setFilters({
      dateFrom: range?.from ? range.from.toISOString() : null,
      dateTo: range?.to ? range.to.toISOString() : null,
      page: 1,
    })
  }

  const dateRange: DateRange | undefined =
    dateFrom || dateTo
      ? {
          from: dateFrom ? new Date(dateFrom) : undefined,
          to: dateTo ? new Date(dateTo) : undefined,
        }
      : undefined

  const handleReset = () => {
    setFilters({
      search: "",
      status: "all",
      kategori: "all",
      page: 1,
      dateFrom: null,
      dateTo: null,
    })
  }

  return (
    <div className="flex flex-col md:flex-row gap-4 items-center mb-4 w-full">
      <SearchInput
        className="w-full md:w-[280px]"
        defaultValue={search || ""}
        onSearch={(val) => setFilters({ search: val || null, page: 1 })}
      />

      <Select
        value={status || "all"}
        onValueChange={(val) => setFilters({ status: val === "all" ? null : val, page: 1 })}
      >
        <SelectTrigger className="w-full md:w-[150px] h-9 rounded-lg">
          <SelectValue placeholder="Status">
            {selectedStatusLabel}
          </SelectValue>
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">Semua Status</SelectItem>
          <SelectItem value="published">Published</SelectItem>
          <SelectItem value="draft">Draft</SelectItem>
          <SelectItem value="scheduled">Scheduled</SelectItem>
          <SelectItem value="archived">Archived</SelectItem>
        </SelectContent>
      </Select>

      <Select
        value={kategori || "all"}
        onValueChange={(val) => setFilters({ kategori: val === "all" ? null : val, page: 1 })}
      >
        <SelectTrigger className="w-full md:w-[180px] h-9 rounded-lg">
          <SelectValue placeholder="Kategori">
            {selectedCategoryName}
          </SelectValue>
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">Semua Kategori</SelectItem>
          {categories.map((c) => (
            <SelectItem key={c.id} value={c.id}>
              {c.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <DatePickerWithRange date={dateRange} setDate={handleDateChange} className="w-full md:w-auto" />

      <Button variant="ghost" onClick={handleReset} className="h-9 px-3 rounded-lg text-xs">
        Reset
      </Button>
    </div>
  )
}
