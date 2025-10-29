function TestApp() {
  return (
    <div className="min-h-screen bg-red-500 flex items-center justify-center">
      <div className="bg-white p-8 rounded-lg shadow-xl">
        <h1 className="text-4xl font-bold text-purple-600 mb-4">
          🎉 React is Working!
        </h1>
        <p className="text-gray-700">
          If you can see this, React and Tailwind are both working correctly.
        </p>
        <div className="mt-4 p-4 bg-pink-100 rounded">
          <p className="text-pink-800">Custom colors are working too!</p>
        </div>
      </div>
    </div>
  );
}

export default TestApp;
