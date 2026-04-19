import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import type { Variants, Transition } from 'framer-motion';
import type { TransitionType } from '../../types/story';
import { useScrollContainer } from './ScrollContainerContext';

type Props = {
  children: React.ReactNode;
  transition: TransitionType;
  index: number;
};

function makeVariants(
  hiddenProps: Record<string, unknown>,
  tx: Omit<Transition, 'delay'>,
): Variants {
  return {
    hidden: { opacity: 0, ...hiddenProps },
    visible: (i: number) => ({
      opacity: 1,
      y: 0,
      x: 0,
      transition: { ...tx, delay: i * 0.1 } as Transition,
    }),
  };
}

const VARIANT_MAP: Record<TransitionType, Variants> = {
  fade: makeVariants({}, { duration: 0.7, ease: 'easeOut' }),
  'slide-up': makeVariants({ y: 40 }, { duration: 0.6, ease: [0.22, 1, 0.36, 1] as [number, number, number, number] }),
  parallax: makeVariants({ y: 24 }, { duration: 0.8, ease: 'easeOut' }),
  cut: {
    hidden: { opacity: 1 },
    visible: { opacity: 1, transition: { duration: 0 } },
  },
};

export function AnimatedBlock({ children, transition, index }: Props) {
  const ref = useRef<HTMLDivElement>(null);
  const root = useScrollContainer();

  // Använd preview-panelen som root så att Intersection Observer
  // reagerar på scroll i rätt container (inte window)
  // useInView vill ha en RefObject som root, inte ett element direkt
  const rootRef = useRef<HTMLElement | null>(null);
  if (root && rootRef.current !== root) rootRef.current = root;

  const inView = useInView(ref, {
    once: true,
    margin: '0px 0px -80px 0px',
    root: root ? rootRef : undefined,
  });

  const variants = VARIANT_MAP[transition] ?? VARIANT_MAP.fade;

  return (
    <motion.div
      ref={ref}
      custom={index}
      initial="hidden"
      animate={inView ? 'visible' : 'hidden'}
      variants={variants}
    >
      {children}
    </motion.div>
  );
}
