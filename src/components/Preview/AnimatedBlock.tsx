import { useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
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
      transition: { ...tx, delay: i * 0.12 } as Transition,
    }),
  };
}

const VARIANT_MAP: Record<TransitionType, Variants> = {
  fade: makeVariants({}, { duration: 0.8, ease: 'easeOut' }),
  'slide-up': makeVariants(
    { y: 48 },
    { duration: 0.65, ease: [0.22, 1, 0.36, 1] as [number, number, number, number] },
  ),
  parallax: makeVariants({ y: 28 }, { duration: 0.9, ease: 'easeOut' }),
  cut: {
    hidden: { opacity: 1 },
    visible: { opacity: 1 },
  },
};

export function AnimatedBlock({ children, transition, index }: Props) {
  const container = useScrollContainer();
  // Håll en stabil RefObject som pekar på scroll-containern
  const rootRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    rootRef.current = container;
  }, [container]);

  const variants = VARIANT_MAP[transition] ?? VARIANT_MAP.fade;

  if (transition === 'cut') {
    return <>{children}</>;
  }

  return (
    <motion.div
      custom={index}
      initial="hidden"
      whileInView="visible"
      viewport={{
        // root pekar på preview-panelen, inte window
        root: rootRef,
        once: true,
        amount: 0.15,
      }}
      variants={variants}
    >
      {children}
    </motion.div>
  );
}
