import { useRef, useState, useEffect } from 'react';
import SRR from './shadow_dog.png'
import './style.css'

type AnimationFrame = {
  x: number;
  y: number;
};

type AnimationState = {
  name: string;
  frames: number;
}

type SpriteAnimation = Record<string, { loc: AnimationFrame[] }>;

const playerImage = new Image();
playerImage.src = SRR;

const spriteWidth = 575;
const spriteHeight = 523;

const animationState: AnimationState[] = [
  { name: 'idle', frames: 7 },
  { name: 'jump', frames: 7 },
  { name: 'fall', frames: 7 },
  { name: 'fun', frames: 7 },
  { name: 'dizzy', frames: 11 },
  { name: 'sit', frames: 5 },
  { name: 'roll', frames: 7 },
  { name: 'bite', frames: 7 },
  { name: 'ko', frames: 12 },
  { name: 'getHit', frames: 4 },
];

const createSpriteAnimation = (spriteWidth: number, spriteHeight: number, animationState: AnimationState[]): SpriteAnimation => {
  const spriteAnimation: SpriteAnimation = {};

  animationState.forEach((state, index) => {
    const frames: { loc: AnimationFrame[] } = { loc: [] };

    for (let j = 0; j < state.frames; j++) {
      const positionX = j * spriteWidth;
      const positionY = index * spriteHeight;
      frames.loc.push({
        x: positionX,
        y: positionY,
      });
    }
      
    spriteAnimation[state.name] = frames;
  });

  return spriteAnimation;
};

const spriteAnimation = createSpriteAnimation(spriteWidth, spriteHeight, animationState);

const animatePlayer = (
  ctx: CanvasRenderingContext2D | null,
  playerImage: HTMLImageElement,
  spriteWidth: number, 
  spriteHeight: number,
  spriteAnimation: SpriteAnimation,
  playerState = 'dizzy'
) => {
  let gameFrame = 0;
  const staggerframes = 5;

  function animate() {
    if (!ctx) return;
    ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);

    const position = Math.floor(gameFrame / staggerframes) % spriteAnimation[playerState].loc.length;
    const frameX = spriteWidth * position;
    const frameY = spriteAnimation[playerState].loc[position].y;

    ctx.drawImage(
      playerImage,
      frameX,
      frameY,
      spriteWidth,
      spriteHeight,
      0,
      0,
      spriteWidth,
      spriteHeight
    );

    gameFrame++;
    requestAnimationFrame(animate);
  }

  playerImage.onload = () => {
    animate();
  };
}

export default function Game(): JSX.Element {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [playerState, setPlayerState] = useState('roll');

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    animatePlayer(ctx, playerImage, spriteWidth, spriteHeight, spriteAnimation, playerState);
  }, [playerState]);

  return <canvas ref={canvasRef} width={600} height={600} />;
}
