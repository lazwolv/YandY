# Component Architecture Guide

## Overview

This document provides detailed information about each component in the Y&Y Beauty Salon landing page, including props, usage examples, and customization options.

---

## Table of Contents

1. [3D Components](#3d-components)
2. [Layout Components](#layout-components)
3. [Section Components](#section-components)
4. [Utility Patterns](#utility-patterns)

---

## 3D Components

### FloatingElements.tsx

**Location:** `src/components/3D/FloatingElements.tsx`

**Purpose:** Renders all 3D elements in the hero section including nail polish bottles, geometric rings, and sparkle particles.

**Technical Details:**
- Uses React Three Fiber for 3D rendering
- Drei helpers for Float component
- Three.js primitives (Cylinder, Torus, Sphere)
- Custom materials with opacity and metalness
- Dynamic lighting system

**Components:**

#### NailPolishBottle
```tsx
<NailPolishBottle
  position={[x, y, z]}
  color="#8d60a9"
/>
```
- Renders a 3D nail polish bottle
- Accepts position array and color string
- Auto-rotates on Y-axis
- Uses Float component for smooth movement

#### GeometricRing
```tsx
<GeometricRing
  position={[x, y, z]}
  color="#ffd7e4"
/>
```
- Renders a torus (donut shape)
- Rotates continuously on X and Y axes
- Metallic material with transparency

#### SparkleParticle
```tsx
<SparkleParticle position={[x, y, z]} />
```
- Small glowing sphere
- Emissive material in pink
- Floats with high intensity

**Customization:**
```tsx
// Change bottle color
<NailPolishBottle position={[-3, 0, 0]} color="#FF69B4" />

// Adjust ring size
<Torus args={[radius, tube, radialSegments, tubularSegments]} />

// Add more particles
{Array.from({ length: 30 }).map((_, i) => (
  <SparkleParticle key={i} position={[...]} />
))}
```

---

## Layout Components

### Navbar.tsx

**Location:** `src/components/Navbar.tsx`

**Purpose:** Fixed navigation bar with smooth scrolling and mobile menu.

**Features:**
- Glassmorphism effect on scroll
- Smooth scroll to sections
- Responsive mobile menu
- Language switcher badge
- CTA buttons

**Props:** None (uses internal state)

**Key Functions:**
```tsx
const scrollToSection = (href: string) => {
  // Smoothly scrolls to element with matching ID
  const element = document.querySelector(href);
  if (element) {
    element.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }
};
```

**State:**
```tsx
const [isScrolled, setIsScrolled] = useState(false);
const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
```

**Customization:**
```tsx
// Add new nav link
const navLinks = [
  { label: 'Home', href: '#home' },
  { label: 'About', href: '#about' },  // Add this
  // ...
];

// Change scroll threshold
setIsScrolled(window.scrollY > 100);  // Default: 50

// Modify glassmorphism
className="bg-white/95 backdrop-blur-lg"
```

### Footer.tsx

**Location:** `src/components/Footer.tsx`

**Purpose:** Comprehensive footer with contact info, links, and newsletter signup.

**Sections:**
1. Brand column (logo, description, social links)
2. Quick Links (navigation)
3. Services list
4. Contact information

**Customization:**
```tsx
// Update contact info
<a href="tel:+15551234567">
  (555) 123-4567
</a>

// Change social links
const socialLinks = [
  { icon: Facebook, label: 'Facebook', href: 'https://facebook.com/yysalon' },
  // ...
];

// Modify newsletter form
<form onSubmit={handleNewsletter}>
  <input type="email" name="email" />
  <button type="submit">Subscribe</button>
</form>
```

---

## Section Components

### HeroNew.tsx

**Location:** `src/components/HeroNew.tsx`

**Purpose:** Hero section with 3D background and main CTA.

**Features:**
- 3D Canvas with FloatingElements
- Framer Motion animations
- Badge, headline, subheadline
- CTA buttons
- Trust indicators
- Scroll indicator

**Animation Timeline:**
```tsx
Badge:      delay 0.2s
Headline:   delay 0.4s
Subheading: delay 0.6s
CTAs:       delay 0.8s
Trust:      delay 1.2s
Scroll:     delay 1.5s
```

**Customization:**
```tsx
// Change headline
<h1>
  Your Beauty,
  <br />
  <span className="gradient-text">
    Redefined  // Change this
  </span>
</h1>

// Modify 3D scene opacity
<div className="absolute inset-0 opacity-40">
  {/* Change opacity value */}
</div>

// Add more trust indicators
<div className="flex items-center gap-2">
  <Award className="w-5 h-5" />
  <span>Award Winning</span>
</div>
```

### ServicesNew.tsx

**Location:** `src/components/ServicesNew.tsx`

**Purpose:** Showcase services with pricing and features.

**Data Structure:**
```tsx
interface Service {
  icon: LucideIcon;
  title: string;
  description: string;
  features: string[];
  color: string;
  price: string;
}
```

**Customization:**
```tsx
// Add new service
const services = [
  // ... existing services
  {
    icon: Sparkles,
    title: 'Eyebrow Threading',
    description: 'Precise eyebrow shaping',
    features: ['Threading', 'Tinting', 'Shaping'],
    color: 'from-pink to-purple',
    price: 'From $15',
  },
];

// Change grid layout
<div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
  {/* Change lg:grid-cols-4 to desired columns */}
</div>

// Modify hover effect
whileHover={{ y: -10, scale: 1.02 }}
```

### WhyChooseUs.tsx

**Location:** `src/components/WhyChooseUs.tsx`

**Purpose:** Highlight key differentiators and build trust.

**Features:**
- 4 reason cards with glass effect
- Stats badges
- Dark background with animated patterns
- Bottom stats showcase

**Customization:**
```tsx
// Add new reason
const reasons = [
  // ... existing reasons
  {
    icon: Trophy,
    title: 'Award Winning',
    description: 'Recognized industry leader',
    stats: 'Multiple Awards',
  },
];

// Change background gradient
className="bg-gradient-to-br from-purple via-purple-dark to-pink"

// Update stats
<div className="text-3xl font-bold">1000+</div>
<div className="text-sm">Happy Clients</div>
```

### GalleryNew.tsx

**Location:** `src/components/GalleryNew.tsx`

**Purpose:** Photo gallery with filtering and lightbox.

**Features:**
- Category filtering (All, Nails, Salon)
- Grid layout with hover effects
- Full-screen lightbox
- Navigation (prev/next)
- Image counter

**State:**
```tsx
const [selectedImage, setSelectedImage] = useState<number | null>(null);
const [activeCategory, setActiveCategory] = useState<'all' | 'nails' | 'salon'>('all');
```

**Image Structure:**
```tsx
interface GalleryImage {
  src: string;
  category: 'nails' | 'salon';
  title: string;
}
```

**Customization:**
```tsx
// Add new category
const categories = [
  { id: 'all', label: 'All Work' },
  { id: 'nails', label: 'Nail Art' },
  { id: 'salon', label: 'Our Salon' },
  { id: 'team', label: 'Our Team' },  // Add this
];

// Change grid columns
className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5"

// Modify aspect ratio
className="aspect-square"  // or aspect-video, aspect-[4/3]
```

### TeamPreview.tsx

**Location:** `src/components/TeamPreview.tsx`

**Purpose:** Showcase team members with profiles.

**Team Member Structure:**
```tsx
interface TeamMember {
  name: string;
  role: string;
  image: string;
  specialty: string;
  experience: string;
}
```

**Customization:**
```tsx
// Add new team member
const team = [
  // ... existing members
  {
    name: 'Lisa Anderson',
    role: 'Beauty Consultant',
    image: '/images/Team/team 5.jpg',
    specialty: 'Skincare',
    experience: '7 Years',
  },
];

// Change card layout
<div className="grid md:grid-cols-2 lg:grid-cols-5 gap-8">

// Modify experience badge
<div className="bg-gold/90">
  <Award className="w-4 h-4" />
  <span>{member.experience}</span>
</div>
```

### Testimonials.tsx

**Location:** `src/components/Testimonials.tsx`

**Purpose:** Display client reviews and build social proof.

**Testimonial Structure:**
```tsx
interface Testimonial {
  name: string;
  role: string;
  image: string;  // emoji or photo URL
  rating: number;
  text: string;
  service: string;
}
```

**Customization:**
```tsx
// Add new testimonial
const testimonials = [
  // ... existing testimonials
  {
    name: 'Maria Lopez',
    role: 'Loyal Client',
    image: '👩',
    rating: 5,
    text: 'Amazing service and beautiful results!',
    service: 'Full Set Acrylics',
  },
];

// Change grid layout
<div className="grid md:grid-cols-3 gap-8">

// Modify rating display
{[...Array(testimonial.rating)].map((_, i) => (
  <Star key={i} className="w-6 h-6 fill-gold text-gold" />
))}
```

### BookingCTA.tsx

**Location:** `src/components/BookingCTA.tsx`

**Purpose:** Strong call-to-action for booking appointments.

**Features:**
- 3 booking methods (online, phone, text)
- Opening hours display
- Location with directions
- Animated sparkle decorations
- Trust badges

**Booking Method Structure:**
```tsx
interface BookingMethod {
  icon: LucideIcon;
  title: string;
  description: string;
  action: string;
  color: string;
}
```

**Customization:**
```tsx
// Update hours
const hours = [
  { day: 'Monday - Friday', time: '9:00 AM - 7:00 PM' },
  { day: 'Saturday', time: '9:00 AM - 6:00 PM' },
  { day: 'Sunday', time: 'Closed' },  // Modify
];

// Change location
<p>
  456 Main Street<br />
  Your City, State 67890
</p>

// Add new booking method
{
  icon: Mail,
  title: 'Email Us',
  description: 'booking@yysalon.com',
  action: 'Send Email',
  color: 'from-blue to-blue-light',
}
```

---

## Utility Patterns

### Animation Pattern

**Entrance Animation:**
```tsx
<motion.div
  initial={{ opacity: 0, y: 30 }}
  animate={inView ? { opacity: 1, y: 0 } : {}}
  transition={{ duration: 0.8 }}
>
  {/* Content */}
</motion.div>
```

**Hover Animation:**
```tsx
<motion.div
  whileHover={{ y: -10, scale: 1.05 }}
  transition={{ duration: 0.3 }}
>
  {/* Interactive element */}
</motion.div>
```

**Stagger Children:**
```tsx
<motion.div
  variants={containerVariants}
  initial="hidden"
  animate="visible"
>
  {items.map((item, i) => (
    <motion.div key={i} variants={itemVariants}>
      {/* Child */}
    </motion.div>
  ))}
</motion.div>
```

### Intersection Observer Pattern

```tsx
import { useInView } from 'react-intersection-observer';

const [ref, inView] = useInView({
  triggerOnce: true,
  threshold: 0.1,
});

// Use in component
<div ref={ref}>
  <motion.div
    initial={{ opacity: 0 }}
    animate={inView ? { opacity: 1 } : {}}
  >
    {/* Content animates when scrolled into view */}
  </motion.div>
</div>
```

### Glassmorphism Pattern

```tsx
<div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-3xl">
  {/* Glass card content */}
</div>

// Or use the utility class
<div className="glass rounded-3xl">
  {/* Content */}
</div>
```

### Gradient Text Pattern

```tsx
<h1 className="bg-gradient-to-r from-purple via-purple-dark to-pink bg-clip-text text-transparent">
  Gradient Heading
</h1>

// Or use the utility class
<h1 className="gradient-text">
  Gradient Heading
</h1>
```

### Gradient Background Pattern

```tsx
// Subtle background
<section className="bg-gradient-to-br from-white via-pink/10 to-purple/10">

// Bold background
<section className="bg-gradient-to-br from-purple via-purple-dark to-purple">

// With overlay
<div className="absolute inset-0 bg-gradient-to-br from-purple/60 via-transparent to-pink/40" />
```

---

## Best Practices

### Performance

1. **Use Lazy Loading:**
```tsx
<img src="..." loading="lazy" alt="..." />
```

2. **Optimize Images:**
- Use WebP format
- Compress before upload
- Appropriate dimensions

3. **Memoize Expensive Calculations:**
```tsx
const expensiveValue = useMemo(() => {
  return computeExpensiveValue(data);
}, [data]);
```

4. **Avoid Layout Shifts:**
- Set explicit image dimensions
- Use aspect-ratio utilities
- Reserve space for dynamic content

### Accessibility

1. **Add ARIA Labels:**
```tsx
<button aria-label="Open mobile menu">
  <Menu />
</button>
```

2. **Use Semantic HTML:**
```tsx
<nav>...</nav>
<main>...</main>
<footer>...</footer>
<section>...</section>
```

3. **Keyboard Navigation:**
```tsx
<button
  onClick={handleClick}
  onKeyDown={(e) => e.key === 'Enter' && handleClick()}
>
```

4. **Focus Indicators:**
```tsx
className="focus:outline-none focus:ring-2 focus:ring-pink"
```

### Code Organization

1. **Extract Reusable Components:**
```tsx
// Instead of repeating
<div className="glass rounded-3xl p-8">
  {/* Content */}
</div>

// Create
<GlassCard>
  {/* Content */}
</GlassCard>
```

2. **Use TypeScript Interfaces:**
```tsx
interface ServiceCardProps {
  title: string;
  description: string;
  icon: LucideIcon;
}
```

3. **Separate Data from UI:**
```tsx
// data.ts
export const services = [...];

// Component.tsx
import { services } from './data';
```

---

## Troubleshooting

### Common Issues

**Issue: Animations not working**
```tsx
// Make sure Framer Motion is imported
import { motion } from 'framer-motion';

// Check that element is <motion.div> not <div>
```

**Issue: 3D scene not rendering**
```tsx
// Wrap in Suspense
<Suspense fallback={null}>
  <Canvas>
    <FloatingElements />
  </Canvas>
</Suspense>
```

**Issue: Images not loading**
```tsx
// Use absolute path from public folder
<img src="/images/photo.jpg" alt="..." />

// Not relative path
<img src="./images/photo.jpg" alt="..." />
```

**Issue: Tailwind classes not applying**
```tsx
// Make sure className is used (not class)
<div className="bg-purple">

// Check that tailwind.config.js includes the file
content: ['./src/**/*.{js,ts,jsx,tsx}']
```

---

## Testing Components

### Visual Testing
```bash
# Start dev server
npm run dev

# Navigate to section
http://localhost:5173#services
```

### Props Testing
```tsx
// Create stories for Storybook (optional)
export const Default = () => <ServiceCard {...defaultProps} />;
export const WithImage = () => <ServiceCard {...propsWithImage} />;
```

### Performance Testing
```javascript
// Use React DevTools Profiler
// Check render times and re-renders
```

---

## Resources

- [Framer Motion API](https://www.framer.com/motion/)
- [React Three Fiber Docs](https://docs.pmnd.rs/react-three-fiber)
- [TailwindCSS Utilities](https://tailwindcss.com/docs)
- [Lucide Icons](https://lucide.dev/icons/)

---

Built with care for Y&Y Beauty Salon 💅✨
