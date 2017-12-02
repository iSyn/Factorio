let Game = {}

window.onload = () => {

  Game.actions = []

  let Action = function(action) {
    this.name = action.name
    if (action.cooldown) this.cooldown = action.cooldown * 1000
    if (action.cooldown) action.currentCooldown ? this.currentCooldown = action.currentCooldown : this.currentCooldown = null

    Game.actions.push(this)
  }

  new Action({name: 'EXPLORE'})
  new Action({name: 'CHOP TREE', cooldown: 5})
  new Action({name: 'MINE ROCK', cooldown: 5})

  // BUILD BUTTONS
  let str = '';
  for (i in Game.actions) {
    if (Game.actions[i].cooldown) {
      str += `
        <div class="action-container" onclick='Game.fireAction(${i})'>
          <div id='action-${i}' class="action-progress"></div>
          <div class="action-name">${Game.actions[i].name}</div>
        </div>
      `
    } else {
      str += `
        <div class="action-container" onclick='Game.fireAction(${i})'>${Game.actions[i].name}</div>
      `
    }
  }

  Game.fireAction = (actionNum) => {

    let selectedAction = Game.actions[actionNum]

    if (!selectedAction.currentCooldown) {
      selectedAction.currentCooldown = selectedAction.cooldown
    }
  }

  Game.updateCooldown = (actionNum) => {

    let selectedAction = Game.actions[actionNum]

    if (selectedAction.currentCooldown > 0) {
      selectedAction.currentCooldown -= 30
    } else {
      selectedAction.currentCooldown = null
    }

    let progressBar = document.querySelector(`#action-${actionNum}`)
    let barWidth = (selectedAction.currentCooldown/selectedAction.cooldown * 100)
    progressBar.style.width = barWidth + '%'
  }

  let counter = 0
  Game.logic = () => {
    // counter++

    // if (counter % 30 == 0)

    for (i in Game.actions) {
      if (Game.actions[i].cooldown) {
        if (Game.actions[i].currentCooldown != null) {
          Game.updateCooldown(i)
        }
      }
    }




    setTimeout(Game.logic, 1000/30)
  }

  Game.logic()

  document.querySelector('.buttons-container').innerHTML = str
}
