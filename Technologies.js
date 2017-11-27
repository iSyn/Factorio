let Technology = function(tech) {
  this.name = tech.name
  this.desc = tech.desc
  this.price = tech.price
  this.tooltip = tech.tooltip
  if (!tech.learned) this.learned = 0
  this.locked = tech.locked

  Game.technologies.push(this)
}

let technologies = [
  {
    name: 'Locomotion',
    desc: 'Enables the building of trains',
    price: {
      RED_SCIENCE_PACK: 10
    },
    locked: 0,
    tooltip: `<h4>LOCOMOTION</h4><hr/><p><strong>cost: 10 red science packs</strong></p><p><i>Allows for trains!</i></p>`
  },
  {
    name: 'test',
    desc: 'test',
    price: {
      RED_SCIENCE_PACK: 10
    },
    locked: 0,
    tooltip: `test</p>`
  },
  {
    name: 'test',
    desc: 'test',
    price: {
      RED_SCIENCE_PACK: 10
    },
    locked: 0,
    tooltip: `test</p>`
  },
  {
    name: 'test',
    desc: 'test',
    price: {
      RED_SCIENCE_PACK: 10
    },
    locked: 0,
    tooltip: `test</p>`
  },
  {
    name: 'test',
    desc: 'test',
    price: {
      RED_SCIENCE_PACK: 10
    },
    locked: 0,
    tooltip: `test</p>`
  },
  {
    name: 'test',
    desc: 'test',
    price: {
      RED_SCIENCE_PACK: 10
    },
    locked: 0,
    tooltip: `test</p>`
  },
  {
    name: 'test',
    desc: 'test',
    price: {
      RED_SCIENCE_PACK: 10
    },
    locked: 0,
    tooltip: `test</p>`
  },
  {
    name: 'test',
    desc: 'test',
    price: {
      RED_SCIENCE_PACK: 10
    },
    locked: 0,
    tooltip: `test</p>`
  },

]
