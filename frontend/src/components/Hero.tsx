const Hero = () => {
  return (
    <section className="relative h-screen min-h-[600px] flex items-center justify-center overflow-hidden">
      {/* Background Image */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: 'url(/images/background.jpg)' }}
      ></div>
      {/* Overlay for better text readability */}
      <div className="absolute inset-0 bg-gradient-to-br from-purple/60 via-purple-dark/50 to-pink/40"></div>

      <div className="relative z-10 text-center px-6 max-w-4xl mx-auto">
        <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 drop-shadow-2xl animate-fade-in">
          Welcome to Y&Y Beauty Salon
        </h1>
        <p className="text-xl md:text-2xl text-pink-light mb-8 drop-shadow-lg">
          Experience luxury beauty services in a relaxing environment
        </p>
        <button className="bg-pink hover:bg-purple text-purple hover:text-white font-bold py-4 px-10 rounded-full text-lg transition-all duration-300 transform hover:scale-105 shadow-2xl">
          Book Your Appointment
        </button>
      </div>
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-white to-transparent"></div>
    </section>
  );
};

export default Hero;
