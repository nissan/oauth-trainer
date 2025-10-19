"use client"

import type { Badge as BadgeType } from "@/types"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

interface BadgeDisplayProps {
  badge: BadgeType
  earned: boolean
  earnedAt?: Date
}

export function BadgeDisplay({ badge, earned, earnedAt }: BadgeDisplayProps) {
  return (
    <Card
      className={`text-center transition-all ${
        earned
          ? "border-success/50 bg-success/5 shadow-md"
          : "opacity-50 grayscale"
      }`}
    >
      <CardHeader>
        <div className="mx-auto text-6xl">{badge.icon}</div>
        <CardTitle className="text-lg">{badge.name}</CardTitle>
        <CardDescription>{badge.description}</CardDescription>
      </CardHeader>

      {earned && earnedAt && (
        <CardContent>
          <div className="text-xs text-success-foreground">
            Earned on {new Date(earnedAt).toLocaleDateString()}
          </div>
        </CardContent>
      )}

      {!earned && (
        <CardContent>
          <div className="text-xs text-muted-foreground">
            🔒 Complete module to earn
          </div>
        </CardContent>
      )}
    </Card>
  )
}
