# Learning Lab demo

A demo of interactive learning content on GitHub Pages. The site uses [Fumadocs](https://fumadocs.dev) for the docs framework and [Primer](https://primer.style), GitHub's open-source design system, for the look and the components.

> [!NOTE]
> This is a prototype with sample content. It is not an official GitHub site.

## What's inside

A focused set of lesson elements in one folder: `src/components/elements`. Each element is one `.tsx` file and one `.module.css` file, and each one runs in the browser.

**Explain**

Each one plays when the reader scrolls to it and shows its end state when the reader's system asks for reduced motion.

| Tag | What it does |
| --- | --- |
| `Terminal` | A terminal session that types itself |
| `GitGraph` | A commit graph that draws itself one step at a time |
| `Timeline` with `Event` | A sequence of events that appear one after another |
| `CodeTour` with `Stop` | A highlight that walks through a code sample |
| `WorkflowRun` | Jobs and steps that run in order |
| `Mermaid` | A diagram from text that uses the Primer colors |

**Practice**

| Tag | What it does |
| --- | --- |
| `Quiz` with `Answer` | A single-choice question with feedback for each answer |
| `CommandExercise` | The learner types a command and the page checks it |
| `Flashcards` with `Flashcard` | A deck of terms that flip to show the answer |
| `Checklist` with `Task` | A checklist with a progress bar that the browser saves |
| `LessonMeta` | Chips for time, level, and prerequisites |

**Page basics (Fumadocs)**

Tabs, code tabs, code blocks with titles and highlights, steps, callouts, accordions, a file tree, search, and light and dark mode.

## Two ways to write an element

A list of items uses child tags:

```mdx
<Quiz question="Which command creates a branch and switches to it?">
  <Answer correct feedback="The -c option creates the branch.">git switch -c docs</Answer>
  <Answer feedback="The -d option deletes a branch.">git branch -d docs</Answer>
</Quiz>
```

A script uses plain text between the tags, inside `` {`...`} ``:

```mdx
<Terminal>{`
$ git switch -c docs
Switched to a new branch 'docs'
`}</Terminal>
```

## Reuse the elements in another site

The folder `src/components/elements` has no ties to this site. To use it in another React 19 site that renders MDX:

1. Copy the folder.
2. Install the packages: `npm install @primer/react @primer/primitives @primer/octicons-react mermaid`.
3. Import the Primer tokens in your global CSS, as `src/app/global.css` does.
4. Set `data-color-mode`, `data-light-theme`, and `data-dark-theme` on the `html` element.
5. Add the elements to your MDX components: `{ ...elements }`.

The shared parts are small:

| File | What it gives every element |
| --- | --- |
| `panel.tsx` | The frame: a title bar and a body |
| `hooks.ts` | In-view detection, reduced motion, auto stepping, copy, and saved state |
| `step-nav.tsx` | Previous, play, and next buttons |
| `script.ts` | The reader for text between the tags |

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
- Every tag in `src/components/elements/index.ts` works in any page without an import.

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
