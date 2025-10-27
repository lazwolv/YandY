import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { Award, Shield, Heart, Sparkles } from 'lucide-react';

const WhyChooseUs = () => {
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  const reasons = [
    {
      icon: Award,
      title: 'Expert Technicians',
      description: 'Our certified nail artists have years of experience and training in the latest techniques and trends.',
      stats: '10+ Years Experience',
    },
    {
      icon: Sparkles,
      title: 'Premium Products',
      description: 'We use only the highest quality, professional-grade products that are safe and long-lasting.',
      stats: '100% Quality Guarantee',
    },
    {
      icon: Shield,
      title: 'Hygiene First',
      description: 'Hospital-grade sterilization and sanitation protocols ensure your safety and peace of mind.',
      stats: 'Medical-Grade Safety',
    },
    {
      icon: Heart,
      title: 'Luxury Experience',
      description: 'Relax in our elegant salon with complimentary refreshments and personalized attention.',
      stats: '500+ 5-Star Reviews',
    },
  ];

  return (
    <section className="py-24 bg-gradient-to-br from-gray-900 via-gray-800 to-black relative overflow-hidden">
      {/* Animated background patterns with subtle purple accent */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_50%_50%,_rgba(168,85,247,0.2),transparent_50%)]" />
        <div className="absolute top-1/4 right-0 w-96 h-96 bg-purple-900/30 rounded-full filter blur-3xl" />
        <div className="absolute bottom-1/4 left-0 w-96 h-96 bg-pink/20 rounded-full filter blur-3xl" />
      </div>

      <div ref={ref} className="max-w-7xl mx-auto px-6 relative z-10">
        {/* Section header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full px-6 py-2 mb-6">
            <Heart className="w-4 h-4 text-pink" />
            <span className="text-white font-semibold">Why Y&Y</span>
          </div>
          <h2 className="text-5xl md:text-6xl font-bold text-white mb-4">
            The Y&Y Difference
          </h2>
          <p className="text-xl text-white/90 max-w-3xl mx-auto">
            Experience the perfect blend of artistry, luxury, and care that sets us apart
          </p>
        </motion.div>

        {/* Reasons grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {reasons.map((reason, index) => {
            const Icon = reason.icon;
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 50 }}
                animate={inView ? { opacity: 1, y: 0 } : {}}
                transition={{ delay: index * 0.1, duration: 0.6 }}
                whileHover={{ y: -10, scale: 1.05 }}
                className="group relative"
              >
                {/* Glass card */}
                <div className="relative h-full bg-white/10 backdrop-blur-md border border-white/20 rounded-3xl p-8 hover:bg-white/15 transition-all duration-300">
                  {/* Gradient glow effect */}
                  <div className="absolute inset-0 bg-gradient-to-br from-pink/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-3xl" />

                  <div className="relative z-10">
                    {/* Icon */}
                    <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-pink to-pink-light flex items-center justify-center mb-6 transform group-hover:rotate-6 transition-transform duration-300 shadow-lg">
                      <Icon className="w-8 h-8 text-purple-dark" />
                    </div>

                    {/* Content */}
                    <h3 className="text-2xl font-bold text-white mb-3">
                      {reason.title}
                    </h3>
                    <p className="text-white/90 mb-6 leading-relaxed">
                      {reason.description}
                    </p>

                    {/* Stats badge */}
                    <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full px-4 py-2">
                      <Sparkles className="w-4 h-4 text-pink" />
                      <span className="text-white text-sm font-semibold">
                        {reason.stats}
                      </span>
                    </div>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Bottom decoration */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={inView ? { opacity: 1, scale: 1 } : {}}
          transition={{ delay: 0.6, duration: 0.8 }}
          className="text-center mt-16"
        >
          <div className="inline-block bg-white/10 backdrop-blur-md border border-white/20 rounded-3xl px-8 py-6">
            <p className="text-white text-lg font-semibold mb-2">
              Join our community of satisfied clients
            </p>
            <div className="flex items-center justify-center gap-6 text-white/80">
              <div className="text-center">
                <div className="text-3xl font-bold text-white">500+</div>
                <div className="text-sm">Happy Clients</div>
              </div>
              <div className="w-px h-12 bg-white/20" />
              <div className="text-center">
                <div className="text-3xl font-bold text-white">10+</div>
                <div className="text-sm">Years Excellence</div>
              </div>
              <div className="w-px h-12 bg-white/20" />
              <div className="text-center">
                <div className="text-3xl font-bold text-white">5★</div>
                <div className="text-sm">Average Rating</div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default WhyChooseUs;
