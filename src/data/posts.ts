// 本地文章类型（包含额外的字段，用于静态数据）
interface LocalPost {
  id: number;
  title: string;
  excerpt: string;
  content: string;
  date: string;
  tags: string[];
  readTime: number;
}

export const posts: LocalPost[] = [
  {
    id: 1,
    title: 'React Hooks 深入理解',
    excerpt: '深入探讨 React Hooks 的原理和最佳实践，从 useState 到自定义 Hook 的完整指南。',
    content: `# React Hooks 深入理解

React Hooks 是 React 16.8 引入的新特性，它让我们可以在不编写 class 的情况下使用 state 和其他 React 特性。

## useState

最基础的 Hook，用于在函数组件中添加状态：

\`\`\`javascript
const [count, setCount] = useState(0);
\`\`\`

## useEffect

处理副作用的 Hook，相当于 componentDidMount、componentDidUpdate 和 componentWillUnmount 的组合：

\`\`\`javascript
useEffect(() => {
  document.title = \`You clicked \${count} times\`;
}, [count]);
\`\`\`

## 自定义 Hook

创建可复用的逻辑：

\`\`\`javascript
function useWindowSize() {
  const [size, setSize] = useState({
    width: window.innerWidth,
    height: window.innerHeight
  });

  useEffect(() => {
    const handleResize = () => {
      setSize({
        width: window.innerWidth,
        height: window.innerHeight
      });
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return size;
}
\`\`\`

Hooks 让组件逻辑更加清晰，代码更易复用。`,
    date: '2025-12-28',
    tags: ['React', 'JavaScript', 'Frontend'],
    readTime: 5
  },
  {
    id: 2,
    title: 'TypeScript 高级类型技巧',
    excerpt: '掌握 TypeScript 的高级类型系统，提升代码类型安全性和开发效率。',
    content: `# TypeScript 高级类型技巧

TypeScript 的类型系统非常强大，掌握高级类型可以让代码更加健壮。

## 联合类型和交叉类型

\`\`\`typescript
type StringOrNumber = string | number;
type Person = { name: string } & { age: number };
\`\`\`

## 泛型约束

\`\`\`typescript
function getProperty<T, K extends keyof T>(obj: T, key: K) {
  return obj[key];
}
\`\`\`

## 条件类型

\`\`\`typescript
type NonNullable<T> = T extends null | undefined ? never : T;
\`\`\`

## 映射类型

\`\`\`typescript
type Readonly<T> = {
  readonly [P in keyof T]: T[P];
};
\`\`\`

这些高级特性让 TypeScript 成为大型项目的最佳选择。`,
    date: '2025-12-25',
    tags: ['TypeScript', 'JavaScript', 'Programming'],
    readTime: 7
  },
  {
    id: 3,
    title: 'Vite 构建工具完全指南',
    excerpt: '探索 Vite 的核心特性和优化技巧，打造极速开发体验。',
    content: `# Vite 构建工具完全指南

Vite 是新一代前端构建工具，利用浏览器原生 ES 模块提供极快的开发服务器启动速度。

## 核心特性

- 极速的服务器启动
- 轻量快速的热重载（HMR）
- 真正的按需编译
- 优化的构建

## 基础配置

\`\`\`typescript
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000,
  },
  build: {
    outDir: 'dist',
  }
});
\`\`\`

## 性能优化

使用代码分割、预加载等技术进一步提升性能：

\`\`\`typescript
const Component = lazy(() => import('./Component'));
\`\`\`

Vite 让前端开发更加高效愉悦！`,
    date: '2025-12-20',
    tags: ['Vite', 'Build Tools', 'Frontend'],
    readTime: 6
  },
  {
    id: 4,
    title: 'CSS Grid 布局完整教程',
    excerpt: '从基础到进阶，全面掌握 CSS Grid 布局系统，创建复杂的网页布局。',
    content: `# CSS Grid 布局完整教程

CSS Grid 是最强大的 CSS 布局系统，可以轻松创建二维布局。

## 基础概念

Grid 容器和 Grid 项目：

\`\`\`css
.container {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 20px;
}
\`\`\`

## 区域命名

使用命名区域创建语义化布局：

\`\`\`css
.container {
  grid-template-areas:
    "header header header"
    "sidebar main main"
    "footer footer footer";
}
\`\`\`

## 响应式设计

结合 minmax 和 auto-fit 实现响应式：

\`\`\`css
grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
\`\`\`

Grid 让复杂布局变得简单直观。`,
    date: '2025-12-15',
    tags: ['CSS', 'Web Design', 'Frontend'],
    readTime: 8
  },
  {
    id: 5,
    title: 'Web 性能优化最佳实践',
    excerpt: '从加载速度到运行时性能，全方位提升 Web 应用的用户体验。',
    content: `# Web 性能优化最佳实践

性能是用户体验的核心，优秀的性能能显著提升用户满意度。

## 加载性能

- 代码分割和懒加载
- 图片优化（WebP、懒加载）
- 资源压缩和 CDN

\`\`\`javascript
// 代码分割
const Dashboard = lazy(() => import('./Dashboard'));
\`\`\`

## 运行时性能

- 虚拟滚动
- 防抖和节流
- Web Workers

\`\`\`javascript
// 防抖
const debounce = (fn, delay) => {
  let timer;
  return (...args) => {
    clearTimeout(timer);
    timer = setTimeout(() => fn(...args), delay);
  };
};
\`\`\`

## 监控和分析

使用 Lighthouse、Chrome DevTools 等工具持续监控性能指标。

性能优化是持续的过程，需要不断测量和改进。`,
    date: '2025-12-10',
    tags: ['Performance', 'Web Development', 'Optimization'],
    readTime: 10
  }
];
