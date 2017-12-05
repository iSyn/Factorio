let Technology = function(tech) {
  this.name = tech.name
  this.functionName = tech.name.replace(/ /g,'-').toLowerCase()
  if (tech.img) this.img = tech.img
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
  if (tech.requires) this.requires = tech.requires
  if (tech.onFinishFunc) this.onFinishFunc = tech.onFinishFunc

  Game.technologies.push(this)
}

let technologies = [
  {
    name: 'Metalsmithing I',
    img: 'metalsmithing-i',
    price: {
      RED_SCIENCE: 3
    },
    locked: 0,
    tooltip: `<h4>METALSMITHING I</h4><hr/><p><strong>Cost: 3 red science</strong></p><p><i>Enables the building of basic metal items</i></p><hr /><p>3 seconds</p>`,
    duration: 15,
    onFinish: {
      unlockTech: ['Metalsmithing II', 'Autonomy I'],
      unlockAction: ['BUILD IRON GEAR', 'BUILD COPPER COIL'],
    }
  },
  {
    name: 'Metalsmithing II',
    img: 'metalsmithing-ii',
    price: {
      RED_SCIENCE: 100
    },
    locked: 1,
    tooltip: `<h4>METALSMITHING II</h4><hr/><p><strong>Cost: 100 red science</strong></p><p><i>Enables the building of intermediate metal items</i></p><hr /><p>10 seconds</p>`,
    duration: 10,
    requires: 'Metalsmithing I'
  },
  {
    name: 'Autonomy I',
    img: 'automation-i',
    price: {
      RED_SCIENCE: 5
    },
    locked: 1,
    tooltip: `<h4>AUTONOMY I</h4><hr/><p><strong>Cost: 5 red science</strong></p><p><i>Enables the building of constructors</i></p><hr/><p>10 seconds</p>`,
    duration: 20,
    onFinish: {
      unlockTech: ['Autonomy II'],
      unlockAction: ['BUILD CONSTRUCTOR']
    },
    requires: 'Metalsmithing I'
  },
  {
    name: 'Autonomy II',
    img: 'automation-ii',
    price: {
      RED_SCIENCE: 70,
      BLUE_SCIENCE: 50
    },
    locked: 1,
    tooltip: `<h4>AUTONOMY II</h4><hr/><p><strong>Cost: 50 red science, 50 blue science</strong></p><p><i>Enables the building of advanced constructors</i></p><hr/><p>2 minutes</p>`,
    duration: 120,
    requires: 'Autonomy I'
  },
  {
    name: 'Fuel Efficiency I',
    img: 'fuel-efficiency-i',
    price: {
      RED_SCIENCE: 10
    },
    locked: 0,
    tooltip: `<h4>FUEL EFFICIENCY I</h4><hr/><p><strong>Cost: 10 red science</strong></p><p><i>Fuel is now 1.5x more efficient</i></p><hr/><p>10 seconds</p>`,
    duration: 20,
    onFinish: {
      unlockTech: ['Fuel Efficiency II', 'Locomotion']
    },
    onFinishFunc: () => Game.state.stats.resourceNeededMulti *= .5
  },
  {
    name: 'Fuel Efficiency II',
    img: 'fuel-efficiency-ii',
    price: {
      RED_SCIENCE: 100,
      BLUE_SCIENCE: 50
    },
    locked: 1,
    tooltip: `<h4>FUEL EFFICIENCY II</h4><hr/><p><strong>Cost: 100 red science, 50 blue science</strong></p><p><i>Fuel is now 1.5x even more efficient</i></p><hr/><p>5 minutes</p>`,
    duration: 300,
    requires: 'Fuel Efficiency I',
    onFinishFunc: () => Game.state.stats.resourceNeededMulti *= .5
  },
  /*  ///////////////////////////////////////////////////////////////////

      TRAIN STUFF

  */  ///////////////////////////////////////////////////////////////////
  {
    name: 'Locomotion',
    desc: 'Enables the building of trains',
    img: 'locomotion',
    price: {
      RED_SCIENCE: 30
    },
    locked: 1,
    tooltip: `<h4>LOCOMOTION</h4><hr/><p><strong>Cost: 30 red science</strong></p><p><i>Enables the building of trains (auto-exploration)</i></p><hr/><p>30 seconds</p>`,
    duration: 30,
    requires: 'Metalsmithing I & Fuel Efficiency I',
    onFinish: {
      unlockTech: ['Train Tank Capacity I', 'Train Speed I', 'Train Fuel Efficiency I'],
      unlockAction: ['BUILD TRAIN']
    }
  },
  {
    name: 'Train Tank Capacity I',
    // img:
    price: {
      RED_SCIENCE: 10,
      BLUE_SCIENCE: 10
    },
    locked: 1,
    tooltip: `<h4>TRAIN TANK CAPACITY I</h4><hr /><p><strong>Cost: 10 red science, 10 blue science</strong></p><p><i>Increases tank capacity by 50</i></p><hr /><p>1 minute</p>`,
    duration: 60,
    requires: 'Locomotion',
    onFinish: {
      unlockTech: ['Train Tank Capacity II']
    },
    onFinishFunc: () => Game.state.trains.maxFuel += 50
  },
  {
    name: 'Train Tank Capacity II',
    // img:
    price: {
      RED_SCIENCE: 70,
      BLUE_SCIENCE: 70
    },
    locked: 1,
    tooltip: `<h4>TRAIN TANK CAPACITY II</h4><hr /><p><strong>Cost: 70 red science, 70 blue science</strong></p><p><i>Increases tank capacity by 50</i></p><hr /><p>1 minute</p>`,
    duration: 60,
    requires: 'Train Tank Capacity I',
    onFinish: {
      unlockTech: ['Train Tank Capacity III']
    },
    onFinishFunc: () => Game.state.trains.maxFuel += 50
  },
  {
    name: 'Train Tank Capacity III',
    // img:
    price: {
      RED_SCIENCE: 300,
      BLUE_SCIENCE: 300
    },
    locked: 1,
    tooltip: `<h4>TRAIN TANK CAPACITY III</h4><hr /><p><strong>Cost: 300 red science, 300 blue science</strong></p><p><i>Increases tank capacity by 100</i></p><hr /><p>1 minute</p>`,
    duration: 60,
    requires: 'Train Tank Capacity II',
    onFinishFunc: () => Game.state.trains.maxFuel += 100
  },
  {
    name: 'Train Speed I',
    price: {
      RED_SCIENCE: 10,
      BLUE_SCIENCE: 10
    },
    locked: 1,
    tooltip: `<h4>TRAIN SPEED I</h4><hr /><p><strong>Cost: 10 red science, 10 blue science</strong></p><p><i>Increase train speed</i></p><hr /><p>1 minute</p>`,
    duration: 60,
    requires: 'Locomotion',
    onFinish: {
      unlockTech: ['Train Speed II']
    }
  },
  {
    name: 'Train Speed II',
    price: {
      RED_SCIENCE: 50,
      BLUE_SCIENCE: 50
    },
    locked: 1,
    tooltip: `<h4>TRAIN SPEED II</h4><hr /><p><strong>Cost: 50 red science, 50 blue science</strong></p><p><i>Furthur increases train speed</i></p><hr /><p>1 minute</p>`,
    duration: 60,
    requires: 'Train Speed I',
    onFinish: {}
  },
  {
    name: 'Train Fuel Efficiency I',
    price: {
      RED_SCIENCE: 10,
      BLUE_SCIENCE: 20
    },
    locked: 1,
    tooltip: `<h4>TRAIN FUEL EFFICIENCY I</h4><hr /><p><strong>Cost: 10 red science, 20 blue science</strong></p><p><i>Lowers the cost of fuel needed</i></p><hr /><p>1 minute</p>`,
    duration: 60,
    requires: 'Locomotion',
    onFinish: {}
  },
  {
    name: 'Enhanced Senses I',
    price: {
      RED_SCIENCE: 10
    },
    img: 'enhanced-senses-i',
    locked: 0,
    tooltip: `<h4>ENHANCED SENSES I</h4><hr><p><strong>Cost: 20 red science</strong></p><p><i>100% chance of finding something while exploring</i></p><hr/><p>20 seconds</p>`,
    duration: 20,
    onFinish: {
      unlockTech: ['Enhanced Senses II']
    }
  },
  {
    name: 'Enhanced Senses II',
    price: {
      RED_SCIENCE: 40,
      BLUE_SCIENCE: 20
    },
    img: 'enhanced-senses-ii',
    locked: 1,
    tooltip: `<h4>ENHANCED SENSES II</h4><hr /><p><strong>Cost: 40 red science, 20 blue science</strong></p><p><i>Increases the amount of ore found while exploring</i></p><p>1 minute</p>`,
    duration: 60,
    requires: 'Enhanced Senses I'
  },
  {
    name: 'Science I',
    price: {
      RED_SCIENCE: 100
    },
    img: 'intermediate-science',
    locked: 0,
    tooltip: `<h4>SCIENCE I</h4><hr/><p><strong>Cost: 100 red science</strong></p><p><i>Allows the creation of blue science</i></p><hr/><p>1 minute</p>`,
    duration: 60,
    onFinish: {
      unlockTech: ['SCIENCE II'],
      unlockAction: ['BUILD BLUE SCIENCE']
    }
  },
  {
    name: 'SCIENCE II',
    price: {
      BLUE_SCIENCE: 100
    },
    locked: 1,
    tooltip: `<h4>SCIENCE II</h4><hr/><p><strong>Cost: 100 blue science</strong></p><p><i>Allows the creation of black science</i></p><hr/><p>2 minutes</p>`,
    duration: 120,
    requires: 'SCIENCE I'
  },
  {
    name: 'Weightlifting I',
    img: 'weightlifting-i',
    price: {
      RED_SCIENCE: 25
    },
    locked: 0,
    tooltip: `<h4>WEIGHTLIFTING I</h4><hr /><p><strong>Cost: 25 red science</strong></p><p><i>Increases the amount of resources get when manually mining/chopping</i></p>`,
    duration: 15,
    onFinish: {
      unlockTech: ['Weightlifting II']
    },
    onFinishFunc: () => Game.state.stats.resourceOnClickMulti++
  },
  {
    name: 'Weightlifting II',
    price: {
      RED_SCIENCE: 300
    },
    locked: 1,
    tooltip: `<h4>WEIGHTLIFTING II</h4><hr /><p><strong>Cost: 300 red science</strong></p><p><i>Increases the amount of resources get on click</i></p>`,
    duration: 60,
    requires: 'Weightlifting I'
  },

]
