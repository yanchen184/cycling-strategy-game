/**
 * Redux action types for the game
 */
export const GAME_ACTION_TYPES = {
  SET_GAME_STATE: 'SET_GAME_STATE',
  SET_PLAYERS: 'SET_PLAYERS',
  UPDATE_PLAYER: 'UPDATE_PLAYER',
  UPDATE_PLAYER_POSITION: 'UPDATE_PLAYER_POSITION',
  SET_TRACK: 'SET_TRACK',
  SET_WEATHER: 'SET_WEATHER',
  INCREMENT_TURN: 'INCREMENT_TURN',
  SET_ACTIVE_PLAYER: 'SET_ACTIVE_PLAYER',
  ADD_GAME_LOG: 'ADD_GAME_LOG',
  RESET_GAME: 'RESET_GAME'
};

/**
 * Set the current game state
 * @param {string} gameState - The new game state
 * @returns {Object} Action object
 */
export const setGameState = (gameState) => ({
  type: GAME_ACTION_TYPES.SET_GAME_STATE,
  payload: gameState
});

/**
 * Set the players for the game
 * @param {Array} players - Array of player objects
 * @returns {Object} Action object
 */
export const setPlayers = (players) => ({
  type: GAME_ACTION_TYPES.SET_PLAYERS,
  payload: players
});

/**
 * Update a specific player's properties
 * @param {number} playerId - ID of the player to update
 * @param {Object} updates - Object containing properties to update
 * @returns {Object} Action object
 */
export const updatePlayer = (playerId, updates) => ({
  type: GAME_ACTION_TYPES.UPDATE_PLAYER,
  payload: { playerId, updates }
});

/**
 * Update a player's position on the track
 * @param {number} playerId - ID of the player to update
 * @param {number} position - New position value
 * @returns {Object} Action object
 */
export const updatePlayerPosition = (playerId, position) => ({
  type: GAME_ACTION_TYPES.UPDATE_PLAYER_POSITION,
  payload: { playerId, position }
});

/**
 * Set the track segments
 * @param {Array} track - Array of track segment objects
 * @returns {Object} Action object
 */
export const setTrack = (track) => ({
  type: GAME_ACTION_TYPES.SET_TRACK,
  payload: track
});

/**
 * Set the current weather condition
 * @param {Object} weather - Weather condition object
 * @returns {Object} Action object
 */
export const setWeather = (weather) => ({
  type: GAME_ACTION_TYPES.SET_WEATHER,
  payload: weather
});

/**
 * Increment the current turn counter
 * @returns {Object} Action object
 */
export const incrementTurn = () => ({
  type: GAME_ACTION_TYPES.INCREMENT_TURN
});

/**
 * Set the currently active player
 * @param {number} playerId - ID of the active player
 * @returns {Object} Action object
 */
export const setActivePlayer = (playerId) => ({
  type: GAME_ACTION_TYPES.SET_ACTIVE_PLAYER,
  payload: playerId
});

/**
 * Add a message to the game log
 * @param {string} message - Log message to add
 * @returns {Object} Action object
 */
export const addGameLog = (message) => ({
  type: GAME_ACTION_TYPES.ADD_GAME_LOG,
  payload: message
});

/**
 * Reset the game state
 * @returns {Object} Action object
 */
export const resetGame = () => ({
  type: GAME_ACTION_TYPES.RESET_GAME
});