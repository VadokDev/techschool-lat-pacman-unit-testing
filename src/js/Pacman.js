import Animation, { ANIMATION_HORIZONTAL } from "./engine/Animation.js";
import Character from "./Character.js";
import PowerPelletEffects from "./services/PowerPelletEffects.js";

const animationBase = {
  imageURL: "img/characters.png",
  numberOfFrame: 4,
  delta: 64,
  refreshRate: 60,
  offsetY: 60,
  type: ANIMATION_HORIZONTAL,
};

const animations = {
  right: new Animation({
    ...animationBase,
  }),

  down: new Animation({
    ...animationBase,
    offsetX: 64 * 4,
  }),

  up: new Animation({
    ...animationBase,
    offsetX: 64 * 8,
  }),

  left: new Animation({
    ...animationBase,
    offsetX: 64 * 12,
  }),
};

const defaults = {
  animations,
  dir: "l",
  defaultAnimation: "left",
  preturn: true,
  frightenedSpeed: null,
  frightenedDotSpeed: null,
  dotSpeed: null,
};

class Pacman extends Character {
  constructor(options) {
    super(options);

    Object.keys(defaults).forEach((key) => {
      if (key in options) this[key] = options[key];
    });

    const {
      addGameGhostEatEventListener,
      addGameGhostModeFrightenedEnter,
      addGameGhostModeFrightenedExit,
    } = options;

    this._ghostFrightened = [];

    // Initialize PowerPelletEffects service
    this.powerPelletEffects = new PowerPelletEffects();

    // Change tile. Set direction.
    this.on("item:tile", (tile) => {
      if (this._ghostFrightened.length) this._speed = this.frightenedSpeed;
      else this._speed = this.speed;

      if (tile.item) {
        if (this.powerPelletEffects.isPowerPellet(tile)) {
          // Power Pill!
          // BUG: This will kill Pacman instead of making ghosts frightened
          const result = this.powerPelletEffects.consumePowerPellet(
            this, // pacman
            [], // ghosts (will be passed from Game.js)
            () => {
              // BUG: Trigger full death sequence like ghost collision
              this._eatenTurns = 9;
              this.dir = "r";
              this.pauseAnimation();
            }, // onPacmanDeath
            () => this.emit("item:eatpill", tile), // onGhostsFrightened
            (score) => this.emit("item:score", score), // onScoreAdd
            50 // pelletScore
          );
        } else if (this.powerPelletEffects.isRegularDot(tile)) {
          // Regular Dot!
          this.powerPelletEffects.consumeRegularDot(
            (score) => this.emit("item:score", score), // onScoreAdd
            10 // dotScore
          );
          this.emit("item:eatdot", tile);
          if (this._ghostFrightened.length)
            this._speed = this.frightenedDotSpeed;
          else this._speed = this.dotSpeed;
        }
        tile.item.destroy();
        tile.item = null;
      }
    });

    addGameGhostEatEventListener((ghost) => {
      this._eatenTurns = 9;
      this.dir = "r";
      this.pauseAnimation();
    });

    addGameGhostModeFrightenedEnter((ghost) => {
      this._ghostFrightened = this._ghostFrightened
        .filter((f) => f !== ghost)
        .concat([ghost]);
    });

    addGameGhostModeFrightenedExit((ghost) => {
      this._ghostFrightened = this._ghostFrightened.filter((f) => f !== ghost);
    });
  }

  reset() {
    Character.prototype.reset.apply(this);
    this._lastEatenTurnsTime = null;
    // Reset power pellet effects when resetting Pacman
    this.powerPelletEffects.reset();
  }

  move() {
    if (!this._eatenTurns) Character.prototype.move.apply(this, arguments);
    else if (!this._eatenTurnsFrames) {
      if (this._eatenTurns === 9) this.emit("item:die");
      if (this._eatenTurns > 2) {
        var directions = { d: "l", l: "u", u: "r", r: "d" };
        this.dir = directions[this.dir];
        this.setNextAnimation();
        this.update();
        this._eatenTurnsFrames = 5;
      } else this._eatenTurnsFrames = 25;

      this._eatenTurns--;

      if (this._eatenTurns === 0) this.emit("item:life");
    } else this._eatenTurnsFrames--;
  }

  /**
   * Get the PowerPelletEffects service instance (for testing)
   * @returns {PowerPelletEffects} The power pellet effects service
   */
  getPowerPelletEffects() {
    return this.powerPelletEffects;
  }
}

Object.assign(Pacman.prototype, defaults);

export default Pacman;
