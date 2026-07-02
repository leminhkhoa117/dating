'use client';
import { useEffect, useRef } from 'react';

const COLORS = [
  '#c89ef5', '#9b59d0', '#f0a0c8', '#ffe4a0',
  '#a0e4f0', '#f5c8e0', '#d4a0f5', '#f0d4ff',
  '#ffb3de', '#b3d9ff', '#c8f5a0', '#ffd4a0',
];

function randomBetween(a, b) {
  return a + Math.random() * (b - a);
}

class Particle {
  constructor(canvas) {
    this.canvas = canvas;
    this.reset();
  }

  reset() {
    const cx = this.canvas.width / 2;
    const cy = this.canvas.height * 0.25;
    // Wider spread origin
    this.x = cx + randomBetween(-150, 150);
    this.y = cy + randomBetween(-20, 20);
    this.color = COLORS[Math.floor(Math.random() * COLORS.length)];
    this.size = randomBetween(6, 13);
    // Slower speeds
    this.speedX = randomBetween(-2.8, 2.8);
    this.speedY = randomBetween(-5.5, -1.2);
    this.gravity = 0.10;       // Less gravity = floats much longer
    this.rotation = randomBetween(0, Math.PI * 2);
    this.rotationSpeed = randomBetween(-0.06, 0.06);
    this.opacity = 1;
    this.fadeRate = 0.005;    // Much slower fade
    this.shape = Math.random() > 0.45 ? 'rect' : 'circle';
    this.alive = true;
  }

  update() {
    this.x += this.speedX;
    this.y += this.speedY;
    this.speedY += this.gravity;
    this.rotation += this.rotationSpeed;
    this.opacity -= this.fadeRate;
    if (this.opacity <= 0 || this.y > this.canvas.height + 20) {
      this.alive = false;
    }
  }

  draw(ctx) {
    ctx.save();
    ctx.globalAlpha = Math.max(0, this.opacity);
    ctx.translate(this.x, this.y);
    ctx.rotate(this.rotation);
    ctx.fillStyle = this.color;
    if (this.shape === 'rect') {
      ctx.fillRect(-this.size / 2, -this.size / 3, this.size, this.size / 1.8);
    } else {
      ctx.beginPath();
      ctx.arc(0, 0, this.size / 2.2, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.restore();
  }
}

export default function Confetti({ trigger }) {
  const canvasRef = useRef(null);
  const particlesRef = useRef([]);
  const animFrameRef = useRef(null);
  const burstIntervalRef = useRef(null);

  const burst = (canvas, count = 70) => {
    for (let i = 0; i < count; i++) {
      particlesRef.current.push(new Particle(canvas));
    }
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener('resize', resize);

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      particlesRef.current = particlesRef.current.filter(p => p.alive);
      particlesRef.current.forEach(p => {
        p.update();
        p.draw(ctx);
      });
      animFrameRef.current = requestAnimationFrame(animate);
    };
    animate();

    // First burst
    burst(canvas, 70);

    // Burst every 5 seconds
    burstIntervalRef.current = setInterval(() => {
      burst(canvas, 70);
    }, 5000);

    return () => {
      window.removeEventListener('resize', resize);
      cancelAnimationFrame(animFrameRef.current);
      clearInterval(burstIntervalRef.current);
    };
  }, []);

  // Extra burst on trigger (YES click)
  useEffect(() => {
    const canvas = canvasRef.current;
    if (canvas && trigger > 0) {
      for (let i = 0; i < 4; i++) {
        setTimeout(() => burst(canvas, 60), i * 250);
      }
    }
  }, [trigger]);

  return <canvas ref={canvasRef} id="confetti-canvas" />;
}
