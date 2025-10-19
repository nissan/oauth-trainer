"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Lock, Unlock } from "lucide-react"

interface PasswordGateProps {
  password: string
  moduleId: string
  children: React.ReactNode
}

const STORAGE_KEY_PREFIX = "oauth_trainer_password_"

export function PasswordGate({ password, moduleId, children }: PasswordGateProps) {
  const [enteredPassword, setEnteredPassword] = useState("")
  const [isUnlocked, setIsUnlocked] = useState(false)
  const [error, setError] = useState(false)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    // Check if password was previously entered
    const storageKey = `${STORAGE_KEY_PREFIX}${moduleId}`
    const savedPassword = localStorage.getItem(storageKey)
    if (savedPassword === password) {
      setIsUnlocked(true)
    }
  }, [moduleId, password])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (enteredPassword === password) {
      setIsUnlocked(true)
      setError(false)
      // Save to localStorage
      const storageKey = `${STORAGE_KEY_PREFIX}${moduleId}`
      localStorage.setItem(storageKey, password)
    } else {
      setError(true)
      setTimeout(() => setError(false), 2000)
    }
  }

  if (!mounted) {
    return null
  }

  if (isUnlocked) {
    return <>{children}</>
  }

  return (
    <div className="flex min-h-[60vh] items-center justify-center">
      <Card className="w-full max-w-md border-primary/30">
        <CardHeader>
          <div className="mb-4 flex justify-center">
            <div className="rounded-full bg-primary/10 p-4">
              <Lock className="h-8 w-8 text-primary" />
            </div>
          </div>
          <CardTitle className="text-center text-2xl">Password Required</CardTitle>
          <CardDescription className="text-center">
            This is a premium module. Enter the password to access the Applied Case Study.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Input
                type="password"
                placeholder="Enter password"
                value={enteredPassword}
                onChange={(e) => setEnteredPassword(e.target.value)}
                className={error ? "border-destructive" : ""}
              />
              {error && (
                <p className="text-sm text-destructive">
                  Incorrect password. Please try again.
                </p>
              )}
              <p className="text-xs text-muted-foreground">
                Hint: Company name + year (check the course materials)
              </p>
            </div>
            <Button type="submit" className="w-full">
              <Unlock className="mr-2 h-4 w-4" />
              Unlock Module
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
