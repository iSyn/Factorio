let s = ((el) => {return document.querySelector(el)})
let choose = ((arr) => {return Math.floor(Math.random() * arr.length)})

let Game = {}

Game.launch = () => {

  Game.state = {
    stone: 0,
    wood: 0,
    maxAmount: 100,

    worldResources: [
      {name: 'WOOD', amount: 150, locked: 0},
      {name: 'STONE', amount: 100, locked: 0},
      {name: 'COAL', amount: 50, locked: 1},
      {name: 'COPPER', amount: 50, locked: 1},
      {name: 'IRON', amount: 50, locked: 1},
    ],

    selectedTab: 'GATHER',
    tabs: [
      {name: 'GATHER', locked: false},
      {name: 'BUILD', locked: false},
      {name: 'TECHNOLOGY', locked: false}
    ],

    stats: {
      overallTotalStone: 0,
      overallTotalWood: 0,
      chestsOwned: 1,
      miningDrillOwned: 1
    }
  }

  Game.load = () => {

    setTimeout(() => {Game.addLog('story', 'You have just crash landed on an alien planet.')}, 1000)
    setTimeout(() => {Game.addLog('story', 'Your goal is to build a rocket ship and escape.')}, 3000)


    Game.rebuildTabs = 1
    Game.rebuildSelectedTab = 1
    Game.rebuildWorldResources = 1
  }

  Game.earn = (type, amount) => {

    if (Game.state[type] + amount <= Game.state.maxAmount) {
      Game.state[type] += amount
    } else {
      Game.state[type] = Game.state.maxAmount
    }

    if (type == 'stone') Game.state.stats.overallTotalStone += amount
    if (type == 'wood') Game.state.stats.overallTotalWood += amount

    Game.rebuildInventory = 1
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
        <p>Cost: ${Game.state.stats.chestsOwned * 50} wood, ${Game.state.stats.chestsOwned * 10} stone</p>
        <p>Increase max storage by 100</p>
      `
    }

    if (type == 'build-mining-drill') {
      tooltip.innerHTML = `
        <p>Cost: ${Game.state.stats.miningDrillOwned * 100} wood, ${Game.state.stats.miningDrillOwned * 100} stone</p>
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

  Game.removeWorldResources = (resource, total) => {
    let selectedResource;

    for (i in Game.state.worldResources) {
      if (resource == Game.state.worldResources[i].name) {
        selectedResource = Game.state.worldResources[i]
      }
    }

    selectedResource.amount -= total

    Game.rebuildWorldResources = 1
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

  Game.buildSelectedTab = () => {
    let selectedTab = Game.state.selectedTab
    let str = ''

    if (selectedTab == 'GATHER') {
      str += `
        <div class="content">
          <div class='action' onmouseover='Game.showTooltip("chop-tree")' onmouseout='Game.hideTooltip()' onclick='Game.chopTree()'>CHOP TREE</div>
          <div class='action' onmouseover='Game.showTooltip("mine-stone")' onmouseout='Game.hideTooltip()' onclick='Game.mineRock()'>MINE ROCK</div>
          <div class='action' onmouseover='Game.showTooltip("explore")' onmouseout='Game.hideTooltip()'>EXPLORE</div>
        </div>
      `
    }

    if (selectedTab == 'BUILD') {
      str += `
        <div class="content">
          <div class="action" onmouseover='Game.showTooltip("build-chest")' onmouseout='Game.hideTooltip()' onclick='Game.buildChest()'>BUILD CHEST</div>
          <div class="action" onmouseover='Game.showTooltip("build-mining-drill")' onmouseout='Game.hideTooltip()' onclick='Game.buildChest()'>BUILD MINING DRILL</div>
        </div>
      `
    }



    s('.tab-content').innerHTML = str

    Game.rebuildSelectedTab = 0
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
    if (Game.state.wood < (Game.state.stats.chestsOwned * 50)) Game.addLog('invalid', "You don't have enough wood")
    if (Game.state.stone < (Game.state.stats.chestsOwned * 10)) Game.addLog('invalid', "You don't have enough stone")

    if (Game.state.wood >= (Game.state.stats.chestsOwned * 50) && Game.state.stone >= (Game.state.stats.chestsOwned * 10)) {
      Game.state.maxAmount += 100
      Game.spend('wood', Game.state.stats.chestsOwned * 50)
      Game.spend('stone', Game.state.stats.chestsOwned * 10)
      Game.state.stats.chestsOwned++
    }

  }

  Game.buildMiningDrill = () => {

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
      newLog.innerHTML = `You ${words[choose(words)]} 1 ${amount}`
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
