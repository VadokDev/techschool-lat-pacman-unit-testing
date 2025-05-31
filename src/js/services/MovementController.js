import { KEY_UP, KEY_RIGHT, KEY_DOWN, KEY_LEFT } from "../engine/Keyboard.js";
import {
  EVENT_SWIPE_UP,
  EVENT_SWIPE_RIGHT,
  EVENT_SWIPE_DOWN,
  EVENT_SWIPE_LEFT,
} from "../engine/Touch.js";

/**
 * MovementController handles converting input (keyboard/touch) to movement directions.
 * This class contains an intentional bug for testing purposes:
 * - ALL directions are inverted (up/down/left/right)
 */
class MovementController {
  constructor() {
    this._lastSwipe = null;
  }

  /**
   * Get the current movement direction based on keyboard input and touch swipes
   * @param {Object} keys - Keyboard keys state object
   * @param {string|null} lastSwipe - Last swipe event type
   * @returns {string|null} Direction ('u', 'd', 'l', 'r') or null
   */
  getInputDirection(keys, lastSwipe = null) {
    this._lastSwipe = lastSwipe || this._lastSwipe;

    let direction = null;

    if (keys[KEY_UP]) {
      direction = "d";
    } else if (keys[KEY_RIGHT]) {
      direction = "l";
    } else if (keys[KEY_DOWN]) {
      direction = "u";
    } else if (keys[KEY_LEFT]) {
      direction = "r";
    }

    if (direction) {
      this._lastSwipe = null;
      return direction;
    }

    return this._getSwipeDirection();
  }

  /**
   * Convert swipe events to movement directions
   * @returns {string|null} Direction or null
   * @private
   */
  _getSwipeDirection() {
    if (this._lastSwipe === EVENT_SWIPE_UP) {
      // BUG: Intentionally inverted - up swipe should go down
      return "d";
    } else if (this._lastSwipe === EVENT_SWIPE_RIGHT) {
      // BUG: Intentionally inverted - right swipe should go left
      return "l";
    } else if (this._lastSwipe === EVENT_SWIPE_DOWN) {
      // BUG: Intentionally inverted - down swipe should go up
      return "u";
    } else if (this._lastSwipe === EVENT_SWIPE_LEFT) {
      // BUG: Intentionally inverted - left swipe should go right
      return "r";
    }

    return null;
  }

  /**
   * Update the last swipe for touch input
   * @param {string} swipeType - The swipe event type
   */
  setLastSwipe(swipeType) {
    this._lastSwipe = swipeType;
  }

  /**
   * Clear the last swipe state
   */
  clearLastSwipe() {
    this._lastSwipe = null;
  }

  /**
   * Get the correct direction (for testing purposes)
   * This method shows what the CORRECT behavior should be
   * @param {Object} keys - Keyboard keys state object
   * @returns {string|null} Direction or null
   */
  getCorrectDirection(keys) {
    if (keys[KEY_UP]) return "u"; // Correct: up key goes up
    if (keys[KEY_RIGHT]) return "r"; // Correct: right key goes right
    if (keys[KEY_DOWN]) return "d"; // Correct: down key goes down
    if (keys[KEY_LEFT]) return "l"; // Correct: left key goes left
    return null;
  }
}

export default MovementController;
