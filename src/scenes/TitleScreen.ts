import Phaser from 'phaser';

export default class TitleScreenScene extends Phaser.Scene {
  constructor() {
    super('TitleScreenScene');
  }
  private titleText: Phaser.GameObjects.Text;
  private music: Phaser.Sound;

  preload() {
    this.load.audio("goatSong", ["./public/assets/audio/goatminjr.ogg"]);
  }

  create() {

    // Add music
    this.music = this.sound.add('goatSong', {
      volume: 0.5,
      loop: true
    });

    if (!this.sound.locked) {
      // already unlocked so play
      this.music.play();
    }
    else {
      // wait for 'unlocked' to fire and then play
      this.sound.once(Phaser.Sound.Events.UNLOCKED, () => {
        this.music.play();
      })
    }

    this.cameras.main.setBackgroundColor('#421278');

    const text = this.add.text(400, 300, 'Who dis?', { fixedWidth: 150, fixedHeight: 36 })
    text.setOrigin(0.5, 0.5)

    text.setInteractive().on('pointerdown', () => {
      this.rexUI.edit(text)
    })

    this.titleText = this.add.text(200, 160, 'Klbb: The Game', { fontSize: '40px', color: '#0f0' });

    var name = "";
    this.input.keyboard.once('keydown-ENTER', () => {
      // fade to black
      // todo: add validation so they can't enter a blank name
      this.cameras.main.fadeOut(1000, 0, 0, 0);
    });

    this.cameras.main.once(Phaser.Cameras.Scene2D.Events.FADE_OUT_COMPLETE, (cam, effect) => {
      this.scene.start('GameScene', { name: text.text });
    });
  }
}
