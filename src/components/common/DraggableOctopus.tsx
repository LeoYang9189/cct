import { useState, useRef, useEffect } from 'react';
import octopusAvatar from '../../assets/octopus-avatar-new.svg';
import './DraggableOctopus.css'; // 导入CSS文件

interface Position {
  x: number;
  y: number;
}

interface Props {
  onClick: () => void;
}

const DraggableOctopus: React.FC<Props> = ({ onClick }) => {
  const [position, setPosition] = useState<Position>({ x: window.innerWidth - 80, y: window.innerHeight - 120 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState<Position>({ x: 0, y: 0 });
  const octopusRef = useRef<HTMLDivElement>(null);

  // 处理鼠标拖拽开始
  const handleMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    if (octopusRef.current) {
      setIsDragging(true);
      const rect = octopusRef.current.getBoundingClientRect();
      setDragOffset({
        x: e.clientX - rect.left,
        y: e.clientY - rect.top
      });
    }
    e.preventDefault();
  };

  // 处理触摸拖拽开始
  const handleTouchStart = (e: React.TouchEvent<HTMLDivElement>) => {
    if (octopusRef.current && e.touches.length > 0) {
      setIsDragging(true);
      const rect = octopusRef.current.getBoundingClientRect();
      const touch = e.touches[0];
      setDragOffset({
        x: touch.clientX - rect.left,
        y: touch.clientY - rect.top
      });
    }
  };

  // 处理鼠标拖拽
  const handleMouseMove = (e: MouseEvent) => {
    if (!isDragging) return;

    // 计算新位置，确保不超出屏幕边界
    const newX = Math.max(0, Math.min(window.innerWidth - 60, e.clientX - dragOffset.x));
    const newY = Math.max(0, Math.min(window.innerHeight - 60, e.clientY - dragOffset.y));

    setPosition({ x: newX, y: newY });
  };

  // 处理触摸拖拽
  const handleTouchMove = (e: TouchEvent) => {
    if (!isDragging || e.touches.length === 0) return;

    const touch = e.touches[0];
    // 计算新位置，确保不超出屏幕边界
    const newX = Math.max(0, Math.min(window.innerWidth - 60, touch.clientX - dragOffset.x));
    const newY = Math.max(0, Math.min(window.innerHeight - 60, touch.clientY - dragOffset.y));

    setPosition({ x: newX, y: newY });
    e.preventDefault(); // 防止页面滚动
  };

  // 处理拖拽结束
  const handleMouseUp = () => {
    setIsDragging(false);
  };

  // 处理触摸结束
  const handleTouchEnd = () => {
    setIsDragging(false);
  };

  // 添加和移除事件监听器
  useEffect(() => {
    if (isDragging) {
      // 鼠标事件
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseup', handleMouseUp);

      // 触摸事件
      window.addEventListener('touchmove', handleTouchMove, { passive: false });
      window.addEventListener('touchend', handleTouchEnd);
      window.addEventListener('touchcancel', handleTouchEnd);
    }

    return () => {
      // 移除鼠标事件
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);

      // 移除触摸事件
      window.removeEventListener('touchmove', handleTouchMove);
      window.removeEventListener('touchend', handleTouchEnd);
      window.removeEventListener('touchcancel', handleTouchEnd);
    };
  }, [isDragging, dragOffset]);

  return (
    <div
      ref={octopusRef}
      style={{
        position: 'fixed',
        left: `${position.x}px`,
        top: `${position.y}px`,
        cursor: isDragging ? 'grabbing' : 'grab',
        zIndex: 1000,
        width: '60px',
        height: '80px',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        transition: isDragging ? 'none' : 'all 0.1s ease'
      }}
      onMouseDown={handleMouseDown}
      onTouchStart={handleTouchStart}
      onClick={() => !isDragging && onClick()}
      role="button"
      tabIndex={0}
      aria-label="打开AI沃宝助手"
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          onClick();
        }
      }}
    >
      <div
        className="octopus-icon-container"
        style={{
          width: '48px',
          height: '48px',
          borderRadius: '50%',
          backgroundColor: 'white',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          marginBottom: '4px'
        }}
      >
        <img
          src={octopusAvatar}
          alt="AI 沃宝"
          style={{
            width: '32px',
            height: '32px',
            pointerEvents: 'none'
          }}
        />
      </div>
      <span
        style={{
          fontSize: '12px',
          fontWeight: '900', // 更粗的字体
          color: '#7466F0',
          textShadow: '0 0 5px rgba(255, 255, 255, 0.8)'
        }}
      >
        AI沃宝
      </span>
    </div>
  );
};

export default DraggableOctopus;