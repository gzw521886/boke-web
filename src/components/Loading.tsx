export default function Loading() {
  return (
    <div className="flex items-center justify-center py-16">
      <div className="text-center">
        <div className="inline-block w-12 h-12 border-2 border-border border-t-accent rounded-full animate-spin mb-4"></div>
        <p className="text-text-secondary">加载中...</p>
      </div>
    </div>
  );
}
