import { IImageConstructor } from '../interfaces/image.interface';

export class Image extends Phaser.GameObjects.Image {

  constructor(aParams: IImageConstructor) {
    super(aParams.scene, aParams.x, aParams.y, aParams.texture, aParams.frame);

    this.scene.add.existing(this);
  }
}
