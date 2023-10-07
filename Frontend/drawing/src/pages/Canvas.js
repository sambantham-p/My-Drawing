import React, { useEffect, useRef } from 'react';

import io from 'socket.io-client';
import styled from '@emotion/styled';

const CanvasStyle = styled.div`
  border: 7px solid black;
`;

const Canvas = ({ height, width }) => {
  const socket =
    window.location.pathname === '/container/board'
      ? io('http://localhost:5000/container/board')
      : io('http://localhost:5000');
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
      socket.emit('canvas-draw', canvas.toDataURL('image/png'));
    };

    const onMouseDown = (e) => {
      isDrawingRef.current = true;
      const startPoint = computePointInCanvas(e.clientX, e.clientY);
      prevPointRef.current = startPoint;
    };

    const onMouseMove = (e) => {
      if (!isDrawingRef.current) return;
      const endPoint = computePointInCanvas(e.clientX, e.clientY);
      drawLine(prevPointRef.current, endPoint, context, '#000000', 5);
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
      var img = new Image();
      img.onload = function () {
        context.drawImage(img, 0, 0);
      };
      img.src = data;
    });

    return () => {
      canvas.removeEventListener('mousedown', onMouseDown);
      canvas.removeEventListener('mousemove', onMouseMove);
      canvas.removeEventListener('mouseup', onMouseUp);
    };
  }, [socket]);
  const setToErase = () => {
    const canvas = canvasRef.current;
    const context = canvas?.getContext('2d');
    context.globalCompositeOperation = 'destination-out';
    if (isDrawingRef === false) {
      console.log('IMG', canvas.toDataURL('image/png'));
      socket.emit('canvas-erase', canvas.toDataURL('image/png'));
    }
  };

  const setToDraw = () => {
    const canvas = canvasRef.current;
    const context = canvas?.getContext('2d');
    context.globalCompositeOperation = 'source-over';
  };

  const eraseAll = () => {
    const canvas = canvasRef.current;
    const context = canvas?.getContext('2d');
    context.clearRect(0, 0, canvas.width, canvas.height);
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
      <div>
        <button onClick={setToErase}>ERASE</button>
        <button onClick={setToDraw}>DRAW</button>
        <button onClick={eraseAll}>ERASE ALL</button>
      </div>
    </>
  );
};

export default Canvas;
