import { useQueryStates, parseAsString } from "nuqs"

export function usePenggunaFilters() {
  return useQueryStates(
    {
      search: parseAsString.withDefault(""),
      role: parseAsString.withDefault("all"),
    },
    {
      clearOnDefault: true,
    }
  )
}
