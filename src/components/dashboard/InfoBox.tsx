import React from 'react';

interface InfoBoxProps {
  icon: string;
  text: string;
  number: string | number;
  bgColor: 'bg-info' | 'bg-success' | 'bg-warning' | 'bg-danger' | 'bg-primary' | 'bg-secondary';
}

export const InfoBox: React.FC<InfoBoxProps> = ({ icon, text, number, bgColor }) => {
  return (
    <div className="info-box">
      <span className={`info-box-icon ${bgColor} elevation-1`}>
        <i className={`bi ${icon}`}></i>
      </span>
      <div className="info-box-content">
        <span className="info-box-text">{text}</span>
        <span className="info-box-number">{number}</span>
      </div>
    </div>
  );
};
