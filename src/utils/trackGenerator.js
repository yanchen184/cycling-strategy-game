/**
 * Track generator utility
 * Generates race tracks based on track type with varying terrains and challenges
 */

import { TRACK_TYPES, SEGMENT_TYPES } from './constants';

/**
 * Generate a complete race track
 * @param {string} trackType - Type of track to generate
 * @returns {Array} Array of track segments
 */
export const generateTrack = (trackType = 'standard') => {
  // Get track template
  const trackTemplate = TRACK_TYPES[trackType] || TRACK_TYPES.standard;
  
  // Generate segments based on track type
  const segments = [];
  const length = trackTemplate.length;
  
  switch (trackType) {
    case 'mountain':
      generateMountainTrack(segments, length);
      break;
      
    case 'city':
      generateCityTrack(segments, length);
      break;
      
    default: // standard
      generateStandardTrack(segments, length);
  }
  
  return segments;
};

/**
 * Generate a standard balanced track
 * @param {Array} segments - Array to fill with segments
 * @param {number} length - Total track length
 */
const generateStandardTrack = (segments, length) => {
  // Distribution of segment types for standard track
  const distribution = {
    [SEGMENT_TYPES.FLAT]: 0.5,      // 50% flat
    [SEGMENT_TYPES.UPHILL]: 0.15,   // 15% uphill
    [SEGMENT_TYPES.DOWNHILL]: 0.15, // 15% downhill
    [SEGMENT_TYPES.SHARP_TURN]: 0.1, // 10% sharp turns
    [SEGMENT_TYPES.SPRINT]: 0.1     // 10% sprint sections
  };
  
  // Generate track segments
  generateSegmentsFromDistribution(segments, length, distribution);
  
  // Ensure first and last segments are flat for start/finish
  segments[0] = createSegment(SEGMENT_TYPES.FLAT);
  segments[segments.length - 1] = createSegment(SEGMENT_TYPES.FLAT);
  
  // Add sprint section near the end (80% mark)
  const sprintPosition = Math.floor(length * 0.8);
  segments[sprintPosition] = createSegment(SEGMENT_TYPES.SPRINT);
  
  return segments;
};

/**
 * Generate a mountain track with more climbing segments
 * @param {Array} segments - Array to fill with segments
 * @param {number} length - Total track length
 */
const generateMountainTrack = (segments, length) => {
  // Distribution for mountain track - more climbing and descending
  const distribution = {
    [SEGMENT_TYPES.FLAT]: 0.2,      // 20% flat
    [SEGMENT_TYPES.UPHILL]: 0.4,    // 40% uphill
    [SEGMENT_TYPES.DOWNHILL]: 0.3,  // 30% downhill
    [SEGMENT_TYPES.SHARP_TURN]: 0.05, // 5% sharp turns
    [SEGMENT_TYPES.SPRINT]: 0.05     // 5% sprint sections
  };
  
  // Generate track segments
  generateSegmentsFromDistribution(segments, length, distribution);
  
  // First segment is flat (start)
  segments[0] = createSegment(SEGMENT_TYPES.FLAT);
  
  // Last segment is flat (finish)
  segments[segments.length - 1] = createSegment(SEGMENT_TYPES.FLAT);
  
  // Create a long climb in the first half
  const climbStart = Math.floor(length * 0.2);
  const climbEnd = Math.floor(length * 0.4);
  
  for (let i = climbStart; i < climbEnd; i++) {
    segments[i] = createSegment(SEGMENT_TYPES.UPHILL);
  }
  
  // Create a long descent after the climb
  const descentStart = climbEnd;
  const descentEnd = Math.floor(length * 0.6);
  
  for (let i = descentStart; i < descentEnd; i++) {
    segments[i] = createSegment(SEGMENT_TYPES.DOWNHILL);
  }
  
  return segments;
};

/**
 * Generate a city track with more technical sections
 * @param {Array} segments - Array to fill with segments
 * @param {number} length - Total track length
 */
