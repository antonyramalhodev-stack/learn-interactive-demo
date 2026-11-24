# Learning Lab demo

A demo of interactive learning content on GitHub Pages. The site uses [Fumadocs](https://fumadocs.dev) for the docs framework and [Primer](https://primer.style), GitHub's open-source design system, for the look and the components.

> [!NOTE]
> This is a prototype with sample content. It is not an official GitHub site.

## What's inside

A focused set of lesson elements. Each one runs in the browser.

**Explain**

Each one plays when the reader scrolls to it and shows its end state when the reader's system asks for reduced motion.

| Component | What it does | Source |
| --- | --- | --- |
| `Terminal` | A terminal session that types itself | `src/components/motion/terminal.tsx` |
| `GitGraph` | A commit graph that draws itself one step at a time | `src/components/motion/git-graph.tsx` |
| `Timeline` | A sequence of events that appear one after another | `src/components/motion/timeline.tsx` |
| `CodeTour` | A highlight that walks through a code sample | `src/components/motion/code-tour.tsx` |
| `WorkflowRun` | Jobs and steps that run in order | `src/components/motion/workflow-run.tsx` |
| `Mermaid` | A diagram from text that uses the Primer colors | `src/components/learn/mermaid.tsx` |

**Practice**

| Component | What it does | Source |
| --- | --- | --- |
| `Quiz` | A single-choice question with feedback for each answer | `src/components/learn/quiz.tsx` |
| `CommandExercise` | The learner types a command and the page checks it | `src/components/learn/command-exercise.tsx` |
| `Flashcards` | A deck of terms that flip to show the answer | `src/components/learn/flashcards.tsx` |
| `Checklist` | A checklist with a progress bar that the browser saves | `src/components/learn/checklist.tsx` |
| `LessonMeta` | Chips for time, level, and prerequisites | `src/components/learn/lesson-meta.tsx` |

**Page basics (Fumadocs)**

Tabs, code tabs, code blocks with titles and highlights, steps, callouts, accordions, a file tree, search, and light and dark mode.

## Where the elements run

- **GitHub Pages.** Every element runs as it is.
- **Microsoft Learn modules.** A module page takes Markdown, not custom components. Use the module's own knowledge check, alerts, and checklist, and add the animated elements as images or video. The page `content/docs/microsoft-learn.mdx` maps each element and marks what to confirm with the team that owns your Learn repository.

## Run it on your computer

You need Node.js 22 or later.

```bash
npm install
npm run dev
```

Open `http://localhost:3000`.

## Deploy to GitHub Pages

1. In the repository, select **Settings**, then **Pages**.
2. Under **Build and deployment**, under **Source**, select **GitHub Actions**.
3. Push to `main`, or run the **Deploy to GitHub Pages** workflow from the **Actions** tab.

The workflow in `.github/workflows/deploy.yml` builds the static site and deploys it. It reads the site path from the GitHub Pages settings, so links, search, and assets work under `/REPOSITORY` with no extra setup.

GitHub Pages is available for public repositories on GitHub Free. A private repository needs GitHub Pro, GitHub Team, or GitHub Enterprise.

## Add content

- Pages live in `content/docs`. Each `.mdx` file is a page.
- Each `meta.json` file sets the sidebar order for its folder.
- Components listed in `src/components/mdx.tsx` work in any page without an import.

```mdx
<Quiz
  question="Which command creates a branch and switches to it?"
  options={[
    { label: 'git switch -c my-branch', correct: true, feedback: 'The -c option creates the branch.' },
    { label: 'git branch -d my-branch', feedback: 'The -d option deletes a branch.' },
  ]}
/>
```

## How the GitHub look works

- `src/app/global.css` imports the Primer design tokens and maps the Fumadocs color variables to them.
- `src/components/provider.tsx` sets `data-color-mode` on the page, so the Primer colors follow the light and dark switch.
- The elements use `@primer/react` components and `@primer/octicons-react` icons.

## Limits of a static site

- No server code and no API routes.
- Checklist progress stays in the learner's browser. It doesn't sync across devices.
- Search downloads a static index and runs in the browser.

## If you fork or rename the repository

Update the owner and name in `src/lib/shared.ts`. The links to the repository and to each page's source file use those values.
