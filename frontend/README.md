# Y&Y Beauty Salon - Luxury Landing Page

A stunning, modern landing page for Y&Y Beauty Salon featuring 3D elements, smooth animations, and a luxury design aesthetic.

## Features

### Core Features
- **3D Hero Section** - Immersive 3D elements using React Three Fiber with floating nail polish bottles and geometric shapes
- **Smooth Animations** - Framer Motion powered animations with scroll-triggered effects
- **Responsive Design** - Mobile-first approach, fully responsive across all devices
- **Glassmorphism UI** - Modern glass-like UI elements with backdrop blur
- **Interactive Gallery** - Full-screen lightbox with image filtering
- **Bilingual Support** - Ready for English/Spanish internationalization
- **PWA Ready** - Progressive Web App capabilities
- **Performance Optimized** - Lazy loading, code splitting, and optimized assets

### Sections
1. **Hero Section** - Eye-catching 3D hero with floating beauty elements and compelling CTAs
2. **Services** - Premium service offerings with hover effects and detailed descriptions
3. **Why Choose Us** - Key differentiators highlighting expertise, quality, and luxury
4. **Gallery** - Filterable photo gallery showcasing nail art and salon interior
5. **Team Preview** - Meet the expert nail technicians with experience badges
6. **Testimonials** - Client reviews with ratings and social proof
7. **Booking CTA** - Multiple booking methods with hours and location
8. **Footer** - Comprehensive footer with contact info, social links, and newsletter signup

## Tech Stack

### Core Technologies
- **React 18.2.0** - Modern React with hooks
- **TypeScript 5.3.3** - Type-safe development
- **Vite 5.0.11** - Lightning-fast build tool
- **TailwindCSS 3.4.1** - Utility-first CSS framework

### 3D & Animation
- **@react-three/fiber 9.4.0** - React renderer for Three.js
- **@react-three/drei 10.7.6** - Useful helpers for React Three Fiber
- **three** - 3D graphics library
- **framer-motion** - Production-ready animation library

### Additional Libraries
- **react-intersection-observer** - Detect when elements enter viewport
- **lucide-react 0.307.0** - Beautiful, consistent icons
- **react-router-dom 6.21.1** - Client-side routing
- **zustand 4.4.7** - State management
- **i18next 23.7.13** - Internationalization framework
- **axios 1.6.5** - HTTP client
- **react-hook-form 7.49.3** - Form validation
- **zod 3.22.4** - Schema validation

## Installation

```bash
# Navigate to frontend directory
cd frontend

# Install dependencies (use --legacy-peer-deps due to React Three Fiber peer dependency)
npm install --legacy-peer-deps

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

## Project Structure

```
frontend/
├── public/
│   ├── images/
│   │   ├── LOGO-DEF.png           # Main logo
│   │   ├── LOGO-DEF-POS.png       # Alternate logo
│   │   ├── background.jpg         # Hero background
│   │   ├── Nails/                 # Nail art photos
│   │   ├── Salon/                 # Salon interior photos
│   │   └── Team/                  # Team member photos
│   └── locales/                   # Translation files
├── src/
│   ├── components/
│   │   ├── 3D/
│   │   │   └── FloatingElements.tsx   # 3D floating beauty elements
│   │   ├── Navbar.tsx                 # Responsive navigation
│   │   ├── HeroNew.tsx                # 3D hero section
│   │   ├── ServicesNew.tsx            # Services showcase
│   │   ├── WhyChooseUs.tsx            # Key differentiators
│   │   ├── GalleryNew.tsx             # Photo gallery with lightbox
│   │   ├── TeamPreview.tsx            # Team member profiles
│   │   ├── Testimonials.tsx           # Client reviews
│   │   ├── BookingCTA.tsx             # Booking call-to-action
│   │   └── Footer.tsx                 # Site footer
│   ├── App.tsx                        # Main app component
│   ├── main.tsx                       # App entry point
│   └── index.css                      # Global styles
├── package.json
├── tailwind.config.js
├── tsconfig.json
├── vite.config.ts
└── README.md
```

## Design System

### Brand Colors
```css
/* Primary Colors */
--pink: #ffd7e4          /* Primary pink */
--pink-light: #ffd7e4    /* Light pink */
--pink-dark: #ffb3cc     /* Dark pink */

