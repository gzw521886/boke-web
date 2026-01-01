import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import ReactMarkdown from 'react-markdown';
import Loading from '../components/Loading';
import ErrorMessage from '../components/ErrorMessage';
import { postsApi } from '../services/api';
import type { Post } from '../types';

export default function PostDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [post, setPost] = useState<Post | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchPost = async () => {
    if (!id) return;

    try {
      setLoading(true);
      setError(null);
      const data = await postsApi.getPost(parseInt(id));
      setPost(data);
    } catch (err) {
      setError('加载文章失败');
      console.error('Failed to fetch post:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPost();
  }, [id]);

  // 格式化日期
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('zh-CN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  // 计算阅读时间
  const calculateReadTime = (content: string) => {
    const wordsPerMinute = 300;
    const words = content.length;
    return Math.ceil(words / wordsPerMinute);
  };

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto px-6 py-8">
        <Loading />
      </div>
    );
  }

  if (error || !post) {
    return (
      <div className="max-w-4xl mx-auto px-6 py-8">
        <ErrorMessage message={error || '文章未找到'} onRetry={fetchPost} />
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-6 py-8">
      <button
        onClick={() => navigate(-1)}
        className="btn mb-8 inline-flex items-center gap-2"
      >
        ← 返回
      </button>

      <article className="card">
        <header className="mb-8 pb-6 border-b border-border">
          <h1 className="text-3xl font-bold mb-4 text-text-primary">
            {post.title}
          </h1>

          <div className="flex items-center gap-4 text-sm text-text-secondary">
            <span>{formatDate(post.created_at)}</span>
            <span>·</span>
            <span>{calculateReadTime(post.content)} 分钟阅读</span>
          </div>

          {post.summary && (
            <p className="mt-4 text-text-secondary italic">
              {post.summary}
            </p>
          )}
        </header>

        <div className="prose prose-invert max-w-none">
          <ReactMarkdown
            components={{
              h1: ({node, ...props}) => <h1 className="text-2xl font-bold mt-8 mb-4 text-accent" {...props} />,
              h2: ({node, ...props}) => <h2 className="text-xl font-bold mt-6 mb-3 text-text-primary" {...props} />,
              h3: ({node, ...props}) => <h3 className="text-lg font-bold mt-4 mb-2 text-text-primary" {...props} />,
              p: ({node, ...props}) => <p className="mb-4 text-text-secondary leading-relaxed" {...props} />,
              code: ({node, inline, ...props}) =>
                inline ?
                  <code className="px-2 py-1 bg-bg-tertiary text-accent border border-border rounded-sm" {...props} /> :
                  <code className="block p-4 bg-bg-tertiary text-text-primary border border-border overflow-x-auto my-4" {...props} />,
              ul: ({node, ...props}) => <ul className="list-disc list-inside mb-4 text-text-secondary" {...props} />,
              ol: ({node, ...props}) => <ol className="list-decimal list-inside mb-4 text-text-secondary" {...props} />,
              a: ({node, ...props}) => <a className="text-accent hover:text-accent-dim underline" {...props} />,
            }}
          >
            {post.content}
          </ReactMarkdown>
        </div>
      </article>
    </div>
  );
}
