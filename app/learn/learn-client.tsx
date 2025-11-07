"use client"

import Link from "next/link"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { captureEvent } from "@/lib/analytics"
import type { Module } from "@/types"

interface LearnClientProps {
  modules: Module[]
}

export function LearnClient({ modules }: LearnClientProps) {
  return (
    <div className="container mx-auto px-4 py-12">
      <div className="mb-12 text-center">
        <h1 className="mb-4 text-4xl font-bold tracking-tight lg:text-5xl">
          Learning Modules
        </h1>
        <p className="mx-auto max-w-2xl text-lg text-muted-foreground">
          Master Identity and Access Management through comprehensive, hands-on modules
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {modules.map((module) => (
          <Card key={module.id} className="flex flex-col">
            <CardHeader>
              <div className="mb-2 flex items-center gap-2">
                <Badge variant={module.difficulty === "beginner" ? "default" : module.difficulty === "intermediate" ? "secondary" : "advanced"}>
                  {module.difficulty}
                </Badge>
                <span className="text-sm text-muted-foreground">
                  {module.estimatedHours}h
                </span>
              </div>
              <CardTitle className="text-xl">{module.title}</CardTitle>
              <CardDescription className="line-clamp-2">
                {module.description}
              </CardDescription>
            </CardHeader>
            <CardContent className="flex flex-1 flex-col justify-end">
              {module.learningObjectives && module.learningObjectives.length > 0 && (
                <div className="mb-4 space-y-2">
                  <p className="text-sm font-medium">Learning Objectives:</p>
                  <ul className="space-y-1 text-sm text-muted-foreground">
                    {module.learningObjectives.slice(0, 3).map((objective, i) => (
                      <li key={i} className="flex gap-2">
                        <span className="text-primary">•</span>
                        <span className="line-clamp-1">{objective}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
              <div className="flex flex-col gap-2">
                <Link href={`/learn/${module.slug}`}>
                  <Button
                    className="w-full"
                    onClick={() => captureEvent('learning-module-clicked', {
                      module_id: module.id,
                      module_slug: module.slug,
                      module_title: module.title,
                      module_difficulty: module.difficulty
                    })}
                  >
                    View Module
                  </Button>
                </Link>
                <div className="text-center text-sm text-muted-foreground">
                  {module.lessons.length} lessons
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
