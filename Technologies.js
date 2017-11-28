let Technology = function(tech) {
  this.name = tech.name
  this.desc = tech.desc
  this.price = tech.price
  this.tooltip = tech.tooltip
  if (!tech.learned) this.learned = 0
  this.locked = tech.locked
  if (tech.onLearn) this.onLearn = tech.onLearn

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
    tooltip: `<h4>LOCOMOTION</h4><hr/><p><strong>Cost: 15 red science packs</strong></p><p><i>Enables the building of trains</i></p>`
  },
  {
    name: 'Fuel Efficiency I',
    desc: 'Fuel is now 2x more efficient',
    price: {
      RED_SCIENCE_PACK: 10
    },
    locked: 0,
    tooltip: `<h4>FUEL EFFICIENCY I</h4><hr/><p><strong>Cost: 10 red science packs</strong></p><p><i>Fuel is now 2x more efficient</i></p>`,
    onLearn: 'Fuel Efficiency II'
  },

]
