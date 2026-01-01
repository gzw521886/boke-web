# 个人博客项目

一个采用黑色主题、简约复古风格的个人博客，使用现代化前端技术栈构建，集成 FastAPI 后端。

## 技术栈

### 前端
- **React 18** - 用户界面库
- **TypeScript** - 类型安全
- **Vite** - 极速构建工具
- **React Router** - 路由管理
- **Tailwind CSS** - 样式框架
- **Axios** - HTTP 客户端
- **React Markdown** - Markdown 渲染
- **SimpleMDE** - Markdown 编辑器
- **Highlight.js** - 代码语法高亮

### 后端
- **FastAPI** - Python 高性能 Web 框架
- 后端 API 地址：http://127.0.0.1:8000

## 设计特点

- 黑色主题配色方案（#0a0a0a 背景）
- 极简线条边框设计
- 复古等宽字体
- 绿色强调色（#00ff88）
- 流畅的过渡动画
- 响应式布局

## 功能特性

### 基础功能
- 文章列表展示（支持分页）
- 文章详情页（Markdown 渲染）
- 分类系统（可按分类筛选）
- 实时搜索功能
- 用户认证（登录/注册）

### 内容创作功能（需登录）
- **Markdown 编辑器**
  - 实时预览（支持并排/全屏模式）
  - 富文本工具栏（加粗、斜体、标题、列表等）
  - 图片上传功能
  - 代码块支持
  - 字数和行数统计
- **文章管理**
  - 创建新文章
  - 编辑已有文章
  - 删除文章
  - 草稿/发布状态切换
  - 文章列表管理
- **文章字段**
  - 标题（必填）
  - Markdown 内容（必填）
  - 摘要（可选）
  - 封面图片（可选，支持上传）
  - 分类选择（可选）

### 高级功能
- 完整的 CRUD API 集成
- JWT Token 认证和路由保护
- 加载状态和错误处理
- 文章阅读时间计算
- 日期格式化
- 图片上传到后端服务

## 快速开始

### 前置条件

确保后端服务已启动在 http://127.0.0.1:8000

### 安装依赖

```bash
npm install
```

### 开发模式

```bash
npm run dev
```

前端服务会启动在 http://localhost:5173（如果端口被占用会自动选择其他端口）

前端会通过 Vite 代理自动转发 `/api` 请求到后端

### 构建生产版本

```bash
npm run build
```

### 预览生产版本

```bash
npm run preview
```

## 项目结构

```
boke-hd/
├── src/
│   ├── components/          # 可复用组件
│   │   ├── Header.tsx       # 顶部导航（含用户信息）
│   │   ├── Footer.tsx       # 底部信息
│   │   ├── PostCard.tsx     # 文章卡片
│   │   ├── SearchBar.tsx    # 搜索框
│   │   ├── Loading.tsx      # 加载状态
│   │   └── ErrorMessage.tsx # 错误提示
│   ├── pages/               # 页面组件
│   │   ├── Home.tsx         # 首页（文章列表）
│   │   ├── PostDetail.tsx   # 文章详情
│   │   ├── CategoriesPage.tsx  # 分类页面
│   │   └── LoginPage.tsx    # 登录/注册页
│   ├── services/            # API 服务
│   │   └── api.ts           # Axios 配置和 API 调用
│   ├── context/             # React Context
│   │   └── AuthContext.tsx  # 认证上下文
│   ├── types/               # TypeScript 类型
│   │   └── index.ts         # 类型定义
│   ├── App.tsx              # 主应用
│   ├── main.tsx             # 入口文件
│   └── index.css            # 全局样式
├── public/                  # 静态资源
├── index.html
├── package.json
├── tailwind.config.js       # Tailwind 配置（黑色主题）
├── tsconfig.json            # TypeScript 配置
└── vite.config.ts           # Vite 配置（含代理）
```

## API 接口

后端提供以下接口（详见 http://127.0.0.1:8000/docs）：

### 文章接口
- `GET /posts/` - 获取文章列表
- `GET /posts/{id}` - 获取文章详情
- `POST /posts/` - 创建文章（需认证）
- `PUT /posts/{id}` - 更新文章（需认证）
- `DELETE /posts/{id}` - 删除文章（需认证）

### 分类接口
- `GET /category/categories/` - 获取所有分类
- `POST /category/categories/` - 创建分类（需认证）

### 认证接口
- `POST /auth/register` - 用户注册
- `POST /auth/token` - 用户登录
- `GET /auth/users` - 获取用户列表

### 文件上传
- `POST /upload` - 上传文件

## 自定义

### 修改主题颜色

编辑 `tailwind.config.js` 中的颜色配置：

```js
colors: {
  'bg-primary': '#0a0a0a',      // 主背景色
  'bg-secondary': '#1a1a1a',    // 次背景色
  'bg-tertiary': '#2a2a2a',     // 第三背景色
  'text-primary': '#e0e0e0',    // 主文字色
  'text-secondary': '#a0a0a0',  // 次文字色
  'accent': '#00ff88',          // 强调色（绿色）
  'accent-dim': '#00cc6a',      // 强调色变体
  'border': '#333333',          // 边框色
}
```

### 修改后端 API 地址

编辑 `vite.config.ts`：

```ts
server: {
  proxy: {
    '/api': {
      target: 'http://your-backend-url:8000',  // 修改这里
      changeOrigin: true,
      rewrite: (path) => path.replace(/^\/api/, '')
    }
  }
}
```

## 部署

项目可以部署到任何静态网站托管服务：

- Vercel
- Netlify
- GitHub Pages
- Cloudflare Pages

构建后的文件在 `dist` 目录中。

## License

MIT
