import React from 'react';
import { getLogoSvg } from '../constants';

interface Props {
  variant?: 'original' | 'white';
  className?: string;
}

const TanPhatLogo: React.FC<Props> = ({ variant = 'original', className = "w-64" }) => {
  const svgString = getLogoSvg(variant as 'original' | 'white');

  return (
    <div 
      className={className}
      dangerouslySetInnerHTML={{ __html: svgString }} 
    />
  );
};

export default TanPhatLogo;