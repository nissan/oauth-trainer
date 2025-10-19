"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { modules } from "@/data/modules"
import { getUserProgress, recordQuizAttempt, awardBadge } from "@/lib/storage"
import type { QuizQuestion } from "@/types"

const PASSING_SCORE = 80 // 80% to pass

export default function QuizPage({ params }: { params: Promise<{ moduleSlug: string }> }) {
  const router = useRouter()
  const [moduleSlug, setModuleSlug] = useState<string | null>(null)

  // Unwrap params promise
  useEffect(() => {
    params.then((p) => setModuleSlug(p.moduleSlug))
  }, [params])

  // Find the module
  const module = modules.find((m) => m.slug === moduleSlug)

  // Show loading state while params are being resolved
  if (!moduleSlug) {
    return <div className="container mx-auto px-4 py-8">Loading...</div>
  }

  // State management
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)
  const [selectedAnswers, setSelectedAnswers] = useState<number[]>([])
  const [quizCompleted, setQuizCompleted] = useState(false)
  const [score, setScore] = useState(0)
  const [showExplanation, setShowExplanation] = useState(false)
  const [userProgress, setUserProgress] = useState(getUserProgress())

  // Get current question
  const quiz = module?.quiz
  const questions = Array.isArray(quiz) ? quiz : (quiz?.questions || [])
  const currentQuestion = questions[currentQuestionIndex]
  const totalQuestions = questions.length

  // Calculate progress
  const progressPercent = ((currentQuestionIndex + 1) / totalQuestions) * 100

  // Check if module exists
  if (!module) {
    return (
      <div className="container mx-auto max-w-4xl px-4 py-16">
        <Card>
          <CardHeader>
            <CardTitle>Module Not Found</CardTitle>
            <CardDescription>The requested module could not be found.</CardDescription>
          </CardHeader>
          <CardContent>
            <Link href="/learn">
              <Button>Back to Learning Hub</Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    )
  }

  // Handle answer selection
  const handleSelectAnswer = (answerIndex: number) => {
    if (quizCompleted || showExplanation) return

    const newAnswers = [...selectedAnswers]
    newAnswers[currentQuestionIndex] = answerIndex
    setSelectedAnswers(newAnswers)
  }

  // Handle submitting current question
  const handleSubmitAnswer = () => {
    if (selectedAnswers[currentQuestionIndex] === undefined) return
    setShowExplanation(true)
  }

  // Handle moving to next question
  const handleNextQuestion = () => {
    setShowExplanation(false)

    if (currentQuestionIndex < totalQuestions - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1)
    } else {
      // Quiz completed - calculate final score
      finishQuiz()
    }
  }

  // Handle going back to previous question
  const handlePreviousQuestion = () => {
    if (currentQuestionIndex > 0) {
      setShowExplanation(false)
      setCurrentQuestionIndex(currentQuestionIndex - 1)
    }
  }

  // Calculate score and finish quiz
  const finishQuiz = () => {
    let correctCount = 0

    questions.forEach((question, index) => {
      if (selectedAnswers[index] === question.correctAnswer) {
        correctCount++
      }
    })

    const finalScore = Math.round((correctCount / totalQuestions) * 100)
    setScore(finalScore)
    setQuizCompleted(true)

    // Record quiz attempt
    recordQuizAttempt(module.id, {
      quizId: module.id,
      score: finalScore,
      correctAnswers: correctCount,
      totalQuestions,
      answers: selectedAnswers.reduce((acc, answer, idx) => {
        const questionId = questions[idx].id || `q-${idx}`
        acc[questionId] = answer
        return acc
      }, {} as Record<string, number>),
      passed: finalScore >= PASSING_SCORE,
    })

    // Award badge if passed
    if (finalScore >= PASSING_SCORE && module.badge) {
      awardBadge(module.id, module.badge.id)
    }

    // Refresh progress
    setUserProgress(getUserProgress())
  }

  // Handle retry
  const handleRetry = () => {
    setCurrentQuestionIndex(0)
    setSelectedAnswers([])
    setQuizCompleted(false)
    setScore(0)
    setShowExplanation(false)
  }

  // Get module progress
  const moduleProgress = userProgress.moduleProgress[module.id]
  const previousAttempts = moduleProgress?.quizAttempts || []
  const bestScore = previousAttempts.length > 0 ? Math.max(...previousAttempts.map((a) => a.score)) : 0

  // Quiz completion view
  if (quizCompleted) {
    const passed = score >= PASSING_SCORE
    const isNewBest = score > bestScore

    return (
      <div className="container mx-auto max-w-4xl px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <nav className="mb-4 text-sm text-muted-foreground">
            <Link href="/learn" className="hover:text-foreground">
              Learning Hub
            </Link>
            {" / "}
            <Link href={`/learn/${moduleSlug}`} className="hover:text-foreground">
              {module.title}
            </Link>
            {" / "}
            <span className="text-foreground">Quiz Results</span>
          </nav>
        </div>

        {/* Results Card */}
        <Card className={`border-2 ${passed ? "border-success" : "border-destructive"}`}>
          <CardHeader className="text-center">
            <div className="mb-4 text-6xl">{passed ? "🎉" : "📚"}</div>
            <CardTitle className="text-3xl">
              {passed ? "Congratulations! You Passed!" : "Keep Learning!"}
            </CardTitle>
            <CardDescription className="text-lg">
              You scored {score}% ({selectedAnswers.filter((ans, idx) => ans === questions[idx].correctAnswer).length} out of {totalQuestions} correct)
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-6">
            {/* Score Progress Bar */}
            <div>
              <div className="mb-2 flex justify-between text-sm">
                <span>Your Score</span>
                <span className="font-semibold">{score}%</span>
              </div>
              <Progress value={score} className="h-3" />
              <div className="mt-2 flex justify-between text-xs text-muted-foreground">
                <span>Passing: {PASSING_SCORE}%</span>
                {isNewBest && <span className="text-success font-semibold">New Best Score! 🌟</span>}
              </div>
            </div>

            {/* Badge Earned */}
            {passed && module.badge && (
              <Card className="border-success bg-success/5">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-lg">
                    <span className="text-2xl">{module.badge.icon}</span>
                    Badge Earned!
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-start gap-4">
                    <div className="text-5xl">{module.badge.icon}</div>
                    <div>
                      <h3 className="font-bold text-lg mb-1">{module.badge.name}</h3>
                      <p className="text-sm text-muted-foreground">{module.badge.description}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Failed Message */}
            {!passed && (
              <Card className="border-destructive bg-destructive/5">
                <CardContent className="pt-6">
                  <p className="text-sm">
                    You need {PASSING_SCORE}% or higher to pass. Review the lessons and try again when you're ready!
                  </p>
                </CardContent>
              </Card>
            )}

            {/* Previous Attempts */}
            {previousAttempts.length > 0 && (
              <div>
                <h3 className="font-semibold mb-3 text-sm">Previous Attempts</h3>
                <div className="space-y-2">
                  {previousAttempts.slice(-5).reverse().map((attempt, index) => (
                    <div key={index} className="flex justify-between text-sm p-3 rounded-lg bg-muted/50">
                      <span className="text-muted-foreground">
                        {new Date(attempt.completedAt).toLocaleDateString()} at {new Date(attempt.completedAt).toLocaleTimeString()}
                      </span>
                      <span className={`font-semibold ${attempt.score >= PASSING_SCORE ? "text-success" : "text-destructive"}`}>
                        {attempt.score}%
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex gap-3 pt-4">
              <Button onClick={handleRetry} variant="outline" className="flex-1">
                Retry Quiz
              </Button>
              <Link href={`/learn/${moduleSlug}`} className="flex-1">
                <Button variant="default" className="w-full">
                  Back to Module
                </Button>
              </Link>
              {passed && (
                <Link href="/learn" className="flex-1">
                  <Button variant="default" className="w-full">
                    Continue Learning →
                  </Button>
                </Link>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Review Answers */}
        <Card className="mt-6">
          <CardHeader>
            <CardTitle>Review Your Answers</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {questions.map((question, index) => {
              const userAnswer = selectedAnswers[index]
              const isCorrect = userAnswer === question.correctAnswer

              return (
                <div key={index} className="pb-6 border-b last:border-b-0">
                  <div className="flex items-start gap-3 mb-3">
                    <Badge variant={isCorrect ? "default" : "destructive"} className="mt-1">
                      {isCorrect ? "✓" : "✗"}
                    </Badge>
                    <div className="flex-1">
                      <p className="font-semibold mb-3">
                        {index + 1}. {question.question}
                      </p>
                      <div className="space-y-2">
                        {question.options.map((option, optIndex) => {
                          const isUserAnswer = userAnswer === optIndex
                          const isCorrectAnswer = question.correctAnswer === optIndex

                          return (
                            <div
                              key={optIndex}
                              className={`p-3 rounded-lg border ${
                                isCorrectAnswer
                                  ? "border-success bg-success/10"
                                  : isUserAnswer
                                    ? "border-destructive bg-destructive/10"
                                    : "border-border bg-muted/30"
                              }`}
                            >
                              <div className="flex items-center gap-2">
                                {isCorrectAnswer && <span className="text-success">✓</span>}
                                {isUserAnswer && !isCorrectAnswer && <span className="text-destructive">✗</span>}
                                <span className={isCorrectAnswer ? "font-semibold" : ""}>{option}</span>
                              </div>
                            </div>
                          )
                        })}
                      </div>
                      {question.explanation && (
                        <div className="mt-3 p-3 bg-muted/50 rounded-lg text-sm">
                          <p className="font-semibold mb-1">Explanation:</p>
                          <p className="text-muted-foreground">{question.explanation}</p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )
            })}
          </CardContent>
        </Card>
      </div>
    )
  }

  // Quiz in progress view
  return (
    <div className="container mx-auto max-w-4xl px-4 py-8">
      {/* Header */}
      <div className="mb-8">
        <nav className="mb-4 text-sm text-muted-foreground">
          <Link href="/learn" className="hover:text-foreground">
            Learning Hub
          </Link>
          {" / "}
          <Link href={`/learn/${moduleSlug}`} className="hover:text-foreground">
            {module.title}
          </Link>
          {" / "}
          <span className="text-foreground">Quiz</span>
        </nav>

        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-3xl font-bold mb-2">{module.title} - Quiz</h1>
            <p className="text-muted-foreground">
              Question {currentQuestionIndex + 1} of {totalQuestions}
            </p>
          </div>
          {bestScore > 0 && (
            <Badge variant="outline" className="text-sm">
              Best Score: {bestScore}%
            </Badge>
          )}
        </div>

        {/* Progress Bar */}
        <div>
          <Progress value={progressPercent} className="h-2" />
        </div>
      </div>

      {/* Question Card */}
      <Card>
        <CardHeader>
          <CardTitle className="text-xl">
            {currentQuestionIndex + 1}. {currentQuestion.question}
          </CardTitle>
        </CardHeader>

        <CardContent className="space-y-4">
          {/* Answer Options */}
          <div className="space-y-3">
            {currentQuestion.options.map((option, index) => {
              const isSelected = selectedAnswers[currentQuestionIndex] === index
              const isCorrect = index === currentQuestion.correctAnswer
              const showResult = showExplanation

              return (
                <button
                  key={index}
                  onClick={() => handleSelectAnswer(index)}
                  disabled={showExplanation}
                  className={`w-full p-4 text-left rounded-lg border-2 transition-all ${
                    showResult && isCorrect
                      ? "border-success bg-success/10"
                      : showResult && isSelected && !isCorrect
                        ? "border-destructive bg-destructive/10"
                        : isSelected
                          ? "border-accent bg-accent/10"
                          : "border-border bg-card hover:border-accent/50 hover:bg-accent/5"
                  } ${showExplanation ? "cursor-not-allowed" : "cursor-pointer"}`}
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                        showResult && isCorrect
                          ? "border-success bg-success text-success-foreground"
                          : showResult && isSelected && !isCorrect
                            ? "border-destructive bg-destructive text-destructive-foreground"
                            : isSelected
                              ? "border-accent bg-accent text-accent-foreground"
                              : "border-muted-foreground"
                      }`}
                    >
                      {showResult && isCorrect && "✓"}
                      {showResult && isSelected && !isCorrect && "✗"}
                      {!showResult && isSelected && "●"}
                    </div>
                    <span className={showResult && isCorrect ? "font-semibold" : ""}>{option}</span>
                  </div>
                </button>
              )
            })}
          </div>

          {/* Explanation (shown after answering) */}
          {showExplanation && currentQuestion.explanation && (
            <Card className="bg-muted/50 border-accent/50">
              <CardContent className="pt-6">
                <p className="font-semibold mb-2">Explanation:</p>
                <p className="text-sm text-muted-foreground">{currentQuestion.explanation}</p>
              </CardContent>
            </Card>
          )}

          {/* Navigation Buttons */}
          <div className="flex gap-3 pt-4">
            <Button onClick={handlePreviousQuestion} variant="outline" disabled={currentQuestionIndex === 0}>
              ← Previous
            </Button>

            {!showExplanation ? (
              <Button
                onClick={handleSubmitAnswer}
                disabled={selectedAnswers[currentQuestionIndex] === undefined}
                className="flex-1"
              >
                Submit Answer
              </Button>
            ) : (
              <Button onClick={handleNextQuestion} className="flex-1">
                {currentQuestionIndex < totalQuestions - 1 ? "Next Question →" : "Finish Quiz"}
              </Button>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Quiz Info */}
      <Card className="mt-6 bg-muted/50">
        <CardContent className="pt-6">
          <div className="flex items-start gap-3">
            <span className="text-2xl">💡</span>
            <div className="text-sm">
              <p className="font-semibold mb-1">Quiz Tips</p>
              <ul className="text-muted-foreground space-y-1 list-disc list-inside">
                <li>You need {PASSING_SCORE}% to pass this quiz</li>
                <li>You can retry the quiz as many times as you need</li>
                <li>Take your time and read each question carefully</li>
                <li>Review the lesson content if you're unsure</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
