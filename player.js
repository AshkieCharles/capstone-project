export class Player {
  /* Takes the game object as an argument */
  constructor(game){
    /* Each sprite will have a width of 100px and 91.3 */
    this.game = game;
    this.width = 100;
    this.height = 91.3;
    /* Starting Position of the player */
    this.x = 0;
    this.y = 100;
  }
  /* Takes User input to update where the player sprite is moving */
  update(){

  }
  /* Will draw the current sprite in the same coordinates as the original sprite */
  draw(context){ 
    context.fillRect(this.x, this.y, this.width, this.height)

  }
}