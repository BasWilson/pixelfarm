const blocksPrefabs = {
    'grass': {
      'color': '#58B940',
      'name': 'grass'
    },
    'dirt': {
      'color': '#3F2909',
      'name': 'dirt'
    },
  }
  
  // Tools/items that can be used in the game
  const items = [
    {
      'name': 'hoe',
      'use': prepareBlock,
    },
    {
      'name': 'scissors',
      'use': harvestCrop
    }
  ]
  
  // All available crops
  const crops = [
    {
      'name': 'corn',
      'amount': 1,
      'use': plantCrop,
      'prematureIcon': '🌱',
      'icon': '🌽',
      'growTime': 30,
      'level': 0
    },
    {
      'name': 'grape',
      'amount': 1,
      'use': plantCrop,
      'prematureIcon': '🌱',
      'icon': '🍇',
      'growTime': 200,
      'level': 30
  
    },
    {
      'name': 'watermelon',
      'amount': 1,
      'use': plantCrop,
      'prematureIcon': '🌱',
      'icon': '🍉',
      'growTime': 250,
      'level': 40
    },
    {
      'name': 'carrot',
      'amount': 1,
      'use': plantCrop,
      'prematureIcon': '🌱',
      'icon': '🥕',
      'growTime': 20,
      'level': 5,
    },
    {
      'name': 'cucumber',
      'amount': 1,
      'use': plantCrop,
      'prematureIcon': '🌱',
      'icon': '🥒',
      'growTime': 25,
      'level': 10,
    },
    {
      'name': 'eggplant',
      'amount': 1,
      'use': plantCrop,
      'prematureIcon': '🌱',
      'icon': '🍆',
      'growTime': 25,
      'level': 15,
    },
    {
      'name': 'potato',
      'amount': 1,
      'use': plantCrop,
      'prematureIcon': '🌱',
      'icon': '🥔',
      'growTime': 15,
      'level': 0,
    },
    {
      'name': 'broccoli',
      'amount': 1,
      'use': plantCrop,
      'prematureIcon': '🌱',
      'icon': '🥦',
      'growTime': 28,
      'level': 5,
    }
  ]
