const canvas = document.querySelector('canvas')
/** this is a 2d game */
const c = canvas.getContext('2d');
console.log(c)

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
/* This creates the map for teh game. The dashes symbolize the boxes while the space symbolize the playable area. */
const map = [
  ['-', '-', '-', '-', '-', '-', ],
  ['-', ' ', ' ', ' ', ' ', '-', ],
  ['-', ' ', '-', '-', ' ', '-', ],
  ['-', ' ', ' ', ' ', ' ', '-', ],
  ['-', '-', '-', '-', '-', '-', ]
]
/* This creates the blu boxes that prevents the player from leaving the game area. */
const boundaries = []

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


boundaries.forEach((boundary) => {
  boundary.draw()
})