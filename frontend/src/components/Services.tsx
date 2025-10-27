import { Scissors, Sparkles, Hand, Heart } from 'lucide-react';

const Services = () => {
  const services = [
    {
      icon: Scissors,
      title: 'Hair Styling',
      description: 'Expert cuts, colors, and treatments for all hair types',
      color: 'from-purple to-purple-dark',
    },
    {
      icon: Sparkles,
      title: 'Manicure & Pedicure',
      description: 'Luxurious nail care with premium products',
      color: 'from-pink to-pink-dark',
    },
    {
      icon: Hand,
      title: 'Waxing',
      description: 'Professional hair removal services',
      color: 'from-purple-light to-purple',
    },
    {
      icon: Heart,
      title: 'Facials',
      description: 'Rejuvenating treatments for glowing skin',
      color: 'from-pink-dark to-pink',
    },
  ];

  return (
    <section className="py-20 bg-gradient-to-b from-white to-pink-light/30">
      <div className="max-w-7xl mx-auto px-6">
        <h2 className="text-4xl md:text-5xl font-bold text-center text-purple mb-16">
          Our Services
        </h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {services.map((service, index) => {
            const Icon = service.icon;
            return (
              <div
                key={index}
                className="bg-white rounded-2xl p-8 shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 border-2 border-pink/20"
              >
                <div className={`w-16 h-16 rounded-full bg-gradient-to-br ${service.color} flex items-center justify-center mb-6 mx-auto`}>
                  <Icon className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-bold text-purple mb-3 text-center">
                  {service.title}
                </h3>
                <p className="text-gray-600 text-center">
                  {service.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default Services;
