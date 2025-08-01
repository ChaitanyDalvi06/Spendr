# Pricing Component App

A React application featuring a beautiful, animated pricing component with monthly/yearly billing toggle and confetti effects.

## Features

- **React 18** with JSX (no TypeScript)
- **Tailwind CSS** for styling
- **Vite** for fast development and building
- **Framer Motion** for smooth animations
- **Radix UI** components for accessibility
- **Canvas Confetti** for celebration effects
- **Number Flow** for animated price transitions

## Getting Started

1. Install dependencies:
```bash
npm install
```

2. Start the development server:
```bash
npm run dev
```

3. Open your browser and navigate to `http://localhost:5173`

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

## Component Usage

The `Pricing` component can be used with custom plans:

```jsx
import { Pricing } from './components/Pricing';

const customPlans = [
  {
    name: "Basic",
    price: "9",
    yearlyPrice: "7",
    period: "per month",
    features: ["Feature 1", "Feature 2"],
    description: "Perfect for beginners",
    buttonText: "Get Started",
    href: "/signup",
    isPopular: false,
  },
  // ... more plans
];

function App() {
  return (
    <Pricing 
      plans={customPlans}
      title="Choose Your Plan"
      description="Select the perfect plan for your needs"
    />
  );
}
```

## Dependencies

- framer-motion
- lucide-react
- canvas-confetti
- @number-flow/react
- @radix-ui/react-slot
- @radix-ui/react-label
- @radix-ui/react-switch
- class-variance-authority
- clsx
- tailwind-merge
