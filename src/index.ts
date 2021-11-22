import Phaser from 'phaser';
import config from './config';
import GameScene from './scenes/Game';
import TitleScreenScene from './scenes/TitleScreen';

new Phaser.Game(
  Object.assign(config, {
    scene: [TitleScreenScene, GameScene]
  })
);
