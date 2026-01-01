interface SearchBarProps {
  value: string;
  onChange: (value: string) => void;
}

export default function SearchBar({ value, onChange }: SearchBarProps) {
  return (
    <div className="mb-8">
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="搜索文章... (标题、内容、标签)"
        className="w-full px-4 py-3 bg-bg-secondary border-retro focus:border-accent outline-none text-text-primary placeholder-text-secondary"
      />
    </div>
  );
}
