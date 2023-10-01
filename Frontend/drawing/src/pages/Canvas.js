import React, { useEffect, useRef } from 'react';

import io from 'socket.io-client';
import styled from '@emotion/styled';

const CanvasStyle = styled.div`
  border: 7px solid black;
  width: 100%;
  height: 100%;
`;

const Canvas = ({ width, height }) => {
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
    canvas.height = window.innerHeight;

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

      // Emit canvas data to the server
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

    // Attach event listeners to the canvas
    canvas.addEventListener('mousedown', onMouseDown);
    canvas.addEventListener('mousemove', onMouseMove);
    canvas.addEventListener('mouseup', onMouseUp);

    // Listen for incoming canvas data from the server
    socket.on('canvas-draw', (data) => {
      var img = new Image();
      img.onload = function () {
        context.drawImage(img, 0, 0);
      };
      img.src = data;
    });

    return () => {
      // Remove event listeners when the component unmounts
      canvas.removeEventListener('mousedown', onMouseDown);
      canvas.removeEventListener('mousemove', onMouseMove);
      canvas.removeEventListener('mouseup', onMouseUp);
    };
  }, [socket]);

  return (
    <CanvasStyle>
      <canvas ref={canvasRef} height={height} width={width} id='board'></canvas>
    </CanvasStyle>
  );
};

export default Canvas;
