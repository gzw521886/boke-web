import { useState, useEffect, useMemo } from 'react';
import PostCard from '../components/PostCard';
import SearchBar from '../components/SearchBar';
import Loading from '../components/Loading';
import ErrorMessage from '../components/ErrorMessage';
import { postsApi } from '../services/api';
import type { Post } from '../types';

export default function Home() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  const fetchPosts = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await postsApi.getPosts();
      // 只显示已发布的文章
      setPosts(data.filter(post => post.is_published));
    } catch (err) {
      setError('加载文章失败，请稍后重试');
      console.error('Failed to fetch posts:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  const filteredPosts = useMemo(() => {
    if (!searchQuery.trim()) {
      return posts;
    }

    const query = searchQuery.toLowerCase();
    return posts.filter(post =>
      post.title.toLowerCase().includes(query) ||
      post.content.toLowerCase().includes(query) ||
      post.summary?.toLowerCase().includes(query)
    );
  }, [posts, searchQuery]);

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto px-6 py-8">
        <Loading />
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-4xl mx-auto px-6 py-8">
        <ErrorMessage message={error} onRetry={fetchPosts} />
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-6 py-8">
      

      <SearchBar value={searchQuery} onChange={setSearchQuery} />

      {filteredPosts.length > 0 ? (
        <div>
          {filteredPosts.map(post => (
            <PostCard key={post.id} post={post} />
          ))}
        </div>
      ) : (
        <div className="text-center py-16 text-text-secondary">
          <p className="text-xl">未找到匹配的文章</p>
          <p className="mt-2">试试其他关键词吧</p>
        </div>
      )}
    </div>
  );
}
