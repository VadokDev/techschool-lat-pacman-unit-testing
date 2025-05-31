import { describe, it, expect } from "@jest/globals";
import Animation from "../src/js/engine/Animation.js";
import Map from "../src/js/Map.js";
import map1 from "../src/js/maps/map-1.js";
import Item from "../src/js/Item.js";
import makeMsPacman from "../src/js/factory/makeMsPacman.js";

let map;

document.body.innerHTML = '<div id="playground"></div>';

describe("Map", () => {
  it("Should exist and be initialized", () => {
    expect(Map).toBeDefined();
    map = new Map(map1);
    expect(map).toBeDefined();
  });

  it("Should have correct tiles length", () => {
    expect(map).toHaveProperty("tiles");
    expect(map.tiles.length).toBe(1008);
  });

  it("Should get tile", () => {
    let tile = map.getTile(0, 0);
    expect(tile).toBeDefined();
    expect(typeof tile.getD()).toBe("object");
    expect(tile.getD().getU()).toBe(tile);
    expect(tile.getR().getL()).toBe(tile);
  });

  it("Should get negative positioned tile", () => {
    let tileA = map.getTile(-1, 0);
    expect(tileA).toBeDefined();
    let tileB = map.getTile(27, 0);
    expect(tileB).toBeDefined();
    expect(tileA).toBe(tileB);
  });

  it("Shorthand code methods should work as expected", () => {
    for (let i = 0; i < map.tiles.length; i++) {
      let t = map.tiles[i];
      if (t.code === "h") expect(t.isHouse()).toBe(true);
      if (t.code === ">") expect(t.isOnlyRight()).toBe(true);
      if (t.code === "<") expect(t.isOnlyLeft()).toBe(true);
      if (t.code === "e") expect(t.isExit()).toBe(true);
      if (t.code === "=") expect(t.isWall()).toBe(true);
    }
  });
});

describe("Item", () => {
  let item;

  it("Should exist and be initialized", () => {
    item = new Item({
      map,
      width: 4,
      height: 4,
      x: 218,
      y: 424,
      animations: {
        default: new Animation({
          imageURL: "../img/pills.png",
          numberOfFrame: 1,
          offsetX: 12,
        }),
      },
    });
    expect(item).toBeDefined();
    expect(item).toHaveProperty("el");
  });

  it("Should be in a tile", () => {
    expect(typeof item.getTile()).toBe("object");
  });

  it("Should bind/trigger events", (done) => {
    item.on("custom-event", () => {
      done();
    });
    item.emit("custom-event");
  });
});

describe("Pacman", () => {
  let pacman;

  it("Should exist and be initialized", () => {
    pacman = makeMsPacman({
      map,
      speed: 50,
      addGameGhostEatEventListener: () => {},
      addGameGhostModeFrightenedEnter: () => {},
      addGameGhostModeFrightenedExit: () => {},
    });
    expect(pacman).toBeDefined();
    expect(pacman).toHaveProperty("animations");
    expect(pacman).toHaveProperty("el");
  });

  it("Should be centered", () => {
    pacman.x = 16;
    pacman.y = 20;
    pacman.update();
    expect(pacman._isCentered()).toBe(true);
  });

  it("Should get step", () => {
    pacman.step = 10;
    expect(pacman.getStep()).toBe(5);
  });

  it("Should get min", () => {
    expect(pacman.getMin(4, 2, 1)).toBe(1);
    expect(pacman.getMin(4, 0, 1)).toBe(0);
    expect(pacman.getMin(4, -2, 1)).toBe(-2);
  });
});

describe("Animation", () => {
  it("should have defaults", () => {
    const animation = new Animation({});

    expect(animation.imageURL).toBeNull();
    expect(animation.numberOfFrame).toBe(1);
    expect(animation.delta).toBe(0);
    expect(animation.refreshRate).toBe(30);
    expect(animation.type).toBe(0);
    expect(animation.offsetX).toBe(0);
    expect(animation.offsetY).toBe(0);
  });

  it("should override defaults", () => {
    const animation = new Animation({
      imageURL: "/images/sprite.png",
      numberOfFrame: 4,
      delta: 32,
      refreshRate: 60,
      type: 1,
      offsetX: 16,
      offsetY: 32,
    });

    expect(animation.imageURL).toBe("/images/sprite.png");
    expect(animation.numberOfFrame).toBe(4);
    expect(animation.delta).toBe(32);
    expect(animation.refreshRate).toBe(60);
    expect(animation.type).toBe(1);
    expect(animation.offsetX).toBe(16);
    expect(animation.offsetY).toBe(32);
  });
});
