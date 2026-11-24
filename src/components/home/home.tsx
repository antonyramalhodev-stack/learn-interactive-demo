'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Button, IconButton, Label } from '@primer/react';
import {
  CheckCircleFillIcon,
  CheckIcon,
  CopyIcon,
  MarkGithubIcon,
  RocketIcon,
} from '@primer/octicons-react';
import { Checklist, CommandExercise, Flashcards, Quiz } from '../learn';
import { CodeTour, GitGraph, Terminal, WorkflowRun } from '../motion';
import type { GitEvent } from '../motion/git-graph';
import styles from './home.module.css';

const heroEvents: GitEvent[] = [
  { type: 'commit', branch: 'main', label: 'Start from main' },
  { type: 'branch', branch: 'update-readme', from: 'main', label: 'Create a branch' },
  { type: 'commit', branch: 'update-readme', label: 'Commit a change' },
  { type: 'commit', branch: 'update-readme', label: 'Push and open a pull request' },
  { type: 'merge', branch: 'update-readme', into: 'main', label: 'Merge the pull request' },
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

function SectionHead({ kicker, title, text }: { kicker: string; title: string; text: string }) {
  return (
    <header className={styles.head}>
      <p className={styles.kicker}>{kicker}</p>
      <h2 className={styles.h2}>{title}</h2>
      <p className={styles.sub}>{text}</p>
    </header>
  );
}

export function Home({ repoUrl }: { repoUrl: string }) {
  return (
    <main className={styles.page}>
      <section className={`${styles.section} ${styles.hero}`}>
        <div className={styles.heroCopy}>
          <Label variant="accent" size="large">
            Demo
          </Label>
          <h1 className={styles.title}>
            Interactive lessons
            <br />
            on <span className={styles.accent}>GitHub Pages</span>
          </h1>
          <p className={styles.lead}>
            Lesson elements built with Fumadocs and Primer, GitHub&apos;s design system. Every
            element runs in the browser, so the site needs no server.
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
        <GitGraph title="update-readme" events={heroEvents} autoPlay loop compact />
      </section>

      <section className={styles.section}>
        <SectionHead
          kicker="Explain"
          title="Show how it works"
          text="These elements play when the reader scrolls to them."
        />
        <div className={styles.duo}>
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
          <CodeTour title="lesson.mdx" code={tourCode} steps={tourSteps} autoPlay />
        </div>
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
        />
      </section>

      <section className={styles.section}>
        <SectionHead
          kicker="Practice"
          title="Check what the learner knows"
          text="Each element gives feedback right away."
        />
        <div className={styles.duo}>
          <Quiz
            question="What does git push -u origin update-readme do?"
            options={[
              {
                label: 'It merges update-readme into the default branch.',
                feedback: 'A push uploads commits. The merge happens later, through the pull request.',
              },
              {
                label: 'It uploads the branch and sets it as the upstream branch.',
                correct: true,
                feedback:
                  'The -u option links your local branch to the remote branch, so later pushes need no arguments.',
              },
            ]}
          />
          <CommandExercise
            prompt="Create a branch named fix-typo and switch to it."
            answers={['git switch -c fix-typo', 'git checkout -b fix-typo']}
            hint="Use git switch with the -c option, followed by the branch name."
            placeholder="git ..."
          />
          <Flashcards
            cards={[
              { front: 'Branch', back: 'A separate line of work in a repository.' },
              { front: 'Commit', back: 'A saved snapshot of your changes, with a message.' },
              { front: 'Upstream branch', back: 'The remote branch that your local branch tracks.' },
              {
                front: 'Pull request',
                back: 'A proposal to merge the changes from one branch into another.',
              },
            ]}
          />
          <Checklist
            id="home-checklist"
            title="Lesson tasks"
            items={['Create a branch', 'Commit a change', 'Push the branch', 'Open a pull request']}
          />
        </div>
      </section>

      <section className={styles.section}>
        <SectionHead
          kicker="Publish"
          title="Where the elements run"
          text="The same lesson content serves two places, in two ways."
        />
        <div className={styles.duo}>
          <div className={styles.place}>
            <h3 className={styles.placeTitle}>
              <CheckCircleFillIcon size={16} className={styles.ok} aria-hidden />
              GitHub Pages
            </h3>
            <p className={styles.placeText}>
              Every element runs as it is. Push to main and GitHub Actions deploys the site.
            </p>
            <Button as={Link} href="/docs/how-it-works">
              Read how it works
            </Button>
          </div>
          <div className={styles.place}>
            <h3 className={styles.placeTitle}>Microsoft Learn modules</h3>
            <p className={styles.placeText}>
              A module page takes Markdown, not custom components. Use the module&apos;s own
              knowledge check and alerts, and add the animated elements as images or video.
            </p>
            <Button as={Link} href="/docs/microsoft-learn">
              See the element map
            </Button>
          </div>
        </div>
        <div className={styles.actions}>
          <Button as="a" href={repoUrl} leadingVisual={MarkGithubIcon}>
            View the repository
          </Button>
        </div>
      </section>

      <footer className={styles.footer}>
        Demo site built with Fumadocs and Primer. Not an official GitHub site.
      </footer>
    </main>
  );
}
