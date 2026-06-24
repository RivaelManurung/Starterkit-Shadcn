"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useRouter } from "next/navigation"
import { useActivityStore } from "@/store/activity-store"
import { useSettingsStore } from "@/store/settings-store"
import Link from "next/link"

export default function SignInPage() {
  const router = useRouter()
  const currentUser = useSettingsStore(state => state.getCurrentUser())

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault()
    if (currentUser) {
      useActivityStore.getState().addLog({
        action: 'LOGIN',
        userId: currentUser.id,
        entityId: currentUser.id,
        entityType: 'User',
        entityTitle: currentUser.name,
      })
    }
    router.push('/overview')
  }

  return (
    <div className="flex h-screen w-full items-center justify-center bg-muted/30">
      <Card className="w-full max-w-sm">
        <CardHeader>
          <CardTitle className="text-2xl">Login</CardTitle>
          <CardDescription>
            Masukkan email untuk login ke dashboard.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleLogin} className="grid gap-4">
            <div className="grid gap-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="admin@cms.dev"
                required
                defaultValue="admin@cms.dev"
              />
            </div>
            <div className="grid gap-2">
              <div className="flex items-center">
                <Label htmlFor="password">Password</Label>
                <Link href="#" className="ml-auto inline-block text-sm underline text-muted-foreground">
                  Lupa password?
                </Link>
              </div>
              <Input id="password" type="password" required defaultValue="password" />
            </div>
            <Button type="submit" className="w-full">
              Login
            </Button>
            <Button variant="outline" className="w-full" type="button" onClick={handleLogin}>
              Login dengan Google
            </Button>
          </form>
          <div className="mt-4 text-center text-sm text-muted-foreground">
            Belum punya akun?{" "}
            <Link href="/sign-up" className="underline text-foreground">
              Daftar
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
