let s = ((el) => {return document.querySelector(el)})
let choose = ((arr) => {return Math.floor(Math.random() * arr.length)})

let Game = {}

Game.launch = () => {

  Game.state = {
    stone: 0,
    wood: 0,
    maxAmount: 100,

    worldResources: [
      {name: 'WOOD', amount: 200, locked: 0},
      {name: 'STONE', amount: 200, locked: 0},
      {name: 'COAL', amount: 0, locked: 1},
      {name: 'COPPER', amount: 0, locked: 1},
      {name: 'IRON', amount: 0, locked: 1},
    ],

    miningDrills: {
      owned: 0,
      active: 0,
      inactive: 0,
      STONE: 0,
      COAL: 0,
      COPPER: 0,
      IRON: 0
    },

    selectedTab: 'GATHER',
    tabs: [
      {name: 'GATHER', locked: false},
      {name: 'BUILD', locked: false},
      {name: 'TECHNOLOGY', locked: false}
    ],

    stats: {
      overallTotalStone: 0,
      overallTotalWood: 0,
      chestsOwned: 0,
    }
  }

  Game.load = () => {

    setTimeout(() => {Game.addLog('story', 'You have just crash landed on an alien planet.')}, 1000)
    setTimeout(() => {Game.addLog('story', 'Your goal is to build a rocket ship and escape.')}, 3000)

    Game.rebuildTabs = 1
    Game.rebuildSelectedTab = 1
    Game.rebuildWorldResources = 1
  }

  Game.earn = (type, total) => {

    let selectedResource
    for (i in Game.state.worldResources) {
      if (type.toUpperCase() == Game.state.worldResources[i].name) {
        selectedResource = Game.state.worldResources[i]
      }
    }

    if (selectedResource.amount >= total) {
      selectedResource.amount -= total
        if (Game.state[type] + total <= Game.state.maxAmount) {
        Game.state[type] += total
      } else {
        Game.state[type] = Game.state.maxAmount
      }
    }

    if (type == 'stone') Game.state.stats.overallTotalStone += total
    if (type == 'wood') Game.state.stats.overallTotalWood += total

    Game.rebuildInventory = 1
    Game.rebuildWorldResources = 1
  }

  Game.spend = (type, amount) => {
    if (Game.state[type] >= amount) {
      Game.state[type] -= amount
    }

    Game.rebuildInventory = 1
  }

  Game.showTooltip = (type) => {
    let tooltip = s('.tooltip')

    if (type == 'chop-tree') {
      tooltip.innerHTML = `<p>Gain 3-5 wood</p>`
    }

    if (type == 'explore') {
      tooltip.innerHTML = `<p>Look around your surroundings</p>`
    }

    if (type == 'mine-stone') {
      tooltip.innerHTML = `<p>Gain 1-2 stone(s)</p>`
    }

    if (type == 'build-chest') {
      tooltip.innerHTML = `
        <p>Cost: 50 wood, 10 stone</p>
        <p>Increase max storage by 100</p>
      `
    }

    if (type == 'build-mining-drill') {
      tooltip.innerHTML = `
        <p>Cost: 100 wood, 100 stone</p>
        <p>Allows for automation</p>
      `
    }

    tooltip.style.position = 'absolute'
    tooltip.style.border = '2px solid black'
    tooltip.style.display = 'block'
    tooltip.style.top = event.clientY + 15 + 'px'
    tooltip.style.left = event.clientX - tooltip.getBoundingClientRect().width/2 + 'px'
  }

  Game.hideTooltip = () => {
    let tooltip = s('.tooltip')
    tooltip.style.display = 'none'
    tooltip.innerHTML = '';
  }

  Game.buildWorldResources = () => {
    let str = ''

    for (i in Game.state.worldResources) {
      if (!Game.state.worldResources[i].locked) {
        str += `
          <div class="inventory-item">
            <p class="inventory-item-name">${Game.state.worldResources[i].name}</p>
            <p class="inventory-item-amount">${Game.state.worldResources[i].amount}</p>
          </div>
        `
      }
    }

    s('.world-resources-container').innerHTML = str

    Game.rebuildWorldResources = 0
  }

  Game.buildInventory = () => {
    let str = ``

    if (Game.state.stats.overallTotalWood > 0) {
      str += `
        <div class="inventory-item">
          <p class="inventory-item-name">WOOD</p>
          <p class='inventory-item-amount'>${Game.state.wood}/${Game.state.maxAmount}</p>
        </div>
      `
    }

    if (Game.state.stats.overallTotalStone > 0) {
      str += `
        <div class="inventory-item">
          <p class="inventory-item-name">STONE</p>
          <p class='inventory-item-amount'>${Game.state.stone}/${Game.state.maxAmount}</p>
        </div>
      `
    }

    s('.inventory-container').innerHTML = str

    Game.rebuildInventory = 0
  }

  Game.buildTabs = () => {
    let str = ``

    for (i in Game.state.tabs) {
      str += `<h3 id="${Game.state.tabs[i].name}-tab" class='tab' onclick='Game.changeTab("${Game.state.tabs[i].name}")'>${Game.state.tabs[i].name}</h3> &nbsp; &nbsp;`
    }

    s('.tabs').innerHTML = str

    s(`#${Game.state.selectedTab}-tab`).style.textDecoration = 'underline'
    s(`#${Game.state.selectedTab}-tab`).style.color = 'black'

    Game.rebuildTabs = 0
  }

  Game.changeTab = (tab) => {
    Game.state.selectedTab = tab
    Game.rebuildTabs = 1
    Game.rebuildSelectedTab = 1
  }

  Game.buildDrills = () => {
    let str = `
      <br/>
      <h3>DRILLS</h3>
      <hr/>
      <div class="mining-drills-container">
        <div class="mining-drills-left">
        `
        for (i in Game.state.worldResources) {
          if (!Game.state.worldResources[i].locked) {
            if (Game.state.worldResources[i].name != 'WOOD') {
              let name = Game.state.worldResources[i].name

              str += `
                <div class="mining-resource-container">
                  <p class="mining-resource-name">${Game.state.worldResources[i].name}</p>
                  <button onclick='Game.addDrill("${Game.state.worldResources[i].name}")'>+</button>
                  <p class="${Game.state.worldResources[i].name}-drills">${Game.state.miningDrills[name]}</p>
                  <button onclick='Game.removeDrill("${Game.state.worldResources[i].name}")'>-</button>
                </div>
              `

            }
          }
        }

        str += `
        </div>
        <div class="mining-drills-right">
          <p>DRILLS OWNED: ${Game.state.miningDrills.owned}</p>
          <p>ACTIVE DRILLS: ${Game.state.miningDrills.active}</p>
          <p>INACTIVE DRILLS: ${Game.state.miningDrills.inactive}</p>
        </div>
      </div>
    `
    return str
  }

  Game.addDrill = (type) => {
    if (Game.state.miningDrills.inactive > 0) {
      Game.state.miningDrills.inactive--
      Game.state.miningDrills.active++

      Game.state.miningDrills[type]++

      Game.rebuildSelectedTab = 1
    }
  }

  Game.removeDrill = (type) => {
    if (Game.state.miningDrills.active > 0) {
      Game.state.miningDrills.active--
      Game.state.miningDrills.inactive++

      Game.state.miningDrills[type]--

      Game.rebuildSelectedTab = 1
    }
  }

  Game.buildSelectedTab = () => {
    let selectedTab = Game.state.selectedTab
    let str = ''

    if (selectedTab == 'GATHER') {
      str += `
        <div class="content">
          <div class='action' onmouseover='Game.showTooltip("chop-tree")' onmouseout='Game.hideTooltip()' onclick='Game.chopTree()'>CHOP TREE</div>
          <div class='action' onmouseover='Game.showTooltip("mine-stone")' onmouseout='Game.hideTooltip()' onclick='Game.mineRock()'>MINE ROCK</div>
          <div class='action' onmouseover='Game.showTooltip("explore")' onmouseout='Game.hideTooltip()' onclick='Game.explore()'>EXPLORE</div>
        </div>
      `

      if (Game.state.miningDrills.owned > 0) {
        str += Game.buildDrills()
      }



    }

    if (selectedTab == 'BUILD') {
      str += `
        <div class="content">
          <div class="action" onmouseover='Game.showTooltip("build-chest")' onmouseout='Game.hideTooltip()' onclick='Game.buildChest()'>BUILD CHEST</div>
          <div class="action" onmouseover='Game.showTooltip("build-mining-drill")' onmouseout='Game.hideTooltip()' onclick='Game.buildMiningDrill()'>BUILD MINING DRILL</div>
        </div>
      `
    }



    s('.tab-content').innerHTML = str

    Game.rebuildSelectedTab = 0
  }

  Game.explore = () => {
    Game.addLog(null, 'You explore your surroundings but found nothing notable.')
  }

  Game.chopTree = () => {
    // Math.floor(Math.random() * (max - min + 1)) + min
    let amount = Math.floor(Math.random() * (5 - 3 + 1)) + 3

    if (Game.state.wood + amount <= Game.state.maxAmount) {
      Game.earn('wood', amount)
    } else {
      amount = Game.state.maxAmount - Game.state.wood
      Game.earn('wood', amount)
    }

    Game.addLog('wood', amount)
  }

  Game.mineRock = () => {
    let amount = Math.floor(Math.random() * 2) + 1

    if (Game.state.stone + amount <= Game.state.maxAmount) {
      Game.earn('stone', amount)
    } else {
      amount = Game.state.maxAmount - Game.state.stone
      Game.earn('stone', amount)
    }
    Game.addLog('stone', amount)
  }

  Game.buildChest = () => {
    if (Game.state.wood < 50) Game.addLog('invalid', "You don't have enough wood")
    if (Game.state.stone < 10) Game.addLog('invalid', "You don't have enough stone")

    if (Game.state.wood >= 50 && Game.state.stone >= 10) {
      Game.state.maxAmount += 100
      Game.spend('wood', 50)
      Game.spend('stone', 10)
      Game.state.stats.chestsOwned++
      Game.addLog('craft', 'chest')
    }
  }

  Game.buildMiningDrill = () => {
    if (Game.state.wood < 100) Game.addLog('invalid', "You don't have enough wood")
    if (Game.state.stone < 100) Game.addLog('invalid', "You don't have enough stone")

    if (Game.state.wood >= 100 && Game.state.stone >= 100) {
      Game.spend('wood', 100)
      Game.spend('stone', 100)
      Game.state.miningDrills.owned++
      Game.state.miningDrills.inactive+=
      Game.rebuildSelectedTab = 1
      Game.addLog('craft', 'mining drill')
    }
  }

  Game.addLog = (type, amount) => {
    let newLog = document.createElement('p')
    newLog.classList.add('log')

    if (type == 'stone') {
      let words = ['excavated', 'mined', 'smashed', 'got']
      newLog.innerHTML = `You ${words[choose(words)]} ${amount} stones`
    } else if (type == 'wood') {
      let words = ['chopped', 'harvested', 'cut', 'cut down']
      newLog.innerHTML = `You ${words[choose(words)]} ${amount} wood`
    } else if (type == 'invalid') {
      newLog.innerHTML = `<p style='color: firebrick'>${amount}</p>`
    } else if (type == 'story') {
      newLog.innerHTML = `<i style='color: slateblue'>${amount}</i>`
    } else if (type == 'craft') {
      let words = ['created', 'crafted', 'made']
      newLog.innerHTML = `<p style='color: darkgreen'>You ${words[choose(words)]} 1 ${amount}</p>`
    } else {
      newLog.innerHTML = amount
    }

    s('.logs-container').prepend(newLog)
  }

  Game.logic = () => {

    if (Game.rebuildInventory) Game.buildInventory()
    if (Game.rebuildTabs) Game.buildTabs()
    if (Game.rebuildSelectedTab) Game.buildSelectedTab()
    if (Game.rebuildWorldResources) Game.buildWorldResources()

    setTimeout(Game.logic, 1000/30)
  }

  Game.load()
  Game.logic()


}

window.onload = () => Game.launch()
