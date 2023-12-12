const canvas = document.querySelector('canvas')
/** this is a 2d game */
const score = document.querySelector('#score')
const c = canvas.getContext('2d');


canvas.width = innerWidth
canvas.height = innerHeight

class Boundary {
  static width = 40
  static height = 40
  constructor({position, image}) {
    /*Dynamic positioning  */
    this.position = position
    /* Must never change as this will be the boundary squares that Pac-man won't be able to get out of */
    this.width = 40
    this.height = 40
    this.image = image
  }

  draw() {
    // c.fillStyle = 'blue'
    // c.fillRect(this.position.x, this.position.y, this.width, this.height)

    c.drawImage(this.image, this.position.x, this.position.y)
  }
}

/* This will be the Pac-man/Player */
class Player {
  constructor({
    position, velocity
  }) {
    this.position = position
    this.velocity = velocity
    this.radius = 16
    this.radians = 0.75
    this.openRate = 0.12
    this.rotation = 0
  }

  draw() {
    c.save()
    c.translate(this.position.x, this.position.y)
    c.rotate(this.rotation)
    c.translate(-this.position.x, -this.position.y)
    c.beginPath()
    c.arc(this.position.x, this.position.y, this.radius, this.radians, Math.PI * 2 - this.radians)
    c.lineTo(this.position.x, this.position.y)
    c.fillStyle = "yellow"
    c.fill()
    c.closePath
    c.restore()
  }
  update() {
    this.draw()
    /* Determines the position of the object overtime */
    this.position.x += this.velocity.x
    this.position.y += this.velocity.y

    if (this.radians < 0 || this.radians > 0.75) this.openRate = -this.openRate
    this.radians += this.openRate
  }

}

class Ghost {
  static speed = 2
  constructor({
    position, velocity, color = 'red'
  }) {
    this.position = position
    this.velocity = velocity
    this.radius = 16
    this.color = color
    this.prevCollisions = []
    this.speed = 2
    this.scared = false
  }

  draw() {
    c.beginPath()
    c.arc(this.position.x, this.position.y, this.radius, 0, Math.PI * 2)
    c.fillStyle = this.scared ? 'blue' : this.color
    c.fill()
    c.closePath
  }
  update() {
    this.draw()
    /* Determines the position of the object overtime */
    this.position.x += this.velocity.x
    this.position.y += this.velocity.y
  }

}




class Pellet {
  constructor({ position }) {
    this.position = position
    this.radius = 3
  }

  draw() {
    c.beginPath()
    c.arc(this.position.x, this.position.y, this.radius, 0, Math.PI * 2)
    c.fillStyle = 'white'
    c.fill()
    c.closePath
  }
}


class PowerUp {
  constructor({ position }) {
    this.position = position
    this.radius = 10
  }

  draw() {
    c.beginPath()
    c.arc(this.position.x, this.position.y, this.radius, 0, Math.PI * 2)
    c.fillStyle = 'green'
    c.fill()
    c.closePath
  }
}


const powerUps = []

const ghosts = [
  new Ghost ({
    position: {
      x:Boundary.width * 6 + Boundary.width / 2,
      y:Boundary.height + Boundary.height / 2,
    },
    velocity: {
      x: Ghost.speed,
      y: 0
    }
  }),
  new Ghost ({
    position: {
      x:Boundary.width * 6 + Boundary.width / 2,
      y:Boundary.height* 3 + Boundary.height / 2,
    },
    velocity: {
      x: Ghost.speed,
      y: 0
    }, 
    color: 'pink'
  }),
  new Ghost ({
    position: {
      x:Boundary.width * 6 + Boundary.width / 2,
      y:Boundary.height* 9 + Boundary.height / 2,
    },
    velocity: {
      x: Ghost.speed,
      y: 0
    }, 
    color: 'orange'
  })
]

const pellets = []
/* This creates the blue boxes that prevents the player from leaving the game area. */
const boundaries = []
/* This controls where the player will spawn */
const player = new Player({
  position: {
    x:Boundary.width + Boundary.width / 2,
    y:Boundary.height + Boundary.height / 2,
  },
  velocity: {
    x:0,
    y:0
  }
})


const keys = {
  w: {
    pressed:false
  },
  a: {
    pressed:false
  },
  s: {
    pressed:false
  },
  d: {
    pressed:false
  }
}

let lastKey = ''
let lastScore = 0



