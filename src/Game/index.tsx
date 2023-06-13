import React, { useEffect, useRef } from 'react'
import SRR from './shadow_dog.png'
const playerImage = new Image()
playerImage.src = SRR
const spriteWidth:number = 575
const spriteHeight:number = 523
const animationState = [
  {
    name: 'idle',
    frames: 7
  },
  {
    name: 'jump',
    frames: 7
  },
  {
    name: 'fall',
    frames: 7
  },
  {
    name: 'fun',
    frames: 7
  },
]

const spriteAnimation : any = {}; 

animationState.forEach((state,index)=>{
  let frames:any = {
    loc:[],
  }

  for (let j = 0; j < state.frames; j++) {
    let positionX = j * spriteWidth;
    let positionY = index * spriteHeight
    frames.loc.push({
      x: positionX,
      y:positionY
    })
  }
  spriteAnimation[state.name] = frames
})

let gameFrame = 0;
let staggerframes = 5;

export default function Game() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null)
  let CANVES_WIDTH = 600
  let CANVAS_HEIGHT = 600
    let playerState = 'idle';
    useEffect(() => {
      const canvas = canvasRef.current;
      if (!canvas) return
      const ctx = canvas.getContext('2d');
      if (!ctx) return
      // ctx.fillStyle='blue'

      
      // ctx.fillRect(0,0,CANVES_WIDTH,CANVAS_HEIGHT)


      // after 2d



      function animate() {
        ctx?.clearRect(0,0,CANVES_WIDTH,CANVAS_HEIGHT)
        let position = Math.floor(gameFrame / staggerframes) % spriteAnimation[playerState].loc.length
        let frameX = spriteWidth * position;
        let frameY = spriteAnimation[playerState].loc.length.y;
        ctx?.drawImage( playerImage, frameX, frameY, spriteWidth, spriteHeight, 0, 0, spriteWidth, spriteHeight)

        gameFrame++;
        requestAnimationFrame(animate);
        console.log(gameFrame)
      }
      animate()

    }, [])
    

    return (
        <canvas ref={canvasRef} width={CANVES_WIDTH} height={CANVAS_HEIGHT} />
    )
}
