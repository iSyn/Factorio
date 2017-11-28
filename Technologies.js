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
  this.duration = tech.duration * 1000
  if (!tech.currentDuration) {
    this.currentDuration = null
  } else {
    this.currentDuration = tech.currentDuration
  }
  if (tech.onFinish) this.onFinish = tech.onFinish

  Game.technologies.push(this)
}

let technologies = [
  {
    name: 'Autonomy I',
    desc: 'Enables the building of constructors',
    price: {
      RED_SCIENCE: 3
    },
    locked: 0,
    tooltip: `<h4>AUTONOMY I</h4><hr/><p><strong>Cost: 3 red science</strong></p><p><i>Enables the building of constructors</i></p><hr/><p>10 seconds</p>`,
    duration: 10,
    onFinish: {
      unlock: ['Autonomy II']
    }
  },
  {
    name: 'Autonomy II',
    desc: 'Enables the building of advanced constructors',
    price: {
      RED_SCIENCE: 50,
      BLUE_SCIENCE: 50
    },
    locked: 1,
    tooltip: `<h4>AUTONOMY II</h4><hr/><p><strong>Cost: 50 red science, 50 blue science</strong></p><p><i>Enables the building of advanced constructors</i></p><hr/><p>2 minutes</p>`,
    duration: 120
  },
  {
    name: 'Fuel Efficiency I',
    desc: 'Fuel is now 2x more efficient',
    price: {
      RED_SCIENCE: 10
    },
    locked: 0,
    tooltip: `<h4>FUEL EFFICIENCY I</h4><hr/><p><strong>Cost: 10 red science</strong></p><p><i>Fuel is now 2x more efficient</i></p><hr/><p>10 seconds</p>`,
    duration: 10
  },
  {
    name: 'Fuel Efficiency II',
    desc: 'Fuel is now 2x even more efficient',
    price: {
      RED_SCIENCE: 100,
      BLUE_SCIENCE: 50
    },
    locked: 1,
    tooltip: `<h4>FUEL EFFICIENCY II</h4><hr/><p><strong>Cost: 100 red science, 50 blue science</strong></p><p><i>Fuel is now 2x even more efficient</i></p><hr/><p>5 minutes</p>`,
    duration: 300
  },
  {
    name: 'Locomotion',
    desc: 'Enables the building of trains',
    price: {
      RED_SCIENCE: 15
    },
    locked: 0,
    tooltip: `<h4>LOCOMOTION</h4><hr/><p><strong>Cost: 15 red science</strong></p><p><i>Enables the building of trains</i></p><hr/><p>30 seconds</p>`,
    duration: 30
  },
  {
    name: 'Enhanced Senses I',
    price: {
      RED_SCIENCE: 5
    },
    locked: 0,
    tooltip: `<h4>ENHANCED SENSES</h4><hr><p><strong>Cost: 20 red science</strong></p><p><i>100% chance of finding something while exploring</i></p>`,
    duration: 20
  },


]
