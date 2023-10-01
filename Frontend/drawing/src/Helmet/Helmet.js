import { Helmet } from 'react-helmet';
import React from 'react';

const Header = ({ header }) => {
  return (
    <>
      <Helmet>
        <title>{header}</title>
      </Helmet>
    </>
  );
};
export default Header;
