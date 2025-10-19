# Testing Guide - Quiz System & Complete Platform

**Purpose:** Verify all features work correctly
**Target:** Quiz system and full user journey
**Date:** 2025-10-18

---

## Quick Start Testing

**Dev Server:** http://localhost:3000

### 5-Minute Smoke Test

1. ✅ Open http://localhost:3000 - Landing page loads
2. ✅ Click "Start Learning" → Learning hub opens
3. ✅ Click "Module 1" → Module overview opens
4. ✅ Click first lesson → Lesson displays
5. ✅ Click "Mark as Complete" → Checkmark appears
6. ✅ Navigate back to module → Progress updates
7. ✅ Click "Take Quiz" → Quiz opens
8. ✅ Answer questions → Score calculates
9. ✅ View results → Badge awarded (if passed)
10. ✅ Check Progress page → Stats updated

**If all 10 steps work:** ✅ Platform is functional!

---

## Comprehensive Quiz System Testing

### Test 1: Taking Your First Quiz

**Steps:**

1. Navigate to: http://localhost:3000/learn/auth-fundamentals
2. Scroll to "Module Quiz" card
3. Verify you see:
   - "10 questions"
   - "80% or higher to pass"
   - "Take Quiz" button (enabled)
4. Click "Take Quiz"
5. Verify quiz page loads with:
   - Question 1 of 10
   - Progress bar at 0%
   - 4 answer options
   - "Submit Answer" button (disabled)

**Expected:** Quiz interface displays correctly

### Test 2: Answering Questions

**Steps:**

1. Click on any answer option
2. Verify:
   - Option highlights in blue
   - "Submit Answer" button enables
3. Click "Submit Answer"
4. Verify:
   - Correct answer turns green with ✓
   - Wrong answer turns red with ✗ (if you picked wrong)
   - Explanation appears below
   - "Submit Answer" changes to "Next Question →"
5. Click "Next Question →"
6. Verify:
   - Moves to question 2
   - Progress bar updates to 20%
   - Previous answer is saved

**Expected:** Question flow works smoothly

### Test 3: Quiz Navigation

**Steps:**

1. On question 2, select an answer and submit
2. Click "← Previous" button
3. Verify:
   - Returns to question 1
   - Shows your previous answer
   - Explanation still visible
   - Cannot change answer
4. Click "Next Question →" twice
5. Verify:
   - Skips to question 3
   - Progress bar correct

**Expected:** Navigation preserves state

### Test 4: Completing Quiz (Passing)

**Steps:**

1. Answer all 10 questions correctly (check correct answers in module file)
2. On question 10, verify button says "Finish Quiz"
3. Click "Finish Quiz"
4. Verify results page shows:
   - 🎉 "Congratulations! You Passed!"
   - "100%" score
   - Green progress bar
   - Badge earned card with 🔐 icon
   - "Identity Foundations" badge name
   - "Retry Quiz" button
   - "Back to Module" button
   - "Continue Learning →" button
5. Scroll down to "Review Your Answers"
6. Verify:
   - All 10 questions listed
   - Green ✓ badges on all
   - Correct answers highlighted green
   - Explanations visible

**Expected:** Passing experience is celebratory and clear

### Test 5: Completing Quiz (Failing)

**Steps:**

1. Click "Retry Quiz"
2. Answer only 5 questions correctly (50%)
3. Click "Finish Quiz"
4. Verify results page shows:
   - 📚 "Keep Learning!"
   - "50%" score
   - Red progress bar
   - "You need 80% or higher to pass" message
   - No badge card (badge not awarded)
   - "Retry Quiz" button
   - "Back to Module" button
   - NO "Continue Learning" button
5. Review answers section shows:
   - Mix of green ✓ and red ✗
   - Correct answers highlighted
   - Your wrong answers highlighted in red

**Expected:** Failing experience is encouraging, not discouraging

### Test 6: Quiz Attempt History

**Steps:**

1. Click "Retry Quiz" again
2. Answer 9 questions correctly (90%)
3. Finish quiz
4. Verify results page shows:
   - "New Best Score! 🌟" indicator
   - Previous attempts section with:
     - Attempt 1: 100% (green)
     - Attempt 2: 50% (red)
     - Attempt 3: 90% (green)
5. Click "Back to Module"
6. Verify module page shows:
   - "Previous Attempts" in quiz card
   - Last 3 attempts listed
   - "Retake Quiz" button (not "Take Quiz")

**Expected:** History tracking works correctly

### Test 7: Badge Persistence

**Steps:**

1. Navigate to: http://localhost:3000/progress
2. Verify "Badges Earned" section shows:
   - 🔐 Identity Foundations badge
3. Refresh page (F5)
4. Verify badge still appears
5. Open browser DevTools → Application → Local Storage
6. Find key `oauth-trainer-progress`
7. Verify JSON contains:
   - `badgesEarned: ["badge-auth-fundamentals"]`
   - Module progress with best score 100%

**Expected:** Badges persist across page loads

### Test 8: Module Unlocking

**Steps:**

