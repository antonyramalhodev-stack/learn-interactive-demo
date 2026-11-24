import { Checklist, Task } from './checklist';
import { CodeTour, Stop } from './code-tour';
import { CommandExercise } from './command-exercise';
import { Flashcard, Flashcards } from './flashcards';
import { GitGraph } from './git-graph';
import { LessonMeta } from './lesson-meta';
import { Mermaid } from './mermaid';
import { Answer, Quiz } from './quiz';
import { Terminal } from './terminal';
import { Timeline, TimelineEvent } from './timeline';
import { WorkflowRun } from './workflow-run';

export {
  Answer,
  Checklist,
  CodeTour,
  CommandExercise,
  Flashcard,
  Flashcards,
  GitGraph,
  LessonMeta,
  Mermaid,
  Quiz,
  Stop,
  Task,
  Terminal,
  Timeline,
  TimelineEvent,
  WorkflowRun,
};

/**
 * Every tag a lesson can use. Spread this into the MDX components of a site:
 *
 *   { ...defaultMdxComponents, ...elements }
 */
export const elements = {
  // Explain
  Terminal,
  GitGraph,
  Timeline,
  Event: TimelineEvent,
  CodeTour,
  Stop,
  WorkflowRun,
  Mermaid,
  // Practice
  Quiz,
  Answer,
  CommandExercise,
  Flashcards,
  Flashcard,
  Checklist,
  Task,
  LessonMeta,
};
