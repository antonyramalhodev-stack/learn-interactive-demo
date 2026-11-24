'use client';

import { useMemo } from 'react';
import { BranchName } from '@primer/react';
import { GitBranchIcon } from '@primer/octicons-react';
import { useAutoStep } from './hooks';
import { Panel } from './panel';
import { scriptLines } from './script';
import { StepNav } from './step-nav';
import styles from './git-graph.module.css';

type GitEvent =
  | { type: 'commit'; branch: string; label: string }
  | { type: 'branch'; branch: string; from: string; label: string }
  | { type: 'merge'; branch: string; into: string; label: string };

/** Reads one line of the script, for example `branch feature from main: Create a branch`. */
function parse(line: string): GitEvent {
  const colon = line.indexOf(':');
  const words = line.slice(0, colon).trim().split(/\s+/);
  const label = line.slice(colon + 1).trim();

  if (colon > 0 && words[0] === 'commit' && words.length === 2) {
    return { type: 'commit', branch: words[1], label };
  }
  if (colon > 0 && words[0] === 'branch' && words[2] === 'from' && words.length === 4) {
    return { type: 'branch', branch: words[1], from: words[3], label };
  }
  if (colon > 0 && words[0] === 'merge' && words[2] === 'into' && words.length === 4) {
    return { type: 'merge', branch: words[1], into: words[3], label };
  }
  throw new Error(`<GitGraph> can't read this line: "${line.trim()}"`);
}

const colors = [
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
  hollow: boolean;
}

interface Link {
  index: number;
  lane: number;
  d: string;
}

/** Places each event on a column and each branch on a lane. */
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
    const target = event.type === 'merge' ? event.into : event.branch;
    if (event.type === 'branch') laneOf(event.from);
    const lane = laneOf(target);
    const node: Node = {
      index,
      lane,
      x: padX + index * stepX,
      y: padY + lane * laneY,
      hollow: event.type !== 'commit',
    };

    // A straight line from the previous commit on the same branch.
    const previous = last.get(target);
    if (previous) links.push({ index, lane, d: `M ${previous.x} ${previous.y} L ${node.x} ${node.y}` });

    // A curve from the other branch, for a new branch or a merge.
    const other = event.type === 'branch' ? event.from : event.type === 'merge' ? event.branch : null;
    const from = other ? last.get(other) : undefined;
    if (other && from) {
      const middle = (from.x + node.x) / 2;
      links.push({
        index,
        lane: event.type === 'merge' ? laneOf(other) : lane,
        d: `M ${from.x} ${from.y} C ${middle} ${from.y}, ${middle} ${node.y}, ${node.x} ${node.y}`,
      });
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

export interface GitGraphProps {
  title?: string;
  /** Play the steps when the reader scrolls to the graph. */
  autoPlay?: boolean;
  /** Start again after the last step. */
  loop?: boolean;
  /** The history, one event on each line. */
  children: string;
}

/**
 * A commit graph that draws itself one step at a time.
 *
 *   <GitGraph title="Feature branch flow">{`
 *   commit main: Start from the default branch
 *   branch feature from main: Create a branch
 *   commit feature: Commit a change
 *   merge feature into main: Merge the branch
 *   `}</GitGraph>
 */
export function GitGraph({ title = 'Commit graph', autoPlay = true, loop = false, children }: GitGraphProps) {
  const events = useMemo(() => scriptLines(children, 'GitGraph').map(parse), [children]);
  const graph = useMemo(() => layout(events), [events]);
  const { ref, step, last, go, play } = useAutoStep(events.length, { autoPlay, loop });

  return (
    <Panel
      ref={ref}
      title={title}
      icon={<GitBranchIcon size={16} aria-hidden />}
      actions={<StepNav step={step} last={last} onGo={go} onPlay={play} />}
    >
      <div className={styles.legend}>
        {graph.lanes.map((lane, index) => (
          <span key={lane} className={styles.lane}>
            <span className={styles.dot} style={{ background: colors[index % colors.length] }} />
            <BranchName as="span">{lane}</BranchName>
          </span>
        ))}
      </div>
      <div className={styles.scroll}>
        <svg
          className={styles.svg}
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
              className={`${styles.link} ${link.index <= step ? styles.on : ''}`}
              stroke={colors[link.lane % colors.length]}
            />
          ))}
          {graph.nodes.map((node) => {
            const color = colors[node.lane % colors.length];
            return (
              <g
                key={node.index}
                className={`${styles.node} ${node.index <= step ? styles.on : ''} ${node.index === step ? styles.now : ''}`}
                style={{ transformOrigin: `${node.x}px ${node.y}px` }}
              >
                <circle cx={node.x} cy={node.y} r={15} className={styles.halo} fill={color} />
                <circle
                  cx={node.x}
                  cy={node.y}
                  r={8}
                  fill={node.hollow ? 'var(--bgColor-default)' : color}
                  stroke={color}
                  strokeWidth={3}
                />
              </g>
            );
          })}
        </svg>
      </div>
      <p className={styles.caption} aria-live="polite">
        <span className={styles.count}>
          {step + 1}/{events.length}
        </span>
        <span key={step} className={styles.label}>
          {events[step].label}
        </span>
      </p>
    </Panel>
  );
}
