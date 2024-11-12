'use client'

import { signIn, signOut } from "next-auth/react"
import { Button } from "@/components/ui/button"
import { useSession } from "next-auth/react"

export function LoginButton() {
    return (
        <Button onClick={() => signIn('google', { callbackUrl: '/dashboard' })}>
            Sign in with Google
        </Button>
    )
}

export function LogoutButton() {
    return (
        <Button variant="outline" onClick={() => signOut()}>
            Sign Out
        </Button>
    )
}

export function AuthStatus() {
    const { data: session } = useSession()

    if (session) {
        return (
            <div>
                {session.user?.email} <LogoutButton />
            </div>
        )
    }

    return <LoginButton />
}