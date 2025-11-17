import React from 'react';
import { Link } from 'react-router-dom';

interface SmallBoxProps {
  title: string | number;
  subtitle: string;
  icon: string;
  bgColor: 'bg-info' | 'bg-success' | 'bg-warning' | 'bg-danger' | 'bg-primary' | 'bg-secondary';
  link?: string;
  linkText?: string;
}

export const SmallBox: React.FC<SmallBoxProps> = ({
  title,
  subtitle,
  icon,
  bgColor,
  link = '#',
  linkText = 'More info'
}) => {
  return (
    <div className={`small-box ${bgColor}`}>
      <div className="inner">
        <h3>{title}</h3>
        <p>{subtitle}</p>
      </div>
      <div className="icon">
        <i className={`bi ${icon}`}></i>
      </div>
      {link !== '#' ? (
        <Link to={link} className="small-box-footer">
          {linkText} <i className="bi bi-arrow-right-circle ms-1"></i>
        </Link>
      ) : (
        <a href={link} className="small-box-footer">
          {linkText} <i className="bi bi-arrow-right-circle ms-1"></i>
        </a>
      )}
    </div>
  );
};
