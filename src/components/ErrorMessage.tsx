interface ErrorMessageProps {
  message: string;
  onRetry?: () => void;
}

export default function ErrorMessage({ message, onRetry }: ErrorMessageProps) {
  return (
    <div className="card border-red-500 bg-red-950/20 text-center py-12">
      <p className="text-red-400 mb-4 text-lg">⚠ {message}</p>
      {onRetry && (
        <button onClick={onRetry} className="btn border-red-500 hover:bg-red-950/30">
          重试
        </button>
      )}
    </div>
  );
}
