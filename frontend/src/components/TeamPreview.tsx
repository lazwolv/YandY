import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { useNavigate } from 'react-router-dom';
import { Users, Star, Award } from 'lucide-react';

const TeamPreview = () => {
  const navigate = useNavigate();
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  const team = [
    {
      id: 'yaneidis-id', // You'll need to get the actual ID from database
      name: 'Yaneidis Hidalgo',
      role: 'Acrylic & Gel Specialist',
      image: '/images/Team/team 1.jpg',
      specialty: 'Acrylic & Gel',
      experience: '8 Years',
    },
    {
      id: 'yailex-id', // You'll need to get the actual ID from database
      name: 'Yailex Hidalgo',
      role: 'Nail Art Specialist',
      image: '/images/Team/team 2.jpg',
      specialty: 'Nail Art',
      experience: '6 Years',
    },
    {
      id: 'diana-id', // You'll need to get the actual ID from database
      name: 'Diana Laura Martinez',
      role: 'Acrylic & Gel Specialist',
      image: '/images/Team/team 3.jpg',
      specialty: 'Acrylic & Gel',
      experience: '5 Years',
    },
  ];

  const handleBookWithMember = (memberId: string) => {
    // Navigate to booking page with pre-selected team member
    navigate(`/booking?teamMember=${memberId}`);
  };

  return (
    <section className="py-24 bg-gradient-to-br from-gray-900 via-gray-800 to-black relative overflow-hidden">
      {/* Decorative elements with subtle purple accent */}
      <div className="absolute top-20 right-10 w-72 h-72 bg-pink/10 rounded-full filter blur-3xl" />
      <div className="absolute bottom-20 left-10 w-96 h-96 bg-purple-900/20 rounded-full filter blur-3xl" />

      <div ref={ref} className="max-w-7xl mx-auto px-6 relative z-10">
        {/* Section header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full px-6 py-2 mb-6">
            <Users className="w-4 h-4 text-pink-light" />
            <span className="text-white font-semibold">Our Team</span>
          </div>
          <h2 className="text-5xl md:text-6xl font-bold text-white mb-4">
            Meet Our Expert Artists
          </h2>
          <p className="text-xl text-white/90 max-w-3xl mx-auto">
            Passionate professionals dedicated to making you look and feel amazing
          </p>
        </motion.div>

        {/* Team grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {team.map((member, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 50 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: index * 0.1, duration: 0.6 }}
              whileHover={{ y: -10 }}
              className="group relative"
            >
              {/* Card */}
              <div className="relative bg-white/5 backdrop-blur-sm border border-white/10 hover:border-white/20 rounded-3xl overflow-hidden shadow-xl hover:shadow-2xl transition-all duration-300">
                {/* Image container */}
                <div className="relative h-80 overflow-hidden">
                  <img
                    src={member.image}
                    alt={member.name}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                    loading="lazy"
                  />
                  {/* Gradient overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent opacity-60 group-hover:opacity-80 transition-opacity" />

                  {/* Experience badge */}
                  <div className="absolute top-4 right-4 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full px-4 py-2 flex items-center gap-2">
                    <Award className="w-4 h-4 text-pink-light" />
                    <span className="text-sm font-semibold text-white">{member.experience}</span>
                  </div>
                </div>

                {/* Content */}
                <div className="p-6">
                  <h3 className="text-2xl font-bold text-white mb-1">
                    {member.name}
                  </h3>
                  <p className="text-white/90 font-semibold mb-3">
                    {member.role}
                  </p>

                  {/* Specialty badge */}
                  <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full px-4 py-2 mb-4">
                    <Star className="w-4 h-4 text-pink-light" />
                    <span className="text-sm text-white/80">{member.specialty}</span>
                  </div>

                  {/* Rating */}
                  <div className="flex items-center gap-1 mb-4">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-pink-light text-pink-light" />
                    ))}
                  </div>

                  {/* Book button - Glassy style */}
                  <button
                    onClick={() => handleBookWithMember(member.id)}
                    className="w-full bg-white/10 backdrop-blur-sm border border-white/20 text-white font-bold py-3 rounded-lg hover:bg-white/15 hover:border-white/30 transition-all duration-300 shadow-lg"
                  >
                    Book with {member.name.split(' ')[0]}
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Bottom CTA */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.6, duration: 0.8 }}
          className="text-center mt-16"
        >
          <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-3xl p-8 md:p-12 shadow-2xl">
            <h3 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Not sure who to book with?
            </h3>
            <p className="text-white/90 text-lg mb-6">
              All our technicians are highly skilled. We'll match you with the perfect artist for your needs!
            </p>
            <button
              onClick={() => navigate('/booking')}
              className="bg-white/10 backdrop-blur-sm border border-white/20 text-white font-bold px-10 py-4 rounded-lg hover:bg-white/15 hover:border-white/30 transition-all duration-300 shadow-xl"
            >
              Let Us Choose For You
            </button>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default TeamPreview;