/* This creates the map for the game. */
const map = [
  ['1', '-', '-', '-', '-', '-', '-', '-', '-', '-', '2'],
  ['|', '.', '.', '.', '.', '.', '.', '.', '.', '.', '|'],
  ['|', '.', 'b', '.', '[', '7', ']', '.', 'b', '.', '|'],
  ['|', '.', '.', '.', '.', '_', '.', '.', 'p', '.', '|'],
  ['|', '.', '[', ']', 'p', '.', '.', '[', ']', '.', '|'],
  ['|', '.', '.', '.', '.', '^', '.', '.', '.', '.', '|'],
  ['|', '.', 'b', '.', '[', '+', ']', '.', 'b', '.', '|'],
  ['|', '.', '.', '.', '.', '_', '.', '.', '.', '.', '|'],
  ['|', '.', '[', ']', '.', '.', '.', '[', ']', '.', '|'],
  ['|', '.', '.', 'p', '.', '^', '.', '.', '.', '.', '|'],
  ['|', '.', 'b', '.', '[', '5', ']', '.', 'b', '.', '|'],
  ['|', '.', '.', '.', '.', '.', '.', '.', '.', 'p', '|'],
  ['4', '-', '-', '-', '-', '-', '-', '-', '-', '-', '3']
]


function createImage(src){
  const image = new Image()
  image.src = src
  return image
}

map.forEach((row, i) => {
  row.forEach((symbol, j) => {
    switch (symbol) {
      case '-':
        boundaries.push(
          new Boundary({
            position: {
              x: Boundary.width * j,
              y: Boundary.height * i
            },
            image: createImage('./img/pipeHorizontal.png')
          })
        )
        break
      case '|':
        boundaries.push(
          new Boundary({
            position: {
              x: Boundary.width * j,
              y: Boundary.height * i
            },
            image: createImage('./img/pipeVertical.png')
          })
        )
        break
      case '1':
        boundaries.push(
          new Boundary({
            position: {
              x: Boundary.width * j,
              y: Boundary.height * i
            },
            image: createImage('./img/pipeCorner1.png')
          })
        )
        break
      case '2':
        boundaries.push(
          new Boundary({
            position: {
              x: Boundary.width * j,
              y: Boundary.height * i
            },
            image: createImage('./img/pipeCorner2.png')
          })
        )
        break
      case '3':
        boundaries.push(
          new Boundary({
            position: {
              x: Boundary.width * j,
              y: Boundary.height * i
            },
            image: createImage('./img/pipeCorner3.png')
          })
        )
        break
      case '4':
        boundaries.push(
          new Boundary({
            position: {
              x: Boundary.width * j,
              y: Boundary.height * i
            },
            image: createImage('./img/pipeCorner4.png')
          })
        )
        break
      case 'b':
        boundaries.push(
          new Boundary({
            position: {
              x: Boundary.width * j,
              y: Boundary.height * i
            },
            image: createImage('./img/block.png')
          })
        )
        break
      case '[':
        boundaries.push(
          new Boundary({
            position: {
              x: j * Boundary.width,
              y: i * Boundary.height
            },
            image: createImage('./img/capLeft.png')
          })
        )
        break
      case ']':
        boundaries.push(
          new Boundary({
            position: {
              x: j * Boundary.width,
              y: i * Boundary.height
            },
            image: createImage('./img/capRight.png')
          })
        )
        break
      case '_':
        boundaries.push(
          new Boundary({
            position: {
              x: j * Boundary.width,
              y: i * Boundary.height
            },
            image: createImage('./img/capBottom.png')
          })
        )
        break
      case '^':
        boundaries.push(
          new Boundary({
            position: {
              x: j * Boundary.width,
              y: i * Boundary.height
            },
            image: createImage('./img/capTop.png')
          })
        )
        break
      case '+':
        boundaries.push(
          new Boundary({
            position: {
              x: j * Boundary.width,
              y: i * Boundary.height
            },
            image: createImage('./img/pipeCross.png')
          })
        )
        break
      case '5':
        boundaries.push(
          new Boundary({
            position: {
              x: j * Boundary.width,
              y: i * Boundary.height
            },
            color: 'blue',
            image: createImage('./img/pipeConnectorTop.png')
          })
        )
        break
      case '6':
        boundaries.push(
          new Boundary({
            position: {
              x: j * Boundary.width,
              y: i * Boundary.height
            },
            color: 'blue',
            image: createImage('./img/pipeConnectorRight.png')
          })
        )
        break
      case '7':
        boundaries.push(
          new Boundary({
            position: {
              x: j * Boundary.width,
              y: i * Boundary.height
            },
            color: 'blue',
            image: createImage('./img/pipeConnectorBottom.png')
          })
        )
        break
      case '8':
        boundaries.push(
          new Boundary({
            position: {
              x: j * Boundary.width,
              y: i * Boundary.height
            },
            image: createImage('./img/pipeConnectorLeft.png')
          })
        )
        break
      case '.':
        pellets.push(
          new Pellet({
            position: {
              x: j * Boundary.width + Boundary.width / 2,
              y: i * Boundary.height + Boundary.height / 2
            }
          })
        )
        break

        case 'p':
          powerUps.push(
            new PowerUp({
              position: {
                x: j * Boundary.width + Boundary.width / 2,
                y: i * Boundary.height + Boundary.height / 2
              }
            })
          )
          break
    }
  })
})


