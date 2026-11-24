'use client';

import { useEffect, useMemo, useState } from 'react';
import { BranchName, IconButton } from '@primer/react';
import {
  ChevronLeftIcon,
  ChevronRightIcon,
  GitBranchIcon,
  PlayIcon,
  SyncIcon,
} from '@primer/octicons-react';
import { useInView, useReducedMotion } from './hooks';
import { Window } from './window';
import styles from './motion.module.css';

export type GitEvent =
  | { type: 'commit'; branch: string; label: string }
  | { type: 'branch'; branch: string; from: string; label: string }
  | { type: 'merge'; branch: string; into: string; label: string };

export interface GitGraphProps {
  title?: string;
  events: GitEvent[];
  /** Play the steps when the reader scrolls to the graph. */
  autoPlay?: boolean;
  /** Start again after the last step. */
  loop?: boolean;
  /** Hide the step buttons. Use with `autoPlay` and `loop` for a decorative graph. */
  compact?: boolean;
  onStatus?: (text: string) => void;
  /** Called with the index of the event on screen. */
  onStep?: (index: number) => void;
}

const laneColors = [
  'var(--fgColor-accent)',
  'var(--fgColor-success)',
  'var(--fgColor-done)',
  'var(--fgColor-attention)',
  'var(--fgColor-severe)',
];

const stepX = 84;
const laneY = 52;
const padX = 30;
const padY = 28;

interface Node {
  index: number;
  x: number;
  y: number;
  lane: number;
  kind: GitEvent['type'];
}

interface Link {
  index: number;
  d: string;
  lane: number;
}

function layout(events: GitEvent[]) {
  const lanes: string[] = [];
  const last = new Map<string, Node>();
  const nodes: Node[] = [];
  const links: Link[] = [];

  const laneOf = (name: string) => {
    if (!lanes.includes(name)) lanes.push(name);
    return lanes.indexOf(name);
  };

  events.forEach((event, index) => {
    const x = padX + index * stepX;
    const target = event.type === 'merge' ? event.into : event.branch;
    if (event.type === 'branch') laneOf(event.from);
    const lane = laneOf(target);
    const node: Node = { index, x, y: padY + lane * laneY, lane, kind: event.type };

    const curveFrom = (from: Node, colorLane: number) => {
      const mid = (from.x + node.x) / 2;
      links.push({
        index,
        lane: colorLane,
        d: `M ${from.x} ${from.y} C ${mid} ${from.y}, ${mid} ${node.y}, ${node.x} ${node.y}`,
      });
    };

    const previous = last.get(target);
    if (previous) {
      links.push({ index, lane, d: `M ${previous.x} ${previous.y} L ${node.x} ${node.y}` });
    }
    if (event.type === 'branch') {
      const from = last.get(event.from);
      if (from) curveFrom(from, lane);
    }
    if (event.type === 'merge') {
      const from = last.get(event.branch);
      if (from) curveFrom(from, laneOf(event.branch));
    }

    nodes.push(node);
    last.set(target, node);
  });

  return {
    lanes,
    nodes,
    links,
    width: padX * 2 + Math.max(events.length - 1, 1) * stepX,
    height: padY * 2 + Math.max(lanes.length - 1, 0) * laneY,
  };
}

/**
 * A commit graph that builds itself one step at a time.
 * You describe the history as a list of events, and the component draws the lanes.
 */
