import defaultMdxComponents from 'fumadocs-ui/mdx';
import { Accordion, Accordions } from 'fumadocs-ui/components/accordion';
import { File, Files, Folder } from 'fumadocs-ui/components/files';
import { Step, Steps } from 'fumadocs-ui/components/steps';
import { Tab, Tabs } from 'fumadocs-ui/components/tabs';
import { TypeTable } from 'fumadocs-ui/components/type-table';
import type { MDXComponents } from 'mdx/types';
import {
  Checklist,
  CommandExercise,
  Flashcards,
  LessonMeta,
  Mermaid,
  PrimerShowcase,
  Quiz,
} from '@/components/learn';
import {
  CodeTour,
  GitGraph,
  LayerStack,
  Terminal,
  ThemePlayground,
  WorkflowRun,
} from '@/components/motion';

/**
 * Every component in this map works in any .mdx file without an import.
 */
export function getMDXComponents(components?: MDXComponents) {
  return {
    ...defaultMdxComponents,
    // Fumadocs built-ins
    Accordion,
    Accordions,
    File,
    Files,
    Folder,
    Step,
    Steps,
    Tab,
    Tabs,
    TypeTable,
    // Learning widgets built with Primer React
    Checklist,
    CommandExercise,
    Flashcards,
    LessonMeta,
    Mermaid,
    PrimerShowcase,
    Quiz,
    // Animated elements
    CodeTour,
    GitGraph,
    LayerStack,
    Terminal,
    ThemePlayground,
    WorkflowRun,
    ...components,
  } satisfies MDXComponents;
}

export const useMDXComponents = getMDXComponents;

declare global {
  type MDXProvidedComponents = ReturnType<typeof getMDXComponents>;
}
