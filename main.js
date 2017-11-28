let s = ((el) => {return document.querySelector(el)})
let select = ((arr, what) => {
  for (i in arr) {
    if (arr[i].name == what) {
      return arr[i]
    }
  }
})
let choose = ((arr) => {return Math.floor(Math.random() * arr.length)})

let Game = {}

Game.launch = () => {

  Game.state = {
    wood: 0,
    stone: 0,
    coal: 0,
    copper: 0,
    iron: 0,
    copperPlate: 0,
    ironPlate: 0,
    copperCoil: 0,
    ironGear: 0,
    redScience: 0,
    blueScience: 0,

    worldResources: [
      {name: 'WOOD', amount: 1000},
      {name: 'STONE', amount: 1000},
      {name: 'COAL', amount: 300},
      {name: 'COPPER', amount: 0},
      {name: 'IRON', amount: 0},
    ],

    miningDrills: [
      {
        type: 'STONE',
        power: 0,
        active: 0,
        fuel: null,
      },
      {
        type: 'COAL',
        power: 0,
        active: 0,
        fuel: null,
      },
      {
        type: 'COPPER',
        power: 0,
        active: 0,
        fuel: null,
      },
      {
        type: 'IRON',
        power: 0,
        active: 0,
        fuel: null,
      },
    ],
    miningDrillsInfo: {
      owned: 0,
      active: 0,
      inactive: 0,
    },

    furnaces: [
      {
        type: 'WOOD',
        power: 0,
        active: 0,
        fuel: null
      },
      {
        type: 'IRON',
        power: 0,
        active: 0,
        fuel: null
      },
      {
        type: 'COPPER',
        power: 0,
        active: 0,
        fuel: null
      }
    ],
    furnacesInfo: {
      owned: 0,
      active: 0,
      inactive: 0
    },

    labs: {
      owned: 0
    },

    tech: {
      currentTech: null
    },

    constructor: {

    },

    constructorInfo: {
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
    }
  }

  Game.load = () => {

    setTimeout(() => {Game.addLog('story', 'You have just crash landed on an alien planet.')}, 1000)
    setTimeout(() => {Game.addLog('story', 'Your goal is to build a rocket ship and escape.')}, 3000)

    actions.forEach((action) => {
      new Action(action)
    })

    technologies.forEach((technology) => {
      new Technology(technology)
    })

    Game.rebuildTabs = 1
    Game.rebuildSelectedTab = 1
    Game.rebuildWorldResources = 1
  }

  Game.earn = (type, total) => {

    if (type == 'wood' || type == 'stone' || type == 'coal' || type == 'copper' || type == 'iron') {
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
    } else {
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

    let gain, loss, selectedResource;

    // DRILLS
    for (i in Game.state.miningDrills) {
      let drill = Game.state.miningDrills[i]
      // IF DRILL IS TURNED ON
      if (drill.power == 1) {
        let resourceNeeded = drill.fuel.toLowerCase()
        gain = drill.active
        if (drill.fuel == 'Wood') loss = drill.active * 2
        if (drill.fuel == 'Coal') loss = Math.ceil(drill.active / 2)
        for (i in Game.state.worldResources) { // GRAB WORLD RESOURCE VALUE
          if (Game.state.worldResources[i].name == drill.type) selectedResource = Game.state.worldResources[i]
        }
        // IF WE HAVE ENOUGH FUEL TO SPEND
        if (Game.state[resourceNeeded] >= loss) {
          // IF WORLD RESOURCE IS MORE THAN 0
          if (selectedResource.amount > 0) {
            if (selectedResource.amount >= gain) {
              Game.earn(drill.type.toLowerCase(), gain)
              Game.state[resourceNeeded] -= loss
            } else {
              Game.earn(drill.type.toLowerCase(), selectedResource.amount)
              Game.state[resourceNeeded] -= loss
            }
          }
        }

        Game.rebuildInventory = 1
      }
    }

    // FURNACES
    for (i in Game.state.furnaces) {
      let furnace = Game.state.furnaces[i]
      // IF THE FURNACE IS ON
      if (furnace.power == 1) {
        let resourceGain = furnace.active
        let resourceLoss = furnace.active * 2
        let selectedFuel = furnace.fuel.toLowerCase()
        let furnaceType = furnace.type.toLowerCase()
        if (furnace.fuel == 'Wood') loss = furnace.active * 2
        if (furnace.fuel == 'Coal') loss = Math.ceil(furnace.active / 2)

        // IF WE HAVE FUEL
        if (Game.state[selectedFuel] >= loss) {
          // IF WE HAVE ENOUGH RESOURCES EX. IRON -> IRON PLATES
          if (Game.state[furnaceType] >= resourceLoss) {
            Game.state[furnaceType] -= resourceLoss
            Game.state[selectedFuel] -= loss
            // if (furnace.type == 'WOOD') Game.earn('coal', resourceGain)
            if (furnace.type == 'WOOD') Game.state.coal += resourceGain
            if (furnace.type == 'COPPER') Game.earn('copperPlate', resourceGain)
            if (furnace.type == 'IRON') Game.earn('ironPlate', resourceGain)
          }
        }
        Game.rebuildInventory = 1
      }
    }
  }

  Game.calculateRemainingTechDuration = () => {

    if (Game.state.tech.currentTech.currentDuration >= 0) {
      Game.state.tech.currentTech.currentDuration -= 30
      let barWidth = 100 - (Game.state.tech.currentTech.currentDuration/Game.state.tech.currentTech.duration * 100)
      if (Game.state.selectedTab == 'TECHNOLOGY') {
        let progressBar = s('.progress')
        progressBar.style.width = barWidth + '%'
      }
    } else {
      Game.recalculateRemainingTechDuration = 0
      Game.addLog('success', `You have completed researching: ${Game.state.tech.currentTech.name}`)
      let tech = select(Game.technologies, Game.state.tech.currentTech.name)
      tech.learned = 1
      tech.inProgress = false
      if (tech.onFinish) {
        if (tech.onFinish.unlockTech) {
          for (i in tech.onFinish.unlockTech) {
            let name = tech.onFinish.unlockTech[i]
            let techToUnlock = select(Game.technologies, name)
            techToUnlock.locked = 0
          }
        }
        if (tech.onFinish.unlockAction) {
          for (i in tech.onFinish.unlockAction) {
            let action = tech.onFinish.unlockAction[i]
            select(Game.actions, action).locked = 0
          }
        }
      }


      Game.state.tech.currentTech = null
      Game.rebuildSelectedTab = 1
    }
  }

  Game.spend = (type, amount) => {
    if (Game.state[type] >= amount) {
      Game.state[type] -= amount
    }

    Game.rebuildInventory = 1
  }

  Game.showTooltip = (text) => {
    let tooltip = s('.tooltip')

    tooltip.innerHTML = text

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

    if (Game.state.copperPlate > 0) {
      str += `
        <div class="inventory-item">
          <p class="inventory-item-name">COPPER PLATE</p>
          <p class='inventory-item-amount'>${Game.state.copperPlate}</p>
        </div>
      `
    }

    if (Game.state.ironPlate > 0) {
      str += `
        <div class="inventory-item">
          <p class="inventory-item-name">IRON PLATE</p>
          <p class='inventory-item-amount'>${Game.state.ironPlate}</p>
        </div>
      `
    }

    if (Game.state.copperCoil > 0) {
      str += `
        <div class="inventory-item">
          <p class="inventory-item-name">COPPER COIL</p>
          <p class='inventory-item-amount'>${Game.state.copperCoil}</p>
        </div>
      `
    }

    if (Game.state.ironGear > 0) {
      str += `
        <div class="inventory-item">
          <p class="inventory-item-name">IRON GEAR</p>
          <p class='inventory-item-amount'>${Game.state.ironGear}</p>
        </div>
      `
    }

    if (Game.state.redScience > 0) {
      str += `
        <div class="inventory-item">
          <p class="inventory-item-name">RED SCIENCE </p>
          <p class='inventory-item-amount'>${Game.state.redScience}</p>
        </div>
      `
    }

    if (Game.state.blueScience > 0) {
      str += `
        <div class="inventory-item">
          <p class="inventory-item-name">BLUE SCIENCE </p>
          <p class='inventory-item-amount'>${Game.state.blueScience}</p>
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

  Game.buildFurnaces = () => {
    let str = `
      <br/>
      <h3>FURNACES <span style='font-size: small'>owned: ${Game.state.furnacesInfo.owned} | active: ${Game.state.furnacesInfo.active} | inactive: ${Game.state.furnacesInfo.inactive}</span></h3>
      <hr/>
      <div class="furnaces-container">
      `
      for (i in Game.state.furnaces) {
        str += `<div class="furnace-container">
          <p style='text-align: center; font-weight: bold;'>${Game.state.furnaces[i].type}</p>
          <hr/>
        `

        // ON AND OFF BUTTONS
        if (Game.state.furnaces[i].power == 0) {
          str += `<p style='margin-bottom: 5px'>Power: <button onclick='Game.toggleFurnacePower(1, ${i})' class="power-btn">OFF</button></p>`
        } else {
          str += `<p style='margin-bottom: 5px'>Power: <button onclick='Game.toggleFurnacePower(0, ${i})' class="power-btn">ON</button></p>`
        }

        // FUEL DROPDOWN
        if (Game.state.furnaces[i].fuel == null) {
          str += `
            <div class="fuel-container">
              <p>Fuel: </p>
              <select id='furnace-fuel-${i}' onchange='Game.changeFurnaceFuel("${i}")'>
                <option selected disabled>Select Fuel Type</option>
                <option value="Wood">Wood</option>
                <option value="Coal">Coal</option>
              </select>
            </div>
          `
        } else if (Game.state.furnaces[i].fuel == 'Wood') {
          str += `
            <div class="fuel-container">
              <p>Fuel: </p>
              <select id='furnace-fuel-${i}' onchange='Game.changeFurnaceFuel("${i}")'>
                <option disabled>Select Fuel Type</option>
                <option selected value="Wood">Wood</option>
                <option value="Coal">Coal</option>
              </select>
            </div>
          `
        } else if (Game.state.furnaces[i].fuel == 'Coal') {
          str += `
            <div class="fuel-container">
              <p>Fuel: </p>
              <select id='furnace-fuel-${i}' onchange='Game.changeFurnaceFuel("${i}")'>
                <option disabled>Select Fuel Type</option>
                <option value="Wood">Wood</option>
                <option selected value="Coal">Coal</option>
              </select>
            </div>
          `
        }

        // BUILD ADD AND REMOVE
        str += `
          <p style='margin-bottom: 5px'>Furnaces: <button onclick='Game.addRemoveFurnace(0, ${i})' class='drill-btn'>-</button>${Game.state.furnaces[i].active}<button onclick='Game.addRemoveFurnace(1, ${i})' class='drill-btn'>+</button></p>
        `

        // FURNACE STATS N SHIT
        if (Game.state.furnaces[i].power == 1) {
          str += `
            <hr/>
            <br/>
          `
          if (Game.state.furnaces[i].type == 'WOOD') {
            str += `
              <p>+${Game.state.furnaces[i].active} coal/s</p>
              <p>-${Game.state.furnaces[i].active * 2} wood/s</p>
            `
          }
          if (Game.state.furnaces[i].type == 'COPPER') {
            str += `
              <p>+${Game.state.furnaces[i].active} copper plate/s</p>
              <p>-${Game.state.furnaces[i].active * 2} copper/s</p>
            `
          }
          if (Game.state.furnaces[i].type == 'IRON') {
            str += `
              <p>+${Game.state.furnaces[i].active} iron plate/s</p>
              <p>-${Game.state.furnaces[i].active * 2} iron/s</p>
            `
          }
          if (Game.state.furnaces[i].fuel == 'Wood') {
            str += `<p>-${Game.state.furnaces[i].active * 2} ${Game.state.furnaces[i].fuel.toLowerCase()}/s</p>`
          } else if (Game.state.furnaces[i].fuel == 'Coal') {
            str += `<p>-${Math.ceil(Game.state.furnaces[i].active / 2)} ${Game.state.furnaces[i].fuel.toLowerCase()}/s</p>`
          }
        }

        str += `</div>`
      }

      str += `</div>`
    return str
  }

  Game.buildConstructors = () => {
    let str = `
      <br/>
      <h3>CONSTRUCTORS</h3>
      <hr/>
      <div class="constructors-container">
        <div class="constructor"></div>
      </div>
    `

    return str
  }

  Game.actions = []

  Game.technologies = []

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
              str += '<div class="next-line-push"></div>'
              str += `<div class="action" onclick='${action.onclick}()' onmouseover='Game.showTooltip("${action.tooltip}")' onmouseout='Game.hideTooltip()'>${action.name}</div>`
            } else {
              str += `<div class="action" onclick='${action.onclick}()' onmouseover='Game.showTooltip("${action.tooltip}")' onmouseout='Game.hideTooltip()'>${action.name}</div>`
            }
          }
        }
      }

      str += `</div>`

      if (Game.state.miningDrillsInfo.owned > 0) str += Game.buildDrills()
      if (Game.state.furnacesInfo.owned > 0) str += Game.buildFurnaces()
      if (Game.state.constructorInfo.owned > 0) str += Game.buildConstructors()
    }

    if (selectedTab == 'BUILD') {

      str += `<div class='content'>`

      for (i in Game.actions) {
        let action = Game.actions[i]
        if (action.tab == 'BUILD') {
          if (!action.locked) {
            if (action.nextLine) {
              str += `<div class="next-line-push"></div>`
              str += `<div class="action" onclick='${action.onclick}()' onmouseover='Game.showTooltip("${action.tooltip}")' onmouseout='Game.hideTooltip()'>${action.name}</div>`
            } else {
              str += `<div class="action" onclick='${action.onclick}()' onmouseover='Game.showTooltip("${action.tooltip}")' onmouseout='Game.hideTooltip()'>${action.name}</div>`
            }
          }
        }
      }

      str += '</div>'
    }

    if (selectedTab == 'TECHNOLOGY') {

      str += `<div class="current-tech">`

      if (!Game.state.tech.currentTech) {
        str += `
          <h3 style='text-align: center; padding: 50px 0; opacity: .6;'>NO CURRENT TECH IN PROGRESS</h3>
          <hr/>
        `
      } else {
        str += `
          <div class="current-tech-container">
            <div class="current-tech-img"></div>
            <div class="current-tech-info">
              <h4>${Game.state.tech.currentTech.name}</h4>
              <div class="progress-bar-container">
                <div class="progress"></div>
              </div>
            </div>
          </div>
          <hr/>
        `
      }

        str += `</div>`

        str += `
          <h3>AVAILABLE TECHNOLOGY</h3>
          <div class="available-techs">
        `

        for (i in Game.technologies) {
          if (Game.technologies[i].locked == 0) {
            if (Game.technologies[i].learned == 0) {
              if (Game.technologies[i].inProgress == false) {
                str += `
                  <div class="available-tech" onclick='Game.learnTech(${JSON.stringify(Game.technologies[i])})' onmouseover='Game.showTooltip("${Game.technologies[i].tooltip}")' onmouseout='Game.hideTooltip()'></div>
                `
              }
            }
          }
        }

        str += `</div>`

        str += `
          <h3>LOCKED TECHNOLOGY</h3>
          <div class="locked-techs">
          `
          for (i in Game.technologies) {
            if (Game.technologies[i].locked == 1) {
              str += `
                <div class="available-tech" onclick='Game.addLog("invalid", "Tech is locked")' onmouseover='Game.showTooltip("<h4>${Game.technologies[i].name.toUpperCase()}</h4><hr/><p>Requires: ${Game.technologies[i].requires}</p>")' onmouseout='Game.hideTooltip()'></div>
              `
            }
          }

          str += `</div>`

    }

    s('.tab-content').innerHTML = str

    Game.rebuildSelectedTab = 0
  }

  Game.toggleFurnacePower = (pow, furnace) => {
    let selectedFurnace = Game.state.furnaces[furnace]

    if (selectedFurnace.fuel != null && selectedFurnace.active > 0) {
      selectedFurnace.power = pow

      Game.rebuildSelectedTab = 1
    } else {
      Game.addLog('invalid', 'Select a fuel type before powering on furnace')
    }

    if (selectedFurnace.active == 0) {
      Game.addLog('invalid', 'Add some furnaces')
    }
  }

  Game.toggleDrillPower = (pow, drill) => {
    let selectedDrill = Game.state.miningDrills[drill]

    if (selectedDrill.fuel != null && selectedDrill.active > 0) {
      selectedDrill.power = pow

      Game.rebuildSelectedTab = 1
    } else {
      Game.addLog('invalid', 'Select a fuel type before powering on drill')
    }

    if (selectedDrill.active == 0) {
      Game.addLog('invalid', 'Add some drills')
    }
  }

  Game.addRemoveDrill = (type, drill) => {
    let selectedDrill = Game.state.miningDrills[drill]

    if (type == 0) {
      // REMOVE DRILLS
      if (selectedDrill.active > 0) {
        selectedDrill.active--
        Game.state.miningDrillsInfo.inactive++
        Game.state.miningDrillsInfo.active--
        if (selectedDrill.active == 0) {
          selectedDrill.power = 0
        }
      }
    } else {
      // ADD DRILLS
      if (Game.state.miningDrillsInfo.inactive > 0) {
        selectedDrill.active++
        Game.state.miningDrillsInfo.inactive--
        Game.state.miningDrillsInfo.active++
      }
    }

    Game.rebuildSelectedTab = 1
  }

  Game.addRemoveFurnace = (type, furnace) => {
    let selectedFurnace = Game.state.furnaces[furnace]

    if (type == 0) {
      // REMOVE furnace
      if (selectedFurnace.active > 0) {
        selectedFurnace.active--
        Game.state.furnacesInfo.inactive++
        Game.state.furnacesInfo.active--
        if (selectedFurnace.active == 0) {
          selectedFurnace.power = 0
        }
      }
    } else {
      // ADD furnace
      if (Game.state.furnacesInfo.inactive > 0) {
        selectedFurnace.active++
        Game.state.furnacesInfo.inactive--
        Game.state.furnacesInfo.active++
      }
    }

    Game.rebuildSelectedTab = 1
  }

  Game.changeFurnaceFuel = (furnace) => {
    let selectedFurnace = Game.state.furnaces[furnace]
    let selectedSelect = s(`#furnace-fuel-${furnace}`)

    selectedFurnace.fuel = selectedSelect.value

    Game.rebuildSelectedTab = 1
  }

  Game.changeFuel = (drill) => {
    let selectedDrill = Game.state.miningDrills[drill]
    let selectedSelect = s(`#fuel-${drill}`)

    selectedDrill.fuel = selectedSelect.value

    Game.rebuildSelectedTab = 1
  }

  Game.buildDrills = () => {
    let str = `
      <br/>
      <h3>DRILLS <span style='font-size: small'>owned: ${Game.state.miningDrillsInfo.owned} | active: ${Game.state.miningDrillsInfo.active} | inactive: ${Game.state.miningDrillsInfo.inactive}</span></h3>
      <hr/>
      <div class="mining-drills-container">
      `
      for (i in Game.state.miningDrills) {
        str += `
          <div class="mining-resource-container">
            <p style='text-align: center; font-weight: bold;'>${Game.state.miningDrills[i].type}</p>
            <hr style='margin-bottom: 5px'/>
            `
            // BUILDS ON AND OFF BUTTONS
            if (Game.state.miningDrills[i].power == 0) {
              str += `<p style='margin-bottom: 5px'>Power: <button onclick='Game.toggleDrillPower(1, ${i})' class="power-btn">OFF</button></p>`
            } else {
              str += `<p style='margin-bottom: 5px'>Power: <button onclick='Game.toggleDrillPower(0, ${i})' class="power-btn">ON</button></p>`
            }

            // BUILDS FUEL DROPDOWN THINGY
            if (Game.state.miningDrills[i].fuel == null) {
              str += `
                <div class="fuel-container">
                  <p>Fuel: </p>
                  <select id='fuel-${i}' onchange='Game.changeFuel("${i}")'>
                    <option selected disabled>Select Fuel Type</option>
                    <option value="Wood">Wood</option>
                    <option value="Coal">Coal</option>
                  </select>
                </div>
              `
            } else if (Game.state.miningDrills[i].fuel == 'Wood') {
              str += `
                <div class="fuel-container">
                  <p>Fuel: </p>
                  <select id='fuel-${i}' onchange='Game.changeFuel("${i}")'>
                    <option disabled>Select Fuel Type</option>
                    <option selected value="Wood">Wood</option>
                    <option value="Coal">Coal</option>
                  </select>
                </div>
              `
            } else if (Game.state.miningDrills[i].fuel == 'Coal') {
              str += `
                <div class="fuel-container">
                  <p>Fuel: </p>
                  <select id='fuel-${i}' onchange='Game.changeFuel("${i}")'>
                    <option disabled>Select Fuel Type</option>
                    <option value="Wood">Wood</option>
                    <option selected value="Coal">Coal</option>
                  </select>
                </div>
              `
            }

            // BUILD ADD/REMOVE DRILLS
            str += `
              <p style='margin-bottom: 5px'>Drills: <button onclick='Game.addRemoveDrill(0, ${i})' class='drill-btn'>-</button>${Game.state.miningDrills[i].active}<button onclick='Game.addRemoveDrill(1, ${i})' class='drill-btn'>+</button></p>
            `

            // DRILL STATS N SHIT
            if (Game.state.miningDrills[i].power == 1) {
              str += `
                <hr/>
                <br/>
                <p>+${Game.state.miningDrills[i].active} ${Game.state.miningDrills[i].type.toLowerCase()}/s</p>
              `
              if (Game.state.miningDrills[i].fuel == 'Wood') {
                str += `<p>-${Game.state.miningDrills[i].active * 2} ${Game.state.miningDrills[i].fuel.toLowerCase()}/s</p>`
              } else if (Game.state.miningDrills[i].fuel == 'Coal') {
                str += `<p>-${Math.ceil(Game.state.miningDrills[i].active / 2)} ${Game.state.miningDrills[i].fuel.toLowerCase()}/s</p>`
              }
            }

            str += `
          </div>
        `
      }

      str += `
      </div>
    `

    return str
  }

  Game.learnTech = (tech) => {
    Game.hideTooltip()

    let selectedTech = select(Game.technologies, tech.name)

    if (!Game.state.tech.currentTech) {
      if (selectedTech.price.RED_SCIENCE && !selectedTech.price.BLUE_SCIENCE) {
        if (Game.state.redScience >= selectedTech.price.RED_SCIENCE) {
          Game.state.redScience -= selectedTech.price.RED_SCIENCE
          Game.rebuildInventory = 1

          Game.state.tech.currentTech = selectedTech
          Game.state.tech.currentTech.currentDuration = selectedTech.duration
          Game.recalculateRemainingTechDuration = 1
          selectedTech.inProgress = true

        } else {
          Game.addLog('invalid', 'You do not have enough red science')
        }
      } else if (selectedTech.price.RED_SCIENCE && selectedTech.price.BLUE_SCIENCE) {
        if (Game.state.redScience >= selectedTech.price.RED_SCIENCE && Game.state.blueScience >= selectedTech.price.BLUE_SCIENCE) {
          Game.state.redScience -= selectedTech.price.RED_SCIENCE
          Game.state.blueScience -= selectedTech.price.BLUE_SCIENCE
          Game.rebuildInventory = 1

          Game.state.tech.currentTech = selectedTech
          Game.state.tech.currentTech.currentDuration = selectedTech.duration
          Game.recalculateRemainingTechDuration = 1
          selectedTech.inProgress = true
        } else {
          if (Game.state.redScience < selectedTech.price.RED_SCIENCE) Game.addLog('invalid', 'Not enough red science')
          if (Game.state.blueScience < selectedTech.price.BLUE_SCIENCE) Game.addLog('invalid', 'Not enough blue science')
        }
      }
    } else {
      Game.addLog('invalid', 'You are already researching something')
    }

    Game.rebuildSelectedTab = 1
  }

  Game.explore = () => {
    // // Game.addLog(null, 'You explore your surroundings but found nothing notable.')
    // let amounts = [1, 5, 10]
    // let amount = Math.floor(Math.random() * 20) + 1

    let selectedType = Game.state.worldResources[choose(Game.state.worldResources)]
    let selectedAmount = Math.floor(Math.random() * 20) + 1

    if (Math.random() >= .3) { // 70% chance
      selectedType.amount += selectedAmount

      // UNLOCK BUTTONS
      if (selectedType.name == 'COAL') Game.actions[3].locked = 0
      if (selectedType.name == 'COPPER') Game.actions[4].locked = 0
      if (selectedType.name == 'IRON') Game.actions[5].locked = 0

      // patch of ...
      // vein of ...

      Game.addLog(null, `You find ${selectedAmount} ${selectedType.name.toLowerCase()}.`)
      Game.rebuildWorldResources = 1
      Game.rebuildSelectedTab = 1
    } else {
      Game.addLog(null, 'You explore your surroundings but found nothing notable.')
    }
  }

  Game.chopTree = () => {
    // Math.floor(Math.random() * (max - min + 1)) + min
    let amount = Math.floor(Math.random() * (7 - 5 + 1)) + 5

    if (Game.state.worldResources[0].amount >= amount) {
      Game.earn('wood', amount)
    } else {
      amount = Game.state.worldResources[0].amount
      Game.earn('wood', amount)
    }

    Game.addLog('wood', amount)
  }

  Game.mineRock = () => {
    // Math.floor(Math.random() * (max - min + 1)) + min
    let amount = Math.floor(Math.random() * (5 - 3 + 1)) + 3

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

  Game.burnWood = () => {
    if (Game.state.wood >= 2) {
      Game.state.wood -= 2
      Game.state.coal++

      Game.rebuildInventory = 1
    } else {
      Game.addLog('invalid', 'Not enough resources')
    }
  }

  Game.smeltCopper = () => {
    if (Game.state.copper >= 2) {
      Game.state.copper -= 2
      Game.state.copperPlate++

      Game.rebuildInventory = 1
    } else {
      Game.addLog('invalid', 'Not enough resources')
    }
  }

  Game.smeltIron = () => {
    if (Game.state.iron >= 2) {
      Game.state.iron -= 2
      Game.state.ironPlate++

      Game.rebuildInventory = 1
    } else {
      Game.addLog('invalid', 'Not enough resources')
    }
  }

  Game.buildMiningDrill = () => {
    if (Game.state.wood < 100) Game.addLog('invalid', "You don't have enough wood")
    if (Game.state.stone < 100) Game.addLog('invalid', "You don't have enough stone")

    if (Game.state.wood >= 100 && Game.state.stone >= 100) {
      Game.spend('wood', 100)
      Game.spend('stone', 100)
      Game.state.miningDrillsInfo.owned++
      Game.state.miningDrillsInfo.inactive++
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
      Game.state.furnacesInfo.owned++
      Game.state.furnacesInfo.inactive++
      Game.addLog('craft', 'furnace')

      // UNLOCK NEW BUTTONS
      if (select(Game.actions, "BURN WOOD").locked == 1) {
        select(Game.actions, "BURN WOOD").locked = 0
        select(Game.actions, "SMELT COPPER").locked = 0
        select(Game.actions, "SMELT IRON").locked = 0
      }

      Game.rebuildSelectedTab = 1

    }
  }

  Game.buildRedScience = () => {
    if (Game.state.copperPlate >= 1 && Game.state.ironPlate >= 1) {
      Game.state.copperPlate--
      Game.state.ironPlate--
      Game.state.redScience++

      Game.addLog('success', 'You crafted a red science')

      Game.rebuildInventory = 1
    } else {
      if (Game.state.copperPlate < 1) Game.addLog('invalid', 'You do not have enough copper plates')
      if (Game.state.ironPlate < 1) Game.addLog('invalid', 'You do not have enough iron plates')
    }
  }

  Game.buildLab = () => {
    if (Game.state.stone < 50) Game.addLog('invalid', 'You dont have enough stone')
    if (Game.state.iron < 10) Game.addLog('invalid', 'You dont have enough iron')

    if (Game.state.stone >= 50 && Game.state.iron >= 10) {
      Game.spend('stone', 50)
      Game.spend('iron', 10)
      Game.state.labs.owned++

      let redScience = select(Game.actions, "BUILD RED SCIENCE")
      if (redScience.locked == 1) redScience.locked = 0


      Game.rebuildSelectedTab = 1
      Game.addLog('craft', 'lab')

      if (Game.state.tabs[2].locked == true) {
        Game.state.tabs[2].locked = false
        Game.rebuildTabs = 1
      }

    }
  }

  Game.buildIronGear = () => {
    if (Game.state.ironPlate >= 2) {
      Game.state.ironPlate -= 2
      Game.state.ironGear += 1

      Game.addLog('success', 'You made an iron gear')

      Game.rebuildInventory = 1
    } else {
      Game.addLog('invalid', 'You do not have enough iron plates')
    }
  }

  Game.buildCopperCoil = () => {
    if (Game.state.copperPlate >= 2) {
      Game.state.copperPlate -= 2
      Game.state.copperCoil += 1

      Game.addLog('success', 'You crafted a copper coil')

      Game.rebuildInventory = 1
    } else {
      Game.addLog('invalid', 'You do not have enough copper plates')
    }
  }

  Game.buildConstructor = () => {
    if (Game.state.ironPlate >= 5 && Game.state.ironGear >= 2 && Game.state.copperCoil >= 3) {
      Game.state.ironPlate -= 5
      Game.state.ironGear -= 2
      Game.state.copperCoil -= 3

      Game.addLog("success", 'You made a constructor')

      Game.state.constructorInfo.owned++
    } else {
      if (Game.state.ironPlate < 5) Game.addLog('invalid', 'You do not have enough iron plates')
      if (Game.state.ironGear < 2) Game.addLog('invalid', 'You do not have enough iron gears')
      if (Game.state.copperCoil < 3) Game.addLog('invalid', 'You do not have enough copper coils')
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
    } else if (type == 'success') {
      newLog.innerHTML = `<p style='color: darkgreen'>${amount}</p>`
    }else {
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
    if (Game.recalculateRemainingTechDuration) Game.calculateRemainingTechDuration()

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
    Game.state.ironPlate += 200
    Game.state.copperPlate += 200
    Game.state.redScience += 200
    Game.buildInventory()
  }


}

window.onload = () => Game.launch()
