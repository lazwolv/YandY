import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { X, ChevronLeft, ChevronRight, Camera } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';

const GalleryNew = () => {
  const { t } = useLanguage();
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  const [selectedImage, setSelectedImage] = useState<number | null>(null);
  const [activeCategory, setActiveCategory] = useState<'all' | 'nails' | 'salon'>('all');

  const images = [
    { src: '/images/Nails/nails1.jpg', category: 'nails', title: 'Elegant French Tips' },
    { src: '/images/Nails/nails2.jpg', category: 'nails', title: 'Glitter Glamour' },
    { src: '/images/Nails/nails3.jpg', category: 'nails', title: 'Ombre Dreams' },
    { src: '/images/Nails/nails4.jpg', category: 'nails', title: 'Bold & Beautiful' },
    { src: '/images/Salon/salon1.jpg', category: 'salon', title: 'Luxury Interior' },
    { src: '/images/Salon/salon2.jpg', category: 'salon', title: 'Relaxation Area' },
    { src: '/images/Nails/nails6.jpg', category: 'nails', title: 'Floral Art' },
    { src: '/images/Nails/nails7.jpg', category: 'nails', title: 'Minimalist Chic' },
    { src: '/images/Salon/salon3.jpg', category: 'salon', title: 'Pedicure Stations' },
    { src: '/images/Nails/nails8.jpg', category: 'nails', title: 'Seasonal Special' },
    { src: '/images/Salon/salon4.jpg', category: 'salon', title: 'Welcome Lounge' },
    { src: '/images/Nails/nails10.jpg', category: 'nails', title: 'Custom Designs' },
  ];

  const filteredImages = activeCategory === 'all'
    ? images
    : images.filter(img => img.category === activeCategory);

  const handlePrevious = () => {
    if (selectedImage !== null && selectedImage > 0) {
      setSelectedImage(selectedImage - 1);
    }
  };

  const handleNext = () => {
    if (selectedImage !== null && selectedImage < filteredImages.length - 1) {
      setSelectedImage(selectedImage + 1);
    }
  };

  const categories = [
    { id: 'all', label: t('gallery.filter.allWork') },
    { id: 'nails', label: t('gallery.filter.nailArt') },
    { id: 'salon', label: t('gallery.filter.ourSalon') },
  ];

  return (
    <section className="py-24 bg-gradient-to-br from-gray-900 via-gray-800 to-black relative overflow-hidden">
      <div ref={ref} className="max-w-7xl mx-auto px-6">
        {/* Section header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="text-center mb-12"
        >
          <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full px-6 py-2 mb-6">
            <Camera className="w-4 h-4 text-pink-light" />
            <span className="text-white font-semibold">{t('gallery.portfolio')}</span>
          </div>
          <h2 className="text-5xl md:text-6xl font-bold text-white mb-4">
            {t('gallery.beautifulWork')}
          </h2>
          <p className="text-xl text-white/90 max-w-3xl mx-auto">
            {t('gallery.subtitle2')}
          </p>
        </motion.div>

        {/* Category filters */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.2, duration: 0.6 }}
          className="flex justify-center gap-4 mb-12"
        >
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.id as any)}
              className={`px-8 py-3 rounded-full font-semibold transition-all duration-300 ${
                activeCategory === cat.id
                  ? 'bg-gradient-to-r from-purple-light to-pink text-white shadow-lg scale-105'
                  : 'bg-white/5 text-white border-2 border-white/20 hover:border-white/40'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </motion.div>

        {/* Gallery grid */}
        <motion.div
          layout
          className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4"
        >
          <AnimatePresence mode="popLayout">
            {filteredImages.map((image, index) => (
              <motion.div
                key={image.src}
                layout
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                transition={{ duration: 0.4 }}
                whileHover={{ scale: 1.05, zIndex: 10 }}
                className="group relative aspect-square rounded-2xl overflow-hidden cursor-pointer shadow-lg hover:shadow-2xl transition-shadow"
                onClick={() => setSelectedImage(index)}
              >
                <img
                  src={image.src}
                  alt={image.title}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                  loading="lazy"
                />
                {/* Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-purple-dark/80 via-purple/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-4">
                  <p className="text-pink-light font-semibold text-sm">{image.title}</p>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>

        {/* View more button */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : {}}
          transition={{ delay: 0.6, duration: 0.8 }}
          className="text-center mt-12"
        >
          <button className="bg-gradient-to-r from-pink to-pink-light text-purple-dark font-bold px-10 py-4 rounded-full shadow-xl hover:shadow-2xl hover:from-pink-light hover:to-pink transition-all duration-300 transform hover:scale-105">
            {t('gallery.viewInstagram')}
          </button>
        </motion.div>
      </div>

      {/* Lightbox */}
      <AnimatePresence>
        {selectedImage !== null && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/95 flex items-center justify-center p-4"
            onClick={() => setSelectedImage(null)}
          >
            {/* Close button */}
            <button
              className="absolute top-4 right-4 w-12 h-12 bg-white/10 backdrop-blur-md rounded-full flex items-center justify-center text-pink-light hover:bg-white/20 transition-colors"
              onClick={() => setSelectedImage(null)}
            >
              <X className="w-6 h-6" />
            </button>

            {/* Navigation */}
            {selectedImage > 0 && (
              <button
                className="absolute left-4 w-12 h-12 bg-white/10 backdrop-blur-md rounded-full flex items-center justify-center text-pink-light hover:bg-white/20 transition-colors"
                onClick={(e) => {
                  e.stopPropagation();
                  handlePrevious();
                }}
              >
                <ChevronLeft className="w-6 h-6" />
              </button>
            )}

            {selectedImage < filteredImages.length - 1 && (
              <button
                className="absolute right-4 w-12 h-12 bg-white/10 backdrop-blur-md rounded-full flex items-center justify-center text-pink-light hover:bg-white/20 transition-colors"
                onClick={(e) => {
                  e.stopPropagation();
                  handleNext();
                }}
              >
                <ChevronRight className="w-6 h-6" />
              </button>
            )}

            {/* Image */}
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              className="max-w-5xl max-h-[90vh]"
              onClick={(e) => e.stopPropagation()}
            >
              <img
                src={filteredImages[selectedImage].src}
                alt={filteredImages[selectedImage].title}
                className="max-w-full max-h-[85vh] object-contain rounded-2xl shadow-2xl"
              />
              <p className="text-pink-light text-center mt-4 text-lg font-semibold">
                {filteredImages[selectedImage].title}
              </p>
            </motion.div>

            {/* Counter */}
            <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-white/10 backdrop-blur-md rounded-full px-6 py-2 text-pink-light">
              {selectedImage + 1} / {filteredImages.length}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
};

export default GalleryNew;
