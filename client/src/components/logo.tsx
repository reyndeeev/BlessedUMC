interface LogoProps {
  variant?: "header" | "footer";
  size?: "sm" | "md" | "lg";
  className?: string;
}

export default function Logo({
  variant = "header",
  size = "md",
  className = "",
}: LogoProps) {
  const isFooter = variant === "footer";

  // Size configurations for the logo image
  const sizeConfig = {
    sm: { height: "h-8", text: "text-lg", subtext: "text-xs" },
    md: { height: "h-12", text: "text-xl", subtext: "text-sm" },
    lg: { height: "h-16", text: "text-2xl", subtext: "text-base" },
  };

  const { height, text, subtext } = sizeConfig[size];

  return (
    <div
      className={`flex items-center space-x-3 ${className}`}
      data-testid="logo-blessed-umc"
    >
      {/* Modern Logo Icon - Facebook Style */}
      <div className={`${height} flex items-center`}>
        {/* Primary Church Logo with modern styling */}
        <div
          className={`${height} w-auto flex items-center justify-center bg-gradient-to-br from-methodist-blue to-blue-700 rounded-lg shadow-lg hover:shadow-xl transition-all duration-200 px-2 border border-blue-800/20`}
        >
          <span
            className={`text-white font-black tracking-tight ${
              size === "sm" ? "text-sm" : size === "md" ? "text-xl" : "text-3xl"
            }`}
            style={{ fontFamily: "'Inter', sans-serif" }}
          >
            B
          </span>
        </div>
      </div>

      {/* Modern Text Branding - Facebook Style */}
      <div className="flex flex-col">
        <h1
          className={`${text} font-black tracking-tight ${
            isFooter ? "text-white" : "text-methodist-blue"
          } leading-none hover:text-blue-700 transition-colors duration-200`}
          style={{ fontFamily: "'Inter', sans-serif" }}
        >
          BLESSED
        </h1>
        <p
          className={`${subtext} ${
            isFooter ? "text-gray-300" : "text-gray-600"
          } font-medium tracking-wide leading-tight`}
          style={{ fontFamily: "'Inter', sans-serif" }}
        >
          United Methodist Church
        </p>
      </div>
    </div>
  );
}
