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
      'name': 'potato',
      'amount': 1,
      'use': plantCrop,
      'prematureIcon': '🌱',
      'icon': '🥔',
      'growTime': 15,
      'level': 0,
      'price': 1,
  },
  {
      'name': 'corn',
      'amount': 1,
      'use': plantCrop,
      'prematureIcon': '🌱',
      'icon': '🌽',
      'growTime': 20,
      'level': 0,
      'price': 1.2,
  },
  {
      'name': 'carrot',
      'amount': 1,
      'use': plantCrop,
      'prematureIcon': '🌱',
      'icon': '🥕',
      'growTime': 25,
      'level': 2,
      'price': 2,
  }, 
  {
      'name': 'red apple',
      'amount': 1,
      'use': plantCrop,
      'prematureIcon': '🌱',
      'icon': '🍎',
      'growTime': 28,
      'level': 4,
      'price': 2.2,
  },
  {
      'name': 'green apple',
      'amount': 1,
      'use': plantCrop,
      'prematureIcon': '🌱',
      'icon': '🍏',
      'growTime': 30,
      'level': 5,
      'price': 2.2,
  },
  {
      'name': 'cucumber',
      'amount': 1,
      'use': plantCrop,
      'prematureIcon': '🌱',
      'icon': '🥒',
      'growTime': 32,
      'level': 8,
      'price': 2.5,
  },
  {
      'name': 'strawberry',
      'amount': 1,
      'use': plantCrop,
      'prematureIcon': '🌱',
      'icon': '🍓',
      'growTime': 40,
      'level': 10,
      'price': 2.5,
  }, 
  {
      'name': 'pear',
      'amount': 1,
      'use': plantCrop,
      'prematureIcon': '🌱',
      'icon': '🍐',
      'growTime': 55,
      'level': 14,
      'price': 3,
  },
  {
      'name': 'tomato',
      'amount': 1,
      'use': plantCrop,
      'prematureIcon': '🌱',
      'icon': '🍅',
      'growTime': 70,
      'level': 20,
      'price': 3.5,
  },

  {
      'name': 'broccoli',
      'amount': 1,
      'use': plantCrop,
      'prematureIcon': '🌱',
      'icon': '🥦',
      'growTime': 110,
      'level': 28,
      'price': 4,
  },

  {
      'name': 'mushroom',
      'amount': 1,
      'use': plantCrop,
      'prematureIcon': '🌱',
      'icon': '🍄',
      'growTime': 140,
      'level': 34,
      'price': 5,
  },
  {
      'name': 'eggplant',
      'amount': 1,
      'use': plantCrop,
      'prematureIcon': '🌱',
      'icon': '🍆',
      'growTime': 170,
      'level': 42,
      'price': 6,
  },
  {
      'name': 'grape',
      'amount': 1,
      'use': plantCrop,
      'prematureIcon': '🌱',
      'icon': '🍇',
      'growTime': 200,
      'level': 55,
      'price': 8,

  },
  {
      'name': 'watermelon',
      'amount': 1,
      'use': plantCrop,
      'prematureIcon': '🌱',
      'icon': '🍉',
      'growTime': 250,
      'level': 70,
      'price': 10,
  },
  ]
