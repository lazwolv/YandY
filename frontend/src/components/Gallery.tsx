import { useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const Gallery = () => {
  const [activeSlider, setActiveSlider] = useState({
    salon: 0,
    work: 0,
    team: 0,
  });

  const galleries = {
    salon: {
      title: 'Our Salon',
      images: [
        { url: '/images/Salon/salon1.jpg', alt: 'Salon Interior 1' },
        { url: '/images/Salon/salon2.jpg', alt: 'Salon Interior 2' },
        { url: '/images/Salon/salon3.jpg', alt: 'Salon Interior 3' },
        { url: '/images/Salon/salon4.jpg', alt: 'Salon Interior 4' },
      ],
    },
    work: {
      title: 'Our Work',
      images: [
        { url: '/images/Nails/nails1.jpg', alt: 'Beautiful Nail Art 1' },
        { url: '/images/Nails/nails2.jpg', alt: 'Beautiful Nail Art 2' },
        { url: '/images/Nails/nails3.jpg', alt: 'Beautiful Nail Art 3' },
        { url: '/images/Nails/nails4.jpg', alt: 'Beautiful Nail Art 4' },
        { url: '/images/Nails/nails6.jpg', alt: 'Beautiful Nail Art 6' },
        { url: '/images/Nails/nails7.jpg', alt: 'Beautiful Nail Art 7' },
        { url: '/images/Nails/nails8.jpg', alt: 'Beautiful Nail Art 8' },
        { url: '/images/Nails/nails10.jpg', alt: 'Beautiful Nail Art 10' },
      ],
    },
    team: {
      title: 'Our Team',
      images: [
        { url: '/images/Team/team 1.jpg', alt: 'Team Member 1' },
        { url: '/images/Team/team 2.jpg', alt: 'Team Member 2' },
        { url: '/images/Team/team 3.jpg', alt: 'Team Member 3' },
        { url: '/images/Team/team 4.jpg', alt: 'Team Member 4' },
      ],
    },
  };

  const nextSlide = (gallery: keyof typeof activeSlider) => {
    setActiveSlider((prev) => ({
      ...prev,
      [gallery]: (prev[gallery] + 1) % galleries[gallery].images.length,
    }));
  };

  const prevSlide = (gallery: keyof typeof activeSlider) => {
    setActiveSlider((prev) => ({
      ...prev,
      [gallery]:
        prev[gallery] === 0
          ? galleries[gallery].images.length - 1
          : prev[gallery] - 1,
    }));
  };

  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-6">
        <h2 className="text-4xl md:text-5xl font-bold text-center text-purple mb-16">
          Gallery
        </h2>
        <div className="grid md:grid-cols-3 gap-8">
          {Object.entries(galleries).map(([key, gallery]) => (
            <div key={key} className="bg-pink-light/20 rounded-2xl p-6 shadow-xl">
              <h3 className="text-2xl font-bold text-purple mb-6 text-center">
                {gallery.title}
              </h3>
              <div className="relative aspect-[4/3] rounded-xl overflow-hidden group">
                {gallery.images.map((image, index) => (
                  <img
                    key={index}
                    src={image.url}
                    alt={image.alt}
                    className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-500 ${
                      index === activeSlider[key as keyof typeof activeSlider]
                        ? 'opacity-100'
                        : 'opacity-0'
                    }`}
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = `https://placehold.co/600x400/8d60a9/ffd7e4?text=${encodeURIComponent(image.alt)}`;
                    }}
                  />
                ))}
                <button
                  onClick={() => prevSlide(key as keyof typeof activeSlider)}
                  className="absolute left-2 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-purple text-purple hover:text-white rounded-full p-2 opacity-0 group-hover:opacity-100 transition-all duration-300 shadow-lg"
                >
                  <ChevronLeft className="w-6 h-6" />
                </button>
                <button
                  onClick={() => nextSlide(key as keyof typeof activeSlider)}
                  className="absolute right-2 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-purple text-purple hover:text-white rounded-full p-2 opacity-0 group-hover:opacity-100 transition-all duration-300 shadow-lg"
                >
                  <ChevronRight className="w-6 h-6" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Gallery;
