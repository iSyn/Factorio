let Technology = function(tech) {
  this.name = tech.name
  this.functionName = tech.name.replace(/ /g,'-').toLowerCase()
  this.desc = tech.desc
  this.price = tech.price
  this.tooltip = tech.tooltip
  if (!tech.learned) this.learned = 0
  this.locked = tech.locked
  if (!tech.inProgress) {
    this.inProgress = false
  } else {
    this.inProgress = true
  }
  this.duration = tech.duration
  if (!tech.currentDuration) {
    this.currentDuration = null
  } else {
    this.currentDuration = tech.currentDuration
  }

  Game.technologies.push(this)
}

let technologies = [
  {
    name: 'Autonomy I',
    desc: 'Enables the building of constructors',
    price: {
      RED_SCIENCE_PACK: 3
    },
    locked: 0,
    tooltip: `<h4>AUTONOMY I</h4><hr/><p><strong>Cost: 3 red science packs</strong></p><p><i>Enables the building of constructors</i></p>`,
    duration: 10 * 1000
  },
  {
    name: 'Fuel Efficiency I',
    desc: 'Fuel is now 2x more efficient',
    price: {
      RED_SCIENCE_PACK: 10
    },
    locked: 0,
    tooltip: `<h4>FUEL EFFICIENCY I</h4><hr/><p><strong>Cost: 10 red science packs</strong></p><p><i>Fuel is now 2x more efficient</i></p>`,
    duration: 10
  },
  {
    name: 'Locomotion',
    desc: 'Enables the building of trains',
    price: {
      RED_SCIENCE_PACK: 15
    },
    locked: 0,
    tooltip: `<h4>LOCOMOTION</h4><hr/><p><strong>Cost: 15 red science packs</strong></p><p><i>Enables the building of trains</i></p>`,
    duration: 20
  },


]
