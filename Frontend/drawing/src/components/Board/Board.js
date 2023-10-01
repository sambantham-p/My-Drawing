import Canvas from '../../pages/Canvas';
import Header from '../../Helmet/Helmet';
import { HeaderConstants } from '../../constant/HeaderConstant/HeaderConstant';
import React from 'react';
import styled from '@emotion/styled';

const Board = () => {
  const Container = styled.div`
    width: 100%;
    height: 100%;
  `;
  return (
    <>
      <Header header={HeaderConstants.BOARD} />;
      <Container>
        <Canvas height={800} width={300} />
      </Container>
    </>
  );
};

export default Board;
