import type { ReactNode, Ref } from 'react';
import ui from './panel.module.css';

export interface PanelProps {
  title: string;
  icon?: ReactNode;
  /** Controls on the right side of the title bar. */
  actions?: ReactNode;
  /** Remove the padding. Use it for code and terminal content. */
  flush?: boolean;
  children: ReactNode;
  ref?: Ref<HTMLElement>;
}

/** The frame every element shares: a title bar and a body. */
export function Panel({ title, icon, actions, flush = false, children, ref }: PanelProps) {
  return (
    <section ref={ref} className={`learn-element not-prose ${ui.root} ${ui.panel}`} aria-label={title}>
      <header className={ui.bar}>
        {icon}
        <span className={ui.title}>{title}</span>
        <span className={ui.spacer} />
        {actions}
      </header>
      <div className={flush ? undefined : ui.body}>{children}</div>
    </section>
  );
}
