# Quick Start Guide - Y&Y Beauty Salon Landing Page

## Getting Started in 3 Steps

### 1. Install Dependencies
```bash
cd frontend
npm install --legacy-peer-deps
```

**Note:** We use `--legacy-peer-deps` because React Three Fiber has peer dependency requirements with React 19, but we're using React 18.

### 2. Start Development Server
```bash
npm run dev
```

The site will be available at `http://localhost:5173` (or another port if 5173 is taken).

### 3. Open in Browser
Navigate to `http://localhost:5173` and enjoy the stunning landing page!

## Common Commands

```bash
# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Run linter
npm run lint

# Clean install (if you have issues)
rm -rf node_modules package-lock.json
npm install --legacy-peer-deps
```

## Development Tips

### Hot Reload
- The development server supports hot module replacement (HMR)
- Changes to React components will update instantly
- CSS changes apply immediately
- No need to refresh the browser!

### 3D Scene Performance
If the 3D hero section is slow on your development machine:
1. Open `src/components/HeroNew.tsx`
2. Adjust the opacity of the Canvas container (currently 40%)
3. Or comment out the Canvas entirely for faster development
4. Re-enable before committing!

### Mobile Testing
```bash
# Get your local IP
ipconfig  # Windows
ifconfig  # Mac/Linux

# Access from phone on same network
http://YOUR-IP:5173
```

### Browser DevTools
- React DevTools: Install the browser extension
- Performance tab: Check frame rates
- Network tab: Monitor asset loading
- Lighthouse: Run audits

## Project Structure

```
frontend/
├── public/           # Static assets (images, fonts)
├── src/
│   ├── components/   # React components
│   │   ├── 3D/      # Three.js 3D components
│   │   ├── *.tsx    # Page sections
│   ├── App.tsx      # Main app component
│   ├── main.tsx     # App entry point
│   └── index.css    # Global styles
├── package.json     # Dependencies
└── README.md        # Full documentation
```

## Troubleshooting

### Build Errors

**Issue: "Cannot find module 'vite'"**
```bash
# Clean install
rm -rf node_modules
npm install --legacy-peer-deps
```

**Issue: TypeScript errors**
```bash
# Make sure TypeScript is installed
npm install typescript --save-dev --legacy-peer-deps
```

**Issue: Three.js type errors**
```bash
# Install Three.js types
npm install @types/three --save-dev --legacy-peer-deps
```

### Runtime Errors

**Issue: 3D scene not rendering**
- Check browser console for WebGL support
- Try a different browser (Chrome recommended)
- Update graphics drivers

**Issue: Images not loading**
- Check that images exist in `public/images/`
- Verify file paths are correct
- Clear browser cache

### Performance Issues

**Issue: Slow scrolling**
- Disable 3D scene during development
- Reduce number of gallery images
- Close other browser tabs

**Issue: High memory usage**
- 3D scenes can be memory intensive
- Close DevTools when not needed
- Restart dev server periodically

## Next Steps

1. **Customize Content**
   - Update colors in `tailwind.config.js`
   - Replace placeholder text
   - Add your own images

2. **Connect Backend**
   - Update API endpoints
   - Add environment variables
   - Test form submissions

3. **Deploy**
   - Build for production: `npm run build`
   - Upload `dist/` folder to hosting
   - Configure domain and SSL

## Resources

- [React Documentation](https://react.dev)
- [TailwindCSS Docs](https://tailwindcss.com/docs)
- [React Three Fiber](https://docs.pmnd.rs/react-three-fiber)
- [Framer Motion](https://www.framer.com/motion/)
- [Vite Guide](https://vitejs.dev/guide/)

## Need Help?

- Check `README.md` for detailed documentation
- Check `LANDING_PAGE_SUMMARY.md` for implementation details
- Review component files - they're well commented
- Search issues on GitHub (when public)

Happy coding! 🚀
