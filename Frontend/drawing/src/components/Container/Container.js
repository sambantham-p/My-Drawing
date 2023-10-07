import Board from '../Board/Board';
import Header from '../../Helmet/Helmet';
import { HeaderConstants } from '../../constant/HeaderConstant/HeaderConstant';
import React from 'react';
import styled from '@emotion/styled';

const Container = () => {
  const WhiteBoard = styled.div`
    width: 100%;
    background: white;
  `;
  return (
    <>
      <Header header={HeaderConstants.CONTAINER} />
      <WhiteBoard>
        <Board />
      </WhiteBoard>
    </>
  );
};

export default Container;
