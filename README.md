# VisionCraft Landing Page

Premium landing page for VisionCraft with full multilingual support (EN/FR/AR with RTL).

## Features

- ✅ Full multilingual support (English, French, Arabic with RTL)
- ✅ React Router for page navigation
- ✅ Responsive design
- ✅ Glassmorphism design language
- ✅ ChatGPT-style typing animation
- ✅ Documentation, Requirements, Contact, Privacy, Terms pages
- ✅ Email waitlist integration ready

## Tech Stack

- React 18
- React Router 6
- Vite 5
- Framer Motion
- Lucide React Icons

## Development

```bash
# Install dependencies
npm install

# Run dev server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

## Deployment to Vercel

### Quick Deploy

1. **Push to GitHub** (if not already done)
   ```bash
   git add .
   git commit -m "Landing page ready for deployment"
   git push origin main
   ```

2. **Import to Vercel**
   - Go to [vercel.com](https://vercel.com)
   - Click "Add New Project"
   - Import your GitHub repository
   - Vercel will auto-detect Vite configuration

3. **Configure Environment Variables** (Optional - for chatbot)
   - In Vercel project settings, go to "Environment Variables"
   - Add: `VITE_GROQ_API_KEY` = `your_groq_api_key`
   - Get your key from: https://console.groq.com/keys

4. **Deploy!**
   - Click "Deploy"
   - Your site will be live at `your-project.vercel.app`

### Build Configuration (Auto-detected)

Vercel automatically detects these settings:

- **Framework Preset**: Vite
- **Build Command**: `npm run build`
- **Output Directory**: `dist`
- **Install Command**: `npm install`
- **Node Version**: 18.x (recommended)

### Custom Domain (Optional)

1. Go to Project Settings → Domains
2. Add your custom domain
3. Follow DNS configuration instructions

### Environment Variables

| Variable | Required | Description |
|----------|----------|-------------|
| `VITE_GROQ_API_KEY` | No | Groq API key for chatbot functionality. Chatbot will be disabled if not provided. |

**Note**: The site works perfectly without the API key - only the chatbot feature requires it.

## Pages

- `/` - Home (Hero, Showcase, Features)
- `/#/docs` - Documentation
- `/#/requirements` - System Requirements  
- `/#/contact` - Contact (LinkedIn + Email)
- `/#/privacy` - Privacy Policy
- `/#/terms` - Terms of Service

## Contact

- Email: chihebnouri14@gmail.com
- LinkedIn: https://www.linkedin.com/in/chiheb-nouri-8200a3193/

## License

All rights reserved © 2026 VisionCraft
