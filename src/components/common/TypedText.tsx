import { useState, useEffect } from 'react';

interface TypedTextProps {
  text: string;
  typingSpeed?: number;
  className?: string;
  onComplete?: () => void;
  loop?: boolean;
  loopDelay?: number;
}

const TypedText = ({ 
  text, 
  typingSpeed = 100, 
  className = '', 
  onComplete, 
  loop = false, 
  loopDelay = 2000 
}: TypedTextProps) => {
  const [displayText, setDisplayText] = useState('');
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isComplete, setIsComplete] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isPaused, setIsPaused] = useState(false);

  useEffect(() => {
    let timeout: ReturnType<typeof setTimeout>;
    
    if (isPaused) {
      timeout = setTimeout(() => {
        setIsPaused(false);
        if (loop) setIsDeleting(true);
      }, loopDelay);
      return () => clearTimeout(timeout);
    }
    
    if (!isDeleting && currentIndex < text.length) {
      // 正在输入
      timeout = setTimeout(() => {
        setDisplayText(prev => prev + text[currentIndex]);
        setCurrentIndex(prev => prev + 1);
      }, typingSpeed);
      
      if (currentIndex === text.length - 1) {
        if (loop) {
          setIsComplete(true);
          setIsPaused(true);
        } else if (!isComplete) {
          setIsComplete(true);
          if (onComplete) onComplete();
        }
      }
      
      return () => clearTimeout(timeout);
    } else if (isDeleting && displayText.length > 0) {
      // 正在删除
      timeout = setTimeout(() => {
        setDisplayText(prev => prev.slice(0, -1));
      }, typingSpeed / 2);
      
      if (displayText.length === 1) {
        setIsDeleting(false);
        setCurrentIndex(0);
        setIsComplete(false);
      }
      
      return () => clearTimeout(timeout);
    }
  }, [currentIndex, text, typingSpeed, isComplete, isDeleting, isPaused, loop, loopDelay, displayText.length, onComplete]);

  return (
    <div className={className}>
      {displayText}
      <span className={`inline-block w-[2px] h-[1em] bg-primary ml-1 animate-blink`}></span>
    </div>
  );
};

export default TypedText; 