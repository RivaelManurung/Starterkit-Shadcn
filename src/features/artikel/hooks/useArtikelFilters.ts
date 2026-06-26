import { useQueryStates, parseAsString, parseAsInteger } from "nuqs"

export function useArtikelFilters() {
  return useQueryStates(
    {
      search: parseAsString.withDefault(""),
      status: parseAsString.withDefault("all"),
      kategori: parseAsString.withDefault("all"),
      page: parseAsInteger.withDefault(1),
      perPage: parseAsInteger.withDefault(10),
      dateFrom: parseAsString,
      dateTo: parseAsString,
    },
    {
      clearOnDefault: true,
    }
  )
}
