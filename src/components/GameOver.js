import React from 'react';
import styled from 'styled-components';

// Import constants
import { GAME_STATES } from '../utils/constants';

const Container = styled.div`
  max-width: 800px;
  margin: 0 auto;
  padding: 20px;
  background-color: rgba(255, 255, 255, 0.9);
  border-radius: 10px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
`;

const Title = styled.h2`
  color: #2c3e50;
  text-align: center;
  font-size: 2.5rem;
  margin-bottom: 20px;
`;

const ResultsTable = styled.table`
  width: 100%;
  border-collapse: collapse;
  margin-bottom: 30px;
`;

const TableHeader = styled.th`
  padding: 12px;
  background-color: #34495e;
  color: white;
  text-align: left;
  border-bottom: 2px solid #2c3e50;
`;

const TableRow = styled.tr`
  &:nth-child(even) {
    background-color: #f2f2f2;
  }
  
  &:hover {
    background-color: #e3f2fd;
  }
`;

const TableCell = styled.td`
  padding: 12px;
  border-bottom: 1px solid #ddd;
`;

const RankCell = styled(TableCell)`
  font-weight: bold;
  color: ${props => {
    switch (props.rank) {
      case 1: return '#f39c12'; // Gold
      case 2: return '#7f8c8d'; // Silver
      case 3: return '#d35400'; // Bronze
      default: return '#2c3e50';
    }
  }};
`;

const StatsContainer = styled.div`
  display: flex;
  justify-content: space-around;
  flex-wrap: wrap;
  margin-bottom: 30px;
`;

const StatBox = styled.div`
  flex: 1;
  min-width: 200px;
  background-color: #f8f9fa;
  padding: 15px;
  margin: 10px;
  border-radius: 8px;
  text-align: center;
`;

const StatValue = styled.div`
  font-size: 2rem;
  font-weight: bold;
  color: #3498db;
  margin-bottom: 5px;
`;

const StatLabel = styled.div`
  color: #7f8c8d;
  font-size: 0.9rem;
`;

const ButtonContainer = styled.div`
  display: flex;
  justify-content: space-around;
  margin-top: 30px;
`;

const Button = styled.button`
  background-color: ${props => props.primary ? '#3498db' : '#95a5a6'};
  color: white;
  padding: 12px 25px;
  border: none;
  border-radius: 5px;
  font-size: 1.1rem;
  cursor: pointer;
  transition: background-color 0.3s;
  
  &:hover {
    background-color: ${props => props.primary ? '#2980b9' : '#7f8c8d'};
  }
`;

/**
 * GameOver component - Displays game results and statistics
 * @param {Object} props - Component props
 * @param {Function} props.onStateChange - Function to change game state
 * @param {Object} props.gameConfig - Game configuration and results
 */
const GameOver = ({ onStateChange, gameConfig }) => {
  // Extract results from gameConfig
  const results = gameConfig.results || [];
  const turns = gameConfig.turns || 0;
  
  /**
   * Handle returning to main menu
   */
  const handleMainMenu = () => {
    onStateChange(GAME_STATES.MAIN_MENU);
  };
  
  /**
   * Handle starting a new game with same config
   */
  const handlePlayAgain = () => {
    // Keep same config but reset players
    const newConfig = { ...gameConfig };
    delete newConfig.results;
    delete newConfig.turns;
    delete newConfig.players;
    
    onStateChange(GAME_STATES.CHARACTER_SELECTION, newConfig);
  };
  
  return (
    <Container>
      <Title>比賽結束</Title>
      
      <StatsContainer>
        <StatBox>
          <StatValue>{turns}</StatValue>
          <StatLabel>總回合數</StatLabel>
        </StatBox>
        
        <StatBox>
          <StatValue>{results.length}</StatValue>
          <StatLabel>參賽選手</StatLabel>
        </StatBox>
        
        <StatBox>
          <StatValue>
            {results[0]?.character?.name || '無冠軍'}
          </StatValue>
          <StatLabel>冠軍選手類型</StatLabel>
        </StatBox>
      </StatsContainer>
      
      <ResultsTable>
        <thead>
          <tr>
            <TableHeader>排名</TableHeader>
            <TableHeader>玩家</TableHeader>
            <TableHeader>角色類型</TableHeader>
            <TableHeader>最終位置</TableHeader>
            <TableHeader>剩餘能量</TableHeader>
          </tr>
        </thead>
        <tbody>
          {results.map((player, index) => (
            <TableRow key={player.id}>
              <RankCell rank={index + 1}>#{index + 1}</RankCell>
              <TableCell>玩家 {player.id}</TableCell>
              <TableCell>{player.character.name}</TableCell>
              <TableCell>{player.position.toFixed(1)}</TableCell>
              <TableCell>{player.energy.toFixed(0)}%</TableCell>
            </TableRow>
          ))}
        </tbody>
      </ResultsTable>
      
      <ButtonContainer>
        <Button onClick={handleMainMenu}>
          返回主選單
        </Button>
        
        <Button primary onClick={handlePlayAgain}>
          再玩一次
        </Button>
      </ButtonContainer>
    </Container>
  );
};

export default GameOver;