import React, { useEffect, useRef, useState } from 'react';

import io from 'socket.io-client';
import { saveAs } from 'file-saver';
import styled from '@emotion/styled';

const CanvasStyle = styled.div`
  border: 7px solid black;
`;
const Button = styled.button`
  width: 15%;
  padding: 10px 20px;
  color: #fff;
  border: none;
  border-radius: 5px;
  margin-right: 10px;
  cursor: pointer;
  transition: background-color 0.3s ease;

  &:hover {
    background-color: #1e87e5;
  }
`;

const ButtonContainer = styled.div`
  display: flex;
  gap: 30px;
  margin: 20px 20px;
`;

const Canvas = ({ height, width, room }) => {
  const socket = io('https://lets-us-draw-backend.onrender.com/', {
    transports: ['websocket'],
  });

  socket.emit('join-room', room);
  const canvasRef = useRef(null);
  const isDrawingRef = useRef(false);
  const prevPointRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const context = canvas.getContext('2d');
    canvas.width = window.innerWidth;
    canvas.height = height;

    const computePointInCanvas = (clientX, clientY) => {
      const boundingRect = canvas.getBoundingClientRect();
      const scaleX = canvas.width / boundingRect.width;
      const scaleY = canvas.height / boundingRect.height;

      return {
        x: (clientX - boundingRect.left) * scaleX,
        y: (clientY - boundingRect.top) * scaleY,
      };
    };

    const drawLine = (start, end, ctx, color, lineWidth) => {
      ctx.beginPath();
      ctx.lineWidth = lineWidth;
      ctx.strokeStyle = color;
      ctx.lineCap = 'round';
      ctx.moveTo(start.x, start.y);
      ctx.lineTo(end.x, end.y);
      ctx.stroke();
    };

    const onMouseDown = (e) => {
      isDrawingRef.current = true;
      const startPoint = computePointInCanvas(e.clientX, e.clientY);
      prevPointRef.current = startPoint;
    };

    const onMouseMove = (e) => {
      if (!isDrawingRef.current) return;
      const endPoint = computePointInCanvas(e.clientX, e.clientY);

      if (context.globalCompositeOperation === 'destination-out') {
        context.clearRect(endPoint.x - 5, endPoint.y - 5, 15, 15);
        socket.emit('canvas-erase', {
          x: endPoint.x,
          y: endPoint.y,
          room,
        });
      } else {
        drawLine(prevPointRef.current, endPoint, context, '#000000', 7);
        socket.emit('canvas-draw', {
          start: prevPointRef.current,
          end: endPoint,
          room,
        });
      }

      prevPointRef.current = endPoint;
    };

    const onMouseUp = () => {
      isDrawingRef.current = false;
      prevPointRef.current = null;
    };

    canvas.addEventListener('mousedown', onMouseDown);
    canvas.addEventListener('mousemove', onMouseMove);
    canvas.addEventListener('mouseup', onMouseUp);
    socket.on('canvas-draw', (data) => {
      drawLine(data.start, data.end, context, '#000000', 7);
    });

    socket.on('canvas-erase', (data) => {
      context.clearRect(data.x - 5, data.y - 5, 15, 15);
    });

    return () => {
      canvas.removeEventListener('mousedown', onMouseDown);
      canvas.removeEventListener('mousemove', onMouseMove);
      canvas.removeEventListener('mouseup', onMouseUp);
    };
  }, [socket]);

  const setToDraw = () => {
    const canvas = canvasRef.current;
    const context = canvas.getContext('2d');
    context.globalCompositeOperation = 'source-over';
  };

  const setToErase = () => {
    const canvas = canvasRef.current;
    const context = canvas.getContext('2d');
    context.globalCompositeOperation = 'destination-out';
  };

  const eraseAll = () => {
    const canvas = canvasRef.current;
    const context = canvas.getContext('2d');
    context.clearRect(0, 0, canvas.width, canvas.height);
  };

  const saveAsImage = () => {
    const canvas = canvasRef.current;

    canvas.toBlob((blob) => {
      saveAs(blob, 'my-drawing.png');
    }, 'image/png');
  };

  return (
    <>
      <CanvasStyle>
        <canvas
          ref={canvasRef}
          height={height}
          width={width}
          id='board'
        ></canvas>
      </CanvasStyle>
      <ButtonContainer>
        <Button onClick={setToDraw} style={{ backgroundColor: 'green' }}>
          DRAW
        </Button>
        <Button onClick={setToErase} style={{ backgroundColor: 'red' }}>
          ERASE
        </Button>

        <Button onClick={eraseAll} style={{ backgroundColor: 'purple' }}>
          ERASE ALL
        </Button>
        <Button onClick={saveAsImage} style={{ backgroundColor: 'orange' }}>
          SAVE AS
        </Button>
      </ButtonContainer>
    </>
  );
};

export default Canvas;
