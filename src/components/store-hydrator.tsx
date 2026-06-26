"use client"

import { useEffect } from "react"
import { usePostStore } from "@/stores/post-store"
import { useActivityStore } from "@/stores/activity-store"
import { useCategoryStore } from "@/stores/category-store"
import { useNotificationStore } from "@/stores/notification-store"
import { useSettingsStore } from "@/stores/settings-store"
import { useTagStore } from "@/stores/tag-store"
import { useUserStore } from "@/stores/user-store"
import { usePenggunaStore } from "@/stores/usePenggunaStore"

/**
 * Rehydrates all Zustand persist stores from localStorage after mount.
 * This prevents hydration mismatches caused by localStorage data
 * differing from the server-rendered initial state.
 */
export function StoreHydrator() {
  useEffect(() => {
    usePostStore.persist.rehydrate()
    useActivityStore.persist.rehydrate()
    useCategoryStore.persist.rehydrate()
    useNotificationStore.persist.rehydrate()
    useSettingsStore.persist.rehydrate()
    useTagStore.persist.rehydrate()
    useUserStore.persist.rehydrate()
    usePenggunaStore.persist.rehydrate()
  }, [])

  return null
}
