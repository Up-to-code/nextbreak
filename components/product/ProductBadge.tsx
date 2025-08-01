// components/ProductBadge.tsx

interface ProductBadgeProps {
    text: string;
    bgColor: string;
    position: 'top-right' | 'bottom-left';
    rotation: 'rotate-3' | '-rotate-3';
  }
  
  export const ProductBadge: React.FC<ProductBadgeProps> = ({ 
    text, 
    bgColor, 
    position, 
    rotation 
  }) => {
    const positionClasses = position === 'top-right' ? 'top-4 right-4' : 'bottom-4 left-4';
    
    return (
      <div className={`absolute ${positionClasses} ${bgColor} text-white px-4 py-2 border-4 border-black font-black text-sm transform ${rotation} shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]`}>
        {text}
      </div>
    );
  };
  
  