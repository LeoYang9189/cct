import { useState, useEffect, useCallback, memo } from 'react';

interface ColoredTextPart {
  text: string;
  className: string;
}

interface ColoredTypedTextProps {
  textParts: ColoredTextPart[];
  typingSpeed?: number;
  onComplete?: () => void;
  loop?: boolean;
  loopDelay?: number;
}

const ColoredTypedText = ({
  textParts,
  typingSpeed = 100,
  onComplete,
  loop = false,
  loopDelay = 2000
}: ColoredTypedTextProps) => {
  const fullText = textParts.map(part => part.text).join('');

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

    if (!isDeleting && currentIndex < fullText.length) {
      // 正在输入
      timeout = setTimeout(() => {
        setDisplayText(prev => prev + fullText[currentIndex]);
        setCurrentIndex(prev => prev + 1);
      }, typingSpeed);

      if (currentIndex === fullText.length - 1) {
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
  }, [currentIndex, fullText, typingSpeed, isComplete, isDeleting, isPaused, loop, loopDelay, displayText.length, onComplete]);

  // 将显示文本分割为不同颜色部分
  const renderColoredText = useCallback(() => {
    let currentPosition = 0;
    return textParts.map((part, index) => {
      const start = currentPosition;
      const end = start + part.text.length;
      currentPosition = end;

      const textToShow = displayText.substring(start, Math.min(end, displayText.length));
      if (textToShow.length === 0) return null;

      return (
        <span key={index} className={part.className}>
          {textToShow}
        </span>
      );
    });
  }, [textParts, displayText]);

  return (
    <div className="inline-flex items-center">
      {renderColoredText()}
      <span className="inline-block w-[2px] h-[1em] bg-primary ml-1 animate-blink"></span>
    </div>
  );
};

// 使用 memo 避免不必要的重新渲染
export default memo(ColoredTypedText);