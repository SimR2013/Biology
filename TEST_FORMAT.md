# /test — Biology Study Vault format

Use this format when creating any new **/test** study website from the student's supplied source materials.

## Entry experience

- The root (`index.html`) is a chapter/test picker.
- Keep each chapter as a dedicated page, starting with `chapter4.html`.
- Pick a **chapter** first, then pick a **mode** (teacher-style mock exam, generated practice, hardcore, flashcards, notes, written practice, guided tutor, and optional ecosystem game).
- Only mark a chapter **Ready** after its content has actually been built and checked against the student's source materials.
- Never claim an offline rubric checker is live AI.

## Required study experience for future chapters

1. Full, source-grounded, clearly organized lesson notes, definitions and diagram explanations.
2. Flashcards and recall quiz with mastered/missed review and browser-local progress.
3. Mock exam matching the supplied teacher question count, written response count, and common question patterns.
4. Repeatable practice question generator with real explanations and resource references, and explicit notice that the templates are finite and may repeat.
5. Hardcore difficulty mode, game/mission mode when relevant, and complete review after each quiz.
6. Written-response practice with model responses, rubric feedback, and disclosure when checking is rule-based.
7. Mobile-friendly navigation, clear source labels and accessible controls.
8. Preserve previous content and progress when adding material.
9. No API keys in GitHub Pages. Any live AI integration requires a protected service and user authorization.

## Chapter registry

- Chapter 1 — **placeholder only** until the complete source material is retrieved and reviewed.
- Chapter 2 — **placeholder only** until the complete source material is retrieved and reviewed.
- Chapter 4 — **ready**: Lessons 4.1, 4.2, 4.3 and 7.2; teacher blueprint: 23 questions, 21 multiple choice + 2 written.

The root selector deep-links into `chapter4.html?mode=exam`, `?mode=generator&topic=4.2`, etc. The `route.js` script opens the proper mode.

## Repository structure

- `index.html` — choose your chapter and study mode
- `chapter4.html` — full Chapter 4 study website
- `endless.js` — renewable practice and flashcards
- `organize.js` — grouped study navigation
- `route.js` — landing-page to study-mode routing
- `bioforge.html` — Chapter 4 interactive ecosystem game

Never alter the user's existing mock-exam question/answer structure without checking it against the source materials.
