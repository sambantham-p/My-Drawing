import React, { useEffect, useState } from 'react';

import PopUp from '../PopUp/PopUp';
import RoomPopUP from '../PopUp/RoomPopUp';
import routeConstant from '../../routes/routeConstant';
import styled from '@emotion/styled';
import { useNavigate } from 'react-router-dom';
import { v4 } from 'uuid';

const Home = () => {
  const room = {};
  room.id = v4();
  const Container = styled.div`
    width: 100%;
    height: 100vh;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    background: linear-gradient(to bottom, #3498db, #1abc9c);
    color: #fff;
    text-align: center;
    padding: 20px;
    box-shadow: 0px 0px 20px rgba(0, 0, 0, 0.2);
  `;

  const Title = styled.h1`
    font-family: 'fantasy';
    font-size: 50px;
    font-weight: 600;
    color: #fff;
    margin-bottom: 20px;
    text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.3);
  `;

  const Subtitle = styled.div`
    font-family: 'Arial', sans-serif;
    font-size: 28px;
    color: #fff;
    margin-top: 20px;
    text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.2);
  `;

  const RadioContainer = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    margin-top: 30px;
  `;

  const RadioOption = styled.label`
    display: flex;
    align-items: center;
    margin: 15px 0;
    cursor: pointer;
    font-size: 24px;
  `;

  const RadioInput = styled.input`
    margin-right: 10px;
    cursor: pointer;
  `;

  const Button = styled.button`
    background-color: #f39c12;
    color: #fff;
    font-size: 24px;
    font-weight: 600;
    padding: 10px 20px;
    border: none;
    border-radius: 5px;
    cursor: pointer;
    transition: background-color 0.3s ease;
    &:hover {
      background-color: #e74c3c;
    }
  `;

  const [selectedOption, setSelectedOption] = useState('solo');
  const [isRoomPopUpOpen, setIsRoomPopUpOpen] = useState(false);
  useEffect(() => {
    console.log('ROOM POP UP', isRoomPopUpOpen);
  }, [isRoomPopUpOpen]);
  const navigate = useNavigate();

  const handleOptionChange = (e) => {
    setSelectedOption(e.target.value);
  };
  const handleClosePopUp = () => {
    setIsRoomPopUpOpen(false);
  };
  return (
    <Container>
      <Title>WELCOME TO MY DRAWING</Title>
      <Subtitle>Choose an option:</Subtitle>
      <RadioContainer
        style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}
      >
        <RadioOption style={{ display: 'flex', alignItems: 'center' }}>
          <RadioInput
            type='radio'
            name='drawingOption'
            value='solo'
            checked={selectedOption === 'solo'}
            onChange={handleOptionChange}
          />
          <label style={{ marginLeft: '5px' }}>SOLO DRAWING</label>
        </RadioOption>
        <RadioOption style={{ display: 'flex', alignItems: 'center' }}>
          <RadioInput
            type='radio'
            name='drawingOption'
            value='share'
            checked={selectedOption === 'share'}
            onChange={handleOptionChange}
          />
          <label style={{ marginLeft: '5px' }}>SHARE DRAWING</label>
        </RadioOption>
      </RadioContainer>
      <Button
        onClick={() => {
          if (selectedOption === 'solo') {
            navigate(routeConstant.CONTAINER);
            setIsRoomPopUpOpen(false);
          } else if (selectedOption === 'share') {
            setIsRoomPopUpOpen(true);
          }
        }}
      >
        Get Started
      </Button>

      {isRoomPopUpOpen && (
        <RoomPopUP
          open={isRoomPopUpOpen}
          onClose={handleClosePopUp}
          roomId={room.id}
        />
      )}
    </Container>
  );
};

export default Home;
