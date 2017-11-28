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
    tooltip: '<p>Look around your surroundings</p>',
    onclick: 'Game.explore',
    locked: 0,

  }, {
    name: 'CHOP TREE',
    tab: 'GATHER',
    tooltip: '<p>Gain 5-7 wood</p>',
    onclick: 'Game.chopTree',
    locked: 0,
    nextLine: true
  }, {
    name: 'MINE ROCK',
    tab: 'GATHER',
    tooltip: '<p>Gain 3-5 stone</p>',
    onclick: 'Game.mineRock',
    locked: 0
  }, {
    name: 'MINE COAL',
    tab: 'GATHER',
    tooltip: '<p>Gain 1 coal</p>',
    onclick: 'Game.mineCoal',
    locked: 1
  }, {
    name: 'MINE COPPER',
    tab: 'GATHER',
    tooltip: '<p>Gain 1 copper</p>',
    onclick: 'Game.mineCopper',
    locked: 1
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
    tooltip: '<p><strong>Cost: 100 wood, 100 stone</strong></p><p><i>Allows for automation</i></p>',
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
    name: 'BUILD RED SCIENCE',
    tab: 'BUILD',
    tooltip: '<p><strong>Cost: 1 copper plate, 1 iron plate</strong></p><p><i>Used for basic science</i></p>',
    onclick: 'Game.buildRedScience',
    locked: 1,
    nextLine: true
  }
]
