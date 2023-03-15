function Cell(r, c) {
  this.c = c
  this.r = r
  this.walls = [true, true, true, true]
  this.visited = false
  this.neighbors = []
  this.cost = 0

  this.show = function (s, c) {
    let w = size
    let x = this.c * w
    let y = this.r * w

    stroke(c)
    strokeWeight(s)

    // top
    if (this.walls[0]) line(x, y, x + w, y)
    // right
    if (this.walls[1]) line(x + w, y, x + w, y + w)
    // bottom
    if (this.walls[2]) line(x, y + w, x + w, y + w)
    // left
    if (this.walls[3]) line(x, y, x, y + w)
  }

  //використовує підхід пошуку в глибину. Функція checkNeighbors()викликається для об’єкта клітинки, і вона переглядає сусідні клітинки (верхню, праву, нижню та ліву).
  // Цей процес триває до тих пір, поки всі комірки не будуть відвідані, і не залишиться невідвіданих комірок із сусідами, які можна додати. Кінцевим результатом є лабіринт, у якому кожна клітина з’єднана з сусідніми клітинами, але немає петель чи від’єднаних ділянок.
  // Спочатку створюється порожній neighbors масив і перевіряється, чи існує кожна сусідня комірка, не відвідувана раніше, і якщо так, додається до масиву neighbors.
  this.checkNeighbors = function () {
    let neighbors = []

    let top = grid[getIndex(this.r - 1, this.c)]
    let right = grid[getIndex(this.r, this.c + 1)]
    let bottom = grid[getIndex(this.r + 1, this.c)]
    let left = grid[getIndex(this.r, this.c - 1)]

    top && !top.visited && neighbors.push(top)
    right && !right.visited && neighbors.push(right)
    bottom && !bottom.visited && neighbors.push(bottom)
    left && !left.visited && neighbors.push(left)

    // Потім випадковим чином вибираєм клітинку з neighbors масиву та перевіряєм, чи її вже додано як сусідню. Якщо ні, додаєм вибрану комірку до масиву neighbors поточної комірки та додаєм поточну комірку як сусідню вибрану комірку.
    let rIndex = floor(random() * neighbors.length)
    n = neighbors[rIndex]
    if (n) {
      let alreadyNeigbor = false
      for (const neighbor of this.neighbors) {
        if (n == neighbor) {
          alreadyNeigbor = true
        }
      }
      if (!alreadyNeigbor) {
        this.neighbors.push(n)
        n.neighbors.push(this)
      }
    }
    return n
  }
}
