// components/card.tsx
import React from 'react';

interface CardProps {
  title: string;
  value: string;
  color: string;
}

export const Card: React.FC<CardProps> = ({ title, value, color }) => (
  <div 
    className="rounded-lg border-2 border-black p-5 shadow-[6px_6px_0px_0px_rgba(0,0,0,1)]"
    style={{ backgroundColor: color }}
  >
    <h3 className="text-lg font-semibold">{title}</h3>
    <p className="text-3xl font-bold">{value}</p>
  </div>
);