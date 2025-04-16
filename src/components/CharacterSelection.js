import React, { useState, useEffect } from 'react';
import styled from 'styled-components';

// Import constants
import { GAME_STATES, CHARACTER_TYPES } from '../utils/constants';

const Container = styled.div`
  padding: 20px;
  background-color: rgba(255, 255, 255, 0.9);
  border-radius: 10px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
  max-width: 800px;
  margin: 0 auto;
`;

const Title = styled.h2`
  color: #2c3e50;
  text-align: center;
  font-size: 2rem;
  margin-bottom: 20px;
`;

const CharactersGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 20px;
  margin-bottom: 30px;
`;

const CharacterCard = styled.div`
  border: 2px solid ${props => props.selected ? '#3498db' : '#ddd'};
  border-radius: 8px;
  padding: 15px;
  cursor: pointer;
  background-color: ${props => props.selected ? '#e3f2fd' : 'white'};
  transition: all 0.3s ease;
  
  &:hover {
    border-color: #3498db;
    transform: translateY(-2px);
  }
`;

const CharacterName = styled.h3`
  color: #2c3e50;
  margin-bottom: 10px;
`;

const CharacterDescription = styled.p`
  color: #7f8c8d;
  margin-bottom: 15px;
  font-size: 0.9rem;
`;

const StatBar = styled.div`
  background-color: #ecf0f1;
  height: 10px;
  border-radius: 5px;
  margin-bottom: 10px;
  position: relative;
  
  &::after {
    content: '';
    position: absolute;
    left: 0;
    top: 0;
    height: 100%;
    width: ${props => (props.value * 20)}%;
    background-color: #3498db;
    border-radius: 5px;
  }
`;

const StatLabel = styled.div`
  display: flex;
  justify-content: space-between;
  font-size: 0.8rem;
  color: #34495e;
  margin-bottom: 5px;
`;

const StatName = styled.span`
  font-weight: bold;
`;

const ButtonContainer = styled.div`
  display: flex;
  justify-content: space-between;
  margin-top: 20px;
`;

const Button = styled.button`
  background-color: ${props => props.secondary ? '#95a5a6' : '#3498db'};
  color: white;
  padding: 10px 20px;
  border: none;
  border-radius: 5px;
  font-size: 1rem;
  cursor: pointer;
  transition: background-color 0.3s;
  
  &:hover {
    background-color: ${props => props.secondary ? '#7f8c8d' : '#2980b9'};
  }
  
  &:disabled {
    background-color: #bdc3c7;
    cursor: not-allowed;
  }
`;

const PlayersContainer = styled.div`
  margin-bottom: 20px;
`;

const PlayerLabel = styled.div`
  font-weight: bold;
  color: #34495e;
  margin-bottom: 10px;
`;

const SpecialAbility = styled.div`
  margin-top: 15px;
  padding: 10px;
  background-color: #f5f6fa;
  border-radius: 5px;
`;

const AbilityName = styled.span`
  font-weight: bold;
  color: #e67e22;
`;

/**
 * CharacterSelection component - Allows players to select their racing characters
 * @param {Object} props - Component props
 * @param {Function} props.onStateChange - Function to change game state
 * @param {Object} props.gameConfig - Game configuration options
 */
const CharacterSelection = ({ onStateChange, gameConfig }) => {
  // Track selected characters for each player
  const [selectedCharacters, setSelectedCharacters] = useState({});
  const [currentPlayer, setCurrentPlayer] = useState(1);
  
  // Initialize character selection
  useEffect(() => {
    // Reset selections when component mounts or player count changes
    setSelectedCharacters({});
    setCurrentPlayer(1);
  }, [gameConfig.playerCount]);
  
  /**
   * Handle character selection for the current player
   * @param {string} characterId - The ID of the selected character
   */
  const handleCharacterSelect = (characterId) => {
    setSelectedCharacters({
      ...selectedCharacters,
      [currentPlayer]: characterId
    });
  };
  
  /**
   * Move to next player selection or start the game if all players selected
   */
  const handleNextPlayer = () => {
    if (currentPlayer < gameConfig.playerCount) {
      // Move to next player
      setCurrentPlayer(currentPlayer + 1);
    } else {
      // All players have selected, start the game
      const players = Object.entries(selectedCharacters).map(([playerId, characterId]) => ({
        id: parseInt(playerId),
        character: CHARACTER_TYPES[characterId],
        position: 0,
        energy: 100,
        cards: [] // Cards will be dealt at game start
      }));
      
      // Start the game with selected characters
      onStateChange(GAME_STATES.GAME_BOARD, { players });
    }
  };
  
  /**
   * Go back to the previous player or main menu
   */
  const handleBack = () => {
    if (currentPlayer > 1) {
      // Go back to previous player
      setCurrentPlayer(currentPlayer - 1);
      // Remove the current player's selection
      const updatedSelections = { ...selectedCharacters };
      delete updatedSelections[currentPlayer];
      setSelectedCharacters(updatedSelections);
    } else {
      // Return to main menu
      onStateChange(GAME_STATES.MAIN_MENU);
    }
  };
  
  // Check if current player has made a selection
  const hasSelection = selectedCharacters[currentPlayer] !== undefined;
  
  return (
    <Container>
      <Title>選擇你的車手</Title>
      
      <PlayersContainer>
        <PlayerLabel>
          玩家 {currentPlayer} 請選擇你的角色
        </PlayerLabel>
      </PlayersContainer>
      
      <CharactersGrid>
        {Object.values(CHARACTER_TYPES).map((character) => (
          <CharacterCard
            key={character.id}
            selected={selectedCharacters[currentPlayer] === character.id}
            onClick={() => handleCharacterSelect(character.id)}
          >
            <CharacterName>{character.name}</CharacterName>
            <CharacterDescription>{character.description}</CharacterDescription>
            
            {/* Stats bars */}
            <StatLabel>
              <StatName>速度</StatName>
              <span>{character.baseStats.speed}/5</span>
            </StatLabel>
            <StatBar value={character.baseStats.speed} />
            
            <StatLabel>
              <StatName>爬坡</StatName>
              <span>{character.baseStats.climbing}/5</span>
            </StatLabel>
            <StatBar value={character.baseStats.climbing} />
            
            <StatLabel>
              <StatName>下坡</StatName>
              <span>{character.baseStats.descending}/5</span>
            </StatLabel>
            <StatBar value={character.baseStats.descending} />
            
            <StatLabel>
              <StatName>耐力</StatName>
              <span>{character.baseStats.endurance}/5</span>
            </StatLabel>
            <StatBar value={character.baseStats.endurance} />
            
            <StatLabel>
              <StatName>恢復</StatName>
              <span>{character.baseStats.recovery}/5</span>
            </StatLabel>
            <StatBar value={character.baseStats.recovery} />
            
            <SpecialAbility>
              <AbilityName>{character.specialAbility}: </AbilityName>
              {character.specialAbilityDescription}
            </SpecialAbility>
          </CharacterCard>
        ))}
      </CharactersGrid>
      
      <ButtonContainer>
        <Button secondary onClick={handleBack}>
          {currentPlayer > 1 ? '上一位玩家' : '返回選單'}
        </Button>
        
        <Button 
          onClick={handleNextPlayer} 
          disabled={!hasSelection}
        >
          {currentPlayer < gameConfig.playerCount ? '下一位玩家' : '開始比賽'}
        </Button>
      </ButtonContainer>
    </Container>
  );
};

export default CharacterSelection;