# Lesson elements

Every lesson element lives in this folder. Each element is one `.tsx` file and one `.module.css` file.

## Shared parts

| File | What it gives every element |
| --- | --- |
| `panel.tsx` | The frame: a title bar and a body |
| `hooks.ts` | In-view detection, reduced motion, auto stepping, copy, and saved state |
| `step-nav.tsx` | Previous, play, and next buttons |
| `script.ts` | The reader for text between the tags |
| `index.ts` | The list of tags a lesson can use |

## Add an element

1. Create `my-element.tsx`. Wrap the content in `Panel` so it matches the others.
2. Create `my-element.module.css` if the element needs its own styles. Use Primer tokens for every color and size.
3. Add the element to `elements` in `index.ts`.

```tsx
'use client';

import { StarIcon } from '@primer/octicons-react';
import { Panel } from './panel';

export function MyElement({ children }: { children: React.ReactNode }) {
  return (
    <Panel title="My element" icon={<StarIcon size={16} aria-hidden />}>
      {children}
    </Panel>
  );
}
```

## Rules the elements follow

- An animation starts when the element scrolls into view.
- With reduced motion, the element shows its end state.
- Nothing needs a server. Saved state stays in the reader's browser.
