'use client';

import Link from 'next/link';
import { Button, IconButton, Label } from '@primer/react';
import {
  CheckCircleFillIcon,
  CheckIcon,
  CopyIcon,
  MarkGithubIcon,
  RocketIcon,
} from '@primer/octicons-react';
import {
  Answer,
  Checklist,
  CodeTour,
  CommandExercise,
  Flashcard,
  Flashcards,
  GitGraph,
  Quiz,
  Stop,
  Task,
  Terminal,
  Timeline,
  TimelineEvent,
  WorkflowRun,
} from '../elements';
import { useCopy } from '../elements/hooks';
import styles from './home.module.css';

function CloneCommand({ repoUrl }: { repoUrl: string }) {
  const [copied, copy] = useCopy();
  const command = `git clone ${repoUrl}.git`;

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
        onClick={() => copy(command)}
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
        <GitGraph title="update-readme" loop>{`
commit main: Start from main
branch update-readme from main: Create a branch
commit update-readme: Commit a change
commit update-readme: Push and open a pull request
merge update-readme into main: Merge the pull request
`}</GitGraph>
      </section>

      <section className={styles.section}>
        <SectionHead
          kicker="Explain"
          title="Show how it works"
          text="These elements play when the reader scrolls to them."
        />
        <div className={styles.duo}>
          <Terminal loop>{`
$ git switch -c update-readme
Switched to a new branch 'update-readme'
$ git add README.md
$ git commit -m "Update README"
$ git push -u origin update-readme
`}</Terminal>
          <CodeTour
            title="lesson.mdx"
            autoPlay
            code={`<Quiz question="Which command creates a branch?">
  <Answer correct>git switch -c docs</Answer>
  <Answer>git branch -d docs</Answer>
</Quiz>`}
          >
            <Stop lines="1" title="Start with the tag">
              Each element is one tag in the MDX file.
            </Stop>
            <Stop lines="2-3" title="List the answers">
              Each answer is its own tag.
            </Stop>
            <Stop lines="2" title="Mark the right one">
              Add the word correct to the right answer.
            </Stop>
          </CodeTour>
        </div>
        <Timeline>
          <TimelineEvent icon="commit" title="You commit a change on a branch" />
          <TimelineEvent icon="pull-request" color="success" title="You open a pull request" />
          <TimelineEvent icon="review" color="accent" title="A reviewer reads the change and comments" />
          <TimelineEvent icon="merge" color="done" title="A maintainer merges the pull request" />
        </Timeline>
        <WorkflowRun
          title="Deploy to GitHub Pages"
          trigger="git push origin main"
          result="The site is live on GitHub Pages"
        >{`
build: Check out the repository, Set up Node.js, Read the GitHub Pages settings, Install dependencies, Build the static site, Upload the site
deploy: Deploy to GitHub Pages
`}</WorkflowRun>
      </section>

      <section className={styles.section}>
        <SectionHead
          kicker="Practice"
          title="Check what the learner knows"
          text="Each element gives feedback right away."
        />
        <div className={styles.duo}>
          <Quiz question="What does git push -u origin update-readme do?">
            <Answer feedback="A push uploads commits. The merge happens later, through the pull request.">
              It merges update-readme into the default branch.
            </Answer>
            <Answer
              correct
              feedback="The -u option links your local branch to the remote branch, so later pushes need no arguments."
            >
              It uploads the branch and sets it as the upstream branch.
            </Answer>
          </Quiz>
          <CommandExercise
            prompt="Create a branch named fix-typo and switch to it."
            hint="Use git switch with the -c option, followed by the branch name."
            placeholder="git ..."
          >{`
git switch -c fix-typo
git checkout -b fix-typo
`}</CommandExercise>
          <Flashcards>
            <Flashcard term="Branch">A separate line of work in a repository.</Flashcard>
            <Flashcard term="Commit">A saved snapshot of your changes, with a message.</Flashcard>
            <Flashcard term="Upstream branch">The remote branch that your local branch tracks.</Flashcard>
            <Flashcard term="Pull request">A proposal to merge the changes from one branch into another.</Flashcard>
          </Flashcards>
          <Checklist id="home-checklist" title="Lesson tasks">
            <Task>Create a branch</Task>
            <Task>Commit a change</Task>
            <Task>Push the branch</Task>
            <Task>Open a pull request</Task>
          </Checklist>
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
