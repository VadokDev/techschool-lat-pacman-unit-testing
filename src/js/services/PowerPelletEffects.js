/**
 * PowerPelletEffects handles the effects of consuming power pellets.
 * This class contains an intentional bug for testing purposes:
 * - Eating a power pellet kills Pacman instead of making ghosts frightened
 */
class PowerPelletEffects {
  constructor() {
    this.effectsHistory = [];
    this.activePowerPellets = 0;
  }

  /**
   * Handle the consumption of a power pellet
   * @param {Object} pacman - Pacman character object
   * @param {Array} ghosts - Array of ghost objects
   * @param {Function} onPacmanDeath - Callback when Pacman dies
   * @param {Function} onGhostsFrightened - Callback when ghosts become frightened
   * @param {Function} onScoreAdd - Callback to add score
   * @param {number} pelletScore - Score value for the pellet
   * @returns {Object} Effect result
   */
  consumePowerPellet(
    pacman,
    ghosts,
    onPacmanDeath,
    onGhostsFrightened,
    onScoreAdd,
    pelletScore = 50
  ) {
    this.activePowerPellets++;

    // Record the event
    const event = {
      type: "power_pellet_consumed",
      timestamp: Date.now(),
      pacmanPosition: { x: pacman.x, y: pacman.y },
      ghostCount: ghosts.length,
    };
    this.effectsHistory.push(event);

    // Add score (this part works correctly)
    if (onScoreAdd && typeof onScoreAdd === "function") {
      onScoreAdd(pelletScore);
    }

    // BUG: Instead of making ghosts frightened, kill Pacman
    // CORRECT behavior would be:
    // if (onGhostsFrightened && typeof onGhostsFrightened === 'function') {
    //     onGhostsFrightened(ghosts);
    // }
    // return { type: 'ghosts_frightened', affectedGhosts: ghosts };

    // BUG: Kill Pacman instead
    // NOTE: This only triggers "item:die" event (plays death sound)
    // but doesn't trigger full death sequence with life loss
    if (onPacmanDeath && typeof onPacmanDeath === "function") {
      console.log("Power pellet consumed - killing Pacman (BUG)");
      onPacmanDeath();
    }

    return { type: "pacman_death", reason: "power_pellet_bug" };
  }

  /**
   * Handle power pellet consumption correctly (for testing purposes)
   * This method shows what the CORRECT behavior should be
   * @param {Object} pacman - Pacman character object
   * @param {Array} ghosts - Array of ghost objects
   * @param {Function} onPacmanDeath - Callback when Pacman dies
   * @param {Function} onGhostsFrightened - Callback when ghosts become frightened
   * @param {Function} onScoreAdd - Callback to add score
   * @param {number} pelletScore - Score value for the pellet
   * @returns {Object} Effect result
   */
  consumePowerPelletCorrectly(
    pacman,
    ghosts,
    onPacmanDeath,
    onGhostsFrightened,
    onScoreAdd,
    pelletScore = 50
  ) {
    this.activePowerPellets++;

    // Record the event
    const event = {
      type: "power_pellet_consumed_correctly",
      timestamp: Date.now(),
      pacmanPosition: { x: pacman.x, y: pacman.y },
      ghostCount: ghosts.length,
    };
    this.effectsHistory.push(event);

    // Add score
    if (onScoreAdd && typeof onScoreAdd === "function") {
      onScoreAdd(pelletScore);
    }

    // CORRECT: Make ghosts frightened
    if (onGhostsFrightened && typeof onGhostsFrightened === "function") {
      onGhostsFrightened(ghosts);
    }

    return { type: "ghosts_frightened", affectedGhosts: ghosts };
  }

  /**
   * Check if a tile contains a power pellet
   * @param {Object} tile - Game tile object
   * @returns {boolean} True if tile contains a power pellet
   */
  isPowerPellet(tile) {
    return !!(tile && tile.item && tile.code === "*");
  }

  /**
   * Check if a tile contains a regular dot
   * @param {Object} tile - Game tile object
   * @returns {boolean} True if tile contains a regular dot
   */
  isRegularDot(tile) {
    return !!(tile && tile.item && tile.code === ".");
  }

  /**
   * Handle regular dot consumption
   * @param {Function} onScoreAdd - Callback to add score
   * @param {number} dotScore - Score value for the dot
   * @returns {Object} Effect result
   */
  consumeRegularDot(onScoreAdd, dotScore = 10) {
    const event = {
      type: "regular_dot_consumed",
      timestamp: Date.now(),
      score: dotScore,
    };
    this.effectsHistory.push(event);

    if (onScoreAdd && typeof onScoreAdd === "function") {
      onScoreAdd(dotScore);
    }

    return { type: "score_added", points: dotScore };
  }

  /**
   * Reset power pellet effects (for new game/level)
   */
  reset() {
    this.activePowerPellets = 0;
    this.effectsHistory = [];
  }

  /**
   * Get the effects history
   * @returns {Array} Array of effect events
   */
  getEffectsHistory() {
    return [...this.effectsHistory];
  }

  /**
   * Get the count of active power pellets
   * @returns {number} Number of active power pellets
   */
  getActivePowerPelletCount() {
    return this.activePowerPellets;
  }

  /**
   * Clear effects history
   */
  clearEffectsHistory() {
    this.effectsHistory = [];
  }
}

export default PowerPelletEffects;