1. Navigate to: http://localhost:3000/learn
2. Verify Module 2 (OAuth 2.0) is:
   - Unlocked (no 🔒 overlay)
   - Clickable
3. Clear localStorage:
   - DevTools → Application → Local Storage
   - Right-click `oauth-trainer-progress` → Delete
4. Refresh page
5. Verify Module 2 is now:
   - Locked (🔒 overlay)
   - "Complete previous modules" message
6. Click Module 1
7. Complete quiz with ≥80%
8. Navigate back to learning hub
9. Verify Module 2 is now unlocked

**Expected:** Progressive unlocking works

### Test 9: Quiz Tips and Info

**Steps:**

1. Start any quiz
2. Scroll to bottom
3. Verify "Quiz Tips" card shows:
   - 💡 icon
   - "You need 80% to pass this quiz"
   - "You can retry the quiz as many times as you need"
   - Helpful tips

**Expected:** Tips provide guidance

### Test 10: Mobile Responsiveness

**Steps:**

1. Open DevTools → Toggle device toolbar (Cmd+Shift+M)
2. Select "iPhone SE" (375px)
3. Navigate through quiz
4. Verify:
   - Questions readable
   - Answer buttons touch-friendly
   - Navigation buttons accessible
   - Progress bar visible
   - No horizontal scrolling
5. Switch to "iPad" (768px)
6. Verify layout adapts
7. Switch to desktop (1440px)
8. Verify optimal spacing

**Expected:** Works on all screen sizes

---

## Full User Journey Testing

### Journey 1: Complete Beginner Path

**Goal:** Complete both modules and earn both badges

**Steps:**

1. Start at landing page
2. Click "Start Learning"
3. Complete Module 1:
   - Read all 5 lessons
   - Mark each as complete
   - Take quiz
   - Pass with ≥80%
   - Earn 🔐 badge
4. Complete Module 2:
   - Read all 6 lessons
   - Mark complete
   - Take quiz
   - Pass with ≥80%
   - Earn 🔑 badge
5. Check progress dashboard:
   - 2 modules completed
   - 11 lessons completed
   - 2 badges earned
   - Overall progress ~100%

**Time:** ~15-20 minutes (if reading all content)

**Expected:** Smooth progression, clear guidance, satisfying achievement

### Journey 2: Struggling Learner

**Goal:** Fail quiz multiple times, then pass

**Steps:**

1. Complete Module 1 lessons
2. Take quiz, fail (50%)
3. See encouraging message
4. Review answers
5. Click "Back to Module"
6. Re-read lessons
7. Retry quiz, fail again (70%)
8. Review what you got wrong
9. Retry quiz, pass (90%)
10. Badge awarded!
11. Check progress shows best score: 90%

**Expected:** System supports learning from mistakes

### Journey 3: Quiz Expert

**Goal:** Perfect score on first try

**Steps:**

1. Read lessons carefully
2. Take notes (optional)
3. Take quiz
4. Answer all questions correctly
5. See 100% score
6. Badge awarded immediately
7. Module 2 unlocks
8. Progress dashboard shows perfect stats

**Expected:** Excellence is recognized

---

## Edge Cases Testing

### Edge Case 1: Incomplete Quiz

**Steps:**

1. Start quiz
2. Answer 5 questions
3. Close browser tab
4. Reopen site
5. Navigate to quiz
6. Verify:
   - Quiz starts fresh (no partial save)
   - Must answer all questions again

**Expected:** No broken state from incomplete quiz

### Edge Case 2: Locked Module Quiz

**Steps:**

1. Clear localStorage
2. Navigate to Module 2
3. Verify quiz button is disabled
4. Click module (should show locked message)

**Expected:** Cannot access locked module quiz

### Edge Case 3: Perfect Score Every Question

**Steps:**

1. Take quiz
2. Answer every question correctly on first try
3. Verify:
   - Score: 100%
   - All questions show green ✓
   - Badge awarded
   - No errors

**Expected:** Perfect execution

### Edge Case 4: Wrong Every Question

**Steps:**

1. Retry quiz
2. Deliberately pick wrong answer every time
3. Verify:
   - Score: 0%
   - All questions show red ✗
   - No badge
   - Encouraging message
   - Can retry

**Expected:** Graceful failure handling

### Edge Case 5: Dark Mode Quiz

**Steps:**

1. Toggle dark mode (button in header)
2. Take quiz
3. Verify:
   - Text readable on dark background
   - Selected answers visible
   - Correct/incorrect colors still distinguishable
   - Explanation text readable

**Expected:** Full dark mode support

---

## Data Persistence Testing

### Test 1: localStorage Structure

**Steps:**

1. Complete 1 lesson and 1 quiz
2. Open DevTools → Application → Local Storage
3. Find `oauth-trainer-progress`
4. Verify JSON structure includes:

