// todo: should define a Physics params object
export interface CharacterConstructor {
  scene: Phaser.Scene;
  spriteId: string;
  startX: number;
  startY: number;
  physics: object;
  jumpSound?: string;
  hitPoints?: number;
}
