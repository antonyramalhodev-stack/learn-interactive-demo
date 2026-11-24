import type { ReactNode } from 'react';
import styles from './motion.module.css';

export interface WindowProps {
  title: ReactNode;
  icon?: ReactNode;
  /** Controls on the right side of the title bar. */
  actions?: ReactNode;
  children: ReactNode;
  className?: string;
  label?: string;
}

/** The frame the animated elements share: a title bar and a body, built from Primer tokens. */
export function Window({ title, icon, actions, children, className, label }: WindowProps) {
  return (
    <section className={`${styles.window} ${className ?? ''}`} aria-label={label}>
      <header className={styles.windowBar}>
        {icon}
        <span className={styles.windowTitle}>{title}</span>
        <span className={styles.spacer} />
        {actions}
      </header>
      {children}
    </section>
  );
}
