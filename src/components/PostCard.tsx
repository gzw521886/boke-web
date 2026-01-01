import { Link } from 'react-router-dom';
import { Post } from '../types';

interface PostCardProps {
  post: Post;
  categoryName?: string;
}

export default function PostCard({ post, categoryName }: PostCardProps) {
  // 格式化日期
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('zh-CN', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit'
    });
  };

  // 计算阅读时间（假设每分钟300字）
  const calculateReadTime = (content: string) => {
    const wordsPerMinute = 300;
    const words = content.length;
    return Math.ceil(words / wordsPerMinute);
  };

  return (
    <article className="card hover:border-accent mb-6">
      <Link to={`/post/${post.id}`}>
        <h2 className="text-xl font-bold text-text-primary mb-3 hover:text-accent">
          {post.title}
        </h2>
      </Link>

      {post.summary && (
        <p className="text-text-secondary mb-4 leading-relaxed">
          {post.summary}
        </p>
      )}

      <div className="flex items-center justify-between text-sm">
        <div className="flex gap-2">
          {categoryName && (
            <Link
              to={`/categories?category=${post.category_id}`}
              className="px-2 py-1 border-retro text-accent hover:bg-bg-tertiary"
            >
              #{categoryName}
            </Link>
          )}
        </div>

        <div className="flex gap-4 text-text-secondary">
          <span>{formatDate(post.created_at)}</span>
          <span>{calculateReadTime(post.content)} min</span>
        </div>
      </div>
    </article>
  );
}
