import React from 'react';
import { Link } from 'react-router-dom';

const LinkItem = ({ children, className, href }) => {
  return (
    <li className={className}>
      <Link to={href} className={className}>
        {children}
      </Link>
    </li>
  );
};

export default LinkItem;