--purple: #8d60a9        /* Primary purple */
--purple-light: #a67dbd  /* Light purple */
--purple-dark: #6f4a87   /* Dark purple */
```

### Typography
- Headings: Bold, large scale (5xl-8xl)
- Body: Regular weight, comfortable line height
- Accents: Gradient text effects for emphasis

### Design Principles
1. **Luxury First** - High-end aesthetic with elegant spacing
2. **Modern & Clean** - Minimalist approach with purposeful elements
3. **Smooth Interactions** - Micro-animations on all interactive elements
4. **Visual Hierarchy** - Clear content structure with gradients and shadows
5. **Mobile-First** - Optimized for mobile, enhanced for desktop

## 3D Implementation

### Approach
We chose **React Three Fiber** for its:
- Declarative API that fits React paradigm
- Performance optimizations out of the box
- Rich ecosystem with @react-three/drei helpers
- TypeScript support
- Easy integration with React components

### 3D Elements
1. **Nail Polish Bottles** - Floating, rotating 3D bottles in brand colors
2. **Geometric Rings** - Animated torus shapes with metallic materials
3. **Sparkle Particles** - Floating spheres with emissive materials
4. **Dynamic Lighting** - Ambient, directional, and spotlights for depth
5. **Auto-Rotation** - Subtle camera movement via OrbitControls

### Performance Considerations
- Suspense boundaries for lazy loading
- Low poly counts for smooth performance
- Optimized materials (no heavy shaders)
- Auto-rotation disabled on mobile for better performance
- Opacity reduced to 40% to not overwhelm content

## Animation Strategy

### Framer Motion Features
- **Initial & Animate** - Entrance animations on mount
- **Viewport Triggers** - Scroll-triggered animations via react-intersection-observer
- **Stagger Children** - Sequential animation of list items
- **Hover Effects** - Scale, translate, and color transitions
- **Exit Animations** - Smooth removal of components

### Animation Types
1. Fade in from bottom (opacity + translateY)
2. Scale on hover for cards and buttons
3. Staggered list items with delay
4. Continuous rotation for 3D objects
5. Page section reveals on scroll

## Responsive Breakpoints

```css
/* Mobile First Approach */
sm:  640px   /* Small tablets */
md:  768px   /* Tablets */
lg:  1024px  /* Small laptops */
xl:  1280px  /* Desktops */
2xl: 1536px  /* Large screens */
```

## Backend Integration

The landing page is designed to integrate with the existing backend at `localhost:8000`:

### Ready for Integration
- Booking form submission endpoint
- Newsletter signup endpoint
- Contact form endpoint
- User authentication (login/signup)

### API Structure (Expected)
```typescript
// Booking appointment
POST /api/bookings
{
  name: string
  email: string
  phone: string
  service: string
  date: string
  time: string
}

// Newsletter subscription
POST /api/newsletter
{
  email: string
}

// Contact form
POST /api/contact
{
  name: string
  email: string
  message: string
}
```

## Accessibility

- **WCAG 2.1 AA Compliant** design principles
- Semantic HTML elements
- ARIA labels for interactive elements
- Keyboard navigation support
- High contrast ratios for text
- Alt text for all images
- Focus indicators on all interactive elements

## Performance

### Optimizations
- Lazy loading images with `loading="lazy"`
- Code splitting via React.lazy() (can be added)
- Optimized bundle size with Vite
- Compressed images in WebP format (recommended)
- CSS purging via TailwindCSS
- Tree shaking of unused code

### Lighthouse Scores (Target)
- Performance: 90+
- Accessibility: 95+
- Best Practices: 95+
- SEO: 95+

## Deployment

### Build
```bash
npm run build
```

### Preview Build
```bash
npm run preview
```

### Deploy to Production
The `dist/` folder contains the production build. Deploy to:
- Vercel
- Netlify
- AWS S3 + CloudFront
- GitHub Pages
- Any static hosting service

### Environment Variables
Create `.env` file:
```env
VITE_API_URL=http://localhost:8000
VITE_SITE_URL=https://yysalon.com
```

## Future Enhancements

### Planned Features
1. **Real Booking System** - Connect to backend booking API
2. **Online Payment** - Stripe/PayPal integration
3. **User Accounts** - Client portal for booking history
4. **Live Chat** - Customer support integration
5. **Google Maps** - Interactive map for location
6. **Before/After Slider** - Showcase transformations
7. **Service Menu PDF** - Downloadable price list
8. **Gift Cards** - Purchase gift cards online
9. **Blog Section** - Beauty tips and trends
10. **Loyalty Program** - Rewards for regular clients

### Internationalization
- Add Spanish translations in `public/locales/es/`
- Implement language switcher functionality
- RTL support for additional languages

### Advanced 3D Features
- Interactive nail color picker in 3D
- Virtual try-on for nail designs
- 360° salon tour
- Animated mascot character

## Browser Support

- Chrome (latest 2 versions)
- Firefox (latest 2 versions)
- Safari (latest 2 versions)
- Edge (latest 2 versions)
- Mobile browsers (iOS Safari, Chrome Android)

## Contributing

### Code Style
- Use TypeScript for type safety
- Follow ESLint rules
- Use Prettier for formatting
- Write meaningful commit messages
- Test on multiple devices

### Component Guidelines
1. Keep components focused and single-purpose
2. Extract reusable logic to hooks
3. Use TypeScript interfaces for props
4. Add comments for complex logic
5. Optimize for performance

## License

Copyright © 2024 Y&Y Beauty Salon. All rights reserved.

## Contact

For questions or support:
- Email: info@yysalon.com
- Phone: (555) 123-4567
- Address: 123 Beauty Street, Salon City, SC 12345

---

Built with ❤️ using React, TypeScript, and Three.js
