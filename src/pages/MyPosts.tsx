import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { postsApi, categoriesApi } from '../services/api';
import Loading from '../components/Loading';
import ErrorMessage from '../components/ErrorMessage';
import type { Post, Category } from '../types';

export default function MyPosts() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<number | null>(null);

  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);

      const [postsData, categoriesData] = await Promise.all([
        postsApi.getPosts(),
        categoriesApi.getCategories(),
      ]);

      // 这里简化处理，实际应该从后端获取当前用户的文章
      // 由于后端接口没有提供"我的文章"专用接口，这里展示所有文章
      // 在实际应用中，应该添加用户筛选
      setPosts(postsData);
      setCategories(categoriesData);
    } catch (err) {
      setError('加载文章失败');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const getCategoryName = (categoryId: number | null) => {
    if (!categoryId) return '未分类';
    return categories.find((c) => c.id === categoryId)?.name || '未分类';
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('zh-CN', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
    });
  };

  const handleDelete = async (id: number) => {
    if (!confirm('确定要删除这篇文章吗？此操作无法撤销。')) {
      return;
    }

    try {
      setDeletingId(id);
      await postsApi.deletePost(id);
      setPosts(posts.filter((p) => p.id !== id));
    } catch (err) {
      alert('删除失败，请重试');
      console.error(err);
    } finally {
      setDeletingId(null);
    }
  };

  const handleTogglePublish = async (post: Post) => {
    try {
      await postsApi.updatePost(post.id, {
        is_published: !post.is_published,
      });

      // 更新本地状态
      setPosts(
        posts.map((p) =>
          p.id === post.id ? { ...p, is_published: !p.is_published } : p
        )
      );
    } catch (err) {
      alert('操作失败，请重试');
      console.error(err);
    }
  };

  if (loading) {
    return (
      <div className="max-w-5xl mx-auto px-6 py-8">
        <Loading />
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-5xl mx-auto px-6 py-8">
        <ErrorMessage message={error} onRetry={fetchData} />
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-6 py-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-accent mb-2">
            {'> '}我的文章
          </h1>
          <p className="text-text-secondary">
            管理你创建的所有文章
          </p>
        </div>

        <Link to="/create" className="btn bg-accent text-bg-primary border-accent hover:bg-accent-dim">
          + 新建文章
        </Link>
      </div>

      {posts.length === 0 ? (
        <div className="text-center py-16">
          <p className="text-text-secondary text-lg mb-4">
            还没有创建任何文章
          </p>
          <Link to="/create" className="btn bg-accent text-bg-primary border-accent">
            创建第一篇文章
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {posts.map((post) => (
            <article key={post.id} className="card">
              <div className="flex items-start justify-between gap-6">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <Link
                      to={`/post/${post.id}`}
                      className="text-xl font-bold text-text-primary hover:text-accent"
                    >
                      {post.title}
                    </Link>

                    <span
                      className={`px-2 py-1 text-xs border-retro ${
                        post.is_published
                          ? 'text-accent border-accent'
                          : 'text-text-secondary'
                      }`}
                    >
                      {post.is_published ? '已发布' : '草稿'}
                    </span>
                  </div>

                  {post.summary && (
                    <p className="text-text-secondary mb-3 leading-relaxed">
                      {post.summary}
                    </p>
                  )}

                  <div className="flex items-center gap-4 text-sm text-text-secondary">
                    <span>{getCategoryName(post.category_id)}</span>
                    <span>·</span>
                    <span>{formatDate(post.created_at)}</span>
                    <span>·</span>
                    <span>更新于 {formatDate(post.updated_at)}</span>
                  </div>
                </div>

                <div className="flex flex-col gap-2">
                  <Link
                    to={`/post/${post.id}`}
                    className="btn text-sm px-3 py-1"
                  >
                    查看
                  </Link>

                  <Link
                    to={`/edit/${post.id}`}
                    className="btn text-sm px-3 py-1"
                  >
                    编辑
                  </Link>

                  <button
                    onClick={() => handleTogglePublish(post)}
                    className="btn text-sm px-3 py-1"
                  >
                    {post.is_published ? '取消发布' : '发布'}
                  </button>

                  <button
                    onClick={() => handleDelete(post.id)}
                    disabled={deletingId === post.id}
                    className="btn text-sm px-3 py-1 border-red-500 text-red-400 hover:bg-red-950/30 disabled:opacity-50"
                  >
                    {deletingId === post.id ? '删除中...' : '删除'}
                  </button>
                </div>
              </div>
            </article>
          ))}
        </div>
      )}
    </div>
  );
}
