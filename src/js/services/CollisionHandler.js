/**
 * CollisionHandler manages collision detection and effects between game characters.
 * This class contains an intentional bug for testing purposes:
 * - Ghost-Pacman collisions do not trigger Pacman death
 */
class CollisionHandler {
  constructor() {
    this.collisionEvents = [];
  }

  /**
   * Check if two characters are colliding based on their positions
   * @param {Object} character1 - First character with tile and direction
   * @param {Object} character2 - Second character with tile and direction
   * @returns {boolean} True if characters are colliding
   */
  isColliding(character1, character2) {
    if (!character1.tile || !character2.tile) {
      return false;
    }

    const tile1 = character1.tile;
    const tile2 = character2.tile;
    const dir1 = character1.dir;
    const dir2 = character2.dir;

    // Direct tile collision
    if (tile1 === tile2) {
      return true;
    }

    // Check if characters are moving towards each other and will collide
    const opposite1 = this._getOppositeDirection(dir1);
    const opposite2 = this._getOppositeDirection(dir2);

    // Character1 moving toward character2's current position
    if (dir2 === opposite1 && tile2 === tile1.get(opposite1)) {
      return true;
    }

    // Character2 moving toward character1's current position
    if (dir1 === opposite2 && tile1 === tile2.get(opposite2)) {
      return true;
    }

    return false;
  }

  /**
   * Handle collision between Pacman and a Ghost
   * @param {Object} pacman - Pacman character object
   * @param {Object} ghost - Ghost character object
   * @param {Function} onPacmanEaten - Callback when Pacman is eaten by ghost
   * @param {Function} onGhostEaten - Callback when ghost is eaten by Pacman
   * @returns {Object} Collision result with type and affected character
   */
  handlePacmanGhostCollision(pacman, ghost, onPacmanEaten, onGhostEaten) {
    if (!this.isColliding(pacman, ghost)) {
      return { type: "none", character: null };
    }

    // If ghost is in frightened mode, Pacman eats the ghost
    if (ghost.mode === "frightened") {
      if (onGhostEaten && typeof onGhostEaten === "function") {
        onGhostEaten(ghost);
      }
      return { type: "ghost_eaten", character: ghost };
    }

    // BUG: Ghost should eat Pacman, but we're not calling the death callback
    // This is the intentional bug - ghost collisions don't kill Pacman
    if (ghost.mode !== "dead") {
      // CORRECT behavior would be:
      // if (onPacmanEaten && typeof onPacmanEaten === 'function') {
      //     onPacmanEaten(ghost);
      // }
      // return { type: 'pacman_eaten', character: pacman };

      // BUG: Instead, we do nothing when ghost touches Pacman
      console.log("Ghost touched Pacman but no death triggered (BUG)");
      return { type: "none", character: null };
    }

    return { type: "none", character: null };
  }

  /**
   * Handle collision correctly (for testing purposes)
   * This method shows what the CORRECT behavior should be
   * @param {Object} pacman - Pacman character object
   * @param {Object} ghost - Ghost character object
   * @param {Function} onPacmanEaten - Callback when Pacman is eaten by ghost
   * @param {Function} onGhostEaten - Callback when ghost is eaten by Pacman
   * @returns {Object} Collision result
   */
  handlePacmanGhostCollisionCorrectly(
    pacman,
    ghost,
    onPacmanEaten,
    onGhostEaten
  ) {
    if (!this.isColliding(pacman, ghost)) {
      return { type: "none", character: null };
    }

    if (ghost.mode === "frightened") {
      if (onGhostEaten && typeof onGhostEaten === "function") {
        onGhostEaten(ghost);
      }
      return { type: "ghost_eaten", character: ghost };
    }

    // CORRECT: Ghost should eat Pacman when not frightened or dead
    if (ghost.mode !== "dead") {
      if (onPacmanEaten && typeof onPacmanEaten === "function") {
        onPacmanEaten(ghost);
      }
      return { type: "pacman_eaten", character: pacman };
    }

    return { type: "none", character: null };
  }

  /**
   * Get the opposite direction
   * @param {string} direction - Current direction
   * @returns {string} Opposite direction
   * @private
   */
  _getOppositeDirection(direction) {
    const opposites = {
      u: "d",
      d: "u",
      l: "r",
      r: "l",
    };
    return opposites[direction];
  }

  /**
   * Record a collision event for debugging/testing
   * @param {Object} event - Collision event details
   */
  recordCollisionEvent(event) {
    this.collisionEvents.push({
      ...event,
      timestamp: Date.now(),
    });
  }

  /**
   * Get collision event history
   * @returns {Array} Array of collision events
   */
  getCollisionHistory() {
    return [...this.collisionEvents];
  }

  /**
   * Clear collision event history
   */
  clearCollisionHistory() {
    this.collisionEvents = [];
  }
}

export default CollisionHandler;
