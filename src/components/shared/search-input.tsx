"use client"

import * as React from "react"
import { Search } from "lucide-react"
import { Input } from "@/components/ui/input"

interface SearchInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  onSearch?: (value: string) => void
  debounceMs?: number
}

export function SearchInput({ 
  onSearch, 
  debounceMs = 300, 
  className,
  ...props 
}: SearchInputProps) {
  const [value, setValue] = React.useState(props.defaultValue || "")
  const [debouncedValue, setDebouncedValue] = React.useState(value)

  const onSearchRef = React.useRef(onSearch)
  React.useEffect(() => {
    onSearchRef.current = onSearch
  }, [onSearch])

  React.useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedValue(value)
    }, debounceMs)

    return () => clearTimeout(timer)
  }, [value, debounceMs])

  const isInitialMount = React.useRef(true)
  React.useEffect(() => {
    if (isInitialMount.current) {
      isInitialMount.current = false
      return
    }
    if (onSearchRef.current && typeof debouncedValue === "string") {
      onSearchRef.current(debouncedValue)
    }
  }, [debouncedValue])

  return (
    <div className={`relative ${className || ''}`}>
      <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
      <Input
        type="search"
        placeholder="Cari..."
        className="pl-8"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        {...props}
      />
    </div>
  )
}
