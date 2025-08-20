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
      {/* Logo Image */}
      <div className={`${height} flex items-center`}>
        <img
          src="https://s3.amazonaws.com/Website_Properties/Resources/graphics-library/Cross_Flame_CLR.png"
          alt="Blessed United Methodist Church Logo"
          className={`${height} w-auto object-contain`}
          onError={(e) => {
            // Fallback to text if image doesn't load
            e.currentTarget.style.display = "none";
            e.currentTarget.nextElementSibling?.classList.remove("hidden");
          }}
        />
        {/* Fallback text logo */}
        <div
          className={`hidden ${height} w-12 bg-methodist-blue rounded-full flex items-center justify-center shadow-lg`}
        >
          <span
            className={`text-white font-bold ${
              size === "sm" ? "text-sm" : size === "md" ? "text-lg" : "text-xl"
            }`}
          >
            B
          </span>
        </div>
      </div>

      {/* Text Content */}
      <div className="flex flex-col">
        <h1
          className={`${text} font-heading font-extrabold tracking-tight ${
            isFooter ? "text-white" : "text-red-600"
          } leading-none`}
        >
          BLESSED
        </h1>
        <p
          className={`${subtext} ${
            isFooter ? "text-gray-300" : "text-warm-gray"
          } font-medium tracking-wide leading-tight`}
        >
          United Methodist Church
        </p>
      </div>
    </div>
  );
}
