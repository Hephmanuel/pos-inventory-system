export default function AuthLoading() {
    
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="relative">
        {/* The outer ring / Gradient Spinner */}
        <div className="w-24 h-24 rounded-full border-8 border-gray-200 border-t-blue-600 animate-spin"></div>
        
        {/* Optional: Add a logo or icon in the center if your design needs it */}
        <div className="absolute inset-0 flex items-center justify-center">
           <div className="w-4 h-4 bg-blue-600 rounded-full animate-pulse"></div>
        </div>
      </div>
    </div>
  );
}