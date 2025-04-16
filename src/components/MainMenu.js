import React, { useState } from 'react';
import styled from 'styled-components';

// Constants
import { GAME_STATES } from '../utils/constants';

const MainMenuContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  max-width: 600px;
  margin: 0 auto;
  padding: 20px;
  background-color: rgba(255, 255, 255, 0.9);
  border-radius: 10px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
`;

const Title = styled.h2`
  color: #2c3e50;
  font-size: 2.5rem;
  margin-bottom: 30px;
`;

const MenuOptions = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  gap: 15px;
`;

const GameOption = styled.div`
  margin-bottom: 20px;
`;

const OptionLabel = styled.label`
  display: block;
  margin-bottom: 8px;
  font-weight: bold;
  color: #34495e;
`;

const Select = styled.select`
  width: 100%;
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 5px;
  background-color: white;
  font-size: 1rem;
  cursor: pointer;
  
  &:focus {
    outline: none;
    border-color: #3498db;
  }
`;

const Button = styled.button`
  background-color: #3498db;
  color: white;
  padding: 12px 20px;
  border: none;
  border-radius: 5px;
  font-size: 1.1rem;
  cursor: pointer;
  transition: background-color 0.3s;
  margin-top: 15px;
  width: 100%;
  
  &:hover {
    background-color: #2980b9;
  }
  
  &:disabled {
    background-color: #95a5a6;
    cursor: not-allowed;
  }
`;

/**
 * MainMenu component - The starting screen of the game
 * @param {Object} props - Component props
 * @param {Function} props.onStateChange - Function to change game state
 */
const MainMenu = ({ onStateChange }) => {
  // Game configuration options
  const [playerCount, setPlayerCount] = useState(2);
  const [aiOpponent, setAiOpponent] = useState(false);
  const [trackType, setTrackType] = useState('standard');

  /**
   * Handles starting a new game
   */
  const handleStartGame = () => {
    // Pass game configuration to the next screen
    onStateChange(GAME_STATES.CHARACTER_SELECTION, {
      playerCount,
      aiOpponent,
      trackType
    });
  };

  return (
    <MainMenuContainer>
      <Title>風馳電掣</Title>
      
      <MenuOptions>
        <GameOption>
          <OptionLabel>選擇玩家數量:</OptionLabel>
          <Select 
            value={playerCount} 
            onChange={(e) => setPlayerCount(parseInt(e.target.value))}
          >
            <option value={2}>2 位玩家</option>
            <option value={3}>3 位玩家</option>
            <option value={4}>4 位玩家</option>
          </Select>
        </GameOption>
        
        <GameOption>
          <OptionLabel>AI 對手:</OptionLabel>
          <Select 
            value={aiOpponent.toString()} 
            onChange={(e) => setAiOpponent(e.target.value === 'true')}
          >
            <option value="false">關閉</option>
            <option value="true">開啟</option>
          </Select>
        </GameOption>
        
        <GameOption>
          <OptionLabel>賽道類型:</OptionLabel>
          <Select 
            value={trackType} 
            onChange={(e) => setTrackType(e.target.value)}
          >
            <option value="standard">標準賽道</option>
            <option value="mountain">山地賽道</option>
            <option value="city">城市賽道</option>
          </Select>
        </GameOption>
        
        <Button onClick={handleStartGame}>
          開始遊戲
        </Button>
      </MenuOptions>
    </MainMenuContainer>
  );
};

export default MainMenu;