const generateCityTrack = (segments, length) => {
  // Distribution for city track - more technical with turns and sprints
  const distribution = {
    [SEGMENT_TYPES.FLAT]: 0.4,      // 40% flat
    [SEGMENT_TYPES.UPHILL]: 0.1,    // 10% uphill
    [SEGMENT_TYPES.DOWNHILL]: 0.1,  // 10% downhill
    [SEGMENT_TYPES.SHARP_TURN]: 0.25, // 25% sharp turns
    [SEGMENT_TYPES.SPRINT]: 0.15     // 15% sprint sections
  };
  
  // Generate track segments
  generateSegmentsFromDistribution(segments, length, distribution);
  
  // Ensure first and last segments are flat for start/finish
  segments[0] = createSegment(SEGMENT_TYPES.FLAT);
  segments[segments.length - 1] = createSegment(SEGMENT_TYPES.FLAT);
  
  // Create multiple sprint sections
  const sprintPositions = [
    Math.floor(length * 0.25),
    Math.floor(length * 0.5),
    Math.floor(length * 0.75)
  ];
  
  sprintPositions.forEach(position => {
    segments[position] = createSegment(SEGMENT_TYPES.SPRINT);
  });
  
  // Add technical sections with turns
  for (let i = 3; i < length - 3; i += 5) {
    segments[i] = createSegment(SEGMENT_TYPES.SHARP_TURN);
  }
  
  return segments;
};

/**
 * Generate track segments based on type distribution
 * @param {Array} segments - Array to fill with segments
 * @param {number} length - Total track length
 * @param {Object} distribution - Distribution of segment types
 */
const generateSegmentsFromDistribution = (segments, length, distribution) => {
  // First fill the array with empty slots
  for (let i = 0; i < length; i++) {
    segments.push(null);
  }
  
  // Get the segment types and their weights
  const segmentTypes = Object.keys(distribution);
  const weights = Object.values(distribution);
  
  // Fill each position
  for (let i = 0; i < length; i++) {
    if (segments[i] === null) {
      // Select a segment type based on the distribution
      const type = weightedRandomSelection(segmentTypes, weights);
      segments[i] = createSegment(type);
    }
  }
};

/**
 * Create a new track segment
 * @param {string} type - Type of segment
 * @returns {Object} Track segment object
 */
const createSegment = (type) => {
  // Base segment properties
  const segment = {
    type,
    difficulty: 1,  // Base difficulty
    length: 1       // Base segment length
  };
  
  // Adjust properties based on type
  switch (type) {
    case SEGMENT_TYPES.UPHILL:
      segment.difficulty = 2 + Math.random();  // 2-3 difficulty
      segment.slope = 5 + Math.floor(Math.random() * 10); // 5-15% grade
      break;
      
    case SEGMENT_TYPES.DOWNHILL:
      segment.difficulty = 1.5 + Math.random();  // 1.5-2.5 difficulty
      segment.slope = -(5 + Math.floor(Math.random() * 10)); // -5 to -15% grade
      break;
      
    case SEGMENT_TYPES.SHARP_TURN:
      segment.difficulty = 2 + Math.random();  // 2-3 difficulty
      segment.angle = 45 + Math.floor(Math.random() * 90); // 45-135 degree turn
      break;
      
    case SEGMENT_TYPES.SPRINT:
      segment.difficulty = 1 + Math.random();  // 1-2 difficulty
      segment.bonusPoints = 2 + Math.floor(Math.random() * 3); // 2-5 bonus points
      break;
      
    default: // FLAT
      segment.difficulty = 1;
  }
  
  return segment;
};

/**
 * Select an item from an array based on weighted probabilities
 * @param {Array} items - Array of items to choose from
 * @param {Array} weights - Corresponding weights for each item
 * @returns {*} Selected item
 */
const weightedRandomSelection = (items, weights) => {
  // Calculate the sum of all weights
  const totalWeight = weights.reduce((sum, weight) => sum + weight, 0);
  
  // Get a random value between 0 and the total weight
  let random = Math.random() * totalWeight;
  
  // Find the item that corresponds to the random value
  for (let i = 0; i < items.length; i++) {
    random -= weights[i];
    if (random <= 0) {
      return items[i];
    }
  }
  
  // Fallback to the last item if something goes wrong
  return items[items.length - 1];
};

/**
 * Ensure track segments flow logically
 * @param {Array} segments - Track segments to process
 * @returns {Array} Processed segments with logical transitions
 */
export const smoothTrack = (segments) => {
  // This function would implement additional logic to make the track flow more naturally
  // For example, avoiding abrupt transitions between certain segment types
  
  // Currently just a placeholder for future implementation
  return segments;
};