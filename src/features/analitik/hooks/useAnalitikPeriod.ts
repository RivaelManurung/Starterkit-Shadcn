import { useQueryState } from "nuqs"

export function useAnalitikPeriod() {
  return useQueryState("period", {
    defaultValue: "30d",
    clearOnDefault: true,
  })
}
export type PeriodType = "7d" | "30d" | "3m" | "1y"
