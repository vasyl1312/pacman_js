function Enemy(r, c) {
  this.r = r
  this.c = c
  this.prevr = r
  this.prevc = c
  this.x = c * size
  this.y = r * size
  this.dir = {
    x: 0,
    y: 0,
  }
  this.cell = grid[getIndex(r, c)]

  //оновлення нового шляху
  this.update = function (cell) {
    this.dir = getDirection(this, cell)
    this.cell = cell
    this.prevr = this.r
    this.prevc = this.c
    this.r = cell.r
    this.c = cell.c
    this.x = this.prevc * size
    this.y = this.prevr * size
  }

  this.step = function () {
    if (this.dir) {
      this.x = this.x + (this.dir.x * size) / updateFrequency
      this.y = this.y + (this.dir.y * size) / updateFrequency
    }
  }

  this.findPath = function (r, c, algorithm) {
    // console.time(algorithm)
    answer = this[algorithm](r, c)
    // console.timeEnd(algorithm)
    return answer
  }

  this.AStar = function (r, c) {
    // Алгоритм починається з заданої this.cell комірки та шукає шлях до цільової комірки, використовуючи комбінацію пошуку в ширину та евристики.
    let openList = [this.cell]
    let closedList = []
    let goalCell = grid[getIndex(r, c)]
    let currentCell
    let path = []
    let visited = []
    for (const i in grid) {
      visited.push(false)
      grid[i].cost = Infinity
      grid[i].heuristic = Infinity
      grid[i].parent = undefined
    }
    this.cell.cost = 0
    while (openList.length > 0) {
      openList.sort((x, y) => y.f - x.f)
      currentCell = openList.pop()

      if (currentCell == goalCell) {
        break
      }

      closedList.push(currentCell)
      for (const n of currentCell.neighbors) {
        if (closedList.includes(n)) continue

        n.heuristic = manhattanDistance(n, goalCell)
        let newCost = currentCell.cost + 1

        if (!openList.includes(n)) {
          openList.push(n)
        } else if (newCost >= n.cost) {
          continue
        }
        n.parent = currentCell
        n.cost = newCost
        n.f = n.cost + n.heuristic
      }
    }

    while (currentCell) {
      path.unshift(currentCell)
      currentCell = currentCell.parent
    }
    exploredCells = closedList
    return path
  }

  // для жадібний пошук, просто змінено рядок, який сортує відкритий список, щоб він використовував лише евристичне значення кожної клітинки, а не комбіноване значення
  // Це призведе до того, що алгоритм завжди вибирає кліку, яка найближче до клітини пакмена, без врахування вартості потрапляння до цієї комірки. Решта алгоритму залишається.
  this.greedySearch = function (r, c) {
    let openList = [this.cell]
    let closedList = []
    let goalCell = grid[getIndex(r, c)]
    let currentCell
    let path = []
    let visited = []
    for (const i in grid) {
      visited.push(false)
      grid[i].heuristic = Infinity
      grid[i].parent = undefined
    }

    while (openList.length > 0) {
      openList.sort((x, y) => manhattanDistance(x, goalCell) - manhattanDistance(y, goalCell))
      currentCell = openList.pop()

      if (currentCell == goalCell) {
        break
      }

      closedList.push(currentCell)

      for (const n of currentCell.neighbors) {
        if (closedList.includes(n)) continue

        n.heuristic = manhattanDistance(n, goalCell)

        if (!openList.includes(n)) {
          openList.push(n)
        }
        n.parent = currentCell
      }
    }

    while (currentCell) {
      path.unshift(currentCell)
      currentCell = currentCell.parent
    }
    exploredCells = closedList

    return path
  }

  //відображення привидів
  this.show = function (enemy) {
    fill(theme.enemy)
    noStroke()
    ellipse(this.x + size / 2, this.y + size / 2, size * 0.5)
  }

  this.show1 = function () {
    fill(theme.enemy1)
    noStroke()
    ellipse(this.x + size / 2, this.y + size / 2, size * 0.5)
  }

  this.show2 = function () {
    fill(theme.enemy2)
    noStroke()
    ellipse(this.x + size / 2, this.y + size / 2, size * 0.5)
  }

  this.show3 = function () {
    fill(theme.enemy3)
    noStroke()
    ellipse(this.x + size / 2, this.y + size / 2, size * 0.5)
  }
}
