export default function LoadingSpinner({ size = 'medium', color = 'blue' }) {
  const sizeClass = 
    size === 'small' ? 'h-4 w-4' : 
    size === 'large' ? 'h-12 w-12' : 'h-8 w-8';
    
  const colorClass = 
    color === 'white' ? 'text-white' : 'text-blue-600';
    
  return (
    <div className={`animate-spin rounded-full border-2 border-t-transparent ${sizeClass} ${colorClass} border-current`}>
      <span className="sr-only">Loading...</span>
    </div>
  );
}