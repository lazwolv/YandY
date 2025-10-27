import { Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { Star, Quote } from 'lucide-react';
import FloatingElements from './3D/FloatingElements';

const Testimonials = () => {
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  const testimonials = [
    {
      name: 'Jennifer Smith',
      role: 'Regular Client',
      image: '👩‍💼',
      rating: 5,
      text: 'Absolutely love Y&Y! The attention to detail is incredible. My nails always look perfect and last for weeks. The team is professional, friendly, and truly talented.',
      service: 'Gel Manicure',
    },
    {
      name: 'Amanda Rodriguez',
      role: 'Monthly Subscriber',
      image: '👩',
      rating: 5,
      text: 'I have been coming here for over a year now and I am never disappointed. The salon is always clean, the products are top quality, and the results are stunning every time!',
      service: 'Nail Art Design',
    },
    {
      name: 'Lisa Thompson',
      role: 'VIP Client',
      image: '👱‍♀️',
      rating: 5,
      text: 'Best nail salon experience ever! The luxury spa pedicure is heaven. I always leave feeling pampered and beautiful. The team goes above and beyond to ensure satisfaction.',
      service: 'Spa Pedicure',
    },
    {
      name: 'Sarah Johnson',
      role: 'New Client',
      image: '👩‍🦰',
      rating: 5,
      text: 'Found my new go-to salon! From the moment I walked in, I felt welcomed. The ambiance is relaxing, and my nails have never looked better. Highly recommend!',
      service: 'Acrylic Extensions',
    },
  ];

  return (
    <section className="py-24 bg-gradient-to-br from-gray-900 via-gray-800 to-black relative overflow-hidden">
      {/* 3D Canvas Background with Sparkles */}
      <div className="absolute inset-0 opacity-10">
        <Canvas camera={{ position: [0, 0, 8], fov: 50 }}>
          <Suspense fallback={null}>
            <FloatingElements />
            <OrbitControls enableZoom={false} enablePan={false} autoRotate autoRotateSpeed={0.4} />
          </Suspense>
        </Canvas>
      </div>

      {/* Decorative background with subtle purple accent */}
      <div className="absolute top-0 left-0 w-full h-full opacity-20">
        <div className="absolute top-1/4 left-10 w-64 h-64 bg-pink/20 rounded-full filter blur-3xl" />
        <div className="absolute bottom-1/4 right-10 w-80 h-80 bg-purple-900/30 rounded-full filter blur-3xl" />
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
            <Quote className="w-4 h-4 text-pink-light" />
            <span className="text-white font-semibold">Testimonials</span>
          </div>
          <h2 className="text-5xl md:text-6xl font-bold text-white mb-4">
            What Our Clients Say
          </h2>
          <p className="text-xl text-white/90 max-w-3xl mx-auto">
            Don't just take our word for it - hear from our amazing community
          </p>
        </motion.div>

        {/* Testimonials grid */}
        <div className="grid md:grid-cols-2 gap-8">
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 50 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: index * 0.1, duration: 0.6 }}
              whileHover={{ y: -5, scale: 1.02 }}
              className="group relative"
            >
              {/* Card with glassmorphism */}
              <div className="relative bg-white/5 backdrop-blur-sm border border-white/10 hover:border-white/20 rounded-3xl p-8 shadow-xl hover:shadow-2xl transition-all duration-300 overflow-hidden">
                {/* Gradient accent on hover */}
                <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-purple-light to-pink transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left" />

                {/* Quote icon */}
                <div className="absolute top-6 right-6 opacity-10">
                  <Quote className="w-20 h-20 text-white" />
                </div>

                <div className="relative z-10">
                  {/* Rating */}
                  <div className="flex items-center gap-1 mb-4">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star key={i} className="w-5 h-5 fill-pink-light text-pink-light" />
                    ))}
                  </div>

                  {/* Testimonial text */}
                  <p className="text-white/90 text-lg leading-relaxed mb-6 italic">
                    "{testimonial.text}"
                  </p>

                  {/* Service badge */}
                  <div className="inline-flex items-center gap-2 bg-white/10 rounded-full px-4 py-2 mb-6">
                    <span className="text-sm font-semibold text-white">{testimonial.service}</span>
                  </div>

                  {/* Client info */}
                  <div className="flex items-center gap-4">
                    <div className="w-14 h-14 rounded-full bg-gradient-to-br from-purple-light to-pink flex items-center justify-center text-3xl shadow-lg">
                      {testimonial.image}
                    </div>
                    <div>
                      <h4 className="font-bold text-white text-lg">
                        {testimonial.name}
                      </h4>
                      <p className="text-white/80 text-sm">{testimonial.role}</p>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Stats section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.6, duration: 0.8 }}
          className="mt-16"
        >
          <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-3xl p-12 text-center shadow-2xl">
            <div className="grid md:grid-cols-4 gap-8">
              <div>
                <div className="text-5xl font-bold text-white mb-2">500+</div>
                <div className="text-white/80">Happy Clients</div>
              </div>
              <div>
                <div className="text-5xl font-bold text-white mb-2">5,000+</div>
                <div className="text-white/80">Services Completed</div>
              </div>
              <div>
                <div className="text-5xl font-bold text-white mb-2 flex items-center justify-center gap-2">
                  5 <Star className="w-8 h-8 fill-pink-light text-pink-light" />
                </div>
                <div className="text-white/80">Average Rating</div>
              </div>
              <div>
                <div className="text-5xl font-bold text-white mb-2">10+</div>
                <div className="text-white/80">Years Experience</div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Leave a review CTA */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : {}}
          transition={{ delay: 0.8, duration: 0.8 }}
          className="text-center mt-12"
        >
          <p className="text-white/90 mb-4">Have you visited us? Share your experience!</p>
          <button className="bg-gradient-to-r from-pink to-pink-light text-purple-dark font-bold px-10 py-4 rounded-full shadow-xl hover:shadow-2xl hover:from-pink-light hover:to-pink transition-all duration-300 transform hover:scale-105">
            Leave a Review
          </button>
        </motion.div>
      </div>
    </section>
  );
};

export default Testimonials;
