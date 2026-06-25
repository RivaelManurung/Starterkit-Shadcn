"use client"

import { useRealtimeSimulator } from "@/lib/realtime-simulator"

export function useRealtimeData() {
  const { onlineUsers } = useRealtimeSimulator()
  return { onlineUsers }
}
