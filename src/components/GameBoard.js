import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import styled from 'styled-components';

// Import game constants
import { 
  GAME_STATES, 
  SEGMENT_TYPES, 
  PLAYER_ACTIONS,
  WEATHER_CONDITIONS
} from '../utils/constants';

// Import actions
import { 
  setTrack, 
  setWeather, 
  updatePlayerPosition, 
  incrementTurn, 
  setActivePlayer,
  addGameLog,
  updatePlayer
} from '../store/actions';

// Import utils
import { generateTrack, getSegmentEffects } from '../utils/trackUtils';

const GameContainer = styled.div`
  display: flex;
  flex-direction: column;
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
`;

const GameInfo = styled.div`
  background-color: rgba(255, 255, 255, 0.9);
  border-radius: 10px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
  padding: 15px;
  margin-bottom: 20px;
  display: flex;
  justify-content: space-between;
`;

const InfoItem = styled.div`
  text-align: center;
  padding: 0 15px;
`;

const InfoLabel = styled.div`
  font-size: 0.9rem;
  color: #7f8c8d;
`;

const InfoValue = styled.div`
  font-size: 1.2rem;
  font-weight: bold;
  color: #2c3e50;
`;

const GameAreaContainer = styled.div`
  display: flex;
  gap: 20px;
`;

const TrackContainer = styled.div`
  flex: 3;
  background-color: rgba(255, 255, 255, 0.9);
  border-radius: 10px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
  padding: 20px;
  position: relative;
  min-height: 400px;
`;

const LogAndActionsContainer = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 20px;
`;

const GameLog = styled.div`
  background-color: rgba(255, 255, 255, 0.9);
  border-radius: 10px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
  padding: 15px;
  flex: 1;
  max-height: 300px;
  overflow-y: auto;
`;

const LogEntry = styled.div`
  margin-bottom: 8px;
  padding-bottom: 8px;
  border-bottom: 1px solid #ecf0f1;
  font-size: 0.9rem;
  color: #34495e;
`;

const ActionsContainer = styled.div`
  background-color: rgba(255, 255, 255, 0.9);
  border-radius: 10px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
  padding: 15px;
`;

const ActionButton = styled.button`
  width: 100%;
  padding: 10px;
  margin-bottom: 10px;
  background-color: ${props => props.disabled ? '#ecf0f1' : '#3498db'};
  color: ${props => props.disabled ? '#95a5a6' : 'white'};
  border: none;
  border-radius: 5px;
  font-size: 1rem;
  cursor: ${props => props.disabled ? 'not-allowed' : 'pointer'};
  transition: background-color 0.3s;
  
  &:hover:not(:disabled) {
    background-color: #2980b9;
  }
`;

const PlayerInfo = styled.div`
  margin-bottom: 15px;
  padding-bottom: 10px;
  border-bottom: 1px solid #ecf0f1;
`;

const PlayerName = styled.div`
  font-weight: bold;
  color: #2c3e50;
  margin-bottom: 5px;
`;

const EnergyBar = styled.div`
  height: 10px;
  background-color: #ecf0f1;
  border-radius: 5px;
  margin-top: 5px;
  position: relative;
  
  &::after {
    content: '';
    position: absolute;
    left: 0;
    top: 0;
    height: 100%;
    width: ${props => props.value}%;
    background-color: ${props => {
      if (props.value > 70) return '#2ecc71';
      if (props.value > 30) return '#f39c12';
      return '#e74c3c';
    }};
    border-radius: 5px;
  }
`;

const TrackSegment = styled.div`
  background-color: ${props => {
    switch (props.type) {
      case SEGMENT_TYPES.FLAT: return '#3498db';
      case SEGMENT_TYPES.UPHILL: return '#e74c3c';
      case SEGMENT_TYPES.DOWNHILL: return '#2ecc71';
      case SEGMENT_TYPES.SHARP_TURN: return '#f39c12';
      case SEGMENT_TYPES.SPRINT: return '#9b59b6';
      default: return '#bdc3c7';
    }
  }};
  height: 30px;
  position: relative;
  margin-bottom: 5px;
  border-radius: 3px;
  
  &::before {
    content: '${props => {
      switch (props.type) {
        case SEGMENT_TYPES.FLAT: return '平路';
        case SEGMENT_TYPES.UPHILL: return '上坡';
        case SEGMENT_TYPES.DOWNHILL: return '下坡';
        case SEGMENT_TYPES.SHARP_TURN: return '急轉彎';
        case SEGMENT_TYPES.SPRINT: return '衝刺點';
        default: return '';
      }
    }}';
    position: absolute;
    left: 10px;
    top: 6px;
    font-size: 0.8rem;
    color: white;
  }
