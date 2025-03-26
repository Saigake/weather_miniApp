import { useEffect, useState, useRef } from 'react';
import { useSelector } from 'react-redux';

export default function MovingCircles() {
  const containerRef = useRef(null);
  const [circle1Pos, setCircle1Pos] = useState({ x: 0, y: 0 });
  const [circle2Pos, setCircle2Pos] = useState({ x: 0, y: 0 });
  const { color1, color2 } = useSelector((state) => state.weather);

  const getRandomPosition = (max, offset) => {
    return Math.random() * max - offset;
  };

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const { width, height } = container.getBoundingClientRect();

    let correctionX1 = 0.25;
    let correctionX2 = 0.1;
    if (width < 500) {
      correctionX1 = -0.1;
      correctionX2 = 0;
    }

    const initialX1 = width * correctionX1;
    const initialY1 = height * 0;
    const initialX2 = width * correctionX2;
    const initialY2 = height * 0.1;

    setCircle1Pos({ x: initialX1, y: initialY1 });
    setCircle2Pos({ x: initialX2, y: initialY2 });

    const moveCircles = () => {
      const maxMovement = 200;
      const newX1 = initialX1 + getRandomPosition(maxMovement, maxMovement / 2);
      const newY1 = initialY1 + getRandomPosition(maxMovement, maxMovement / 2);
      const newX2 = initialX2 + getRandomPosition(maxMovement, maxMovement / 2);
      const newY2 = initialY2 + getRandomPosition(maxMovement, maxMovement / 2);

      setCircle1Pos({ x: newX1, y: newY1 });
      setCircle2Pos({ x: newX2, y: newY2 });
    };

    const interval = setInterval(moveCircles, 5000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div ref={containerRef} className="absolute inset-0 w-full h-full z-[-1] ">
      <div
        className="absolute w-[500px] h-[500px] rounded-full transition-transform duration-5000 ease-in-out"
        style={{
          background: `radial-gradient(circle, ${color1} 0%, transparent 65%)`,
          transform: `translate(${circle1Pos.x}px, ${circle1Pos.y}px)`,
          zIndex: 0,
        }}
      />
      <div
        className="absolute w-[300px] h-[300px] rounded-full transition-transform duration-5000 ease-in-out"
        style={{
          background: `radial-gradient(circle, ${color2} 0%, transparent 70%)`,
          transform: `translate(${circle2Pos.x}px, ${circle2Pos.y}px)`,
          zIndex: 0,
        }}
      />
    </div>
  );
}
