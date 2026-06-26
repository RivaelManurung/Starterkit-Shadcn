import { useQueryStates, parseAsString, parseAsInteger } from "nuqs"

export function useLogFilters() {
  return useQueryStates(
    {
      search: parseAsString.withDefault(""),
      user: parseAsString.withDefault("all"),
      action: parseAsString.withDefault("all"),
      page: parseAsInteger.withDefault(1),
      dateFrom: parseAsString,
      dateTo: parseAsString,
    },
    {
      clearOnDefault: true,
    }
  )
}