`;

const PlayerMarker = styled.div`
  width: 20px;
  height: 20px;
  border-radius: 50%;
  background-color: ${props => props.color || '#3498db'};
  position: absolute;
  top: 5px;
  left: ${props => props.position}%;
  z-index: 2;
  transition: left 0.5s ease;
`;

const FinishButton = styled.button`
  background-color: #e74c3c;
  color: white;
  padding: 12px 20px;
  border: none;
  border-radius: 5px;
  font-size: 1.1rem;
  cursor: pointer;
  margin-top: 20px;
  transition: background-color 0.3s;
  
  &:hover {
    background-color: #c0392b;
  }
`;

/**
 * Calculate position percentage for visual representation
 * @param {number} position - Player's current position
 * @param {number} trackLength - Total length of the track
 * @returns {number} - Percentage (0-100) for CSS positioning
 */
const calculatePositionPercentage = (position, trackLength) => {
  const percentage = (position / trackLength) * 100;
  return Math.min(Math.max(percentage, 0), 100); // Ensure value is between 0-100
};

/**
 * Get a color for a player based on their ID
 * @param {number} playerId - Player's ID
 * @returns {string} - CSS color value
 */
const getPlayerColor = (playerId) => {
  const colors = ['#3498db', '#e74c3c', '#2ecc71', '#f39c12', '#9b59b6'];
  return colors[(playerId - 1) % colors.length];
};

/**
 * GameBoard component - The main game interface
 * @param {Object} props - Component props
 * @param {Function} props.onStateChange - Function to change game state
 * @param {Object} props.gameConfig - Game configuration options
 */
const GameBoard = ({ onStateChange, gameConfig }) => {
  const dispatch = useDispatch();
  
  // Get game state from Redux
  const gameState = useSelector(state => state);
  const { players, track, weather, currentTurn, activePlayerId, gameLog } = gameState;
  
  // Local state for UI
  const [selectedAction, setSelectedAction] = useState(null);
  const [hoveredAction, setHoveredAction] = useState(null);
  
  // Get current active player
  const activePlayer = players.find(player => player.id === activePlayerId);
  
  // Initialize the game
  useEffect(() => {
    // Generate track based on game configuration
    const trackType = gameConfig.trackType || 'standard';
    const newTrack = generateTrack(trackType);
    dispatch(setTrack(newTrack));
    
    // Set random weather condition
    const weatherOptions = Object.values(WEATHER_CONDITIONS);
    const randomWeather = weatherOptions[Math.floor(Math.random() * weatherOptions.length)];
    dispatch(setWeather(randomWeather));
    
    // Set the first player as active
    if (players.length > 0 && !activePlayerId) {
      dispatch(setActivePlayer(players[0].id));
    }
  }, [dispatch, gameConfig, players, activePlayerId]);
  
  /**
   * Handle player action selection
   * @param {string} action - Selected action type
   */
  const handleSelectAction = (action) => {
    setSelectedAction(action);
  };
  
  /**
   * Execute the selected player action
   */
  const handleExecuteAction = () => {
    if (!selectedAction || !activePlayer) return;
    
    // Get current segment
    const currentSegmentIndex = Math.floor(activePlayer.position);
    const currentSegment = track[currentSegmentIndex] || track[0];
    
    // Calculate action effects based on segment, weather, and character
    const { moveDistance, energyChange } = calculateActionEffects(
      selectedAction, 
      activePlayer, 
      currentSegment, 
      weather
    );
    
    // Update player position
    const newPosition = Math.min(activePlayer.position + moveDistance, track.length);
    dispatch(updatePlayerPosition(activePlayer.id, newPosition));
    
    // Update player energy
    const newEnergy = Math.max(0, Math.min(100, activePlayer.energy + energyChange));
    dispatch(updatePlayer(activePlayer.id, { energy: newEnergy }));
    
    // Add log entry
    const actionName = getActionName(selectedAction);
    dispatch(addGameLog(`玩家 ${activePlayer.id} 使用了 ${actionName}，移動了 ${moveDistance.toFixed(1)} 格，耐力變化 ${energyChange > 0 ? '+' : ''}${energyChange}%`));
    
    // Check if player has finished the race
    if (newPosition >= track.length) {
      dispatch(addGameLog(`玩家 ${activePlayer.id} 到達了終點！`));
      checkGameEnd();
    } else {
      // Move to next player or next turn
      moveToNextPlayer();
    }
    
    // Reset selected action
    setSelectedAction(null);
  };
  
  /**
   * Calculate effects of a player action
   * @param {string} action - Action type
   * @param {Object} player - Player data
   * @param {Object} segment - Current track segment
   * @param {Object} weather - Current weather condition
   * @returns {Object} - Calculated move distance and energy change
   */
  const calculateActionEffects = (action, player, segment, weather) => {
    // Default effects
    let moveDistance = 1.0;
    let energyChange = -10;
    
    // Get stat modifiers based on segment type
    const segmentEffects = getSegmentEffects(segment.type);
    
    // Apply character stats
    const characterStats = player.character.baseStats;
    
    // Calculate based on action type
    switch (action) {
      case PLAYER_ACTIONS.SPRINT:
        moveDistance = 1.5;
        energyChange = -20;
        
        // Apply speed stat
        moveDistance *= (1 + (characterStats.speed - 3) * 0.1);
        break;
        
      case PLAYER_ACTIONS.CONSERVE:
        moveDistance = 0.7;
        energyChange = -5;
        
        // Apply endurance stat
        energyChange *= (1 - (characterStats.endurance - 3) * 0.1);
        break;
        
      case PLAYER_ACTIONS.DRAFT:
        // Check if there's a player ahead to draft from
        const playerAhead = players.find(p => 
          p.id !== player.id && 
          p.position > player.position && 
          p.position - player.position < 1.5
        );
        
        if (playerAhead) {
          moveDistance = 1.2;
          energyChange = -8;
        } else {
          moveDistance = 0.9;
          energyChange = -12;
        }
        break;
        
      case PLAYER_ACTIONS.ATTACK:
        moveDistance = 1.3;
        energyChange = -15;
        
        // Different segments affect attack differently
        if (segment.type === SEGMENT_TYPES.UPHILL) {
          // Climbing stat affects attack on uphills
          moveDistance *= (1 + (characterStats.climbing - 3) * 0.15);
        } else if (segment.type === SEGMENT_TYPES.DOWNHILL) {
          // Descending stat affects attack on downhills
          moveDistance *= (1 + (characterStats.descending - 3) * 0.15);
        }
        break;
        
      case PLAYER_ACTIONS.RECOVER:
        moveDistance = 0.5;
        energyChange = 15;
        
        // Recovery stat affects recover action
        energyChange *= (1 + (characterStats.recovery - 3) * 0.1);
        break;
        
      default:
        break;
    }
    
    // Apply segment effects
    moveDistance *= segmentEffects.speedModifier;
    energyChange *= segmentEffects.energyModifier;
    
    // Apply weather effects
    moveDistance *= weather.speedModifier;
    energyChange *= weather.enduranceModifier;
    
    // Special character abilities (simplified for now)
    if (player.character.id === 'SPRINTER' && action === PLAYER_ACTIONS.SPRINT) {
      moveDistance *= 1.2; // Sprinter's special ability
    } else if (player.character.id === 'CLIMBER' && segment.type === SEGMENT_TYPES.UPHILL) {
      energyChange *= 0.8; // Climber's special ability
    } else if (player.character.id === 'TIME_TRIALIST' && action === PLAYER_ACTIONS.CONSERVE) {
      moveDistance *= 1.15; // Time trialist's special ability
    }
    
    return { moveDistance, energyChange };
  };
  
  /**
   * Move to the next player's turn
   */
  const moveToNextPlayer = () => {
    const currentIndex = players.findIndex(player => player.id === activePlayerId);
    let nextIndex = (currentIndex + 1) % players.length;
    
    // Skip players who have finished
    while (players[nextIndex].position >= track.length && nextIndex !== currentIndex) {
      nextIndex = (nextIndex + 1) % players.length;
    }
    
    // If we're back to the first player, increment turn
    if (nextIndex === 0) {
      dispatch(incrementTurn());
    }
    
    // Set next active player
    dispatch(setActivePlayer(players[nextIndex].id));
  };
  
  /**
   * Check if the game should end
   */
  const checkGameEnd = () => {
    // Count finished players
    const finishedPlayers = players.filter(player => player.position >= track.length).length;
    
    // If all players have finished or we've played too many turns
    if (finishedPlayers === players.length || currentTurn > 50) {
      endGame();
    }
  };
  
  /**
   * End the game and transition to results screen
   */
  const endGame = () => {
    // Sort players by position (descending)
    const results = [...players].sort((a, b) => b.position - a.position);
    
    // Transition to game over screen with results
    onStateChange(GAME_STATES.GAME_OVER, {
      ...gameConfig,
      results,
      turns: currentTurn
    });
  };
  
  /**
   * Get readable name for action
   * @param {string} actionType - Action type constant
   * @returns {string} - Human-readable action name
   */
  const getActionName = (actionType) => {
    switch (actionType) {
      case PLAYER_ACTIONS.SPRINT: return '短衝';
      case PLAYER_ACTIONS.CONSERVE: return '保存體力';
      case PLAYER_ACTIONS.DRAFT: return '借力';
      case PLAYER_ACTIONS.ATTACK: return '攻擊';
      case PLAYER_ACTIONS.RECOVER: return '恢復';
      default: return '未知動作';
    }
  };
  
  /**
   * Force end the game (for debugging or if stuck)
   */
  const handleForceEndGame = () => {
    endGame();
  };
  
  // If track or players are not initialized, show loading
  if (track.length === 0 || players.length === 0) {
    return (
      <GameContainer>
        <div>正在載入賽道...</div>
      </GameContainer>
    );
  }
  
  return (
    <GameContainer>
      <GameInfo>
        <InfoItem>
          <InfoLabel>回合</InfoLabel>
          <InfoValue>{currentTurn}</InfoValue>
        </InfoItem>
        
        <InfoItem>
          <InfoLabel>賽道類型</InfoLabel>
          <InfoValue>{gameConfig.trackType}</InfoValue>
        </InfoItem>
        
        <InfoItem>
          <InfoLabel>天氣</InfoLabel>
          <InfoValue>{weather?.name || '未知'}</InfoValue>
        </InfoItem>
        
        <InfoItem>
          <InfoLabel>當前玩家</InfoLabel>
          <InfoValue>{activePlayer ? `玩家 ${activePlayer.id}` : '未知'}</InfoValue>
        </InfoItem>
      </GameInfo>
      
      <GameAreaContainer>
        <TrackContainer>
          {/* Visual representation of the track */}
          {track.map((segment, index) => (
            <TrackSegment key={index} type={segment.type}>
              {/* Player markers */}
              {players.map(player => {
                const segmentIndex = Math.floor(player.position);
                if (segmentIndex === index) {
                  // Calculate position within this segment (0-100%)
                  const segmentPosition = (player.position - segmentIndex) * 100;
                  return (
                    <PlayerMarker 
                      key={player.id}
                      color={getPlayerColor(player.id)}
                      position={segmentPosition}
                    />
                  );
                }
                return null;
              })}
            </TrackSegment>
          ))}
          
          <FinishButton onClick={handleForceEndGame}>
            強制結束比賽
          </FinishButton>
        </TrackContainer>
        
        <LogAndActionsContainer>
          <GameLog>
            {gameLog.map((entry, index) => (
              <LogEntry key={index}>{entry}</LogEntry>
            ))}
          </GameLog>
          
          <ActionsContainer>
            {activePlayer && (
              <>
                <PlayerInfo>
                  <PlayerName>玩家 {activePlayer.id} - {activePlayer.character.name}</PlayerName>
                  <div>位置: {activePlayer.position.toFixed(1)} / {track.length}</div>
                  <div>
                    能量: {activePlayer.energy.toFixed(0)}%
                    <EnergyBar value={activePlayer.energy} />
                  </div>
                </PlayerInfo>
                
                <div>
                  {Object.values(PLAYER_ACTIONS).map(action => (
                    <ActionButton 
                      key={action}
                      onClick={() => handleSelectAction(action)}
                      disabled={activePlayer.position >= track.length}
                      style={{ backgroundColor: selectedAction === action ? '#2980b9' : undefined }}
                    >
                      {getActionName(action)}
                    </ActionButton>
                  ))}
                  
                  <ActionButton 
                    onClick={handleExecuteAction}
                    disabled={!selectedAction || activePlayer.position >= track.length}
                    style={{ backgroundColor: '#e67e22' }}
                  >
                    執行動作
                  </ActionButton>
                </div>
              </>
            )}
          </ActionsContainer>
        </LogAndActionsContainer>
      </GameAreaContainer>
    </GameContainer>
  );
};

export default GameBoard;