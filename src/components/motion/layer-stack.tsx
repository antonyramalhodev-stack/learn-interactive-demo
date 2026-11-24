'use client';

import { useEffect, useState } from 'react';
import { useInView, useReducedMotion } from './hooks';
import styles from './motion.module.css';

export interface Layer {
  name: string;
  /** The tool or package that fills this layer. */
  tech: string;
  text: string;
}

export interface LayerStackProps {
  /** Top layer first. */
  layers: Layer[];
  /** Step through the layers until the reader picks one. */
  autoPlay?: boolean;
  onStatus?: (text: string) => void;
}

/**
 * A stack of layers. The selected layer lifts out of the stack and its description shows beside it.
 */
export function LayerStack({ layers, autoPlay = true, onStatus }: LayerStackProps) {
  const [ref, inView] = useInView<HTMLDivElement>();
  const reduced = useReducedMotion();
  const [active, setActive] = useState(0);
  const [auto, setAuto] = useState(autoPlay);

  useEffect(() => {
    if (!auto || !inView || reduced) return;
    const id = window.setTimeout(() => setActive((value) => (value + 1) % layers.length), 2600);
    return () => window.clearTimeout(id);
  }, [active, auto, inView, layers.length, reduced]);

  useEffect(() => {
    if (onStatus && inView) onStatus(`layer: ${layers[active].name.toLowerCase()}`);
  }, [active, inView, layers, onStatus]);

  const pick = (index: number) => {
    setAuto(false);
    setActive(index);
  };

  return (
    <div ref={ref} className={`learn-widget not-prose ${styles.layers}`}>
      <div className={styles.layerScene} aria-hidden>
        <div className={styles.layerTilt}>
          {layers.map((layer, index) => (
            <div
              key={layer.name}
              className={`${styles.layerSlab} ${index === active ? styles.layerSlabOn : ''}`}
              style={{
                ['--layer-z' as string]: `${(layers.length - 1 - index) * 34}px`,
                zIndex: layers.length - index,
              }}
              onPointerEnter={() => pick(index)}
            >
              <span>{layer.name}</span>
            </div>
          ))}
        </div>
      </div>
      <div className={styles.layerList} role="tablist" aria-label="Layers" aria-orientation="vertical">
        {layers.map((layer, index) => (
          <button
            key={layer.name}
            type="button"
            role="tab"
            aria-selected={index === active}
            className={`${styles.layerTab} ${index === active ? styles.layerTabOn : ''}`}
            onClick={() => pick(index)}
            onFocus={() => pick(index)}
          >
            <span className={styles.layerName}>
              {layer.name}
              <code>{layer.tech}</code>
            </span>
            <span className={styles.layerText}>{layer.text}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
