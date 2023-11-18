import { Player } from "./player.js";
/* The load even will make sure the JavScript waits for all the resources such as css and images to be fully loaded before running the code */
window.addEventListener('load', function()
{
  const canvas = document.getElementById('canvas1')
  const ctx = canvas.getContext('2d');
  canvas.width = 500;
  canvas.height = 500;

  class Game {
    constructor(width,height){
      this.width = width;
      this.height = height;
      /* this relates to the Game class */
      this.player = new Player(this)
    }
    update(){


    }
    draw(){
      this.player.draw(context)


    }
  }
  const game = new Game(canvas.width, canvas.height)
  console.log(game)
  

});

