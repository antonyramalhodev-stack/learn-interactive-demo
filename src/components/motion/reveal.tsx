'use client';

import { useEffect, useState, type ReactNode } from 'react';
import { useInView } from './hooks';
import styles from './motion.module.css';

/** Fades its content in the first time the reader scrolls to it. */
export function Reveal({ children, delay = 0 }: { children: ReactNode; delay?: number }) {
  const [ref, inView] = useInView<HTMLDivElement>(0.15);
  const [shown, setShown] = useState(false);

  useEffect(() => {
    if (inView) setShown(true);
  }, [inView]);

  return (
    <div
      ref={ref}
      className={`${styles.reveal} ${shown ? styles.revealOn : ''}`}
      style={{ transitionDelay: `${delay}ms` }}
    >
      {children}
    </div>
  );
}
