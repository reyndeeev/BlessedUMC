import { Cross, Heart } from "lucide-react";

interface LogoProps {
  variant?: 'header' | 'footer';
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export default function Logo({ variant = 'header', size = 'md', className = '' }: LogoProps) {
  const isFooter = variant === 'footer';
  
  // Size configurations
  const sizeConfig = {
    sm: { container: 'w-8 h-8', icon: 'w-4 h-4', text: 'text-lg', subtext: 'text-xs' },
    md: { container: 'w-12 h-12', icon: 'w-6 h-6', text: 'text-xl', subtext: 'text-sm' },
    lg: { container: 'w-16 h-16', icon: 'w-8 h-8', text: 'text-2xl', subtext: 'text-base' }
  };
  
  const { container, icon, text, subtext } = sizeConfig[size];

  return (
    <div className={`flex items-center space-x-3 ${className}`} data-testid="logo-blessed-umc">
      {/* Logo Icon */}
      <div className={`${container} relative`}>
        {/* Background gradient circle */}
        <div className={`${container} rounded-full ${
          isFooter 
            ? 'bg-gradient-to-br from-white to-gray-100' 
            : 'bg-gradient-to-br from-methodist-blue to-blue-700'
        } shadow-lg flex items-center justify-center`}>
          {/* Cross icon */}
          <Cross className={`${icon} ${
            isFooter ? 'text-methodist-blue' : 'text-white'
          } drop-shadow-sm`} />
        </div>
        
        {/* Small accent heart - representing love and community */}
        <div className={`absolute -bottom-1 -right-1 ${
          size === 'sm' ? 'w-4 h-4' : size === 'md' ? 'w-5 h-5' : 'w-6 h-6'
        } rounded-full ${
          isFooter ? 'bg-warm-gold' : 'bg-red-500'
        } flex items-center justify-center shadow-md`}>
          <Heart className={`${
            size === 'sm' ? 'w-2 h-2' : size === 'md' ? 'w-3 h-3' : 'w-3.5 h-3.5'
          } ${isFooter ? 'text-white' : 'text-white'} fill-current`} />
        </div>
      </div>

      {/* Text Content */}
      <div className="flex flex-col">
        <h1 className={`${text} font-heading font-extrabold tracking-tight ${
          isFooter ? 'text-white' : 'text-red-600'
        } leading-none`}>
          BLESSED
        </h1>
        <p className={`${subtext} ${
          isFooter ? 'text-gray-300' : 'text-warm-gray'
        } font-medium tracking-wide leading-tight`}>
          United Methodist Church
        </p>
      </div>
    </div>
  );
}