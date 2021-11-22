import Phaser from 'phaser';
import RexUIPlugin from 'phaser3-rex-plugins/templates/ui/ui-plugin'
import TitleScreenScene from './scenes/TitleScreen';
import GameScene from './scenes/Game';

export default {
  type: Phaser.AUTO,
  parent: 'klbb',
  backgroundColor: '#33A5E7',
  physics: {
    default: 'arcade',
    arcade: {
      gravity: { y: 500 }
    }
  },
  dom: {
    createContainer: true
  },
  scale: {
    width: 800,
    height: 600,
    mode: Phaser.Scale.FIT,
    autoCenter: Phaser.Scale.CENTER_BOTH
  },
  plugins: {
    scene: [
      {
        key: 'rexUI',
        plugin: RexUIPlugin,
        mapping: 'rexUI'
      }
    ]
  }
};
