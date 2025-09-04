function SplashScreen() {
  return (
    <div className="relative w-screen h-screen overflow-hidden flex items-center justify-center bg-blue-900">
      {/* Background */}
      <img
        src="/HomePage.jpg"
        alt="Background"
        className="absolute inset-0 w-full h-full object-cover"
      />
      {/* Gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-blue-900/95 via-blue-900/50 to-transparent"></div>

      {/* Content */}
      <div className="relative z-10 text-center">
      
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white">
          Volt<span className="text-blue-400">Brew</span>
        </h1>
        <p className="text-sm sm:text-base md:text-lg text-gray-200 mt-2 tracking-wide">
          SMART ELECTRIC COMPANY
        </p>
      </div>
    </div>
  );
}

export default SplashScreen;
