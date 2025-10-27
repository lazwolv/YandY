import { motion } from 'framer-motion';
import { Facebook, Instagram, Twitter, Mail, Phone, MapPin, Heart, ExternalLink } from 'lucide-react';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  const socialLinks = [
    { icon: Facebook, label: 'Facebook', href: '#' },
    { icon: Instagram, label: 'Instagram', href: '#' },
    { icon: Twitter, label: 'Twitter', href: '#' },
  ];

  const quickLinks = [
    { label: 'About Us', href: '#about' },
    { label: 'Services', href: '#services' },
    { label: 'Gallery', href: '#gallery' },
    { label: 'Team', href: '#team' },
    { label: 'Testimonials', href: '#testimonials' },
    { label: 'Contact', href: '#contact' },
  ];

  const services = [
    'Luxury Manicure',
    'Deluxe Pedicure',
    'Nail Art Design',
    'Acrylic & Gel',
    'Waxing Services',
    'Spa Packages',
  ];

  return (
    <footer className="bg-gradient-to-br from-gray-900 via-gray-800 to-black text-white/90 relative overflow-hidden border-t border-white/10">
      {/* Decorative background with subtle purple accent */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-0 right-0 w-96 h-96 bg-purple-900/30 rounded-full filter blur-3xl" />
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-pink/20 rounded-full filter blur-3xl" />
      </div>

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        {/* Main footer content */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-12 py-16">
          {/* Brand column */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <div className="mb-6">
              <img
                src="/images/LOGO-DEF.png"
                alt="Y&Y Beauty Salon"
                className="h-16 w-auto mb-4 transition-opacity duration-300"
              />
              <h3 className="text-2xl font-bold text-white mb-2">Y&Y Beauty Salon</h3>
            </div>
            <p className="text-white/80 mb-6 leading-relaxed">
              Where beauty meets luxury. Experience premium nail care and beauty services in an elegant, relaxing atmosphere.
            </p>
            {/* Social links */}
            <div className="flex gap-4">
              {socialLinks.map((social, index) => {
                const Icon = social.icon;
                return (
                  <motion.a
                    key={index}
                    href={social.href}
                    whileHover={{ scale: 1.1, y: -3 }}
                    className="w-12 h-12 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 flex items-center justify-center hover:bg-pink-light/20 transition-all duration-300 group"
                  >
                    <Icon className="w-5 h-5 text-white group-hover:text-pink-light transition-colors" />
                  </motion.a>
                );
              })}
            </div>
          </motion.div>

          {/* Quick Links */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1, duration: 0.6 }}
          >
            <h4 className="text-xl font-bold text-white mb-6">Quick Links</h4>
            <ul className="space-y-3">
              {quickLinks.map((link, index) => (
                <li key={index}>
                  <a
                    href={link.href}
                    className="text-white/80 hover:text-pink-light transition-colors duration-300 flex items-center gap-2 group"
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-white/60 group-hover:bg-pink-light transition-colors" />
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </motion.div>

          {/* Services */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2, duration: 0.6 }}
          >
            <h4 className="text-xl font-bold text-white mb-6">Our Services</h4>
            <ul className="space-y-3">
              {services.map((service, index) => (
                <li key={index} className="text-white/80 flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-white/60" />
                  {service}
                </li>
              ))}
            </ul>
          </motion.div>

          {/* Contact Info */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3, duration: 0.6 }}
          >
            <h4 className="text-xl font-bold text-white mb-6">Get In Touch</h4>
            <div className="space-y-4">
              <a
                href="tel:+15551234567"
                className="flex items-start gap-3 text-white/80 hover:text-pink-light transition-colors group"
              >
                <div className="w-10 h-10 rounded-full bg-white/10 backdrop-blur-sm flex items-center justify-center flex-shrink-0 group-hover:bg-pink-light/20 transition-colors">
                  <Phone className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-sm text-white/60">Call Us</div>
                  <div className="font-semibold">(555) 123-4567</div>
                </div>
              </a>

              <a
                href="mailto:info@yysalon.com"
                className="flex items-start gap-3 text-white/80 hover:text-pink-light transition-colors group"
              >
                <div className="w-10 h-10 rounded-full bg-white/10 backdrop-blur-sm flex items-center justify-center flex-shrink-0 group-hover:bg-pink-light/20 transition-colors">
                  <Mail className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-sm text-white/60">Email Us</div>
                  <div className="font-semibold">info@yysalon.com</div>
                </div>
              </a>

              <div className="flex items-start gap-3 text-white/80">
                <div className="w-10 h-10 rounded-full bg-white/10 backdrop-blur-sm flex items-center justify-center flex-shrink-0">
                  <MapPin className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-sm text-white/60">Visit Us</div>
                  <div className="font-semibold">
                    123 Beauty Street
                    <br />
                    Salon City, SC 12345
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Newsletter signup */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.4, duration: 0.6 }}
          className="border-t border-white/10 py-12"
        >
          <div className="max-w-2xl mx-auto text-center">
            <h3 className="text-2xl font-bold text-white mb-3">
              Stay Updated with Our Latest Offers
            </h3>
            <p className="text-white/90 mb-6">
              Subscribe to our newsletter for exclusive deals and beauty tips
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <input
                type="email"
                placeholder="Enter your email"
                className="px-6 py-4 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-pink flex-1 max-w-md"
              />
              <button className="px-8 py-4 bg-gradient-to-r from-pink to-pink-light text-purple-dark font-bold rounded-full hover:from-pink-light hover:to-pink transition-all duration-300 transform hover:scale-105 shadow-lg flex items-center justify-center gap-2">
                Subscribe
                <ExternalLink className="w-5 h-5" />
              </button>
            </div>
          </div>
        </motion.div>

        {/* Bottom bar */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.5, duration: 0.6 }}
          className="border-t border-white/10 py-8"
        >
          <div className="flex flex-col md:flex-row justify-between items-center gap-4 text-white/60 text-sm">
            <p className="flex items-center gap-2">
              &copy; {currentYear} Y&Y Beauty Salon. All rights reserved. Made with{' '}
              <Heart className="w-4 h-4 fill-pink text-pink" /> in Salon City
            </p>
            <div className="flex gap-6">
              <a href="#" className="hover:text-pink transition-colors">
                Privacy Policy
              </a>
              <a href="#" className="hover:text-pink transition-colors">
                Terms of Service
              </a>
              <a href="#" className="hover:text-pink transition-colors">
                Sitemap
              </a>
            </div>
          </div>
        </motion.div>
      </div>
    </footer>
  );
};

export default Footer;
