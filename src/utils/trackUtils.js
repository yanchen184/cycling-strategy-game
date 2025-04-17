import { TRACK_TYPES, SEGMENT_TYPES } from './constants';

/**
 * Generate a track based on track type
 * @param {string} trackType - Type of track to generate
 * @returns {Array} - Array of track segments
 */
export const generateTrack = (trackType) => {
  const trackConfig = TRACK_TYPES[trackType];
  
  if (!trackConfig) {
    console.error(`Invalid track type: ${trackType}`);
    return [];
  }
  
  const { length } = trackConfig;
  const segments = [];
  
  // Different track types have different segment distributions
  switch (trackType) {
    case 'standard':
      // Standard track has a balance of all segment types
      for (let i = 0; i < length; i++) {
        let segmentType;
        
        // First segment is always flat
        if (i === 0) {
          segmentType = SEGMENT_TYPES.FLAT;
        } else {
          const rand = Math.random();
          if (rand < 0.5) {
            segmentType = SEGMENT_TYPES.FLAT;
          } else if (rand < 0.65) {
            segmentType = SEGMENT_TYPES.UPHILL;
          } else if (rand < 0.8) {
            segmentType = SEGMENT_TYPES.DOWNHILL;
          } else if (rand < 0.9) {
            segmentType = SEGMENT_TYPES.SHARP_TURN;
          } else {
            segmentType = SEGMENT_TYPES.SPRINT;
          }
        }
        
        segments.push({ 
          type: segmentType,
          index: i
        });
      }
      break;
      
    case 'mountain':
      // Mountain track has more uphills and downhills
      for (let i = 0; i < length; i++) {
        let segmentType;
        
        // First segment is always flat
        if (i === 0) {
          segmentType = SEGMENT_TYPES.FLAT;
        } else {
          const rand = Math.random();
          if (rand < 0.25) {
            segmentType = SEGMENT_TYPES.FLAT;
          } else if (rand < 0.55) {
            segmentType = SEGMENT_TYPES.UPHILL;
          } else if (rand < 0.8) {
            segmentType = SEGMENT_TYPES.DOWNHILL;
          } else if (rand < 0.9) {
            segmentType = SEGMENT_TYPES.SHARP_TURN;
          } else {
            segmentType = SEGMENT_TYPES.SPRINT;
          }
        }
        
        segments.push({ 
          type: segmentType,
          index: i
        });
      }
      break;
      
    case 'city':
      // City track has more sharp turns and sprint segments
      for (let i = 0; i < length; i++) {
        let segmentType;
        
        // First segment is always flat
        if (i === 0) {
          segmentType = SEGMENT_TYPES.FLAT;
        } else {
          const rand = Math.random();
          if (rand < 0.4) {
            segmentType = SEGMENT_TYPES.FLAT;
          } else if (rand < 0.5) {
            segmentType = SEGMENT_TYPES.UPHILL;
          } else if (rand < 0.6) {
            segmentType = SEGMENT_TYPES.DOWNHILL;
          } else if (rand < 0.85) {
            segmentType = SEGMENT_TYPES.SHARP_TURN;
          } else {
            segmentType = SEGMENT_TYPES.SPRINT;
          }
        }
        
        segments.push({ 
          type: segmentType,
          index: i
        });
      }
      break;
      
    default:
      // Fallback to standard track
      return generateTrack('standard');
  }
  
  return segments;
};

/**
 * Get segment-specific effects
 * @param {string} segmentType - Type of segment
 * @returns {Object} - Segment effects on speed and energy
 */
export const getSegmentEffects = (segmentType) => {
  switch (segmentType) {
    case SEGMENT_TYPES.FLAT:
      return {
        speedModifier: 1.0,
        energyModifier: 1.0
      };
      
    case SEGMENT_TYPES.UPHILL:
      return {
        speedModifier: 0.7,
        energyModifier: 1.4
      };
      
    case SEGMENT_TYPES.DOWNHILL:
      return {
        speedModifier: 1.3,
        energyModifier: 0.8
      };
      
    case SEGMENT_TYPES.SHARP_TURN:
      return {
        speedModifier: 0.8,
        energyModifier: 1.2
      };
      
    case SEGMENT_TYPES.SPRINT:
      return {
        speedModifier: 1.2,
        energyModifier: 1.1
      };
      
    default:
      return {
        speedModifier: 1.0,
        energyModifier: 1.0
      };
  }
};