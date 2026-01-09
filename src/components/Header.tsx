import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useRef } from 'react';

export default function Header() {
  const { user, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate()

  const clickCount = useRef(0);
  const timer = useRef<number | null>(null);

  const handleSecretClick = (e: React.MouseEvent) => {
    e.preventDefault();

    if (timer.current){
      clearTimeout(timer.current);
    }
    clickCount.current += 1;
    if(clickCount.current >=3){
      clickCount.current = 0;
      navigate('/login');
    }else{
      timer.current = window.setTimeout(() => {
        clickCount.current = 0;
      },500)
    }

  }
  return (
    <header className="border-b border-border bg-bg-primary sticky top-0 z-50">
      <div className="max-w-4xl mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          <div>
            <span 
            onClick={handleSecretClick}
            className='text-2xl font-bold text-accent hover:text-accent-dim cursor-pointer'>三</span>
            <Link to="/" className="text-2xl font-bold text-accent hover:text-accent-dim">
              三笔记
            </Link>
          </div>

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
              <span></span>
              // <Link to="/login" className="link-accent">
              //   登录
              // </Link>
            )}
          </nav>
        </div>
      </div>
    </header>
  );
}
