/**
 * TypeScript type definitions for MDX-based content
 */

export interface LessonFrontmatter {
  title: string;
  description: string;
  slug: string;
  duration: number; // in minutes
  order: number;
  keyTakeaways: string[];
  prerequisites?: string[]; // slugs of prerequisite lessons
}

export interface ModuleMetadata {
  id: string;
  slug: string;
  order: number;
  title: string;
  description: string;
  difficulty: "beginner" | "intermediate" | "expert" | "advanced";
  estimatedHours: number;
  badge: {
    name: string;
    icon: string;
    description: string;
  };
  learningObjectives: string[];
  prerequisiteModules: string[]; // slugs of prerequisite modules
  requiresPassword?: boolean; // if true, module requires password to access
  password?: string; // the password required to access the module
}

export interface QuizQuestion {
  id: string;
  question: string;
  options: string[];
  correctAnswer: number; // index of correct option
  explanation: string;
}

export interface QuizMetadata {
  passingScore: number; // percentage
  questions: QuizQuestion[];
}

export interface Lesson {
  slug: string;
  moduleSlug: string;
  frontmatter: LessonFrontmatter;
  content: string; // raw MDX content
  Component?: React.ComponentType; // dynamic import result
}

export interface Module {
  metadata: ModuleMetadata;
  lessons: Lesson[];
  quiz: QuizMetadata;
}

export interface CourseStructure {
  modules: Module[];
  totalLessons: number;
  totalHours: number;
}
