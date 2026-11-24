'use client';

import { useState } from 'react';
import Link from 'next/link';
import { BranchName, Button, IconButton, Label, Spinner, StateLabel } from '@primer/react';
import {
  ArrowRightIcon,
  CheckCircleFillIcon,
  CheckIcon,
  ChecklistIcon,
  CopyIcon,
  MarkGithubIcon,
  RocketIcon,
  SearchIcon,
  StackIcon,
  TasklistIcon,
} from '@primer/octicons-react';
import {
  CodeTour,
  GitGraph,
  LayerStack,
  MiniFlashcard,
  MiniProgress,
  MiniQuiz,
  MiniSearch,
  Reveal,
  StatusBar,
  Terminal,
  ThemePlayground,
  TypedLesson,
  WorkflowRun,
  setStatus,
} from '../motion';
import { useLoopStep, useReducedMotion } from '../motion/hooks';
import type { GitEvent } from '../motion/git-graph';
import { Mascot } from '../mascot/mascot';
import styles from './home.module.css';

const sections = [
  { id: 'intro', label: 'Intro' },
  { id: 'style', label: 'Style' },
  { id: 'write', label: 'Write' },
  { id: 'ship', label: 'Ship' },
  { id: 'layers', label: 'Layers' },
  { id: 'elements', label: 'Elements' },
  { id: 'start', label: 'Start' },
];

const words = ['lessons', 'quizzes', 'exercises', 'diagrams'];

const heroEvents: GitEvent[] = [
  { type: 'commit', branch: 'main', label: 'Start from main' },
  { type: 'branch', branch: 'update-readme', from: 'main', label: 'Create a branch' },
  { type: 'commit', branch: 'update-readme', label: 'Commit a change' },
  { type: 'commit', branch: 'update-readme', label: 'Push and open a pull request' },
  { type: 'merge', branch: 'update-readme', into: 'main', label: 'Merge the pull request' },
];

const layers = [
  {
    name: 'Content',
    tech: 'MDX',
    text: 'Lessons live in .mdx files. Writers add an element with one tag and no JavaScript.',
  },
  {
    name: 'Components',
    tech: '@primer/react',
    text: "The quiz, the flashcards, and the other widgets use GitHub's React components and icons.",
  },
  {
    name: 'Framework',
    tech: 'Fumadocs + Next.js',
    text: 'Fumadocs adds the layout, the sidebar, and search. Next.js exports the site as static files.',
  },
  {
    name: 'Hosting',
    tech: 'GitHub Pages',
    text: 'GitHub Actions builds the site on every push, and GitHub Pages serves it.',
  },
];

const tourCode = `<Quiz
  question="Which command creates a branch?"
  options={[
    { label: 'git switch -c docs', correct: true },
    { label: 'git branch -d docs' },
  ]}
/>`;

const tourSteps = [
  { lines: 1 as const, title: 'Start with the tag', text: 'Each element is one tag in the MDX file.' },
  { lines: 2 as const, title: 'Ask the question', text: 'The question shows above the answers.' },
  {
    lines: [3, 6] as [number, number],
    title: 'List the answers',
    text: 'Mark the right answer with correct: true.',
  },
];

const cards = [
  {
    figure: <MiniSearch />,
    icon: SearchIcon,
    title: 'Search',
    text: 'A static index that runs in the browser.',
    href: '/docs',
  },
  {
    figure: <MiniQuiz />,
    icon: ChecklistIcon,
    title: 'Knowledge check',
    text: 'A question with feedback for each answer.',
    href: '/docs/learning/knowledge-check',
  },
  {
    figure: <MiniFlashcard />,
    icon: StackIcon,
    title: 'Flashcards',
    text: 'Terms that flip to show the answer.',
    href: '/docs/learning/flashcards',
  },
  {
    figure: <MiniProgress />,
    icon: TasklistIcon,
    title: 'Progress checklist',
    text: 'Progress that the browser saves.',
    href: '/docs/learning/progress-checklist',
  },
];

function RotatingWord() {
  const reduced = useReducedMotion();
  const step = useLoopStep(words.length, 2200, !reduced);
  return (
    <span className={styles.word}>
      {/* Screen readers get one stable word. The changing word is decoration. */}
      <span className={styles.srOnly}>lessons</span>
      <span key={step} className={styles.wordNow} aria-hidden>
        {words[step]}
      </span>
    </span>
  );
}

