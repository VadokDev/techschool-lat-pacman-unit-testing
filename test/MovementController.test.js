import { describe, it, expect } from "@jest/globals";
import MovementController from "../src/js/services/MovementController.js";
import { KEY_UP } from "../src/js/engine/Keyboard.js";

describe("MovementController", () => {
  describe("Keyboard Input Direction", () => {
    it("should go up when the up key is pressed", () => {
      /* Notes about keyboard input and direction output:
      - up key activated -> up direction ("u")
      - right key activated -> right direction ("r")
      - down key activated -> down direction ("d")
      - left key activated -> left direction ("l")
      */

      const keys = {};
      keys[KEY_UP] = true;

      const movementController = new MovementController();
      const upDirection = movementController.getInputDirection(keys);
      expect(upDirection).toBe("d");
    });
  });
});
