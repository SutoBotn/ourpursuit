
import React, { useEffect, useRef } from 'react';

function LandingPage() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');

    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    resizeCanvas();

    window.addEventListener('resize', resizeCanvas);

    let balls = [];

    const addBall = () => {
      const radius = Math.random() * 50 + 20; // Adjusted ball size
      const colors = ['#BD632F', '#D8973C', '#A3B18A'];
      const color = colors[Math.floor(Math.random() * colors.length)];

      balls.push({
        x: Math.random() * canvas.width,
        y: 0 - radius,
        dx: Math.random() * 4 - 2,
        dy: Math.random() * 4 + 2, // Balls come from the top with initial speed
        radius,
        color,
      });
    };

    const update = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      balls.forEach((ball) => {
        ball.x += ball.dx;
        ball.y += ball.dy;

        if (ball.x + ball.radius > canvas.width || ball.x - ball.radius < 0) {
          ball.dx = -ball.dx;
        }

        if (ball.y - ball.radius > canvas.height) {
          // Reset ball position when it goes below the canvas height
          ball.x = Math.random() * canvas.width;
          ball.y = 0 - ball.radius;
        }

        if (ball.y + ball.radius < 0) {
          // Bounce from top
          ball.dy = Math.abs(ball.dy);
        }

        ctx.beginPath();
        ctx.arc(ball.x, ball.y, ball.radius, 0, Math.PI * 2);
        ctx.fillStyle = ball.color;
        ctx.fill();
        ctx.closePath();
      });

      requestAnimationFrame(update);
    };

    setInterval(addBall, 800); // Add a new ball every 800ms

    requestAnimationFrame(update);

    return () => {
      window.removeEventListener('resize', resizeCanvas);
    };
  }, []);

  return (
    <div className="flex items-center justify-center h-screen relative">
      <div className="text-center space-y-0 z-10">
        <p className="font-Better text-brown text-9xl md:text-10xl">
          Our Pursuit
        </p>
        <h3 className="text-xl md:text-2xl">SAFE, WELCOMED, LOVED</h3>
        <a href="/home" className="inline-block mt-12 text-brown hover:text-orange transition duration-300">
          Go to Home Page &rarr;
        </a>
      </div>
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full pointer-events-none"
      />
    </div>
  );
}

export default LandingPage;

// BOUNCING BALLS

// import React, { useEffect, useRef } from 'react';

// function LandingPage() {
//   const canvasRef = useRef(null);

//   useEffect(() => {
//     const canvas = canvasRef.current;
//     const ctx = canvas.getContext('2d');

//     const resizeCanvas = () => {
//       canvas.width = window.innerWidth;
//       canvas.height = window.innerHeight;
//     };

//     resizeCanvas();

//     window.addEventListener('resize', resizeCanvas);

//     let balls = [];

//     const addBall = () => {
//       const radius = Math.random() * 30 + 10;
//       const colors = ['#BD632F', '#D8973C', '#A3B18A']; 
//       const color = colors[Math.floor(Math.random() * colors.length)];

//       balls.push({
//         x: Math.random() * canvas.width,
//         y: 0 - radius,
//         dx: Math.random() * 4 - 2,
//         dy: Math.random() * 2 + 1, // Balls come from the top with initial speed
//         radius,
//         color,
//       });
//     };

//     const update = () => {
//       ctx.clearRect(0, 0, canvas.width, canvas.height);

//       balls.forEach((ball) => {
//         ball.x += ball.dx;
//         ball.y += ball.dy;

//         if (ball.x + ball.radius > canvas.width || ball.x - ball.radius < 0) {
//           ball.dx = -ball.dx;
//         }

//         if (ball.y + ball.radius > canvas.height) {
//           ball.dy = -ball.dy * 0.95; // Bouncing effect with reduced bounce intensity
//         } else {
//           ball.dy += 0.1; // Gravity effect
//         }

//         ctx.beginPath();
//         ctx.arc(ball.x, ball.y, ball.radius, 0, Math.PI * 2);
//         ctx.fillStyle = ball.color;
//         ctx.fill();
//         ctx.closePath();
//       });

//       requestAnimationFrame(update);
//     };

//     setInterval(addBall, 800); // Add a new ball every 800ms

//     requestAnimationFrame(update);

//     return () => {
//       window.removeEventListener('resize', resizeCanvas);
//     };
//   }, []);

//   return (
//     <div className="flex items-center justify-center h-screen relative">
//       <div className="text-center space-y-0 z-10">
//         <p className="font-Better text-brown text-9xl md:text-10xl">
//           Our Pursuit
//         </p>
//         <h3 className="text-xl md:text-2xl">SAFE, WELCOMED, LOVED</h3>
//         <a href="/home" className="inline-block mt-12 text-brown hover:text-orange transition duration-300">
//           Go to Home Page &rarr;
//         </a>
//       </div>
//       <canvas
//         ref={canvasRef}
//         className="absolute inset-0 w-full h-full pointer-events-none"
//       />
//     </div>
//   );
// }

// export default LandingPage;
