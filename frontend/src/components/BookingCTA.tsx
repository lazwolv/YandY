import { Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useInView } from 'react-intersection-observer';
import { Calendar, Phone, MessageCircle, MapPin, Clock, Sparkles } from 'lucide-react';
import FloatingElements from './3D/FloatingElements';
import { env } from '../config/env';
import { openMaps } from '../utils/maps';

const BookingCTA = () => {
  const navigate = useNavigate();
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  const bookingMethods = [
    {
      icon: Calendar,
      title: 'Book Online',
      description: 'Quick and easy online booking',
      action: 'Book Now',
      color: 'from-pink to-pink-light',
      onClick: () => navigate('/booking'),
      enabled: env.features.booking,
    },
    {
      icon: Phone,
      title: 'Call Us',
      description: env.business.phoneDisplay,
      action: 'Call Now',
      color: 'from-pink to-pink-light',
      onClick: () => window.location.href = `tel:${env.business.phone}`,
      enabled: true,
    },
    {
      icon: MessageCircle,
      title: 'Text Us',
      description: 'Quick response via SMS',
      action: 'Send Message',
      color: 'from-pink to-pink-light',
      onClick: () => window.location.href = `sms:${env.business.phone}`,
      enabled: true,
    },
  ].filter(method => method.enabled);

  const hours = [
    { day: 'Monday - Friday', time: env.hours.weekday },
  ];

  return (
    <section className="py-24 bg-gradient-to-br from-gray-900 via-gray-800 to-black relative overflow-hidden">
      {/* 3D Canvas Background with Sparkles */}
      <div className="absolute inset-0 opacity-15">
        <Canvas camera={{ position: [0, 0, 8], fov: 50 }}>
          <Suspense fallback={null}>
            <FloatingElements />
            <OrbitControls enableZoom={false} enablePan={false} autoRotate autoRotateSpeed={0.3} />
          </Suspense>
        </Canvas>
      </div>

      {/* Animated background with subtle purple accent */}
      <div className="absolute inset-0">
        <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_30%_30%,_rgba(168,85,247,0.15),transparent_50%)]" />
        <div className="absolute bottom-0 right-0 w-full h-full bg-[radial-gradient(circle_at_70%_70%,_rgba(236,72,153,0.1),transparent_50%)]" />
      </div>

      {/* Floating sparkles */}
      <motion.div
        animate={{
          y: [0, -20, 0],
          rotate: [0, 360],
        }}
        transition={{
          duration: 4,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
        className="absolute top-20 left-10 text-pink"
      >
        <Sparkles className="w-12 h-12" />
      </motion.div>

      <motion.div
        animate={{
          y: [0, 20, 0],
          rotate: [360, 0],
        }}
        transition={{
          duration: 5,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
        className="absolute bottom-20 right-20 text-pink-light"
      >
        <Sparkles className="w-16 h-16" />
      </motion.div>

      <div ref={ref} className="max-w-7xl mx-auto px-6 relative z-10">
        {/* Main CTA card */}
        <motion.div
          initial={{ opacity: 0, y: 50, scale: 0.9 }}
          animate={inView ? { opacity: 1, y: 0, scale: 1 } : {}}
          transition={{ duration: 0.8 }}
          className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl p-12 mb-12 shadow-2xl"
        >
          <div className="text-center mb-12">
            <motion.div
              initial={{ scale: 0 }}
              animate={inView ? { scale: 1 } : {}}
              transition={{ delay: 0.3, duration: 0.5, type: 'spring' }}
              className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm border border-white/30 rounded-full px-6 py-2 mb-6"
            >
              <Calendar className="w-5 h-5 text-pink" />
              <span className="text-white font-semibold">Ready to Book?</span>
            </motion.div>

            <h2 className="text-5xl md:text-7xl font-bold text-white mb-6">
              Your Perfect Look
              <br />
              <span className="text-white">
                Awaits You
              </span>
            </h2>

            <p className="text-xl text-white/90 max-w-3xl mx-auto mb-8">
              Book your appointment today and experience the luxury beauty service you deserve
            </p>
          </div>

          {/* Booking methods */}
          <div className="grid md:grid-cols-3 gap-6 mb-12">
            {bookingMethods.map((method, index) => {
              const Icon = method.icon;
              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 30 }}
                  animate={inView ? { opacity: 1, y: 0 } : {}}
                  transition={{ delay: 0.4 + index * 0.1, duration: 0.6 }}
                  whileHover={{ scale: 1.05, y: -5 }}
                  onClick={method.onClick}
                  className="group cursor-pointer"
                >
                  <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-6 hover:bg-white/15 transition-all duration-300">
                    <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${method.color} flex items-center justify-center mb-4 mx-auto transform group-hover:rotate-6 transition-transform shadow-lg`}>
                      <Icon className="w-8 h-8 text-purple-dark" />
                    </div>
                    <h3 className="text-xl font-bold text-white mb-2">
                      {method.title}
                    </h3>
                    <p className="text-white/80 mb-4">
                      {method.description}
                    </p>
                    <button className="bg-white/20 hover:bg-white/30 text-white font-semibold py-2 px-6 rounded-full transition-all duration-300 border border-white/30">
                      {method.action}
                    </button>
                  </div>
                </motion.div>
              );
            })}
          </div>

          {/* Divider */}
          <div className="flex items-center gap-4 my-12">
            <div className="flex-1 h-px bg-white/20" />
            <Sparkles className="w-5 h-5 text-pink" />
            <div className="flex-1 h-px bg-white/20" />
          </div>

          {/* Hours and Location */}
          <div className="grid md:grid-cols-2 gap-8">
            {/* Hours */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={inView ? { opacity: 1, x: 0 } : {}}
              transition={{ delay: 0.7, duration: 0.6 }}
              className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-8"
            >
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-pink to-pink-light flex items-center justify-center">
                  <Clock className="w-6 h-6 text-purple-dark" />
                </div>
                <h3 className="text-2xl font-bold text-white">Opening Hours</h3>
              </div>
              <div className="space-y-3">
                {hours.map((hour, index) => (
                  <div key={index} className="flex justify-between items-center py-2 border-b border-white/10 last:border-0">
                    <span className="text-white/80">{hour.day}</span>
                    <span className="text-white font-semibold">{hour.time}</span>
                  </div>
                ))}
              </div>
            </motion.div>

            {/* Location */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              animate={inView ? { opacity: 1, x: 0 } : {}}
              transition={{ delay: 0.8, duration: 0.6 }}
              className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-8"
            >
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-pink to-pink-light flex items-center justify-center">
                  <MapPin className="w-6 h-6 text-purple-dark" />
                </div>
                <h3 className="text-2xl font-bold text-white">Visit Us</h3>
              </div>
              <div className="space-y-4">
                <p className="text-white/90 text-lg">
                  {env.business.address.line1}
                  <br />
                  {env.business.address.city}, {env.business.address.state} {env.business.address.zip}
                </p>
                <div className="flex flex-col gap-3 pt-4">
                  <button
                    onClick={() => openMaps({
                      address: env.business.address.full,
                      latitude: env.business.location.latitude,
                      longitude: env.business.location.longitude,
                    })}
                    className="bg-white/20 hover:bg-white/30 text-white font-semibold py-3 px-6 rounded-full transition-all duration-300 border border-white/30 text-center"
                  >
                    Get Directions
                  </button>
                  <p className="text-white/80 text-sm text-center">
                    Free parking available
                  </p>
                </div>
              </div>
            </motion.div>
          </div>
        </motion.div>

        {/* Trust badges */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 1, duration: 0.8 }}
          className="flex flex-wrap justify-center items-center gap-8 text-white/90"
        >
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-pink" />
            <span className="font-semibold">Walk-Ins Welcome</span>
          </div>
          <div className="w-px h-6 bg-white/30" />
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-pink" />
            <span className="font-semibold">Same-Day Appointments</span>
          </div>
          <div className="w-px h-6 bg-white/30" />
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-pink" />
            <span className="font-semibold">Gift Vouchers Available</span>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default BookingCTA;
