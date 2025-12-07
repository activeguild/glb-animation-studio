'use client';

export function Header() {
  return (
    <header className="bg-white border-b border-gray-200 px-6 py-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <h1 className="text-2xl font-bold text-gray-900">
            GLB Animation Studio
          </h1>
          <span className="text-sm text-gray-500 bg-gray-100 px-2 py-1 rounded">
            Beta
          </span>
        </div>
      </div>
    </header>
  );
}
