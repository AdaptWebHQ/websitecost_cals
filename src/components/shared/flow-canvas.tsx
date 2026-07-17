'use client';

import { useEffect, useRef } from 'react';

export default function FlowCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    let W = 0, H = 0, DPR = 1, animId: number;

    function resize() {
      if (!canvas) return;
      DPR = Math.min(window.devicePixelRatio || 1, 2);
      W = canvas.parentElement?.clientWidth || window.innerWidth;
      H = canvas.parentElement?.clientHeight || window.innerHeight;
      canvas.width = W * DPR;
      canvas.height = H * DPR;
      canvas.style.width = W + 'px';
      canvas.style.height = H + 'px';
      ctx?.setTransform(DPR, 0, 0, DPR, 0, 0);
    }
    resize();
    window.addEventListener('resize', resize);

    const palette: [string, string][] = [
      ['rgba(255,45,120,0.85)', 'rgba(255,110,190,0.0)'],
      ['rgba(140,60,255,0.85)', 'rgba(90,40,220,0.0)'],
      ['rgba(70,150,255,0.85)', 'rgba(60,200,255,0.0)'],
      ['rgba(255,90,60,0.75)', 'rgba(255,150,60,0.0)'],
    ];
    const ribbons = Array.from({ length: 4 }, (_, i) => ({
      seed: Math.random() * 1000,
      speed: 0.15 + Math.random() * 0.12,
      amp: 60 + Math.random() * 90,
      freq: 0.9 + Math.random() * 0.8,
      yBase: 0.15 + (i / 4) * 0.75,
      thickness: 26 + Math.random() * 30,
      colorPair: palette[i % palette.length],
      phase: Math.random() * Math.PI * 2,
    }));

    let t = 0;
    function draw() {
      t++;
      if (!ctx) return;
      ctx.clearRect(0, 0, W, H);
      ctx.fillStyle = '#050203';
      ctx.fillRect(0, 0, W, H);
      ribbons.forEach((r) => {
        const pts: [number, number][] = [];
        for (let s = 0; s <= 40; s++) {
          const x = (s / 40) * W * 1.3 - W * 0.15;
          const y = r.yBase * H + Math.sin((s / 40) * Math.PI * r.freq + t * 0.002 * r.speed * 10 + r.phase) * r.amp + Math.sin(t * 0.0015 + r.seed) * 20;
          pts.push([x, y]);
        }
        const grad = ctx.createLinearGradient(0, 0, W, 0);
        grad.addColorStop(0, r.colorPair[1]);
        grad.addColorStop(0.5, r.colorPair[0]);
        grad.addColorStop(1, r.colorPair[1]);
        ctx.save();
        ctx.globalCompositeOperation = 'lighter';
        ctx.beginPath();
        ctx.moveTo(pts[0][0], pts[0][1]);
        for (let i = 1; i < pts.length - 1; i++) {
          ctx.quadraticCurveTo(pts[i][0], pts[i][1], (pts[i][0] + pts[i + 1][0]) / 2, (pts[i][1] + pts[i + 1][1]) / 2);
        }
        ctx.strokeStyle = grad;
        ctx.lineWidth = r.thickness;
        ctx.lineCap = 'round';
        ctx.filter = 'blur(18px)';
        ctx.stroke();

        ctx.lineWidth = r.thickness * 0.35;
        ctx.filter = 'blur(4px)';
        ctx.globalAlpha = 0.9;
        ctx.stroke();
        ctx.restore();
      });
      animId = requestAnimationFrame(draw);
    }
    draw();
    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('resize', resize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', display: 'block' }}
    />
  );
}