/* This will function to track if the player overlaps with the boundary walls and reduces the velocity of the user to zero. The player never actually hits the boundary as that would make it so we can't move after hitting a boundary so what we need to do is to add the velocity of the other coordinate as they would be negative when moving in that direction. */
function collisionDetection({
  circle,
  rectangle
}) {
  // Will grab the the distance between the center of the circle towards the edge padding of the boundaries.
  const padding = Boundary.width /2 - circle.radius - 1
  return (
    /* The top of the player */
    circle.position.y - circle.radius + circle.velocity.y<= rectangle.position.y + rectangle.height + padding && 
    /* The right of the circle */
    circle.position.x + circle.radius + circle.velocity.x >= rectangle.position.x - padding && 
    /* The bottom of the circle */
    circle.position.y + circle.radius + circle.velocity.y >= rectangle.position.y - padding && 
    /* The left of the circle */
    circle.position.x - circle.radius + circle.velocity.x <= rectangle.position.x + rectangle.width + padding) 
}
/* This loop checks whether or not the user player is touching any of the boundaries by grabbing the edges of the x and y coordinates of the boundaries and checking whether or not it overlaps with that of the x and y of the player itself. */



let animationId

/* Create an infinite loop to make sure it redraws the Pac-man everytime. */
function animate() {
  animationId = requestAnimationFrame(animate)
  /* So we clear the drawing before drawing another one to prevent the creation of a long line. */
  c.clearRect(0, 0, canvas.width, canvas.height)
  
  if (keys.w.pressed && lastKey == 'w') {
    for (let i = 0; i < boundaries.length; i++){
      const boundary = boundaries[i]
      if (
        collisionDetection({
          circle: {...player, velocity: {
            x: 0, 
            y: -2
          }},
          rectangle: boundary
      })
      ) {
        player.velocity.y = 0
        break
      } else {
        player.velocity.y = -2
      }
    }
  } else if (keys.a.pressed && lastKey == 'a') {
    for (let i = 0; i < boundaries.length; i++){
      const boundary = boundaries[i]
      if (
        collisionDetection({
          circle: {...player, velocity: {
            x: -2, 
            y: 0
          }},
          rectangle: boundary
      })
      ) {
        player.velocity.x = 0
        break
      } else {
        player.velocity.x = -2
      }
    }
  } else if (keys.s.pressed && lastKey == 's') {
    for (let i = 0; i < boundaries.length; i++){
      const boundary = boundaries[i]
      if (
        collisionDetection({
          circle: {...player, velocity: {
            x: 0, 
            y: 2
          }},
          rectangle: boundary
      })
      ) {
        player.velocity.y = 0
        break
      } else {
        player.velocity.y = 2
      }
    }
  } else if (keys.d.pressed && lastKey == 'd') {
    for (let i = 0; i < boundaries.length; i++){
      const boundary = boundaries[i]
      if (
        collisionDetection({
          circle: {...player, velocity: {
            x: 2, 
            y: 0
          }},
          rectangle: boundary
      })
      ) {
        player.velocity.x = 0
        break
      } else {
        player.velocity.x = 2
      }
    }
  }


// Detect collisions between player and ghosts
for (let i = ghosts.length - 1; 0 <= i; i--){
    const ghost = ghosts[i]
      // Player touches ghost
      if (
        Math.hypot(
          ghost.position.x - player.position.x, 
          ghost.position.y - player.position.y
          ) < // This will make sure the when the ghost is scared it won't hurt you.
          ghost.radius + player.radius 
        ) {
          if (ghost.scared) {
            ghosts.splice(i, 1)
          } else {
            alert('You Lost')
            cancelAnimationFrame(animationId)
            
          }
        }
      }


  // Win Condition
  if (pellets.length == 0){
    alert("You win!")
    cancelAnimationFrame(animationId)
  }
  //Power Ups
  for (let i = powerUps.length - 1; 0 <= i; i--){
    const powerUp = powerUps[i]
    powerUp.draw()
    // Player collision with power
    if (
      Math.hypot
      (powerUp.position.x - player.position.x, 
        powerUp.position.y - player.position.y
        ) < 
        powerUp.radius + player.radius
        )
        {
          // The moment Pac-Man touches the power up the ghost go into a scared state
          powerUps.splice(i, 1)
          ghosts.forEach(ghost => {
            ghost.scared = true

            setTimeout(() => {
              ghost.scared = false
            }, 6000)
          })

        }
  }


  for (let i = pellets.length - 1; 0 <= i; i--){
    const pellet = pellets[i]

    pellet.draw()

    // This will detect the longest part of the pellet that will be detected to remove it
    if (
      Math.hypot
      (pellet.position.x - player.position.x, 
        pellet.position.y - player.position.y
        ) < 
        pellet.radius + player.radius
        ) {
          // The array we had earlier will now lose one pellet each time the user interacts with it.
      pellets.splice(i, 1)
      lastScore += 10
      score.innerHTML = lastScore

    }

  }



  boundaries.forEach((boundary) => {
    boundary.draw()
    if (collisionDetection({
      circle: player,
      rectangle: boundary
    }))  
      {
        player.velocity.x = 0
        player.velocity.y = 0
      }

  })
  player.update()

  ghosts.forEach(ghost => {
    ghost.update()

    const collisions = []
    boundaries.forEach(boundary => {
      if (
        // This will make sure we don't get repeats of the same direction inside the array
        !collisions.includes('right')&&
        collisionDetection({
          circle: {...ghost, velocity: {
            x: ghost.speed, 
            y: 0
          }},
          rectangle: boundary
      })
      ) {
        collisions.push('right')
      }

      if (
        !collisions.includes('left')&&
        collisionDetection({
          circle: {...ghost, velocity: {
            x: -ghost.speed, 
            y: 0
          }},
          rectangle: boundary
      })
      ) {
        collisions.push('left')
      }

      if (
        !collisions.includes('up')&&
        collisionDetection({
          circle: {...ghost, velocity: {
            x: 0, 
            y: -ghost.speed
          }},
          rectangle: boundary
      })
      ) {
        collisions.push('up')
      }

      if (
        !collisions.includes('down')&&
        collisionDetection({
          circle: {...ghost, velocity: {
            x: 0, 
            y: ghost.speed
          }},
          rectangle: boundary
      })
      ) {
        collisions.push('down')
      }



    })
    if (collisions.length > ghost.prevCollisions.length)
      ghost.prevCollisions = collisions
    if (JSON.stringify(collisions) !== JSON.stringify(ghost.prevCollisions)){
    
    // This will give the ghost array random directions which a ghost can take
    if (ghost.velocity.x > 0) ghost.prevCollisions.push('right')
    else if (ghost.velocity.x < 0) ghost.prevCollisions.push('left')
    else if (ghost.velocity.y < 0) ghost.prevCollisions.push('up')
    else if (ghost.velocity.y > 0) ghost.prevCollisions.push('down')

      const pathways = ghost.prevCollisions.filter(collision => {
        return !collisions.includes(collision)
      })

      // This will do the magic of an Ai-looking ghost. This will randomize which direction the ghost will go. This will grab a random integer and round down it so that it can be used as a length for the array.
      const direction = pathways [Math.floor(Math.random() * pathways.length )]

      switch (direction){
        case 'down':
          ghost.velocity.y = ghost.speed
          ghost.velocity.x = 0
          break
        case 'up':
          ghost.velocity.y = -ghost.speed
          ghost.velocity.x = 0
          break
        case 'left':
          ghost.velocity.y = 0
          ghost.velocity.x = -ghost.speed
          break
        case 'right':
          ghost.velocity.y = 0
          ghost.velocity.x = ghost.speed
          break
      }
      ghost.prevCollisions = []

    }
  })

  // Adds the rotation of Pac-Man after he faces a new direction
  if (player.velocity.x > 0) player.rotation = 0
  else if (player.velocity.x < 0) player.rotation = Math.PI
  else if (player.velocity.y > 0) player.rotation = Math.PI / 2
  else if (player.velocity.y < 0) player.rotation = Math.PI * 1.5
}

animate()




/* This will listen for the WASD for controlling the movement of the user. */
window.addEventListener('keydown', ({ key }) => {
  switch (key) {
    case 'w':
      /* The reason why it is a negative number is because in web dev everything starts from the top so it starts from zero. */
    keys.w.pressed = true
    lastKey = 'w'
    break
    case 'a':
    keys.a.pressed = true
    lastKey = 'a'
    break
    case 'd':
    keys.d.pressed = true
    lastKey = 'd'
    break
    case 's':
    keys.s.pressed = true
    lastKey = 's'
    break
  }
})

window.addEventListener('keyup', ({ key }) => {
  switch (key) {
    case 'w':
      /* The reason why it is a negative number is because in web dev everything starts from the top so it starts from zero. */
    keys.w.pressed = false
    break
    case 'a':
    keys.a.pressed = false
    break
    case 'd':
    keys.d.pressed = false
    break
    case 's':
    keys.s.pressed = false
    break
  }
})