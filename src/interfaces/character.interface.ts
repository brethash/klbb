import { Physics } from "../objects/physics";

export interface CharacterConstructor {
  scene: Phaser.Scene;
  spriteId: string;
  startX: number;
  startY: number;
  physics: Physics;
  jumpSound?: string;
  hitPoints?: number;
}
