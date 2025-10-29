import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { Sparkles, Hand, Droplet, Heart, Scissors, Palette, Star, Clock } from 'lucide-react';

const ServicesNew = () => {
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  const services = [
    {
      icon: Sparkles,
      title: 'Luxury Manicure',
      description: 'Premium nail care with gel polish, nail art, and hand massage',
      features: ['Gel Polish', 'Nail Art', 'Hand Massage'],
      color: 'from-purple-light to-pink',
      price: 'From $35',
    },
    {
      icon: Hand,
      title: 'Deluxe Pedicure',
      description: 'Rejuvenating foot treatment with exfoliation and massage',
      features: ['Foot Soak', 'Exfoliation', 'Massage'],
      color: 'from-purple-light to-pink',
      price: 'From $45',
    },
    {
      icon: Palette,
      title: 'Nail Art Design',
      description: 'Custom designs from elegant to bold, crafted by expert artists',
      features: ['Custom Designs', '3D Art', 'Ombre'],
      color: 'from-purple-light to-pink',
      price: 'From $15',
    },
    {
      icon: Droplet,
      title: 'Acrylic & Gel',
      description: 'Long-lasting extensions with natural look and strength',
      features: ['Extensions', 'Refills', 'Sculpting'],
      color: 'from-purple-light to-pink',
      price: 'From $50',
    },
    {
      icon: Scissors,
      title: 'Waxing Services',
      description: 'Professional hair removal for smooth, beautiful skin',
      features: ['Body Wax', 'Facial Wax', 'Gentle Care'],
      color: 'from-purple-light to-pink',
      price: 'From $20',
    },
    {
      icon: Heart,
      title: 'Spa Packages',
      description: 'Complete beauty experience with combined treatments',
      features: ['Full Service', 'Relaxation', 'VIP Treatment'],
      color: 'from-purple-light to-pink',
      price: 'From $80',
    },
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
      },
    },
  };

  return (
    <section className="py-24 bg-gradient-to-br from-gray-900 via-gray-800 to-black relative overflow-hidden">
      {/* Decorative background elements with subtle purple accent */}
      <div className="absolute top-20 left-10 w-72 h-72 bg-purple-900/20 rounded-full filter blur-3xl" />
      <div className="absolute bottom-20 right-10 w-96 h-96 bg-pink/10 rounded-full filter blur-3xl" />

      <div ref={ref} className="max-w-7xl mx-auto px-6 relative z-10">
        {/* Section header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full px-6 py-2 mb-6">
            <Star className="w-4 h-4 text-pink-light" />
            <span className="text-white font-semibold">Our Services</span>
          </div>
          <h2 className="text-5xl md:text-6xl font-bold text-white mb-4">
            Luxury Beauty Treatments
          </h2>
          <p className="text-xl text-white/90 max-w-3xl mx-auto">
            From classic elegance to bold statements, our expert team delivers perfection in every detail
          </p>
        </motion.div>

        {/* Services grid */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate={inView ? 'visible' : 'hidden'}
          className="grid md:grid-cols-2 lg:grid-cols-3 gap-8"
        >
          {services.map((service, index) => {
            const Icon = service.icon;
            return (
              <motion.div
                key={index}
                variants={itemVariants}
                whileHover={{ y: -10, scale: 1.02 }}
                className="group relative bg-white/5 backdrop-blur-sm rounded-3xl p-8 shadow-xl hover:shadow-2xl transition-all duration-300 border border-white/10 hover:border-white/20 overflow-hidden"
              >
                {/* Gradient background on hover */}
                <div className={`absolute inset-0 bg-gradient-to-br ${service.color} opacity-0 group-hover:opacity-20 transition-opacity duration-300`} />

                <div className="relative z-10">
                  {/* Icon */}
                  <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${service.color} flex items-center justify-center mb-6 transform group-hover:rotate-6 transition-transform duration-300 shadow-lg`}>
                    <Icon className="w-8 h-8 text-white" />
                  </div>

                  {/* Content */}
                  <h3 className="text-2xl font-bold text-white mb-3 transition-colors">
                    {service.title}
                  </h3>
                  <p className="text-white/90 mb-4 leading-relaxed">
                    {service.description}
                  </p>

                  {/* Features */}
                  <ul className="space-y-2 mb-6">
                    {service.features.map((feature, i) => (
                      <li key={i} className="flex items-center gap-2 text-sm text-white/80">
                        <div className="w-1.5 h-1.5 rounded-full bg-pink-light" />
                        {feature}
                      </li>
                    ))}
                  </ul>

                  {/* Price and CTA */}
                  <div className="flex items-center justify-between pt-4 border-t border-white/10">
                    <span className="text-xl font-bold text-pink-light">
                      {service.price}
                    </span>
                    <button className="text-pink-light font-semibold hover:text-pink transition-colors flex items-center gap-1 group">
                      Learn More
                      <motion.span
                        animate={{ x: [0, 4, 0] }}
                        transition={{ duration: 1.5, repeat: Infinity }}
                      >
                        →
                      </motion.span>
                    </button>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </motion.div>

        {/* Bottom CTA */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.6, duration: 0.8 }}
          className="text-center mt-16"
        >
          <p className="text-white/90 mb-6 flex items-center justify-center gap-2">
            <Clock className="w-5 h-5" />
            Walk-ins welcome • Appointments recommended
          </p>
          <button className="bg-gradient-to-r from-purple-light to-pink text-white font-bold px-10 py-4 rounded-full shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-105">
            View Full Service Menu
          </button>
        </motion.div>
      </div>
    </section>
  );
};

export default ServicesNew;