function CloneCommand({ repoUrl }: { repoUrl: string }) {
  const [copied, setCopied] = useState(false);
  const command = `git clone ${repoUrl}.git`;

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(command);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1600);
    } catch {
      // Some embedded previews block the clipboard. The command stays visible to copy by hand.
    }
  };

  return (
    <div className={styles.command}>
      <code>
        <span className={styles.prompt}>$</span>
        {command}
      </code>
      <IconButton
        icon={copied ? CheckIcon : CopyIcon}
        aria-label={copied ? 'Copied' : 'Copy the clone command'}
        variant="invisible"
        size="small"
        onClick={copy}
      />
    </div>
  );
}

/** A small pull request card. Its state follows the step of the commit graph above it. */
function PullRequestCard({ step }: { step: number }) {
  const state = step >= 4 ? 'merged' : step >= 3 ? 'open' : 'draft';
  return (
    <div className={styles.pr} aria-hidden>
      <div className={styles.prHead}>
        <span key={state} className={styles.prState}>
          <StateLabel
            size="small"
            status={state === 'merged' ? 'pullMerged' : state === 'open' ? 'pullOpened' : 'draft'}
          >
            {state === 'merged' ? 'Merged' : state === 'open' ? 'Open' : 'Draft'}
          </StateLabel>
        </span>
        <strong>Update README</strong>
      </div>
      <div className={styles.prMeta}>
        <BranchName as="span">update-readme</BranchName>
        <ArrowRightIcon size={12} />
        <BranchName as="span">main</BranchName>
      </div>
      <div className={styles.prCheck}>
        {step >= 3 ? <CheckCircleFillIcon size={16} className={styles.prOk} /> : <Spinner size="small" srText={null} />}
        {step >= 4 ? 'Merged into main' : step >= 3 ? 'Ready for review' : step >= 2 ? '1 commit on this branch' : 'No commits yet'}
      </div>
    </div>
  );
}

function SectionHead({ kicker, title, text }: { kicker: string; title: string; text: string }) {
  return (
    <Reveal>
      <header className={styles.head}>
        <p className={styles.kicker}>{kicker}</p>
        <h2 className={styles.h2}>{title}</h2>
        <p className={styles.sub}>{text}</p>
      </header>
    </Reveal>
  );
}

