import React from 'react';
import styled from '@emotion/styled';

const PopupOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100vh;
  background-color: rgba(0, 0, 0, 0.2);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 999;
`;

const PopupContainer = styled.div`
  position: relative;
  padding: 10px;
  width: fit-content;
  background-color: aliceblue;
  border-radius: 8px;
  box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.2);
`;

const CloseButton = styled.button`
  position: absolute;
  top: 16px;
  right: 16px;
  background: none;
  border: none;
  cursor: pointer;
  font-size: 18px;
  z-index: 1000; /* Ensure it appears above other content */
`;

const PopUp = ({ open, onClose, children }) => {
  if (!open) {
    return null;
  }

  return (
    <PopupOverlay>
      <PopupContainer>
        <CloseButton>
          <button onClick={onClose}>Close</button>
        </CloseButton>
        {children}
      </PopupContainer>
    </PopupOverlay>
  );
};

export default PopUp;
