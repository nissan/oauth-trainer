import fs from "fs";
import path from "path";
import matter from "gray-matter";
import type {
  Module,
  ModuleMetadata,
  QuizMetadata,
  Lesson,
  LessonFrontmatter,
  CourseStructure,
} from "./content-types";

const CONTENT_DIR = path.join(process.cwd(), "content");
const MODULES_DIR = path.join(CONTENT_DIR, "modules");

/**
 * Get all module directories
 */
export function getModuleSlugs(): string[] {
  try {
    if (!fs.existsSync(MODULES_DIR)) {
      return [];
    }
    return fs
      .readdirSync(MODULES_DIR)
      .filter((file) => {
        const filePath = path.join(MODULES_DIR, file);
        return fs.statSync(filePath).isDirectory();
      })
      .sort(); // Sorts alphabetically (01-auth-fundamentals, 02-oauth-basics, etc.)
  } catch (error) {
    console.error("Error reading module slugs:", error);
    return [];
  }
}

/**
 * Get module metadata from module.json
 */
export function getModuleMetadata(moduleSlug: string): ModuleMetadata | null {
  try {
    const modulePath = path.join(MODULES_DIR, moduleSlug, "module.json");
    if (!fs.existsSync(modulePath)) {
      return null;
    }
    const content = fs.readFileSync(modulePath, "utf8");
    return JSON.parse(content) as ModuleMetadata;
  } catch (error) {
    console.error(`Error reading module metadata for ${moduleSlug}:`, error);
    return null;
  }
}

/**
 * Get quiz data from quiz.json
 */
export function getModuleQuiz(moduleSlug: string): QuizMetadata | null {
  try {
    const quizPath = path.join(MODULES_DIR, moduleSlug, "quiz.json");
    if (!fs.existsSync(quizPath)) {
      return null;
    }
    const content = fs.readFileSync(quizPath, "utf8");
    return JSON.parse(content) as QuizMetadata;
  } catch (error) {
    console.error(`Error reading quiz for ${moduleSlug}:`, error);
    return null;
  }
}

/**
 * Get all lesson slugs for a module
 */
export function getLessonSlugs(moduleSlug: string): string[] {
  try {
    const lessonsDir = path.join(MODULES_DIR, moduleSlug, "lessons");
    if (!fs.existsSync(lessonsDir)) {
      return [];
    }
    return fs
      .readdirSync(lessonsDir)
      .filter((file) => file.endsWith(".mdx"))
      .map((file) => file.replace(/\.mdx$/, ""))
      .sort(); // Sorts alphabetically (01-auth-vs-authz, 02-identity-providers, etc.)
  } catch (error) {
    console.error(`Error reading lesson slugs for ${moduleSlug}:`, error);
    return [];
  }
}

/**
 * Get lesson frontmatter and content
 */
export function getLesson(
  moduleSlug: string,
  lessonSlug: string
): Lesson | null {
  try {
    const lessonPath = path.join(
      MODULES_DIR,
      moduleSlug,
      "lessons",
      `${lessonSlug}.mdx`
    );
    if (!fs.existsSync(lessonPath)) {
      return null;
    }

    const fileContents = fs.readFileSync(lessonPath, "utf8");
    const { data, content } = matter(fileContents);

    return {
      slug: lessonSlug,
      moduleSlug,
      frontmatter: data as LessonFrontmatter,
      content,
    };
  } catch (error) {
    console.error(
      `Error reading lesson ${moduleSlug}/${lessonSlug}:`,
      error
    );
    return null;
  }
}

/**
 * Get all lessons for a module
 */
export function getModuleLessons(moduleSlug: string): Lesson[] {
  const lessonSlugs = getLessonSlugs(moduleSlug);
  return lessonSlugs
    .map((slug) => getLesson(moduleSlug, slug))
    .filter((lesson): lesson is Lesson => lesson !== null);
}

/**
 * Get complete module data (metadata + lessons + quiz)
 */
export function getModule(moduleSlug: string): Module | null {
  const metadata = getModuleMetadata(moduleSlug);
  if (!metadata) {
    return null;
  }

  const lessons = getModuleLessons(moduleSlug);
  const quiz = getModuleQuiz(moduleSlug);

  if (!quiz) {
    console.warn(`No quiz found for module ${moduleSlug}`);
  }

  return {
    metadata,
    lessons,
    quiz: quiz || { passingScore: 80, questions: [] },
  };
}

/**
 * Get all modules with their lessons
 */
export function getAllModules(): Module[] {
  const moduleSlugs = getModuleSlugs();
  return moduleSlugs
    .map((slug) => getModule(slug))
    .filter((module): module is Module => module !== null);
}

/**
 * Get complete course structure
 */
export function getCourseStructure(): CourseStructure {
  const modules = getAllModules();

  const totalLessons = modules.reduce(
    (sum, module) => sum + module.lessons.length,
    0
  );

  const totalHours = modules.reduce(
    (sum, module) => sum + module.metadata.estimatedHours,
    0
  );

  return {
    modules,
    totalLessons,
    totalHours,
  };
}

/**
 * Get the next lesson in the course (across modules)
 */
export function getNextLesson(
  currentModuleSlug: string,
  currentLessonSlug: string
): { moduleSlug: string; lessonSlug: string } | null {
  const modules = getAllModules();
  const currentModuleIndex = modules.findIndex(
    (m) => m.metadata.slug === currentModuleSlug
  );

  if (currentModuleIndex === -1) {
    return null;
  }

  const currentModule = modules[currentModuleIndex];
  const currentLessonIndex = currentModule.lessons.findIndex(
    (l) => l.slug === currentLessonSlug
  );

  if (currentLessonIndex === -1) {
    return null;
  }

  // Check if there's a next lesson in the current module
  if (currentLessonIndex < currentModule.lessons.length - 1) {
    return {
      moduleSlug: currentModuleSlug,
      lessonSlug: currentModule.lessons[currentLessonIndex + 1].slug,
    };
  }

  // Return null when last lesson of module is reached
  // This ensures users see the "Take Quiz" button instead of jumping to next module
  return null;
}

/**
 * Get the previous lesson in the course (across modules)
 */
export function getPreviousLesson(
  currentModuleSlug: string,
  currentLessonSlug: string
): { moduleSlug: string; lessonSlug: string } | null {
  const modules = getAllModules();
  const currentModuleIndex = modules.findIndex(
    (m) => m.metadata.slug === currentModuleSlug
  );

  if (currentModuleIndex === -1) {
    return null;
  }

  const currentModule = modules[currentModuleIndex];
  const currentLessonIndex = currentModule.lessons.findIndex(
    (l) => l.slug === currentLessonSlug
  );

  if (currentLessonIndex === -1) {
    return null;
  }

  // Check if there's a previous lesson in the current module
  if (currentLessonIndex > 0) {
    return {
      moduleSlug: currentModuleSlug,
      lessonSlug: currentModule.lessons[currentLessonIndex - 1].slug,
    };
  }

  // Check if there's a previous module
  if (currentModuleIndex > 0) {
    const previousModule = modules[currentModuleIndex - 1];
    if (previousModule.lessons.length > 0) {
      return {
        moduleSlug: previousModule.metadata.slug,
        lessonSlug:
          previousModule.lessons[previousModule.lessons.length - 1].slug,
      };
    }
  }

  return null;
}
