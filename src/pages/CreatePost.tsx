import { useState, useEffect, useMemo } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import SimpleMDE from 'react-simplemde-editor';
import 'easymde/dist/easymde.min.css';
import { postsApi, categoriesApi, uploadApi } from '../services/api';
import Loading from '../components/Loading';
import ErrorMessage from '../components/ErrorMessage';
import type { Category, PostCreate } from '../types';

export default function CreatePost() {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const isEditMode = !!id;

  const [formData, setFormData] = useState<PostCreate>({
    title: '',
    content: '',
    summary: '',
    cover_image: '',
    category_id: null,
    is_published: false,
  });

  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(false);
  const [fetchLoading, setFetchLoading] = useState(isEditMode);
  const [error, setError] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);

  // 获取分类列表
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const data = await categoriesApi.getCategories();
        setCategories(data);
      } catch (err) {
        console.error('Failed to fetch categories:', err);
      }
    };
    fetchCategories();
  }, []);

  // 编辑模式：获取文章数据
  useEffect(() => {
    if (isEditMode && id) {
      const fetchPost = async () => {
        try {
          setFetchLoading(true);
          const post = await postsApi.getPost(parseInt(id));
          setFormData({
            title: post.title,
            content: post.content,
            summary: post.summary || '',
            cover_image: post.cover_image || '',
            category_id: post.category_id,
            is_published: post.is_published,
          });
        } catch (err) {
          setError('加载文章失败');
          console.error(err);
        } finally {
          setFetchLoading(false);
        }
      };
      fetchPost();
    }
  }, [isEditMode, id]);

  // SimpleMDE 配置
  const editorOptions = useMemo(() => {
    return {
      spellChecker: false,
      placeholder: '开始写作...\n\n支持 Markdown 语法',
      status: ['lines', 'words', 'cursor'],
      toolbar: [
        'bold',
        'italic',
        'heading',
        '|',
        'quote',
        'unordered-list',
        'ordered-list',
        '|',
        'link',
        {
          name: 'image',
          action: async (editor: any) => {
            const input = document.createElement('input');
            input.type = 'file';
            input.accept = 'image/*';
            input.onchange = async (e: any) => {
              const file = e.target.files?.[0];
              if (file) {
                await handleImageUpload(file, editor);
              }
            };
            input.click();
          },
          className: 'fa fa-picture-o',
          title: '上传图片',
        },
        'code',
        'table',
        '|',
        'preview',
        'side-by-side',
        'fullscreen',
        '|',
        'guide',
      ],
    };
  }, []);

  // 图片上传处理
  const handleImageUpload = async (file: File, editor: any) => {
    try {
      setUploading(true);
      const response = await uploadApi.uploadFile(file);
      const imageUrl = response.url || response.file_url || '';

      // 插入图片到编辑器
      const cm = editor.codemirror;
      const output = `![${file.name}](${imageUrl})`;
      cm.replaceSelection(output);
    } catch (err) {
      alert('图片上传失败，请重试');
      console.error(err);
    } finally {
      setUploading(false);
    }
  };

  // 封面图片上传
  const handleCoverUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setUploading(true);
      const response = await uploadApi.uploadFile(file);
      const imageUrl = response.url || response.file_url || '';
      setFormData({ ...formData, cover_image: imageUrl });
    } catch (err) {
      alert('封面上传失败，请重试');
      console.error(err);
    } finally {
      setUploading(false);
    }
  };

  // 提交表单
  const handleSubmit = async (publish: boolean) => {
    if (!formData.title.trim() || !formData.content.trim()) {
      setError('标题和内容不能为空');
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const postData: PostCreate = {
        ...formData,
        is_published: publish,
      };

      if (isEditMode && id) {
        await postsApi.updatePost(parseInt(id), postData);
      } else {
        await postsApi.createPost(postData);
      }

      navigate('/my-posts');
    } catch (err: any) {
      setError(err.response?.data?.detail || '保存失败，请重试');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (fetchLoading) {
    return (
      <div className="max-w-5xl mx-auto px-6 py-8">
        <Loading />
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-6 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-accent mb-2">
          {'> '}{isEditMode ? '编辑文章' : '创建文章'}
        </h1>
        <p className="text-text-secondary">
          {'// '}使用 Markdown 语法编写你的文章
        </p>
      </div>

      {error && (
        <div className="mb-6">
          <ErrorMessage message={error} />
        </div>
      )}

      <div className="space-y-6">
        {/* 标题 */}
        <div>
          <label className="block text-text-primary mb-2 font-medium">
            标题 <span className="text-accent">*</span>
          </label>
          <input
            type="text"
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            placeholder="请输入文章标题"
            className="w-full px-4 py-3 bg-bg-secondary border-retro focus:border-accent outline-none text-text-primary text-lg"
          />
        </div>

        {/* 摘要 */}
        <div>
          <label className="block text-text-primary mb-2 font-medium">
            摘要
          </label>
          <textarea
            value={formData.summary || ''}
            onChange={(e) => setFormData({ ...formData, summary: e.target.value })}
            placeholder="请输入文章摘要（可选）"
            rows={3}
            className="w-full px-4 py-3 bg-bg-secondary border-retro focus:border-accent outline-none text-text-primary resize-none"
          />
        </div>

        {/* 分类 */}
        <div>
          <label className="block text-text-primary mb-2 font-medium">
            分类
          </label>
          <select
            value={formData.category_id || ''}
            onChange={(e) =>
              setFormData({
                ...formData,
                category_id: e.target.value ? parseInt(e.target.value) : null,
              })
            }
            className="w-full px-4 py-3 bg-bg-secondary border-retro focus:border-accent outline-none text-text-primary"
          >
            <option value="">请选择分类</option>
            {categories.map((cat) => (
              <option key={cat.id} value={cat.id}>
                {cat.name}
              </option>
            ))}
          </select>
        </div>

        {/* 封面图片 */}
        <div>
          <label className="block text-text-primary mb-2 font-medium">
            封面图片
          </label>
          {formData.cover_image && (
            <div className="mb-3">
              <img
                src={formData.cover_image}
                alt="封面预览"
                className="max-w-sm border-retro"
              />
            </div>
          )}
          <input
            type="file"
            accept="image/*"
            onChange={handleCoverUpload}
            disabled={uploading}
            className="text-text-secondary"
          />
          {uploading && <p className="text-accent mt-2">上传中...</p>}
        </div>

        {/* Markdown 编辑器 */}
        <div>
          <label className="block text-text-primary mb-2 font-medium">
            内容 <span className="text-accent">*</span>
          </label>
          <div className="markdown-editor">
            <SimpleMDE
              value={formData.content}
              onChange={(value) => setFormData({ ...formData, content: value })}
              options={editorOptions}
            />
          </div>
        </div>

        {/* 操作按钮 */}
        <div className="flex gap-4 pt-4">
          <button
            onClick={() => handleSubmit(false)}
            disabled={loading}
            className="btn disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? '保存中...' : '保存草稿'}
          </button>

          <button
            onClick={() => handleSubmit(true)}
            disabled={loading}
            className="btn bg-accent text-bg-primary border-accent hover:bg-accent-dim disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? '发布中...' : '发布文章'}
          </button>

          <button
            onClick={() => navigate(-1)}
            disabled={loading}
            className="btn disabled:opacity-50 disabled:cursor-not-allowed"
          >
            取消
          </button>
        </div>
      </div>
    </div>
  );
}
