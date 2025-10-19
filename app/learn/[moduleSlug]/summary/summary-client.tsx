"use client";

import { useEffect, useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { getAllCaseStudyResponses } from "@/lib/storage";
import { Download, Share2, Twitter } from "lucide-react";

interface Lesson {
  id: string;
  slug: string;
  title: string;
  description: string;
}

interface SummaryClientProps {
  moduleSlug: string;
  moduleId: string;
  moduleTitle: string;
  lessons: Lesson[];
}

export function SummaryClient({
  moduleSlug,
  moduleId,
  moduleTitle,
  lessons,
}: SummaryClientProps) {
  const [mounted, setMounted] = useState(false);
  const [responses, setResponses] = useState<Record<string, string>>({});
  const [isGeneratingPDF, setIsGeneratingPDF] = useState(false);
  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setMounted(true);
    const allResponses = getAllCaseStudyResponses(moduleId);
    setResponses(allResponses);
  }, [moduleId]);

  if (!mounted) {
    return null;
  }

  const completedCount = Object.keys(responses).length;
  const totalLessons = lessons.length;

  const handleDownloadPDF = async () => {
    setIsGeneratingPDF(true);
    try {
      // Dynamic import of jsPDF to reduce bundle size
      const { default: jsPDF } = await import("jspdf");
      const doc = new jsPDF();

      // Title page
      doc.setFontSize(24);
      doc.text("Applied IAM Case Study", 20, 30);
      doc.setFontSize(16);
      doc.text(moduleTitle, 20, 45);

      doc.setFontSize(12);
      doc.text(`Completed by: ${new Date().toLocaleDateString()}`, 20, 60);
      doc.text(`Lessons Completed: ${completedCount}/${totalLessons}`, 20, 70);

      doc.setFontSize(10);
      doc.text("Generated with ReddiTech's Curious Auth Builder", 20, 280);
      doc.text("#reddilearner", 20, 287);

      // Add responses for each lesson
      let yPos = 90;
      let pageCount = 1;

      for (const lesson of lessons) {
        const response = responses[lesson.id];
        if (!response) continue;

        // Check if we need a new page
        if (yPos > 250) {
          doc.addPage();
          pageCount++;
          yPos = 20;
        }

        // Lesson title
        doc.setFontSize(14);
        doc.setFont("helvetica", "bold");
        doc.text(lesson.title, 20, yPos);
        yPos += 10;

        // Response
        doc.setFontSize(10);
        doc.setFont("helvetica", "normal");
        const lines = doc.splitTextToSize(response, 170);

        for (const line of lines) {
          if (yPos > 280) {
            doc.addPage();
            pageCount++;
            yPos = 20;
          }
          doc.text(line, 20, yPos);
          yPos += 5;
        }

        yPos += 10; // Space between lessons
      }

      // Save PDF
      const fileName = `apex-defense-iam-case-study-${new Date().getTime()}.pdf`;
      doc.save(fileName);
    } catch (error) {
      console.error("Error generating PDF:", error);
      alert("Failed to generate PDF. Please try again.");
    } finally {
      setIsGeneratingPDF(false);
    }
  };

  const handleShareTwitter = () => {
    const text = `Just completed the Applied IAM Case Study: ${moduleTitle}! 🔐 ${completedCount}/${totalLessons} lessons analyzed. #reddilearner`;
    const url = encodeURIComponent(window.location.origin + `/learn/${moduleSlug}`);
    window.open(
      `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${url}`,
      "_blank"
    );
  };

  const handleShareLinkedIn = () => {
    const url = encodeURIComponent(window.location.origin + `/learn/${moduleSlug}`);
    window.open(
      `https://www.linkedin.com/sharing/share-offsite/?url=${url}`,
      "_blank"
    );
  };

  return (
    <div>
      {/* Header Card */}
      <Card className="mb-8 border-primary/30">
        <CardHeader>
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <CardTitle className="mb-2 text-3xl">
                Case Study Complete! 🎉
              </CardTitle>
              <CardDescription className="text-base">
                You've completed {completedCount} of {totalLessons} lessons in
                the {moduleTitle}.
              </CardDescription>
            </div>
            <Badge variant="success" className="text-lg">
              {completedCount}/{totalLessons}
            </Badge>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-3">
            <Button
              onClick={handleDownloadPDF}
              disabled={isGeneratingPDF || completedCount === 0}
              size="lg"
            >
              <Download className="mr-2 h-4 w-4" />
              {isGeneratingPDF ? "Generating..." : "Download PDF"}
            </Button>
            <Button
              onClick={handleShareTwitter}
              variant="outline"
              size="lg"
              disabled={completedCount === 0}
            >
              <Twitter className="mr-2 h-4 w-4" />
              Share on Twitter
            </Button>
            <Button
              onClick={handleShareLinkedIn}
              variant="outline"
              size="lg"
              disabled={completedCount === 0}
            >
              <Share2 className="mr-2 h-4 w-4" />
              Share on LinkedIn
            </Button>
          </div>
          <p className="mt-4 text-sm text-muted-foreground">
            Share your achievement with #reddilearner to connect with other IAM
            learners!
          </p>
        </CardContent>
      </Card>

      {/* Summary Content */}
      <div ref={contentRef} className="space-y-8">
        <div className="prose dark:prose-invert max-w-none">
          <h2 className="text-2xl font-bold">Your Analysis Summary</h2>
          <p className="text-muted-foreground">
            Below is a compilation of all your responses to the Apex Defense
            Systems IAM case study. This document demonstrates your ability to
            apply IAM concepts to real-world scenarios.
          </p>
        </div>

        {lessons.map((lesson) => {
          const response = responses[lesson.id];
          if (!response) {
            return (
              <Card key={lesson.id} className="border-muted">
                <CardHeader>
                  <CardTitle className="text-xl">{lesson.title}</CardTitle>
                  <CardDescription>{lesson.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-sm italic text-muted-foreground">
                    No response provided yet.
                  </p>
                </CardContent>
              </Card>
            );
          }

          return (
            <Card key={lesson.id} className="border-primary/20">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <CardTitle className="text-xl">{lesson.title}</CardTitle>
                    <CardDescription>{lesson.description}</CardDescription>
                  </div>
                  <Badge variant="success">Completed</Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="prose dark:prose-invert max-w-none">
                  <div className="whitespace-pre-wrap rounded-lg bg-muted p-4">
                    {response}
                  </div>
                </div>
                <div className="mt-4 text-sm text-muted-foreground">
                  {response.split(/\s+/).length} words
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {completedCount === 0 && (
        <Card className="mt-8 border-warning/50 bg-warning/5">
          <CardContent className="pt-6">
            <p className="text-center text-muted-foreground">
              You haven't completed any lessons yet. Go back and start working
              on the case study!
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
