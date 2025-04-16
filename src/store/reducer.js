/**
 * Redux reducer for the game state
 */
import { GAME_ACTION_TYPES } from './actions';
import { GAME_STATES } from '../utils/constants';

// Initial state of the application
const initialState = {
  gameState: GAME_STATES.MAIN_MENU,
  players: [],
  track: [],
  weather: null,
  currentTurn: 1,
  activePlayerId: null,
  gameLog: ['準備開始比賽'],
  gameConfig: {
    playerCount: 2,
    aiOpponent: false,
    trackType: 'standard'
  }
};

/**
 * Root reducer function
 * @param {Object} state - Current Redux state
 * @param {Object} action - Action to process
 * @returns {Object} New state
 */
const rootReducer = (state = initialState, action) => {
  switch (action.type) {
    case GAME_ACTION_TYPES.SET_GAME_STATE:
      return {
        ...state,
        gameState: action.payload
      };
      
    case GAME_ACTION_TYPES.SET_PLAYERS:
      return {
        ...state,
        players: action.payload
      };
      
    case GAME_ACTION_TYPES.UPDATE_PLAYER:
      return {
        ...state,
        players: state.players.map(player => 
          player.id === action.payload.playerId
            ? { ...player, ...action.payload.updates }
            : player
        )
      };
      
    case GAME_ACTION_TYPES.UPDATE_PLAYER_POSITION:
      return {
        ...state,
        players: state.players.map(player => 
          player.id === action.payload.playerId
            ? { ...player, position: action.payload.position }
            : player
        )
      };
      
    case GAME_ACTION_TYPES.SET_TRACK:
      return {
        ...state,
        track: action.payload
      };
      
    case GAME_ACTION_TYPES.SET_WEATHER:
      return {
        ...state,
        weather: action.payload
      };
      
    case GAME_ACTION_TYPES.INCREMENT_TURN:
      return {
        ...state,
        currentTurn: state.currentTurn + 1
      };
      
    case GAME_ACTION_TYPES.SET_ACTIVE_PLAYER:
      return {
        ...state,
        activePlayerId: action.payload
      };
      
    case GAME_ACTION_TYPES.ADD_GAME_LOG:
      return {
        ...state,
        gameLog: [...state.gameLog, action.payload]
      };
      
    case GAME_ACTION_TYPES.RESET_GAME:
      return {
        ...initialState,
        gameConfig: { ...state.gameConfig } // Preserve game configuration
      };
      
    default:
      return state;
  }
};

export default rootReducer;