'use client';

import { useEffect, useState } from 'react';
import { useStatus } from './status';
import styles from './motion.module.css';

export interface StatusSection {
  /** The `id` of the section element on the page. */
  id: string;
  label: string;
}

/**
 * A bar fixed to the bottom of the page.
 * The left side prints what the animations are doing. The right side links to each section and
 * marks the one on screen.
 */
export function StatusBar({ sections }: { sections: StatusSection[] }) {
  const status = useStatus();
  const [active, setActive] = useState(sections[0]?.id);

  useEffect(() => {
    if (typeof IntersectionObserver === 'undefined') return;
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) setActive(entry.target.id);
        });
      },
      // A section counts as current while it crosses the middle of the screen.
      { rootMargin: '-45% 0px -45% 0px' },
    );
    sections.forEach((section) => {
      const element = document.getElementById(section.id);
      if (element) observer.observe(element);
    });
    return () => observer.disconnect();
  }, [sections]);

  return (
    <div className={styles.statusBar}>
      <p className={styles.statusText} aria-hidden>
        <span className={styles.statusLamp} />
        <span key={status} className={styles.statusLine}>
          {status}
        </span>
      </p>
      <nav className={styles.statusNav} aria-label="Sections">
        {sections.map((section) => (
          <a
            key={section.id}
            href={`#${section.id}`}
            aria-current={active === section.id ? 'location' : undefined}
            className={active === section.id ? styles.statusLinkOn : undefined}
          >
            {section.label}
          </a>
        ))}
      </nav>
    </div>
  );
}
