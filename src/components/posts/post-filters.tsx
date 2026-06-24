"use client"

import { Button } from "@/components/ui/button"
import { usePostStore } from "@/stores/post-store"
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
import { PostStatus } from "@/types"

export function PostFilters() {
  const filters = usePostStore(state => state.filters)
  const setFilters = usePostStore(state => state.setFilters)
  const resetFilters = usePostStore(state => state.resetFilters)

  const categories = useCategoryStore(state => state.categories)

  const handleDateChange = (range: DateRange | undefined) => {
    setFilters({
      dateFrom: range?.from ? range.from.toISOString() : null,
      dateTo: range?.to ? range.to.toISOString() : null,
    })
  }

  const dateRange: DateRange | undefined = (filters.dateFrom || filters.dateTo) ? {
    from: filters.dateFrom ? new Date(filters.dateFrom) : undefined,
    to: filters.dateTo ? new Date(filters.dateTo) : undefined,
  } : undefined

  return (
    <div className="flex flex-col md:flex-row gap-4 items-center mb-4">
      <SearchInput 
        className="w-full md:w-[300px]" 
        defaultValue={filters.search}
        onSearch={(search) => setFilters({ search, page: 1 })}
      />
      
      <Select 
        value={filters.status} 
        onValueChange={(val) => setFilters({ status: val as PostStatus | 'ALL', page: 1 })}
      >
        <SelectTrigger className="w-full md:w-[150px]">
          <SelectValue placeholder="Status" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="ALL">Semua Status</SelectItem>
          <SelectItem value="PUBLISHED">Published</SelectItem>
          <SelectItem value="DRAFT">Draft</SelectItem>
          <SelectItem value="SCHEDULED">Scheduled</SelectItem>
          <SelectItem value="ARCHIVED">Archived</SelectItem>
        </SelectContent>
      </Select>

      <Select 
        value={filters.categoryId || "ALL"} 
        onValueChange={(val) => setFilters({ categoryId: val === "ALL" ? null : val, page: 1 })}
      >
        <SelectTrigger className="w-full md:w-[180px]">
          <SelectValue placeholder="Kategori" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="ALL">Semua Kategori</SelectItem>
          {categories.map((c: any) => (
            <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>
          ))}
        </SelectContent>
      </Select>

      <DatePickerWithRange 
        date={dateRange} 
        setDate={handleDateChange} 
      />

      <Button variant="ghost" onClick={resetFilters}>
        Reset
      </Button>
    </div>
  )
}
