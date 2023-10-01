import Header from '../Helmet/Helmet';
import { HeaderConstants } from '../constant/HeaderConstant/HeaderConstant';
import React from 'react';
import styled from '@emotion/styled';

const ErrorPage = () => {
  const Container = styled.div`
    display: flex;
    justify-content: center;
    align-items: center;
    width: 100%;
    height: 100vh;
    font-size: 40px;
    font-family: cursive;
    font-weight: bold;
  `;
  return (
    <>
      <Header header={HeaderConstants.ERROR} />
      <Container>404 ERROR PAGE NOT FOUND</Container>
    </>
  );
};

export default ErrorPage;
