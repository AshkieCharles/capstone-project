const canvas = document.querySelector('canvas')
/** this is a 2d game */
const c = canvas.getContext('2d');


canvas.width = innerWidth
canvas.height = innerHeight

class Boundary {
  static width = 40
  static height = 40
  constructor({position}) {
    /*Dynamic positioning  */
    this.position = position
    /* Must never change as this will be the boundary squares that Pac-man won't be able to get out of */
    this.width = 40
    this.height = 40
  }

  draw() {
    c.fillStyle = 'blue'
    c.fillRect(this.position.x, this.position.y, this.width, this.height)
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
  }

  draw() {
    c.beginPath()
    c.arc(this.position.x, this.position.y, this.radius, 0, Math.PI * 2)
    c.fillStyle = "yellow"
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



/* This creates the map for the game. The dashes symbolize the boxes while the space symbolize the playable area. */
const map = [
  ['-', '-', '-', '-', '-', '-', ],
  ['-', ' ', ' ', ' ', ' ', '-', ],
  ['-', ' ', '-', '-', ' ', '-', ],
  ['-', ' ', ' ', ' ', ' ', '-', ],
  ['-', '-', '-', '-', '-', '-', ]
]

map.forEach((row, i) => {
  row.forEach((symbol, j) => {
    console.log(symbol)
    switch (symbol) {
      /* Whenever we hit a dashed line we create a a box and break the loop and reiterate the loop again before hitting another symbol. */
      case '-':
        boundaries.push(
          new Boundary({
            position: {
              x: Boundary.width * j,
              /* This makes sure that it is always 40 below the next square */
              y: Boundary.height * i
            }
          })
        )
        break
    }
  })
})

/* Create an infinite loop to make sure it redraws the Pac-man everytime. */
function animate() {
  requestAnimationFrame(animate)
  /* So we clear the drawing before drawing another one to prevent the creation of a long line. */
  c.clearRect(0, 0, canvas.width, canvas.height)
  boundaries.forEach((boundary) => {
    boundary.draw()
      /* This will loop to track if the player overlaps with the boundary walls and reduces the velocity of the user to zero. */
    if (
      player.position.y - player.radius <= boundary.position.y + boundary.height && 
      player.position.x + player.radius >= boundary.position.x && 
      player.position.y + player.radius >= boundary.position.y && 
      player.position.x - player.radius <= boundary.position.x + boundary.width){console.log('we are colliding')}
    /* This loop checks whether or not the user player is touching any of the boundaries by grabbing the edges of the x and y coordinates of the boundaries and checking whether or not it overlaps with that of the x and y of the player itself. */
  })
  player.update()
  player.velocity.y = 0
  player.velocity.x = 0

  if (keys.w.pressed && lastKey == 'w') {
    player.velocity.y = -7
  } else if (keys.a.pressed && lastKey == 'a') {
    player.velocity.x = -7
  } else if (keys.s.pressed && lastKey == 's') {
    player.velocity.y = 7
  } else if (keys.d.pressed && lastKey == 'd') {
    player.velocity.x = 7
  }


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