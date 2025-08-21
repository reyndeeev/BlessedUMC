# Blessed United Methodist Church Website

A modern, responsive website for Blessed United Methodist Church featuring worship information, ministry details, events, contact forms, and a dedicated Youth Fellowship (UMYF) section.

## Features

- **Responsive Design**: Mobile-first approach with beautiful layouts on all devices
- **Modern UI**: Built with React, TypeScript, and Tailwind CSS
- **Youth Fellowship Section**: Dedicated UMYF page with activities and events
- **Dark Transparent Styling**: Modern glass-effect components with backdrop blur
- **Social Media Integration**: Direct links to Facebook pages
- **Service Information**: Worship times, ministry details, and contact information

## Technology Stack

### Frontend
- **React 18** with TypeScript
- **Tailwind CSS** for styling
- **shadcn/ui** component library
- **Wouter** for client-side routing
- **TanStack Query** for state management
- **React Hook Form** with Zod validation
- **Lucide React** for icons

### Backend
- **Express.js** with TypeScript
- **Drizzle ORM** for database operations
- **PostgreSQL** database support
- **RESTful API** architecture

### Build Tools
- **Vite** for fast development and building
- **ESBuild** for server bundling
- **PostCSS** with Autoprefixer

## Getting Started

### Prerequisites
- Node.js 18+ 
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone https://github.com/yourusername/blessed-umc-website.git
cd blessed-umc-website
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
```bash
cp .env.example .env
# Edit .env with your database credentials and other settings
```

4. Start the development server:
```bash
npm run dev
```

The application will be available at `http://localhost:5000`

## Project Structure

```
├── client/                 # Frontend React application
│   ├── src/
│   │   ├── components/     # Reusable UI components
│   │   ├── pages/          # Page components
│   │   ├── hooks/          # Custom React hooks
│   │   └── lib/            # Utility functions
├── server/                 # Backend Express server
├── shared/                 # Shared TypeScript schemas
└── public/                 # Static assets
```

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run type-check` - Run TypeScript type checking

## Deployment

### Replit Deployment
The project is configured for easy deployment on Replit:
1. Click the "Deploy" button in your Replit workspace
2. Choose your deployment settings
3. Your site will be live at `yourproject.replit.app`

### Other Platforms
The project can be deployed to:
- Vercel
- Netlify
- Railway
- Heroku

## Environment Variables

Create a `.env` file in the root directory:

```env
DATABASE_URL=your_postgresql_url
VITE_API_URL=your_api_url
```

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Contact

**Blessed United Methodist Church**
- Website: [Your Website URL]
- Facebook: [Your Facebook Page]
- Email: [Your Contact Email]

**Youth Fellowship (UMYF)**
- Youth Pastor: Rev. John B. Manalo
- Youth Coordinator: Anika Loreen Lagarto
- Email: blessedumyf01@gmail.com
- Facebook: Blessed UMYF

## Acknowledgments

- Built with love for the Blessed UMC community
- Special thanks to all contributors and church members
- Powered by modern web technologies for optimal performance