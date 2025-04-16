/**
 * Game state constants
 * These define the different screens and states of the game
 */
export const GAME_STATES = {
  MAIN_MENU: 'MAIN_MENU',
  CHARACTER_SELECTION: 'CHARACTER_SELECTION',
  GAME_BOARD: 'GAME_BOARD',
  GAME_OVER: 'GAME_OVER'
};

/**
 * Character types with their base stats
 */
export const CHARACTER_TYPES = {
  SPRINTER: {
    id: 'SPRINTER',
    name: '短衝型選手',
    description: '在平地和直道上速度優勢明顯',
    baseStats: {
      speed: 5,
      climbing: 2,
      descending: 3,
      endurance: 3,
      recovery: 2
    },
    specialAbility: '爆發力',
    specialAbilityDescription: '可以在一回合內大幅提升速度，但會消耗更多耐力'
  },
  CLIMBER: {
    id: 'CLIMBER',
    name: '爬坡型選手',
    description: '在山地和上坡路段有優勢',
    baseStats: {
      speed: 3,
      climbing: 5,
      descending: 2,
      endurance: 4,
      recovery: 3
    },
    specialAbility: '輕盈如風',
    specialAbilityDescription: '在上坡路段消耗較少的耐力'
  },
  ALL_ROUNDER: {
    id: 'ALL_ROUNDER',
    name: '全能型選手',
    description: '各方面表現均衡',
    baseStats: {
      speed: 4,
      climbing: 3,
      descending: 3,
      endurance: 4,
      recovery: 4
    },
    specialAbility: '戰術大師',
    specialAbilityDescription: '可以在比賽中調整策略，適應不同路段'
  },
  TIME_TRIALIST: {
    id: 'TIME_TRIALIST',
    name: '計時賽專家',
    description: '長時間保持高速的能力',
    baseStats: {
      speed: 4,
      climbing: 3,
      descending: 3,
      endurance: 5,
      recovery: 2
    },
    specialAbility: '節奏把控',
    specialAbilityDescription: '能夠長時間保持穩定的高速度'
  }
};

/**
 * Track types with their characteristics
 */
export const TRACK_TYPES = {
  standard: {
    name: '標準賽道',
    description: '平衡的賽道，包含各種類型的路段',
    length: 20, // Total number of segments
    segments: [
      // Will be generated dynamically
    ]
  },
  mountain: {
    name: '山地賽道',
    description: '包含大量爬坡和下坡路段',
    length: 18,
    segments: [
      // Will be generated dynamically
    ]
  },
  city: {
    name: '城市賽道',
    description: '包含急轉彎和短距離衝刺路段',
    length: 22,
    segments: [
      // Will be generated dynamically
    ]
  }
};

/**
 * Segment types for track generation
 */
export const SEGMENT_TYPES = {
  FLAT: 'FLAT',
  UPHILL: 'UPHILL',
  DOWNHILL: 'DOWNHILL',
  SHARP_TURN: 'SHARP_TURN',
  SPRINT: 'SPRINT'
};

/**
 * Game actions that players can take
 */
export const PLAYER_ACTIONS = {
  SPRINT: 'SPRINT',
  CONSERVE: 'CONSERVE',
  DRAFT: 'DRAFT',
  ATTACK: 'ATTACK',
  RECOVER: 'RECOVER'
};

/**
 * Weather conditions that can affect gameplay
 */
export const WEATHER_CONDITIONS = {
  SUNNY: {
    name: '晴朗',
    speedModifier: 1.0,
    enduranceModifier: 1.0
  },
  RAINY: {
    name: '雨天',
    speedModifier: 0.8,
    enduranceModifier: 1.2
  },
  WINDY: {
    name: '大風',
    speedModifier: 0.9,
    enduranceModifier: 1.3
  },
  HOT: {
    name: '酷熱',
    speedModifier: 0.95,
    enduranceModifier: 1.4
  }
};