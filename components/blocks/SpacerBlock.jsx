export function SpacerBlock({ 
  height = 'medium' // small, medium, large, xlarge
}) {
  const heightClasses = {
    small: 'h-8',
    medium: 'h-16',
    large: 'h-24',
    xlarge: 'h-32'
  };

  return (
    <div className={`w-full ${heightClasses[height]}`} aria-hidden="true" />
  );
}
