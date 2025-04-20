// /hooks/useAnimatedNumber.ts
import { useEffect, useState } from "react";

export function useAnimatedNumber(target: number, speed = 300) {
  const [displayValue, setDisplayValue] = useState(target);

  useEffect(() => {
    let frameId: number;
    let startTime: number | null = null;
    const startValue = displayValue;
    const change = target - startValue;

    const animate = (time: number) => {
      if (!startTime) startTime = time;
      const progress = Math.min((time - startTime) / speed, 1);
      setDisplayValue(Math.round(startValue + change * progress));

      if (progress < 1) {
        frameId = requestAnimationFrame(animate);
      }
    };

    frameId = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(frameId);
  }, [target, speed]);

  return displayValue;
}
