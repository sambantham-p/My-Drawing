import React, { useEffect, useState } from 'react';

import PopUp from './PopUp'; // Import your updated PopUp component
import copy from 'copy-to-clipboard';
import routeConstant from '../../routes/routeConstant';
import styled from '@emotion/styled';
import { useNavigate } from 'react-router';

// Define your custom styles for the pop-up container
const PopUpContainer = styled.div`
  background-color: #fff;
  color: #333;
  border-radius: 8px;
  box-shadow: 0px 2px 10px rgba(0, 0, 0, 0.2);
  padding: 20px;
  width: 300px;
  text-align: center;
`;

const Title = styled.h2`
  font-size: 24px;
  margin-bottom: 10px;
`;

const Message = styled.p`
  font-size: 16px;
  margin-bottom: 20px;
`;

const ButtonContainer = styled.div`
  display: flex;
  justify-content: center;
  gap: 20px;
`;

const Button = styled.button`
  background-color: #007bff;
  color: #fff;
  padding: 10px 20px;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  font-size: 16px;
  transition: background-color 0.3s ease;

  &:hover {
    background-color: #0056b3;
  }
`;

const RoomPopUP = ({ open, roomId, onClose }) => {
  const navigate = useNavigate();
  const [copyText, setCopyText] = useState('');
  useEffect(() => {
    setCopyText(
      'https://let-us-draw.vercel.app' +
        routeConstant.BOARD.replace(':uuid', roomId)
    );
  }, [open]);
  const handleConfirm = () => {
    setCopyText(copyText);
    copy(copyText);
    alert(`Link copied successfully`);
    navigate(routeConstant.BOARD.replace(':uuid', roomId));
  };

  return (
    <PopUp open={open} onClose={onClose}>
      <PopUpContainer>
        <Title>Share Room Link</Title>
        <Message>Do you want to share the link to the room?</Message>
        <ButtonContainer>
          <Button onClick={handleConfirm}>Yes, Share</Button>
          <Button onClick={onClose}>No, Cancel</Button>
        </ButtonContainer>
      </PopUpContainer>
    </PopUp>
  );
};

export default RoomPopUP;