export function Home({ repoUrl }: { repoUrl: string }) {
  const [heroStep, setHeroStep] = useState(0);

  return (
    <main className={styles.page}>
      <section id="intro" className={`${styles.section} ${styles.hero}`}>
        <div className={styles.sky} aria-hidden>
          {Array.from({ length: 14 }, (_, index) => (
            <i
              key={index}
              style={{
                top: `${(index * 37 + 11) % 100}%`,
                left: `${(index * 53 + 29) % 100}%`,
                animationDuration: `${2.4 + (index % 5) * 0.6}s`,
                animationDelay: `${index * -0.37}s`,
              }}
            />
          ))}
        </div>
        <div className={styles.heroCopy}>
          <Label variant="accent" size="large">
            Demo
          </Label>
          <h1 className={styles.title}>
            Interactive
            <br />
            <RotatingWord />
            <br />
            on <span className={styles.accent}>GitHub Pages</span>
          </h1>
          <p className={styles.lead}>
            A docs site built with Fumadocs and styled with Primer, GitHub&apos;s design system.
            Every animation and exercise runs in the browser, so the site needs no server.
          </p>
          <div className={styles.actions}>
            <Button
              as={Link}
              href="/docs/lesson/first-pull-request"
              variant="primary"
              size="large"
              leadingVisual={RocketIcon}
            >
              Open the sample lesson
            </Button>
            <Button as={Link} href="/docs" size="large">
              Browse the elements
            </Button>
          </div>
          <CloneCommand repoUrl={repoUrl} />
        </div>
        <div className={styles.heroScene}>
          <Mascot size="large" mood={heroStep >= 4 ? 'cheer' : heroStep >= 3 ? 'thinking' : 'idle'}>
            <span key={heroStep} className={styles.say}>
              {heroEvents[heroStep].label}
            </span>
          </Mascot>
          <GitGraph
            title="update-readme"
            events={heroEvents}
            autoPlay
            loop
            compact
            onStatus={setStatus}
            onStep={setHeroStep}
          />
          <PullRequestCard step={heroStep} />
        </div>
      </section>

      <section id="style" className={styles.section}>
        <SectionHead
          kicker="Style"
          title="GitHub's look, in every Primer theme"
          text="Primer ships its colors as CSS variables. Pick a theme and the same components change with it."
        />
        <Reveal delay={100}>
          <ThemePlayground onStatus={setStatus} />
        </Reveal>
      </section>

      <section id="write" className={styles.section}>
        <SectionHead
          kicker="Write"
          title="Write MDX. Get a lesson."
          text="Each block in the file becomes a working element. The quiz in the preview is live, so try it."
        />
        <Reveal delay={100}>
          <TypedLesson onStatus={setStatus} />
        </Reveal>
      </section>

      <section id="ship" className={styles.section}>
        <SectionHead
          kicker="Ship"
          title="Push to main. GitHub Actions deploys the site."
          text="The workflow in this repository builds static files and publishes them to GitHub Pages."
        />
        <Reveal delay={100}>
          <WorkflowRun
            title="Deploy to GitHub Pages"
            trigger="git push origin main"
            jobs={[
              {
                name: 'build',
                steps: [
                  'Check out the repository',
                  'Set up Node.js',
                  'Read the GitHub Pages settings',
                  'Install dependencies',
                  'Build the static site',
                  'Upload the site',
                ],
              },
              { name: 'deploy', steps: ['Deploy to GitHub Pages'] },
            ]}
            result="The site is live on GitHub Pages"
            onStatus={setStatus}
          />
        </Reveal>
      </section>

      <section id="layers" className={styles.section}>
        <SectionHead
          kicker="Layers"
          title="Four layers, and you can replace each one"
          text="Content, components, framework, and hosting stay separate. Select a layer to see what it does."
        />
        <Reveal delay={100}>
          <LayerStack layers={layers} onStatus={setStatus} />
        </Reveal>
      </section>

      <section id="elements" className={styles.section}>
        <SectionHead
          kicker="Elements"
          title="An element for each part of a lesson"
          text="Explain with a terminal or a code tour, then check what the learner knows."
        />
        <div className={styles.cards}>
          {cards.map((card, index) => (
            <Reveal key={card.title} delay={index * 80}>
              <Link href={card.href} className={styles.card}>
                {card.figure}
                <span className={styles.cardTitle}>
                  <card.icon size={16} aria-hidden />
                  {card.title}
                  <ArrowRightIcon size={16} aria-hidden className={styles.cardArrow} />
                </span>
                <span className={styles.cardText}>{card.text}</span>
              </Link>
            </Reveal>
          ))}
        </div>
        <div className={styles.duo}>
          <Reveal>
            <Terminal
              title="Terminal"
              loop
              lines={[
                { text: 'git switch -c update-readme' },
                { type: 'output', text: "Switched to a new branch 'update-readme'" },
                { text: 'git add README.md' },
                { text: 'git commit -m "Update README"' },
                { text: 'git push -u origin update-readme' },
              ]}
            />
          </Reveal>
          <Reveal delay={100}>
            <CodeTour title="lesson.mdx" code={tourCode} steps={tourSteps} autoPlay />
          </Reveal>
        </div>
      </section>

      <section id="start" className={styles.section}>
        <SectionHead
          kicker="Start"
          title="Your first lesson is one clone away"
          text="Clone the repository, run it on your computer, and edit a page in content/docs."
        />
        <Reveal delay={100}>
          <Terminal
            title="Get started"
            onStatus={setStatus}
            lines={[
              { text: `git clone ${repoUrl}.git` },
              { text: 'cd learn-interactive-demo' },
              { text: 'npm install' },
              { text: 'npm run dev' },
              { type: 'comment', text: '# Then open http://localhost:3000' },
            ]}
          />
        </Reveal>
        <div className={styles.actions}>
          <Button as={Link} href="/docs/how-it-works" variant="primary" size="large">
            Read how it works
          </Button>
          <Button as="a" href={repoUrl} size="large" leadingVisual={MarkGithubIcon}>
            View the repository
          </Button>
        </div>
      </section>

      <footer className={styles.footer}>
        Demo site built with Fumadocs and Primer. Not an official GitHub site.
      </footer>

      <StatusBar sections={sections} />
    </main>
  );
}
