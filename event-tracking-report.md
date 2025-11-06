# Event tracking report

This document lists all PostHog events that have been automatically added to your Next.js application.

## Events by File

### app/home-client.tsx

- **learning_cta_clicked**: User clicked on a primary call-to-action button to start or continue their learning journey.
- **progress_cta_clicked**: User clicked on the secondary call-to-action button in the hero section to view their progress or learn more.

### app/learn/page.tsx

- **learning-module-clicked**: Tracks a click on the 'View Module' button for a specific learning module on the main learn page.

### app/learn/[moduleSlug]/module-client.tsx

- **learning_module_cta_clicked**: Fired when a user clicks the main call-to-action button to start, continue, or review lessons in a module.
- **module_quiz_cta_clicked**: Fired when a user clicks the button to take or retake a module quiz.

### app/learn/[moduleSlug]/[lessonSlug]/lesson-client.tsx

- **lesson_marked_complete**: Fired when a user clicks the 'Mark as Complete' button for a lesson, or when they navigate to the next lesson without having already completed the current one.
- **lesson_navigation**: Fired when a user clicks a navigation button to go to the previous lesson, next lesson, or the module quiz.

### app/learn/[moduleSlug]/quiz/page.tsx

- **quiz_completed**: Fired when a user finishes a quiz attempt, recording their score and whether they passed.
- **quiz_retried**: Fired when a user clicks the 'Retry Quiz' button after viewing their results.

### app/learn/[moduleSlug]/summary/summary-client.tsx

- **case-study-summary-downloaded**: Fired when a user clicks the button to download their case study summary as a PDF.
- **case-study-summary-shared**: Fired when a user clicks to share their case study summary on a social media platform like Twitter or LinkedIn.

### app/progress/page.tsx

- **progress-reset-confirmed**: Fired when a user confirms their intention to reset all their learning progress.
- **progress-exported**: Fired when a user clicks the button to export their learning progress to a JSON file.

### components/lesson-card.tsx

- **lesson_card_clicked**: Fired when a user clicks on a lesson card to navigate to the lesson page.

### components/module-card.tsx

- **module-card-cta-clicked**: Fires when a user clicks the call-to-action button on a module card to start, continue, or review a module.

### components/password-gate.tsx

- **module_unlock_attempted**: Fired when a user submits the password form to unlock a module. The 'success' property indicates whether the password was correct.


## Events still awaiting implementation
- (human: you can fill these in)
---

## Next Steps

1. Review the changes made to your files
2. Test that events are being captured correctly
3. Create insights and dashboards in PostHog
4. Make a list of events we missed above. Knock them out yourself, or give this file to an agent.

Learn more about what to measure with PostHog and why: https://posthog.com/docs/new-to-posthog/getting-hogpilled
