import { useEffect, useState } from 'react';

/**
 * Custom hook to add a staggered animation effect to a list of items
 * @param itemCount Number of items to animate
 * @param delay Base delay between animations (in ms)
 * @returns An array of boolean values indicating if each item should be visible
 */
export const useStaggeredAnimation = (itemCount: number, delay = 50) => {
  const [visibleItems, setVisibleItems] = useState<boolean[]>([]);

  useEffect(() => {
    const timers: number[] = [];
    
    // Reset visibility when item count changes
    setVisibleItems(Array(itemCount).fill(false));
    
    // Animate each item with staggered delay
    for (let i = 0; i < itemCount; i++) {
      const timer = setTimeout(() => {
        setVisibleItems(prev => {
          const newState = [...prev];
          newState[i] = true;
          return newState;
        });
      }, delay * i);
      
      timers.push(timer);
    }
    
    // Clean up timers
    return () => {
      timers.forEach(timer => clearTimeout(timer));
    };
  }, [itemCount, delay]);
  
  return visibleItems;
};

/**
 * Custom hook to add entrance animation on component mount
 * @param delay Delay before animation starts (in ms)
 * @param duration Duration of the animation (in ms)
 * @returns Object with style and className for the animated element
 */
export const useEntranceAnimation = (delay = 0, duration = 300) => {
  const [isVisible, setIsVisible] = useState(false);
  
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, delay);
    
    return () => clearTimeout(timer);
  }, [delay]);
  
  return {
    style: { 
      transition: `opacity ${duration}ms, transform ${duration}ms`,
      opacity: isVisible ? 1 : 0,
      transform: isVisible ? 'translateY(0)' : 'translateY(20px)'
    },
    className: isVisible ? 'animate-entrance' : ''
  };
};

/**
 * Custom hook to add number counting animation
 * @param targetValue The final value to count to
 * @param duration Duration of the animation (in ms)
 * @returns The current value during animation
 */
export const useCountAnimation = (targetValue: number, duration = 1000) => {
  const [currentValue, setCurrentValue] = useState(0);
  
  useEffect(() => {
    let startTime: number | null = null;
    const startValue = currentValue;
    
    const animate = (timestamp: number) => {
      if (!startTime) startTime = timestamp;
      const elapsed = timestamp - startTime;
      
      const progress = Math.min(elapsed / duration, 1);
      setCurrentValue(startValue + progress * (targetValue - startValue));
      
      if (progress < 1) {
        requestAnimationFrame(animate);
      }
    };
    
    requestAnimationFrame(animate);
    
    return () => {
      setCurrentValue(targetValue);
    };
  }, [targetValue, duration]);
  
  return currentValue;
}; 