import Canvas from '../../pages/Canvas';
import Header from '../../Helmet/Helmet';
import { HeaderConstants } from '../../constant/HeaderConstant/HeaderConstant';
import React from 'react';
import styled from '@emotion/styled';

const Board = () => {
  console.log('board', window.location.pathname.split('/').slice(-1)[0]);
  const roomId = window.location.pathname.split('/').slice(-1)[0];

  const Container = styled.div`
    width: 100%;
    padding-top: 20px;
  `;
  return (
    <>
      <Header header={HeaderConstants.BOARD} />;
      <Container>
        <Canvas height={750} width={1062} room={roomId} />
      </Container>
    </>
  );
};

export default Board;
