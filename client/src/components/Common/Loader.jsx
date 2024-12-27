function Loader() {
   return (
      <div className="flex flex-col items-center justify-center min-h-screen">
         <div className="w-10 h-10 border-4 border-yellow-500 border-t-transparent rounded-full animate-spin"></div>
         <p className="mt-4 text-gray-600">Loading Contest data...</p>
      </div>
   );
}

export default Loader;