```json
{
  "userId": "anonymous-XXXXX",
  "createdAt": "2025-10-18T...",
  "moduleProgress": {
    "auth-fundamentals": {
      "moduleId": "auth-fundamentals",
      "lessonProgress": {
        "auth-vs-authz": {
          "lessonId": "auth-vs-authz",
          "completed": true,
          "completedAt": "...",
          "timeSpent": 5
        }
      },
      "quizAttempts": [
        {
          "attemptNumber": 1,
          "score": 80,
          "passed": true,
          "completedAt": "..."
        }
      ],
      "bestQuizScore": 80,
      "completed": true,
      "badgeEarned": true
    }
  },
  "totalLessonsCompleted": 1,
  "badgesEarned": ["badge-auth-fundamentals"]
}
```

**Expected:** Clean, structured data

### Test 2: Export Progress

**Steps:**

1. Navigate to progress dashboard
2. Click "Export Progress" button
3. Verify:
   - JSON file downloads
   - Filename: `oauth-trainer-progress-YYYY-MM-DD.json`
   - File contains all progress data
4. Open file in text editor
5. Verify JSON is valid and readable

**Expected:** Export works correctly

### Test 3: Reset Progress

**Steps:**

1. Click "Reset Progress" button
2. Verify confirmation dialog appears
3. Click "Cancel"
4. Verify nothing changes
5. Click "Reset Progress" again
6. Click "Confirm"
7. Verify:
   - All badges removed
   - All progress cleared
   - Modules locked again
   - Stats show 0%

**Expected:** Reset completely clears data

---

## Performance Testing

### Test 1: Page Load Speed

**Steps:**

1. Open DevTools → Network tab
2. Disable cache
3. Refresh landing page
4. Verify:
   - Page loads in < 1 second
   - No 404 errors
   - All resources load

**Expected:** Fast initial load

### Test 2: Quiz Responsiveness

**Steps:**

1. Open quiz
2. Click answer → Submit → Next rapidly
3. Verify:
   - No lag
   - Smooth transitions
   - No errors in console

**Expected:** Smooth interactions

### Test 3: localStorage Performance

**Steps:**

1. Complete 50+ quiz attempts
2. Navigate between pages
3. Verify:
   - No slowdown
   - Data loads instantly

**Expected:** Scales well

---

## Accessibility Testing

### Test 1: Keyboard Navigation

**Steps:**

1. Use Tab key to navigate quiz
2. Verify:
   - Can select answers with keyboard
   - Can submit with Enter
   - Focus visible on all elements

**Expected:** Keyboard accessible

### Test 2: Screen Reader (Optional)

**Steps:**

1. Enable screen reader (VoiceOver on Mac)
2. Navigate quiz
3. Verify:
   - Questions announced
   - Answer options readable
   - Buttons labeled correctly

**Expected:** Screen reader friendly

### Test 3: Color Contrast

**Steps:**

1. Use browser DevTools → Accessibility
2. Check contrast ratios
3. Verify:
   - Text meets WCAG AA standards
   - Dark mode also compliant

**Expected:** Accessible colors

---

## Browser Compatibility (Optional)

Test on:
- ✅ Chrome/Edge (Chromium)
- ✅ Firefox
- ✅ Safari

Expected: Works on all modern browsers

---

## Bug Report Template

If you find issues, document:

```markdown
**Bug:** [Brief description]
**Steps to reproduce:**
1. ...
2. ...

**Expected:** [What should happen]
**Actual:** [What actually happens]
**Browser:** Chrome 120
**Console errors:** [Any errors from DevTools]
**Screenshots:** [If applicable]
```

---

## ✅ Testing Checklist

Copy and check off as you test:

### Core Functionality
- [ ] Landing page loads
- [ ] Learning hub displays modules
- [ ] Module overview shows lessons
- [ ] Lesson viewer displays content
- [ ] Quiz page loads
- [ ] Can select answers
- [ ] Can submit answers
- [ ] Explanations appear
- [ ] Can navigate questions
- [ ] Quiz completes
- [ ] Score calculates correctly
- [ ] Badge awards on passing
- [ ] Progress dashboard updates

### Data Persistence
- [ ] Progress saves
- [ ] Quiz attempts recorded
- [ ] Badges persist
- [ ] Best score tracked
- [ ] Export works
- [ ] Reset works

### UI/UX
- [ ] Dark mode works
- [ ] Mobile responsive
- [ ] Tablet responsive
- [ ] Desktop optimal
- [ ] No layout shift
- [ ] Colors accessible
- [ ] Buttons clear
- [ ] Navigation intuitive

### Edge Cases
- [ ] Locked modules handled
- [ ] Perfect score works
- [ ] Zero score works
- [ ] Multiple retries work
- [ ] Incomplete quiz handled

---

## Test Results Template

```markdown
**Date:** 2025-10-18
**Tester:** [Your name]
**Duration:** [Time spent testing]

**Results:**
- Tests passed: X / Y
- Bugs found: Z
- Severity: [Critical / Medium / Minor]

**Notes:**
[Any observations or suggestions]

**Status:** ✅ PASS / ⚠️ ISSUES FOUND / ❌ FAIL
```

---

## Quick Verification Commands

**Check for errors:**
```bash
npm run build
```

**Run linter:**
```bash
npm run lint
```

**Check dev server:**
```bash
npm run dev
# Open http://localhost:3000
```

---

**Happy Testing! 🧪**

If all tests pass, the platform is production-ready! ✅
