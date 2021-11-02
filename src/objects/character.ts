import { CharacterConstructor } from '../interfaces/character.interface';
import Phaser from "phaser";

export class Character extends Phaser.Physics.Arcade.Sprite {
  body: Phaser.Physics.Arcade.Body;
  private _hitPoints: number | boolean = false;
  private _jumpSound: string;

  constructor(aParams: CharacterConstructor) {
    super(aParams.scene,
        aParams.startX,
        aParams.startY,
        aParams.spriteId);

    this.initSprite();
    this.initPhysics();
    if (aParams.jumpSound) {
      this.jumpSound = aParams.jumpSound;
    }
    if (aParams.hitPoints) {
      this.hitPoints = aParams.hitPoints;
    }

    this.scene.add.existing(this);
  }

  private initSprite() {
    // todo: this is lol
    this.setScale(1.0);
  }

  private initPhysics() {
    // todo: take the rest of the stuff like physics and assign them here
    this.scene.physics.world.enable(this);
    // this.body.setVelocity(100, 200);
    // this.body.setBounce(1, 1);
    // this.body.setCollideWorldBounds(true);
  }

    get hitPoints(): number | boolean {
        return this._hitPoints;
    }

    set hitPoints(value: number | boolean) {
        this._hitPoints = value;
    }
    get jumpSound(): string {
        return this._jumpSound;
    }

    set jumpSound(value: string) {
        this._jumpSound = value;
    }
}

// //  Player physics properties. Give the little guy a slight bounce.
// this.player.setBounce(0.2);
// this.player.setCollideWorldBounds(true);