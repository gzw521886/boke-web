// 后端 API 返回的文章类型
export interface Post {
  id: number;
  title: string;
  content: string;
  summary: string | null;
  cover_image: string | null;
  is_published: boolean;
  category_id: number | null;
  created_at: string;
  updated_at: string;
}

// 创建文章的请求类型
export interface PostCreate {
  title: string;
  content: string;
  is_published?: boolean;
  summary?: string | null;
  cover_image?: string | null;
  category_id?: number | null;
}

// 更新文章的请求类型
export interface PostUpdate {
  title?: string | null;
  content?: string | null;
  is_published?: boolean | null;
  summary?: string | null;
  cover_image?: string | null;
  category_id?: number | null;
}

// 分类类型
export interface Category {
  id: number;
  name: string;
}

// 创建分类的请求类型
export interface CategoryCreate {
  name: string;
}

// 用户类型
export interface User {
  id?: number | null;
  username: string;
  nickname?: string | null;
  avatar?: string | null;
  hashed_password: string;
}

// 用户注册类型
export interface UserCreate {
  username: string;
  password: string;
  nickname?: string | null;
  avatar?: string | null;
}

// 登录响应类型
export interface LoginResponse {
  access_token: string;
  token_type: string;
}
