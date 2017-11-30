let Action = function(action) {
  this.name = action.name
  this.tab = action.tab
  this.tooltip = action.tooltip
  this.onclick = action.onclick
  this.locked = action.locked
  if (action.nextLine) this.nextLine = action.nextLine
  action.cooldown ? this.cooldown = action.cooldown * 1000 : this.cooldown = 2 * 1000
  action.currentCooldown ? this.currentCooldown = action.currentCooldown : this.currentCooldown = null

  Game.actions.push(this)
}

let actions = [
  {
    name: 'EXPLORE',
    tab: 'GATHER',
    tooltip: '<p>Look around your surroundings</p>',
    onclick: 'Game.explore',
    locked: 1,
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
    name: 'BUILD MINING DRILL',
    tab: 'BUILD',
    tooltip: '<p><strong>Cost: 20 wood, 20 stone</strong></p><p><i>Allows for automation</i></p>',
    onclick: 'Game.buildMiningDrill',
    locked: 0
  }, {
    name: 'BUILD FURNACE',
    tab: 'BUILD',
    tooltip: '<p><strong>Cost: 100 stone, 25 coal</strong></p><p><i>Smelts raw materials</i></p>',
    onclick: 'Game.buildFurnace',
    locked: 0
  }, {
    name: 'BUILD LAB',
    tab: 'BUILD',
    tooltip: '<p><strong>Cost: 50 stone, 10 iron</strong></p><p><i>Enables technology</i></p>',
    onclick: 'Game.buildLab',
    locked: 0,
  }, {
    name: 'BUILD CONSTRUCTOR',
    tab: 'BUILD',
    tooltip: '<p><strong>Cost: 5 iron plates, 2 iron gears, 3 copper coils</strong></p><p><i>Automate the constructing of an item</i></p>',
    onclick: 'Game.buildConstructor',
    locked: 1
  }, {
    name: 'BUILD RED SCIENCE',
    tab: 'BUILD',
    tooltip: '<p><strong>Cost: 1 copper plate, 1 iron plate</strong></p><p><i>Used for basic science</i></p>',
    onclick: 'Game.buildRedScience',
    locked: 1,
    nextLine: true
  }, {
    name: 'BUILD BLUE SCIENCE',
    tab: 'BUILD',
    tooltip: '<p><strong>Cost: 3 copper coils, 3 iron screws</strong></p><p><i>Used for intermediate science</i></p>',
    onclick: 'Game.buildBlueScience',
    locked: 1,
  }, {
    name: 'BUILD IRON GEAR',
    tab: 'BUILD',
    tooltip: '<p><strong>Cost: 2 iron plates</strong></p><p><i>Used for crafting</i></p>',
    onclick: 'Game.buildIronGear',
    locked: 1,
    nextLine: true
  }, {
    name: 'BUILD COPPER COIL',
    tab: 'BUILD',
    tooltip: '<p><strong>Cost: 2 copper plates</strong></p><p><i>Used for crafting</i></p>',
    onclick: 'Game.buildCopperCoil',
    locked: 1,
  }
]
