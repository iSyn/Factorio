let s = ((el) => {return document.querySelector(el)})
let choose = ((arr) => {return Math.floor(Math.random() * arr.length)})

let Game = {}

Game.launch = () => {

  Game.state = {
    wood: 0,
    stone: 0,
    coal: 0,
    copper: 0,
    iron: 0,
    // maxAmount: 100,

    worldResources: [
      {name: 'WOOD', amount: 400},
      {name: 'STONE', amount: 400},
      {name: 'COAL', amount: 0},
      {name: 'COPPER', amount: 0},
      {name: 'IRON', amount: 0},
    ],

    miningDrills: {
      owned: 0,
      active: 0,
      inactive: 0,
      STONE: {active: 0, fuel: null, amountLeftFromFuel: 0},
      COAL: {active: 0, fuel: null, amountLeftFromFuel: 0},
      COPPER: {active: 0, fuel: null, amountLeftFromFuel: 0},
      IRON: {active: 0, fuel: null, amountLeftFromFuel: 0}
    },

    furnaces: {
      owned: 0
    },

    labs: {
      owned: 0
    },

    selectedTab: 'ACTION',
    tabs: [
      {name: 'ACTION', locked: false},
      {name: 'BUILD', locked: false},
      {name: 'TECHNOLOGY', locked: true}
    ],

    stats: {
      overallTotalWood: 0,
      overallTotalStone: 0,
      overallTotalCoal: 0,
      overallTotalCopper: 0,
      overallTotalIron: 0,

      chestsOwned: 0,
    }
  }

  Game.load = () => {

    setTimeout(() => {Game.addLog('story', 'You have just crash landed on an alien planet.')}, 1000)
    setTimeout(() => {Game.addLog('story', 'Your goal is to build a rocket ship and escape.')}, 3000)

    actions.forEach((action) => {
      new Action(action)
    })

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
      Game.state[type] += total
    }

    if (type == 'stone') Game.state.stats.overallTotalStone += total
    if (type == 'wood') Game.state.stats.overallTotalWood += total
    if (type == 'coal') Game.state.stats.overallTotalCoal += total
    if (type == 'copper') Game.state.stats.overallTotalCopper += total
    if (type == 'iron') Game.state.stats.overallTotalIron += total

    Game.rebuildInventory = 1
    Game.rebuildWorldResources = 1
  }

  Game.earnPassiveResources = () => {
    // if (Game.state.miningDrills.STONE > 0) {
    //   let gain = Game.state.miningDrills.STONE * 2 // STONE GAIN
    //   let loss = Math.ceil(Game.state.miningDrills.STONE / 2) // WOOD LOSS

    //   if (Game.state.worldResources[1].amount >= gain && Game.state.wood >= loss) {
    //     Game.earn('stone', gain)
    //     Game.spend('wood', loss)
    //   }

    // Game.rebuildInventory = 1
    // }

    let resourceGain = 0;
    let resourceLoss = 0;

    let coalBonus = 5
    let woodBonus = 2

    // IF THERE ARE DRILLS ON STONE
    if (Game.state.miningDrills.STONE.active > 0) {
      resourceGain = Game.state.miningDrills.STONE.active // STONE GAIN
      resourceLoss = Game.state.miningDrills.STONE.active // FUEL LOSS
      // IF STONE DRILL HAS SELECTED FUEL
      if (Game.state.miningDrills.STONE.fuel != null) {
        let selectedFuel = Game.state.miningDrills.STONE.fuel.toLowerCase()

        // IF DRILL STILL HAS FUEL, DONT TAKE RESOURCES, ONLY GAIN
        console.log('AMOUNT LEFT FROM FUEL:', Game.state.miningDrills.STONE.amountLeftFromFuel)
        if (Game.state.miningDrills.STONE.amountLeftFromFuel > 0) {
          console.log('has fuel')
          Game.earn('stone', resourceGain)
          Game.state.miningDrills.STONE.amountLeftFromFuel--
        } else {
          console.log('adding fuel')
          // IF DRILL DOESNT HAVE FUEL
          // ADD FUEL
          if (Game.state.miningDrills.STONE.fuel == 'wood') {
            Game.state.miningDrills.STONE.amountLeftFromFuel = woodBonus
          } else {
            Game.state.miningDrills.STONE.amountLeftFromFuel = coalBonus
          }
          // EARN RESOURCES
          Game.earn('stone', resourceGain)
          // SPEND FUEL
          Game.state.miningDrills.STONE.amountLeftFromFuel--
          console.log('selected fuel', selectedFuel)
          Game.spend(`${selectedFuel}`, resourceLoss)
        }

      }
    }
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

    if (type == 'mine-coal') tooltip.innerHTML = '<p>Gain 1 coal</p>'
    if (type == 'mine-copper') tooltip.innerHTML = '<p>Gain 1 copper</p>'
    if (type == 'mine-iron') tooltip.innerHTML = '<p>Gain 1 iron</p>'

    if (type == 'build-mining-drill') {
      tooltip.innerHTML = `
        <p>Cost: 100 wood, 100 stone</p>
        <p><i>Allows for automation</i></p>
      `
    }

    if (type == 'build-furnace') {
      tooltip.innerHTML = `
        <p>Cost: 100 stone, 25 coal</p>
        <p><i>Smelts raw materials</i></p>
      `
    }

    if (type == 'build-lab') {
      tooltip.innerHTML = `
        <p>Costs: 50 stone, 10 raw iron</p>
        <p><i>Enables TECHNOLOGY <br/> Increases technology speed</i></p>
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
      if (Game.state.worldResources[i].amount > 0) {
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

    if (Game.state.stats.overallTotalWood > 0 || Game.state.wood > 0) {
      str += `
        <div class="inventory-item">
          <p class="inventory-item-name">WOOD</p>
          <p class='inventory-item-amount'>${Game.state.wood}</p>
        </div>
      `
    }

    if (Game.state.stats.overallTotalStone > 0 || Game.state.stone > 0) {
      str += `
        <div class="inventory-item">
          <p class="inventory-item-name">STONE</p>
          <p class='inventory-item-amount'>${Game.state.stone}</p>
        </div>
      `
    }

    if (Game.state.stats.overallTotalCoal > 0 || Game.state.coal > 0) {
      str += `
        <div class="inventory-item">
          <p class="inventory-item-name">COAL</p>
          <p class='inventory-item-amount'>${Game.state.coal}</p>
        </div>
      `
    }

    if (Game.state.stats.overallTotalCopper > 0 || Game.state.copper > 0) {
      str += `
        <div class="inventory-item">
          <p class="inventory-item-name">COPPER</p>
          <p class='inventory-item-amount'>${Game.state.copper}</p>
        </div>
      `
    }

    if (Game.state.stats.overallTotalIron > 0 || Game.state.iron > 0) {
      str += `
        <div class="inventory-item">
          <p class="inventory-item-name">IRON</p>
          <p class='inventory-item-amount'>${Game.state.iron}</p>
        </div>
      `
    }

    s('.inventory-container').innerHTML = str

    Game.rebuildInventory = 0
  }

  Game.buildTabs = () => {
    let str = ``

    for (i in Game.state.tabs) {
      if (Game.state.tabs[i].locked == false) {
        str += `<h3 id="${Game.state.tabs[i].name}-tab" class='tab' onclick='Game.changeTab("${Game.state.tabs[i].name}")'>${Game.state.tabs[i].name}</h3> &nbsp; &nbsp;`
      }
    }

    s('.tabs').innerHTML = str

    s(`#${Game.state.selectedTab}-tab`).style.textDecoration = 'underline'
    s(`#${Game.state.selectedTab}-tab`).style.color = 'black'

    Game.rebuildTabs = 0
  }

  Game.changeTab = (tab) => {
    s('.tab-content').classList.remove('fadeIn')
    Game.state.selectedTab = tab
    Game.rebuildTabs = 1
    Game.rebuildSelectedTab = 1
    s('.tab-content').classList.add('fadeIn')
    setTimeout(() => {
      s('.tab-content').classList.remove('fadeIn')
    }, 500)
  }

  Game.changeFuelOption = (drill) => {
    let selectedDrill = s(`#${drill}-fuel`)

    Game.state.miningDrills[drill].fuel = selectedDrill.value

    Game.rebuildSelectedTab = 1
  }

  Game.buildDrills = () => {
    let str = `
      <br/>
      <h3>DRILLS <span style='font-size: small'>(owned: ${Game.state.miningDrills.owned} | active: ${Game.state.miningDrills.active} | inactive: ${Game.state.miningDrills.inactive})</span></h3>
      <hr/>
      <div class="mining-drills-container">
        `
        for (i in Game.state.worldResources) {
          if (!Game.state.worldResources[i].locked) {
            if (Game.state.worldResources[i].name != 'WOOD') {
              let name = Game.state.worldResources[i].name

              str += `
                <div id='drill-${i}' class="mining-resource-container">
                  <p class="mining-resource-name">${Game.state.worldResources[i].name}</p>
                  <hr style='margin-bottom: 5px;' />
                  <div class="fuel-container">
                    <p>Fuel: </p>
                    `
                      if (Game.state.miningDrills[name].fuel == null) {
                        str += `
                          <select id='${name}-fuel' onchange='Game.changeFuelOption("${name}")'>
                            <option disabled selected>Select Fuel Type</option>
                            <option value="Wood">Wood</option>
                            <option value="Coal">Coal</option>
                          </select>
                        `
                      } else {
                        if (Game.state.miningDrills[name].fuel == 'Wood') {
                          str += `
                            <select id='${name}-fuel' onchange='Game.changeFuelOption("${name}")'>
                              <option disabled>Select Fuel Type</option>
                              <option selected value="Wood">Wood</option>
                              <option value="Coal">Coal</option>
                            </select>
                          `
                        } else if (Game.state.miningDrills[name].fuel == 'Coal') {
                          str += `
                            <select id='${name}-fuel' onchange='Game.changeFuelOption("${name}")'>
                              <option disabled>Select Fuel Type</option>
                              <option value="Wood">Wood</option>
                              <option selected value="Coal">Coal</option>
                            </select>
                          `
                        }
                      }

                    str += `
                  </div>
                  <p>Drills: <button class='drill-btn' onclick='Game.removeDrill("${Game.state.worldResources[i].name}")'>-</button>${Game.state.miningDrills[name].active}<button class='drill-btn' onclick='Game.addDrill("${Game.state.worldResources[i].name}")'>+</button></p>
                  <br/>
                  <hr/>

                  `

                  if (Game.state.miningDrills[name].active > 0) {
                    if (Game.state.miningDrills[name].fuel != null) {
                      str += Game.drillStats(`${name}`)
                    } else {
                      str += '<p>Select fuel to start drilling</p>'
                    }
                  }

                  str += `</div>`

            }
          }
        }

        str += `

      </div>
    `
    return str
  }

  Game.drillStats = (drill) => {
    console.log('drillstats firing')
    let selectedDrill = Game.state.miningDrills[drill]


    let str = `
      <div class="drill-stats">
        <p style='font-weight: bold; text-align: center'>STATS</p>
        <hr/>
        <p>+${selectedDrill.active} ${drill.toLowerCase()}/s</p>
        <p>-${selectedDrill.active} ${selectedDrill.fuel.toLowerCase()}/4s</p>
      </div>
    `

    return str
  }

  Game.buildFurnaces = () => {
    let str = `
      <br/>
      <h3>FURNACES</h3>
      <hr/>
    `
    return str
  }

  Game.addDrill = (type) => {

    // IF WE HAVE AVAILABLE DRILLS
    if (Game.state.miningDrills.inactive > 0) {
      // MINUS ONE FROM AVAILABLE DRILLS
      Game.state.miningDrills.inactive--
      // ADD ONE TO ACTIVE DRILLS
      Game.state.miningDrills.active++

      // ADD ONE TO SELECTED ACTIVE DRILL
      Game.state.miningDrills[type].active++

      Game.rebuildSelectedTab = 1
    }
  }

  Game.removeDrill = (type) => {

    // IF SELECTED DRILL HAS ACTIVE
    if (Game.state.miningDrills[type].active > 0) {
      // MINUS ONE FROM SELECTED DRILL
      Game.state.miningDrills[type].active--
      // MINUS ONE FROM ACTIVE
      Game.state.miningDrills.active--
      // ADD ONE BACK TO INACTIVE
      Game.state.miningDrills.inactive++

      Game.rebuildSelectedTab = 1

    }
  }

  Game.actions = []
  let Action = function(action) {
    this.name = action.name
    this.tab = action.tab
    this.tooltip = action.tooltip
    this.onclick = action.onclick
    this.locked = action.locked
    if (action.nextLine) this.nextLine = action.nextLine

    Game.actions.push(this)
  }

  let actions = [
    {
      name: 'EXPLORE',
      tab: 'GATHER',
      tooltip: 'explore',
      onclick: 'Game.explore',
      locked: 0,
      nextLine: true
    }, {
      name: 'CHOP TREE',
      tab: 'GATHER',
      tooltip: 'chop-tree',
      onclick: 'Game.chopTree',
      locked: 0
    }, {
      name: 'MINE ROCK',
      tab: 'GATHER',
      tooltip: 'mine-stone',
      onclick: 'Game.mineRock',
      locked: 0
    }, {
      name: 'MINE COAL',
      tab: 'GATHER',
      tooltip: 'mine-coal',
      onclick: 'Game.mineCoal',
      locked: 1
    }, {
      name: 'MINE COPPER',
      tab: 'GATHER',
      tooltip: 'mine-copper',
      onclick: 'Game.mineCopper',
      locked: 1
    }, {
      name: 'MINE IRON',
      tab: 'GATHER',
      tooltip: 'mine-iron',
      onclick: 'Game.mineIron',
      locked: 1
    }, {
      name: 'BUILD MINING DRILL',
      tab: 'BUILD',
      tooltip: 'build-mining-drill',
      onclick: 'Game.buildMiningDrill',
      locked: 0
    }, {
      name: 'BUILD FURNACE',
      tab: 'BUILD',
      tooltip: 'build-furnace',
      onclick: 'Game.buildFurnace',
      locked: 0
    }, {
      name: 'BUILD LAB',
      tab: 'BUILD',
      tooltip: 'build-lab',
      onclick: 'Game.buildLab',
      locked: 0
    }
  ]

  Game.buildSelectedTab = () => {
    let selectedTab = Game.state.selectedTab
    let str = ''

    if (selectedTab == 'ACTION') {

      str += `<div class="content">`

      for (i in Game.actions) {
        let action = Game.actions[i]
        if (action.tab == 'GATHER') {
          if (!action.locked) {
            if (action.nextLine) {
              str += `<div class="action" onclick='${action.onclick}()' onmouseover='Game.showTooltip("${action.tooltip}")' onmouseout='Game.hideTooltip()'>${action.name}</div>`
              str += '<div class="next-line-push"></div>'
            } else {
              str += `<div class="action" onclick='${action.onclick}()' onmouseover='Game.showTooltip("${action.tooltip}")' onmouseout='Game.hideTooltip()'>${action.name}</div>`
            }
          }
        }
      }

      str += `</div>`

      if (Game.state.miningDrills.owned > 0) str += Game.buildDrills()
      if (Game.state.furnaces.owned > 0) str += Game.buildFurnaces()

    }

    if (selectedTab == 'BUILD') {

      str += `<div class='content'>`

      for (i in Game.actions) {
        let action = Game.actions[i]
        if (action.tab == 'BUILD') {
          if (!action.locked) {
            str += `<div class="action" onclick='${action.onclick}()' onmouseover='Game.showTooltip("${action.tooltip}")' onmouseout='Game.hideTooltip()'>${action.name}</div>`
          }
        }
      }

      str += '</div>'

    }



    s('.tab-content').innerHTML = str

    Game.rebuildSelectedTab = 0
  }

  Game.explore = () => {
    // Game.addLog(null, 'You explore your surroundings but found nothing notable.')
    let amounts = [1, 3, 5, 10]
    let amount = Math.floor(Math.random() * 10) + 1

    let selectedType = Game.state.worldResources[choose(Game.state.worldResources)]
    let selectedAmount = Math.floor(Math.random() * 10) + 1

    if (Math.random() >= .3) { // 70% chance
      selectedType.amount += selectedAmount

      // UNLOCK BUTTONS
      if (selectedType.name == 'COAL') Game.actions[3].locked = 0
      if (selectedType.name == 'COPPER') Game.actions[4].locked = 0
      if (selectedType.name == 'IRON') Game.actions[5].locked = 0

      Game.addLog(null, `You find ${selectedAmount} ${selectedType.name.toLowerCase()}.`)
      Game.rebuildWorldResources = 1
      Game.rebuildSelectedTab = 1
    } else {
      Game.addLog(null, 'You explore your surroundings but found nothing notable.')
    }
  }

  Game.chopTree = () => {
    // Math.floor(Math.random() * (max - min + 1)) + min
    let amount = Math.floor(Math.random() * (5 - 3 + 1)) + 3

    if (Game.state.worldResources[0].amount >= amount) {
      Game.earn('wood', amount)
    } else {
      amount = Game.state.worldResources[0].amount
      Game.earn('wood', amount)
    }

    Game.addLog('wood', amount)
  }

  Game.mineRock = () => {
    let amount = Math.floor(Math.random() * 2) + 1

    if (Game.state.worldResources[1].amount >= amount) {
      Game.earn('stone', amount)
    } else {
      amount = Game.state.worldResources[1].amount
      Game.earn('stone', amount)
    }

    Game.addLog('mine', amount)
  }

  Game.mineCoal = () => {
    let amount = 1
    if (Game.state.worldResources[2].amount >= amount) {
      Game.earn('coal', amount)
    } else {
      amount = 0
      Game.earn('coal', amount)
    }

    Game.addLog('mine', amount)
  }

  Game.mineCopper = () => {
    let amount = 1
    if (Game.state.worldResources[3].amount >= amount) {
      Game.earn('copper', amount)
    } else {
      amount = 0
      Game.earn('copper', amount)
    }

    Game.addLog('mine', amount)
  }

  Game.mineIron = () => {
    let amount = 1
    if (Game.state.worldResources[4].amount >= amount) {
      Game.earn('iron', amount)
    } else {
      amount = 0
      Game.earn('iron', amount)
    }

    Game.addLog('mine', amount)
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

  Game.buildFurnace = () => {
    if (Game.state.stone < 100) Game.addLog('invalid', 'You dont have enough stone')
    if (Game.state.coal < 25) Game.addLog('invalid', 'You dont have enough coal')

    if (Game.state.stone >= 100 && Game.state.coal >= 25) {
      Game.spend('stone', 100)
      Game.spend('coal', 25)
      Game.state.furnaces.owned++
      Game.rebuildSelectedTab = 1
      Game.addLog('craft', 'furnace')
    }
  }

  Game.buildLab = () => {
    console.log('buildLab firing')
    if (Game.state.stone < 50) Game.addLog('invalid', 'You dont have enough stone')
    if (Game.state.iron < 10) Game.addLog('invalid', 'You dont have enough iron')

    if (Game.state.stone >= 50 && Game.state.iron >= 10) {
      Game.spend('stone', 50)
      Game.spend('iron', 10)
      Game.state.labs.owned++
      Game.rebuildSelectedTab = 1
      Game.addLog('craft', 'lab')

      // if (Game.state.tabs[2].locked == true) {
      //   Game.state.tabs[2].locked == false

      //   Game.rebuildTabs = 1
      // }
      console.log(Game.state.tabs[2])
      if (Game.state.tabs[2].locked == true) {
        console.log('tab is locked')
        Game.state.tabs[2].locked = false
        Game.rebuildTabs = 1
      }

    }
  }

  Game.addLog = (type, amount) => {
    let newLog = document.createElement('p')
    newLog.classList.add('log')

    if (type == 'mine') {
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

  let counter = 0
  Game.logic = () => {
    counter++

    if (counter % 30 == 0) Game.earnPassiveResources()

    if (Game.rebuildInventory) Game.buildInventory()
    if (Game.rebuildTabs) Game.buildTabs()
    if (Game.rebuildSelectedTab) Game.buildSelectedTab()
    if (Game.rebuildWorldResources) Game.buildWorldResources()

    setTimeout(Game.logic, 1000/30)
  }

  Game.load()
  Game.logic()

  s('header').onclick = () => {
    console.log('clicked')
    Game.state.wood += 200
    Game.state.stone += 200
    Game.state.iron += 200
    Game.state.coal += 200
    Game.state.copper += 200
    Game.buildInventory()
  }


}

window.onload = () => Game.launch()
