import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function LoginPage() {
  const navigate = useNavigate();
  const { login, register } = useAuth();
  const [isLogin, setIsLogin] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    username: '',
    password: '',
    nickname: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      if (isLogin) {
        await login(formData.username, formData.password);
      } else {
        await register({
          username: formData.username,
          password: formData.password,
          nickname: formData.nickname || undefined,
        });
      }
      navigate('/');
    } catch (err: any) {
      setError(err.response?.data?.detail || '操作失败，请重试');
      console.error('Auth error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <div className="min-h-[calc(100vh-200px)] flex items-center justify-center px-6 py-12">
      <div className="w-full max-w-md">
        <h1 className="text-3xl font-bold mb-8 text-accent text-center">
          {'> '}{isLogin ? '登录' : '注册'}
        </h1>

        <form onSubmit={handleSubmit} className="card">
          {error && (
            <div className="mb-6 p-4 border border-red-500 bg-red-950/20 text-red-400 text-sm">
              {error}
            </div>
          )}

          <div className="mb-6">
            <label className="block text-text-primary mb-2">用户名</label>
            <input
              type="text"
              name="username"
              value={formData.username}
              onChange={handleChange}
              required
              className="w-full px-4 py-3 bg-bg-primary border-retro focus:border-accent outline-none text-text-primary"
              placeholder="请输入用户名"
            />
          </div>

          <div className="mb-6">
            <label className="block text-text-primary mb-2">密码</label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
              className="w-full px-4 py-3 bg-bg-primary border-retro focus:border-accent outline-none text-text-primary"
              placeholder="请输入密码"
            />
          </div>

          {!isLogin && (
            <div className="mb-6">
              <label className="block text-text-primary mb-2">昵称（可选）</label>
              <input
                type="text"
                name="nickname"
                value={formData.nickname}
                onChange={handleChange}
                className="w-full px-4 py-3 bg-bg-primary border-retro focus:border-accent outline-none text-text-primary"
                placeholder="请输入昵称"
              />
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full btn bg-accent text-bg-primary border-accent hover:bg-accent-dim disabled:opacity-50 disabled:cursor-not-allowed mb-4"
          >
            {loading ? '处理中...' : isLogin ? '登录' : '注册'}
          </button>

          <div className="text-center">
            <button
              type="button"
              onClick={() => {
                setIsLogin(!isLogin);
                setError(null);
              }}
              className="text-accent hover:text-accent-dim text-sm"
            >
              {isLogin ? '还没有账号？去注册' : '已有账号？去登录'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
