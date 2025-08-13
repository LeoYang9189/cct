/// <reference types="vite/client" />

// CSS模块类型声明
declare module '*.css' {
  const content: { [className: string]: string };
  export default content;
}

// SVG文件类型声明
declare module '*.svg' {
  const content: string;
  export default content;
}

// SVG React组件类型声明
declare module '*.svg?react' {
  import React from 'react';
  const ReactComponent: React.FC<React.SVGProps<SVGSVGElement>>;
  export { ReactComponent };
  export default ReactComponent;
}

// 其他资源文件类型声明
declare module '*.png' {
  const content: string;
  export default content;
}

declare module '*.jpg' {
  const content: string;
  export default content;
}

declare module '*.jpeg' {
  const content: string;
  export default content;
}

declare module '*.gif' {
  const content: string;
  export default content;
}

declare module '*.webp' {
  const content: string;
  export default content;
}

// Arco Design CSS类型声明
declare module '@arco-design/web-react/dist/css/arco.css';
declare module 'leaflet/dist/leaflet.css';