export function GitGraph({
  title = 'Commit graph',
  events,
  autoPlay = true,
  loop = false,
  compact = false,
  onStatus,
  onStep,
}: GitGraphProps) {
  const [ref, inView] = useInView<HTMLDivElement>();
  const reduced = useReducedMotion();
  const graph = useMemo(() => layout(events), [events]);
  const lastStep = events.length - 1;
  const [step, setStep] = useState(0);
  const [playing, setPlaying] = useState(autoPlay);

  useEffect(() => {
    if (reduced) {
      setStep(lastStep);
      setPlaying(false);
    }
  }, [lastStep, reduced]);

  useEffect(() => {
    if (!playing || !inView || reduced) return;
    if (step >= lastStep) {
      if (!loop) {
        setPlaying(false);
        return;
      }
      const id = window.setTimeout(() => setStep(0), 2600);
      return () => window.clearTimeout(id);
    }
    const id = window.setTimeout(() => setStep((value) => value + 1), 1500);
    return () => window.clearTimeout(id);
  }, [inView, lastStep, loop, playing, reduced, step]);

  const current = events[step];

  useEffect(() => {
    if (onStatus && inView) onStatus(`git: ${current.label}`);
  }, [current.label, inView, onStatus]);

  useEffect(() => {
    onStep?.(step);
  }, [onStep, step]);

  const go = (next: number) => {
    setPlaying(false);
    setStep(Math.min(Math.max(next, 0), lastStep));
  };

  return (
    <div ref={ref} className="learn-widget not-prose">
      <Window
        title={title}
        icon={<GitBranchIcon size={16} aria-hidden />}
        label={title}
        actions={
          compact ? null : (
            <>
              <IconButton
                icon={ChevronLeftIcon}
                aria-label="Previous step"
                size="small"
                variant="invisible"
                disabled={step === 0}
                onClick={() => go(step - 1)}
              />
              <IconButton
                icon={step >= lastStep ? SyncIcon : PlayIcon}
                aria-label={step >= lastStep ? 'Replay' : 'Play'}
                size="small"
                variant="invisible"
                onClick={() => {
                  if (step >= lastStep) setStep(0);
                  setPlaying(true);
                }}
              />
              <IconButton
                icon={ChevronRightIcon}
                aria-label="Next step"
                size="small"
                variant="invisible"
                disabled={step >= lastStep}
                onClick={() => go(step + 1)}
              />
            </>
          )
        }
      >
        <div className={styles.graphBody}>
          <div className={styles.graphLegend}>
            {graph.lanes.map((lane, index) => (
              <span key={lane} className={styles.graphLane}>
                <span className={styles.graphDot} style={{ background: laneColors[index % laneColors.length] }} />
                <BranchName as="span">{lane}</BranchName>
              </span>
            ))}
          </div>
          <div className={styles.graphScroll}>
            <svg
              className={styles.graphSvg}
              viewBox={`0 0 ${graph.width} ${graph.height}`}
              style={{ minWidth: Math.min(graph.width, 320) }}
              role="img"
              aria-label={`${title}. ${events.map((event) => event.label).join(', then ')}.`}
            >
              {graph.links.map((link, index) => (
                <path
                  key={index}
                  d={link.d}
                  pathLength={1}
                  className={`${styles.graphLink} ${link.index <= step ? styles.graphLinkOn : ''}`}
                  stroke={laneColors[link.lane % laneColors.length]}
                />
              ))}
              {graph.nodes.map((node) => (
                <g
                  key={node.index}
                  className={`${styles.graphNode} ${node.index <= step ? styles.graphNodeOn : ''} ${
                    node.index === step ? styles.graphNodeNow : ''
                  }`}
                  style={{ transformOrigin: `${node.x}px ${node.y}px` }}
                >
                  <circle cx={node.x} cy={node.y} r={15} className={styles.graphHalo} fill={laneColors[node.lane % laneColors.length]} />
                  <circle
                    cx={node.x}
                    cy={node.y}
                    r={8}
                    fill={node.kind === 'commit' ? laneColors[node.lane % laneColors.length] : 'var(--bgColor-default)'}
                    stroke={laneColors[node.lane % laneColors.length]}
                    strokeWidth={3}
                  />
                </g>
              ))}
            </svg>
          </div>
          <p className={styles.graphCaption} aria-live={compact ? 'off' : 'polite'}>
            <span className={styles.graphStep}>
              {step + 1}/{events.length}
            </span>
            <span key={step} className={styles.swap}>
              {current.label}
            </span>
          </p>
        </div>
      </Window>
    </div>
  );
}
