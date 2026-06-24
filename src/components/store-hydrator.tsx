"use client"

import { useEffect } from "react"
import { usePostStore } from "@/store/post-store"
import { useActivityStore } from "@/store/activity-store"
import { useCategoryStore } from "@/store/category-store"
import { useNotificationStore } from "@/store/notification-store"
import { useSettingsStore } from "@/store/settings-store"
import { useTagStore } from "@/store/tag-store"
import { useUserStore } from "@/store/user-store"

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
  }, [])

  return null
}
