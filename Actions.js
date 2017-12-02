let Action = function(action) {
  this.name = action.name
  this.tab = action.tab
  if (this.tab == 'BUILD') {
    this.name = `BUILD ${action.name}`
    this.itemName = action.name
  }
  this.tooltip = action.tooltip
  this.onclick = action.onclick
  this.locked = action.locked
  if (action.price) this.price = action.price
  if (action.nextLine) this.nextLine = action.nextLine
  action.cooldown ? this.cooldown = action.cooldown * 1000 : this.cooldown = 2 * 1000
  // action.currentCooldown ? this.currentCooldown = action.currentCooldown : this.currentCooldown = null

  Game.actions.push(this)
}

let actions = [
  {
    name: 'EXPLORE',
    tab: 'GATHER',
    tooltip: '<p>Look around your surroundings</p>',
    onclick: 'Game.explore',
    locked: 1,
    cooldown: 5
  }, {
    name: 'CHOP TREE',
    tab: 'GATHER',
    tooltip: '<p>Gain 5-7 wood</p>',
    onclick: 'Game.chopTree',
    locked: 0,
    nextLine: true,
  }, {
    name: 'MINE ROCK',
    tab: 'GATHER',
    tooltip: '<p>Gain 3-5 stone</p>',
    onclick: 'Game.mineRock',
    locked: 0,
  }, {
    name: 'MINE COAL',
    tab: 'GATHER',
    tooltip: '<p>Gain 1 coal</p>',
    onclick: 'Game.mineCoal',
    locked: 1,
  }, {
    name: 'MINE COPPER',
    tab: 'GATHER',
    tooltip: '<p>Gain 1 copper</p>',
    onclick: 'Game.mineCopper',
    locked: 1,
  }, {
    name: 'MINE IRON',
    tab: 'GATHER',
    tooltip: '<p>Gain 1 iron</p>',
    onclick: 'Game.mineIron',
    locked: 1,
  }, {
    name: 'BURN WOOD',
    tab: 'GATHER',
    tooltip: '<p>Gain 1 coal for 2 wood</p>',
    onclick: 'Game.burnWood',
    locked: 1,
    nextLine: true
  }, {
    name: 'SMELT COPPER',
    tab: 'GATHER',
    tooltip: '<p>Gain 1 copper plate for 1 copper</p>',
    onclick: 'Game.smeltCopper',
    locked: 1
  }, {
    name: 'SMELT IRON',
    tab: 'GATHER',
    tooltip: '<p>Gain 1 iron plate for 1 iron</p>',
    onclick: 'Game.smeltIron',
    locked: 1
  }, {
    name: 'MINING DRILL',
    tab: 'BUILD',
    price: [
      {
        type: 'wood',
        amount: 30
      }, {
        type: 'stone',
        amount: 30
      }
    ],
    tooltip: '<p><strong>Cost: 30 wood, 30 stone</strong></p><p><i>Allows for automation</i></p>',
    onclick: 'buildMiningDrill',
    locked: 0,
    cooldown: 6
  }, {
    name: 'FURNACE',
    tab: 'BUILD',
    price: [
      {
        type: 'stone',
        amount: 100
      }, {
        type: 'coal',
        amount: 25
      }
    ],
    tooltip: '<p><strong>Cost: 100 stone, 25 coal</strong></p><p><i>Smelts raw materials</i></p>',
    onclick: 'buildFurnace',
    locked: 0,
    cooldown: 6
  }, {
    name: 'LAB',
    tab: 'BUILD',
    price: [
      {
        type: 'stone',
        amount: 50
      }, {
        type: 'iron',
        amount: 10
      }
    ],
    tooltip: '<p><strong>Cost: 50 stone, 10 iron</strong></p><p><i>Enables technology</i></p>',
    onclick: 'buildLab',
    locked: 0,
    cooldown: 6
  }, {
    name: 'CONSTRUCTOR',
    tab: 'BUILD',
    price: [
      {
        type: 'ironPlate',
        amount: 5,
      }, {
        type: 'ironGear',
        amount: 2,
      }, {
        type: 'copperCoil',
        amount: 3
      }
    ],
    tooltip: '<p><strong>Cost: 5 iron plates, 2 iron gears, 3 copper coils</strong></p><p><i>Automate the constructing of an item</i></p>',
    onclick: 'buildConstructor',
    locked: 1,
    cooldown: 6
  }, {
    name: 'RED SCIENCE',
    tab: 'BUILD',
    price: [
      {
        type: 'copperPlate',
        amount: 1
      }, {
        type: 'ironPlate',
        amount: 1
      }
    ],
    tooltip: '<p><strong>Cost: 1 copper plate, 1 iron plate</strong></p><p><i>Used for basic science</i></p>',
    onclick: 'buildRedScience',
    locked: 1,
    nextLine: true
  }, {
    name: 'BLUE SCIENCE',
    tab: 'BUILD',
    price: [
      {
        type: 'copperCoil',
        amount: 3
      }, {
        type: 'ironScrews',
        amount: 3
      }
    ],
    tooltip: '<p><strong>Cost: 3 copper coils, 3 iron screws</strong></p><p><i>Used for intermediate science</i></p>',
    onclick: 'buildBlueScience',
    locked: 1,
  }, {
    name: 'IRON GEAR',
    tab: 'BUILD',
    price: [
      {
        type: 'ironPlate',
        amount: 2
      }
    ],
    tooltip: '<p><strong>Cost: 2 iron plates</strong></p><p><i>Used for crafting</i></p>',
    onclick: 'buildIronGear',
    locked: 1,
    nextLine: true
  }, {
    name: 'COPPER COIL',
    tab: 'BUILD',
    price: [
      {
        type: 'copperPlate',
        amount: 2
      }
    ],
    tooltip: '<p><strong>Cost: 2 copper plates</strong></p><p><i>Used for crafting</i></p>',
    onclick: 'buildCopperCoil',
    locked: 1,
  }
]
