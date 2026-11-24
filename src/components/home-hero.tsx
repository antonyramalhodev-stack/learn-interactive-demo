'use client';

import Link from 'next/link';
import { Button, Label } from '@primer/react';
import {
  BookIcon,
  ChecklistIcon,
  PaintbrushIcon,
  RocketIcon,
  SearchIcon,
  StackIcon,
  TerminalIcon,
} from '@primer/octicons-react';
import { Quiz } from '@/components/learn';
import styles from './home-hero.module.css';

const features = [
  {
    icon: ChecklistIcon,
    title: 'Knowledge checks',
    text: 'Single-choice questions with feedback for each answer.',
    href: '/docs/learning/knowledge-check',
  },
  {
    icon: TerminalIcon,
    title: 'Command exercises',
    text: 'Learners type a command and the page checks it.',
    href: '/docs/learning/command-exercise',
  },
  {
    icon: StackIcon,
    title: 'Flashcards and checklists',
    text: 'Review terms and track progress in the browser.',
    href: '/docs/learning/flashcards',
  },
  {
    icon: BookIcon,
    title: 'Tabs, steps, and callouts',
    text: 'Built-in elements you write in plain MDX.',
    href: '/docs/built-in/tabs-and-code',
  },
  {
    icon: PaintbrushIcon,
    title: 'Primer look and feel',
    text: "GitHub's colors, icons, and components in light and dark mode.",
    href: '/docs/learning/primer-components',
  },
  {
    icon: SearchIcon,
    title: 'Search with no server',
    text: 'A static index that runs in the browser.',
    href: '/docs',
  },
];

export function HomeHero() {
  return (
    <main className={styles.page}>
      <section className={styles.hero}>
        <Label variant="accent" size="large">
          Demo
        </Label>
        <h1 className={styles.title}>
          Interactive learning content on <span className={styles.accent}>GitHub Pages</span>
        </h1>
        <p className={styles.lead}>
          A docs site built with Fumadocs and styled with Primer, GitHub&apos;s design system.
          Every element runs in the browser, so the site needs no server.
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
      </section>

      <section className={styles.grid} aria-label="What the demo includes">
        {features.map((feature) => (
          <Link key={feature.title} href={feature.href} className={styles.card}>
            <span className={styles.cardIcon}>
              <feature.icon size={20} aria-hidden />
            </span>
            <span className={styles.cardTitle}>{feature.title}</span>
            <span className={styles.cardText}>{feature.text}</span>
          </Link>
        ))}
      </section>

      <section className={styles.try} aria-labelledby="try-heading">
        <h2 id="try-heading" className={styles.sectionTitle}>
          Try one now
        </h2>
        <Quiz
          question="What does a static site need to run this quiz?"
          options={[
            {
              label: 'A database',
              feedback: 'No database. The quiz keeps its state in the page.',
            },
            {
              label: 'Only the browser',
              correct: true,
              feedback: 'The quiz is a small component that runs in the browser.',
            },
            {
              label: 'A server that scores the answers',
              feedback: 'No server. The page checks the answer itself.',
            },
          ]}
        />
      </section>

      <footer className={styles.footer}>
        Demo site built with Fumadocs and Primer. Not an official GitHub site.
      </footer>
    </main>
  );
}
