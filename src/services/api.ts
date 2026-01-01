import axios from 'axios';
import type {
  Post,
  PostCreate,
  PostUpdate,
  Category,
  CategoryCreate,
  User,
  UserCreate,
  LoginResponse
} from '../types';

// 创建 axios 实例
const api = axios.create({
  baseURL: '/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

// 请求拦截器 - 添加 token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('access_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// 响应拦截器 - 处理错误
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Token 过期，清除本地存储
      localStorage.removeItem('access_token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// ==================== 文章 API ====================

export const postsApi = {
  // 获取文章列表
  getPosts: async (params?: { category_id?: number; offset?: number; limit?: number }) => {
    const response = await api.get<Post[]>('/posts/', { params });
    return response.data;
  },

  // 获取单篇文章
  getPost: async (id: number) => {
    const response = await api.get<Post>(`/posts/${id}`);
    return response.data;
  },

  // 创建文章（需要认证）
  createPost: async (data: PostCreate) => {
    const response = await api.post<Post>('/posts/', data);
    return response.data;
  },

  // 更新文章（需要认证）
  updatePost: async (id: number, data: PostUpdate) => {
    const response = await api.put<Post>(`/posts/${id}`, data);
    return response.data;
  },

  // 删除文章（需要认证）
  deletePost: async (id: number) => {
    const response = await api.delete(`/posts/${id}`);
    return response.data;
  },
};

// ==================== 分类 API ====================

export const categoriesApi = {
  // 获取所有分类
  getCategories: async () => {
    const response = await api.get<Category[]>('/category/categories/');
    return response.data;
  },

  // 创建分类（需要认证）
  createCategory: async (data: CategoryCreate) => {
    const response = await api.post<Category>('/category/categories/', data);
    return response.data;
  },
};

// ==================== 认证 API ====================

export const authApi = {
  // 用户注册
  register: async (data: UserCreate) => {
    const response = await api.post<User>('/auth/register', data);
    return response.data;
  },

  // 用户登录
  login: async (username: string, password: string) => {
    const formData = new FormData();
    formData.append('username', username);
    formData.append('password', password);

    const response = await api.post<LoginResponse>('/auth/token', formData, {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
    });
    return response.data;
  },

  // 获取用户列表
  getUsers: async () => {
    const response = await api.get<User[]>('/auth/users');
    return response.data;
  },
};

// ==================== 文件上传 API ====================

export const uploadApi = {
  // 上传文件
  uploadFile: async (file: File) => {
    const formData = new FormData();
    formData.append('file', file);

    const response = await api.post('/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },
};

export default api;
