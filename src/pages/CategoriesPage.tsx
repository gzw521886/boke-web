import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import PostCard from '../components/PostCard';
import Loading from '../components/Loading';
import ErrorMessage from '../components/ErrorMessage';
import { postsApi, categoriesApi } from '../services/api';
import type { Post, Category } from '../types';

export default function CategoriesPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const selectedCategoryId = searchParams.get('category');

  const [posts, setPosts] = useState<Post[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);

      // 并行获取分类和文章
      const [categoriesData, postsData] = await Promise.all([
        categoriesApi.getCategories(),
        postsApi.getPosts({
          category_id: selectedCategoryId ? parseInt(selectedCategoryId) : undefined
        })
      ]);

      setCategories(categoriesData);
      setPosts(postsData.filter(post => post.is_published));
    } catch (err) {
      setError('加载数据失败，请稍后重试');
      console.error('Failed to fetch data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [selectedCategoryId]);

  // 获取分类名称
  const getCategoryName = (categoryId: number | null) => {
    if (!categoryId) return undefined;
    return categories.find(c => c.id === categoryId)?.name;
  };

  // 处理分类选择
  const handleCategoryClick = (categoryId: number | null) => {
    if (categoryId === null) {
      setSearchParams({});
    } else {
      setSearchParams({ category: categoryId.toString() });
    }
  };

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
        <ErrorMessage message={error} onRetry={fetchData} />
      </div>
    );
  }

  const selectedCategory = categories.find(
    c => c.id === (selectedCategoryId ? parseInt(selectedCategoryId) : null)
  );

  return (
    <div className="max-w-4xl mx-auto px-6 py-8">
      <h1 className="text-4xl font-bold mb-8 text-accent">
        {'> '}分类浏览
      </h1>

      <div className="mb-12">
        <div className="flex flex-wrap gap-3">
          <button
            onClick={() => handleCategoryClick(null)}
            className={`px-4 py-2 border-retro ${
              !selectedCategoryId
                ? 'bg-accent text-bg-primary border-accent'
                : 'hover:bg-bg-tertiary hover:border-accent text-text-primary'
            }`}
          >
            全部 ({posts.length})
          </button>

          {categories.map(category => {
            const count = posts.filter(p => p.category_id === category.id).length;
            return (
              <button
                key={category.id}
                onClick={() => handleCategoryClick(category.id)}
                className={`px-4 py-2 border-retro ${
                  selectedCategoryId === category.id.toString()
                    ? 'bg-accent text-bg-primary border-accent'
                    : 'hover:bg-bg-tertiary hover:border-accent text-text-primary'
                }`}
              >
                {category.name} ({count})
              </button>
            );
          })}
        </div>
      </div>

      <div>
        <h2 className="text-xl font-bold mb-6 text-text-primary">
          {selectedCategory ? `"${selectedCategory.name}" 分类文章` : '所有文章'}
          <span className="text-text-secondary ml-2">
            ({posts.length})
          </span>
        </h2>

        {posts.length > 0 ? (
          posts.map(post => (
            <PostCard
              key={post.id}
              post={post}
              categoryName={getCategoryName(post.category_id)}
            />
          ))
        ) : (
          <div className="text-center py-16 text-text-secondary">
            <p className="text-xl">该分类暂无文章</p>
          </div>
        )}
      </div>
    </div>
  );
}
