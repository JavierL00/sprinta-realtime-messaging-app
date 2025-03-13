export default function Loading() {
	return (
	 <div className="flex items-center justify-center h-full w-full">
		 <div className="relative w-16 h-16">
			 <div className="absolute inset-0 border-4 border-purple-500 rounded-full animate-spin"></div>
			 <div className="absolute inset-0 border-4 border-purple-300 rounded-full opacity-50"></div>
		 </div>
	 </div>
	);
}
