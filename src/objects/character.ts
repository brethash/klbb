import { CharacterConstructor } from '../interfaces/character.interface';
import Phaser from "phaser";
import {Physics} from "./physics";

export class Character extends Phaser.Physics.Arcade.Sprite {

  body: Phaser.Physics.Arcade.Body;
  private _hitPoints: number;
  private _jumpSound: string;
  private _physics: Physics;

  constructor(aParams: CharacterConstructor) {
    super(aParams.scene,
        aParams.startX,
        aParams.startY,
        aParams.spriteId);

    this.initSprite();
    this.initPhysics(aParams.physics);

    if (aParams.jumpSound) {
      this.jumpSound = aParams.jumpSound;
    }
    // todo: maybe we need like a "hero" class or something?
    if (aParams.hitPoints) {
      this.hitPoints = aParams.hitPoints;
    }

    this.scene.add.existing(this);
  }

  private initSprite() {
    // todo: this is lol
      // todo: lolmode where this is set to a random val eacj jump
    this.setScale(1.0);
  }

  private initPhysics(physics: Physics) {
    this.scene.physics.world.enable(this);

    if (physics.velocityX && physics.velocityY) {
        this.body.setVelocity(physics.velocityX, physics.velocityY);
    } else if (physics.velocityX) {
        this.body.setVelocityX(physics.velocityX);
    } else if (physics.velocityY) {
        this.body.setVelocityY(physics.velocityY);
    }

    if (physics.bounceX && physics.bounceY) {
      this.body.setBounce(physics.bounceX, physics.bounceY);
    } else if (physics.bounceX) {
      this.body.setBounceX(physics.bounceX);
    } else if (physics.bounceY) {
      this.body.setBounceY(physics.bounceY);
    }

    this.body.setCollideWorldBounds(physics.colliderWorldBounds);
  }

  get hitPoints(): number {
      return this._hitPoints;
  }

  set hitPoints(hitPoints: number) {
      this._hitPoints = hitPoints;
  }
  get jumpSound(): string {
      return this._jumpSound;
  }

  set jumpSound(jumpSound: string) {
      this._jumpSound = jumpSound;
  }

  /**
   * Re-inits the body physics settings
   * @param physics
   */
  set physics(physics: Physics) {
      this._physics = physics;
      this.initPhysics(this.physics);
  }
  get physics(): Physics {
      return this._physics;
  }
}
