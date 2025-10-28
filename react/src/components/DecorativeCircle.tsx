interface DecorativeCircleProps {
  size?: "sm" | "md" | "lg" | "xl";
  position: {
    top?: string;
    bottom?: string;
    left?: string;
    right?: string;
  };
  opacity?: number;
}

export const DecorativeCircle = ({
  size = "md",
  position,
  opacity = 0.1,
}: DecorativeCircleProps) => {
  const sizeClasses = {
    sm: "w-24 h-24",
    md: "w-48 h-48",
    lg: "w-72 h-72",
    xl: "w-96 h-96",
  };

  return (
    <div
      className={`absolute ${sizeClasses[size]} rounded-full bg-primary pointer-events-none`}
      style={{
        ...position,
        opacity,
        filter: "blur(80px)",
      }}
    />
  );
};
