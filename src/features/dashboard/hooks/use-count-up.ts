'use client';

import { useEffect, useState } from 'react';
import { useMotionValue, useReducedMotion, useSpring } from 'motion/react';

// عدّاد تصاعدي ناعم لقيم KPI — يحترم تفضيل تقليل الحركة
export function useCountUp(target: number): number {
  const reduceMotion = useReducedMotion();
  const motionValue = useMotionValue(0);
  const spring = useSpring(motionValue, { stiffness: 80, damping: 24 });
  const [value, setValue] = useState(0);

  useEffect(() => {
    if (reduceMotion) return;
    motionValue.set(target);
    return spring.on('change', (latest) => setValue(Math.round(latest)));
  }, [target, reduceMotion, motionValue, spring]);

  return reduceMotion ? target : value;
}
