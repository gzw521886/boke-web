import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Header() {
  const { user, isAuthenticated, logout } = useAuth();

  return (
    <header className="border-b border-border bg-bg-primary sticky top-0 z-50">
      <div className="max-w-4xl mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          <Link to="/" className="text-2xl font-bold text-accent hover:text-accent-dim">
            三三笔记
          </Link>

          <nav className="flex gap-6 items-center">
            <Link to="/" className="link-accent">
              首页
            </Link>
            <Link to="/categories" className="link-accent">
              分类
            </Link>

            {isAuthenticated ? (
              <>
                <Link to="/create" className="link-accent">
                  写笔记
                </Link>
                <Link to="/my-posts" className="link-accent">
                  我的笔记
                </Link>
                <span className="text-text-secondary">
                  {user?.nickname || user?.username}
                </span>
                <button onClick={logout} className="link-accent">
                  退出
                </button>
              </>
            ) : (
              <Link to="/login" className="link-accent">
                登录
              </Link>
            )}
          </nav>
        </div>
      </div>
    </header>
  );
}
