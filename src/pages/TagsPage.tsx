import { useMemo } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import PostCard from '../components/PostCard';
import { posts } from '../data/posts';
import { Tag } from '../types';

export default function TagsPage() {
  const [searchParams] = useSearchParams();
  const selectedTag = searchParams.get('tag');

  const tags: Tag[] = useMemo(() => {
    const tagCounts = new Map<string, number>();

    posts.forEach(post => {
      post.tags.forEach(tag => {
        tagCounts.set(tag, (tagCounts.get(tag) || 0) + 1);
      });
    });

    return Array.from(tagCounts.entries())
      .map(([name, count]) => ({ name, count }))
      .sort((a, b) => b.count - a.count);
  }, []);

  const filteredPosts = useMemo(() => {
    if (!selectedTag) {
      return posts;
    }
    return posts.filter(post => post.tags.includes(selectedTag));
  }, [selectedTag]);

  return (
    <div className="max-w-4xl mx-auto px-6 py-8">
      <h1 className="text-4xl font-bold mb-8 text-accent">
        {'> '}标签分类
      </h1>

      <div className="mb-12">
        <div className="flex flex-wrap gap-3">
          <Link
            to="/tags"
            className={`px-4 py-2 border-retro ${
              !selectedTag
                ? 'bg-accent text-bg-primary border-accent'
                : 'hover:bg-bg-tertiary hover:border-accent text-text-primary'
            }`}
          >
            全部 ({posts.length})
          </Link>

          {tags.map(tag => (
            <Link
              key={tag.name}
              to={`/tags?tag=${tag.name}`}
              className={`px-4 py-2 border-retro ${
                selectedTag === tag.name
                  ? 'bg-accent text-bg-primary border-accent'
                  : 'hover:bg-bg-tertiary hover:border-accent text-text-primary'
              }`}
            >
              #{tag.name} ({tag.count})
            </Link>
          ))}
        </div>
      </div>

      <div>
        <h2 className="text-xl font-bold mb-6 text-text-primary">
          {selectedTag ? `"${selectedTag}" 相关文章` : '所有文章'}
          <span className="text-text-secondary ml-2">
            ({filteredPosts.length})
          </span>
        </h2>

        {filteredPosts.map(post => (
          <PostCard key={post.id} post={post} />
        ))}
      </div>
    </div>
  );
}
