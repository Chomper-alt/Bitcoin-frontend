export default function AuthWrapper({ children }) {
  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center">
      <div className="bg-white shadow-md rounded px-8 pt-6 pb-8 w-full max-w-md">
        {children}
      </div>
    </div>
  );
}
