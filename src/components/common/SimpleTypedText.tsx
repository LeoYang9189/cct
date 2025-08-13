import { useState, useEffect, memo } from 'react';

interface SimpleTypedTextProps {
  text: string;
  className?: string;
  typingSpeed?: number;
  pauseTime?: number;
}

const SimpleTypedText = ({
  text,
  className = '',
  typingSpeed = 150,
  pauseTime = 5000
}: SimpleTypedTextProps) => {
  const [displayText, setDisplayText] = useState('');
  const [isTyping, setIsTyping] = useState(true);
  const [isPaused, setIsPaused] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    let timeout: ReturnType<typeof setTimeout>;

    // 暂停状态 - 完整显示文本一段时间后开始删除
    if (isPaused) {
      timeout = setTimeout(() => {
        setIsPaused(false);
        setIsDeleting(true);
      }, pauseTime);
      return () => clearTimeout(timeout);
    }

    // 打字状态
    if (isTyping && !isDeleting) {
      if (currentIndex < text.length) {
        timeout = setTimeout(() => {
          setDisplayText(prev => prev + text[currentIndex]);
          setCurrentIndex(prev => prev + 1);
        }, typingSpeed);
      } else {
        setIsTyping(false);
        setIsPaused(true);
      }
      return () => clearTimeout(timeout);
    }

    // 删除状态
    if (isDeleting) {
      if (displayText.length > 0) {
        timeout = setTimeout(() => {
          setDisplayText(prev => prev.slice(0, -1));
        }, typingSpeed / 3);
      } else {
        // 重置状态，准备下一轮打字
        setIsDeleting(false);
        setIsTyping(true);
        setCurrentIndex(0);
      }
      return () => clearTimeout(timeout);
    }
  }, [text, typingSpeed, pauseTime, isTyping, isPaused, isDeleting, currentIndex, displayText.length]);

  return (
    <span className={className}>
      {displayText}
      <span className="inline-block w-[2px] h-[1em] bg-primary ml-1 animate-blink"></span>
    </span>
  );
};

export default memo(SimpleTypedText);
