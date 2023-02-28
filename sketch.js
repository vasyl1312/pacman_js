let cols, rows, path1, path2, path, scoreStr, frameRateStr, current, goal, theme, theme1, player
let size = 30
let grid = []
let stack = []
let coins = []
let score = -1
let realTime = true
let framerate = 60
let frameCount = 0
let updateFrequency = 15
let pacman = true
let verbose = false
let exploredCells = []
let mazeMap = false

// AStar greedySearch
let search = 'AStar'
let geeedy = 'greedySearch'

function setup() {
  createCanvas(480, 480) //створюємо квадратну сітку
  cols = floor(width / size)
  rows = floor(height / size)

  //кольори для привидів поля і гравця
  if (pacman) {
    theme = {
      background: color(0),
      walls: color(0, 0, 255),
      goal: color(255, 255, 0),
      player: color(255, 255, 0),
      path: color(255, 184, 222, 120),
      enemy: color(255, 184, 222),
      enemy1: color(255, 14, 22),
      enemy2: color(200, 100, 50),
      enemy3: color(124, 252, 0),
    }
  }

  //запушуєм поки на все поле клітинки і монети
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      grid.push(new Cell(r, c))
      coins.push(true)
    }
  }

  current = grid[0]
  goal = grid[grid.length - 1]
  maze(true) //генерація лабіринту щоб не було замкнутих кімнат
  if (!mazeMap) {
    randomMap(true)
  }

  enemy = new Enemy(0, 0) //створюємо привидів і гравця
  enemy1 = new Enemy(10, 0)
  enemy2 = new Enemy(0, 10)
  enemy3 = new Enemy(10, 15)

  if (pacman) {
    player = new Player()
  }

  if (pacman) {
    scoreStr = createP('Score: ' + score) // очки
  }
}

function draw() {
  background(theme.background)
  if (verbose) {
    highlightCells(exploredCells)
  }

  if (pacman) {
    player.update()
    player.show() //відображення пакмена
    showCoins() //малюємо монети
    scoreStr.html('Score: ' + score)
  }

  for (const cell of grid) {
    cell.show(size / 4, theme.walls) //виводимо монети якщо вільна комiрка
  }

  for (const cell of grid) {
    cell.show(size / 4 - 2, theme.background)
  }

  //запуск привидів
  enemy.step()
  enemy.show()
  enemy1.step()
  enemy1.show1()
  enemy2.step()
  enemy2.show2()
  enemy3.step()
  enemy3.show3()

  if (frameCount % updateFrequency == 0) {
    //3 привиди жадібним 1 а*
    path = enemy.findPath(goal.r, goal.c, search)
    path1 = enemy1.findPath(goal.r, goal.c, geeedy)
    path2 = enemy2.findPath(goal.r, goal.c, geeedy)
    path3 = enemy3.findPath(goal.r, goal.c, geeedy)

    let newCell = path[1]
    let newCell1 = path1[1]
    let newCell2 = path2[1]
    let newCell3 = path3[1]

    //якщо не зловили пакмена оновлюємо клітинки для привидів
    if (newCell && newCell1 && newCell2 && newCell3) {
      enemy.update(newCell)
      enemy1.update(newCell1)
      enemy2.update(newCell2)
      enemy3.update(newCell3)
    } else {
      if (!alert('Game over, your score is: ' + score + '\nTry again!')) {
        window.location.reload()
      }
    }
  }

  //кожнний новий рух пакмена запам'ятовуємо для привидів
  if (realTime) {
    let r, c
    if (pacman) {
      c = floor(min(player.x, width) / size)
      r = floor(min(player.y, height) / size)
    } else {
      c = floor(min(mouseX, width) / size)
      r = floor(min(mouseY, height) / size)
    }
    if (grid[getIndex(r, c)]) {
      goal = grid[getIndex(r, c)]
    }
  }
  frameCount = (frameCount + 1) % framerate

  showPath(path) //для а* показуємо шлях до пакмена
  // showPath(path1) //для відображення інших шляхів
  // showPath(path2)
  // showPath(path3)
}

//для керування пакменом по клавіатурі
function keyPressed() {
  // console.log(keyCode);
  if (keyCode === ESCAPE) {
    // console.log('yes')
    noLoop()
  } else {
    if (keyCode === LEFT_ARROW) {
      player.dir = { x: -1, y: 0 }
    } else if (keyCode === RIGHT_ARROW) {
      player.dir = { x: 1, y: 0 }
    } else if (keyCode === UP_ARROW) {
      player.dir = { x: 0, y: -1 }
    } else if (keyCode === DOWN_ARROW) {
      player.dir = { x: 0, y: 1 }
    }
  }
}
