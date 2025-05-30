/* eslint-disable */
import { useEffect, useRef } from 'react';
import { usePublish } from './PublishContext';

export const VolumeIndicator = () => {
  const { volume } = usePublish();
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Update canvas when volume changes
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Set circle properties
    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;
    const maxRadius = Math.min(centerX, centerY) - 2;
    const minRadius = maxRadius * 0.4; // 最小半径为最大半径的40%

    // Calculate current radius based on volume (min-max scaling)
    const radius = minRadius + (volume / 100) * (maxRadius - minRadius);

    // Draw outer circle (max volume indicator)
    ctx.beginPath();
    ctx.arc(centerX, centerY, maxRadius, 0, 2 * Math.PI);
    ctx.strokeStyle = '#e6e6e6';
    ctx.lineWidth = 1;
    ctx.stroke();

    // Draw volume circle with gradient
    const gradient = ctx.createRadialGradient(
      centerX,
      centerY,
      minRadius,
      centerX,
      centerY,
      maxRadius
    );
    gradient.addColorStop(0, 'rgba(64, 169, 255, 0.8)');
    gradient.addColorStop(1, 'rgba(64, 169, 255, 0.1)');

    ctx.beginPath();
    ctx.arc(centerX, centerY, radius, 0, 2 * Math.PI);
    ctx.fillStyle = gradient;
    ctx.fill();

    // Draw inner circle (base)
    ctx.beginPath();
    ctx.arc(centerX, centerY, minRadius, 0, 2 * Math.PI);
    ctx.fillStyle = '#f0f0f0';
    ctx.fill();
    ctx.strokeStyle = '#d9d9d9';
    ctx.lineWidth = 1;
    ctx.stroke();
  }, [volume]);

  return (
    <div style={{ textAlign: 'center', marginTop: '8px' }}>
      <canvas
        ref={canvasRef}
        width={80}
        height={40}
        style={{ display: 'block', margin: '0 auto' }}
      />
    </div>
  );
};

export default VolumeIndicator;
