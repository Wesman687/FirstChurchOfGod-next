export function DividerBlock({ 
  style = 'solid', // solid, dashed, dotted, double
  color = 'gray', // gray, blue, green, red, purple
  thickness = 'thin', // thin, medium, thick
  width = 'full', // quarter, half, threequarter, full
  alignment = 'center' // left, center, right
}) {
  const styleClasses = {
    solid: 'border-solid',
    dashed: 'border-dashed',
    dotted: 'border-dotted',
    double: 'border-double'
  };

  const colorClasses = {
    gray: 'border-gray-300',
    blue: 'border-blue-400',
    green: 'border-green-400',
    red: 'border-red-400',
    purple: 'border-purple-400'
  };

  const thicknessClasses = {
    thin: 'border-t',
    medium: 'border-t-2',
    thick: 'border-t-4'
  };

  const widthClasses = {
    quarter: 'w-1/4',
    half: 'w-1/2',
    threequarter: 'w-3/4',
    full: 'w-full'
  };

  const alignmentClasses = {
    left: 'mr-auto',
    center: 'mx-auto',
    right: 'ml-auto'
  };

  return (
    <section className="py-4">
      <div className="container mx-auto px-4">
        <hr 
          className={`
            ${styleClasses[style]} 
            ${colorClasses[color]} 
            ${thicknessClasses[thickness]} 
            ${widthClasses[width]} 
            ${alignmentClasses[alignment]}
          `}
          role="separator"
        />
      </div>
    </section>
  );
}
