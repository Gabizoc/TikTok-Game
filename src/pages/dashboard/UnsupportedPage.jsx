export default function UnsupportedPage() {
    return (
      <div className="w-full h-full flex items-center justify-center text-center p-4 z-10">
        <div className="text-white">
          <h1 className="text-2xl font-bold mb-2">Unsupported on Mobile</h1>
          <p className="text-gray-400">Please access this page from a desktop device.</p>
        </div>
      </div>
    );
  }
  