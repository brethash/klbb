import Phaser from 'phaser';
import { Image } from '../objects/image';
import { Character } from '../objects/character';

export default class Demo extends Phaser.Scene {
  constructor() {
    super('GameScene');
  }

  private player: Phaser.Physics.Arcade.Sprite;
  private stars: Phaser.Arcade.Group;
  private rockets: Phaser.Physics.Arcade.Group;
  private bombs: Phaser.Physics.Arcade.Group;
  private ground: Image;
  private platforms: Phaser.Physics.Arcade.StaticGroup;
  private cursors: Phaser.Input.Keyboard;
  private score: number = 0;
  private gameOver: Boolean;
  private scoreText: Phaser.GameObjects.Text;
  private music: Phaser.Sound;

  preload() {
    this.load.image('sky', './assets/sky.png');
    this.load.image('ground', './assets/platform.png');
    this.load.image('star', './assets/star.png');
    this.load.image('bomb', './assets/bomb.png');
    this.load.image('fire', './assets/fire.png');
    this.load.image('rockets', './assets/rocket.png');
    this.load.spritesheet('dude', './assets/dude.png', { frameWidth: 32, frameHeight: 48 });
    this.load.audio("goatsong", ["./assets/audio/goatminjr.ogg"]);
  }

  create() {
    this.add.image(400, 300, 'sky');

    // const logo = this.add.image(400, 70, 'star');

    // this.tweens.add({
    //   targets: logo,
    //   y: 350,
    //   duration: 1500,
    //   ease: 'Sine.inOut',
    //   yoyo: true,
    //   repeat: -1
    // });
    //  The platforms group contains the ground and the 2 ledges we can jump on
    this.platforms = this.physics.add.staticGroup();
    //  Here we create the ground.
    //  Scale it to fit the width of the game (the original sprite is 400x32 in size)
    this.ground = this.platforms.create(400, 568, 'ground').setScale(2).refreshBody();

    //  Now let's create some ledges
    this.platforms.create(600, 400, 'ground');
    this.platforms.create(50, 250, 'ground');
    this.platforms.create(750, 220, 'ground');

    // The player and its settings
    this.player = this.physics.add.sprite(100, 450, 'dude');

    // //  Player physics properties. Give the little guy a slight bounce.
    this.player.setBounce(0.2);
    this.player.setCollideWorldBounds(true);

    //  Our player animations, turning, walking left and walking right.
    this.anims.create({
        key: 'left',
        frames: this.anims.generateFrameNumbers('dude', { start: 0, end: 3 }),
        frameRate: 10,
        repeat: -1
    });

    this.anims.create({
        key: 'turn',
        frames: [ { key: 'dude', frame: 4 } ],
        frameRate: 20
    });

    this.anims.create({
        key: 'right',
        frames: this.anims.generateFrameNumbers('dude', { start: 5, end: 8 }),
        frameRate: 10,
        repeat: -1
    });

    // //  Input Events
    this.cursors = this.input.keyboard.createCursorKeys();

    // //  Some rockets to collect, 12 in total, evenly spaced 70 pixels apart along the x axis
    this.rockets = this.physics.add.group({
        key: 'rockets',
        repeat: 11,
        setXY: { x: 12, y: 0, stepX: 70 }
    });

    this.rockets.children.iterate(function (child: Phaser.Physics.Arcade.Sprite) {

        //  Give each star a slightly different bounce
        child.setBounceY(Phaser.Math.FloatBetween(0.4, 0.8));

    });

    this.makeStars();

    this.bombs = this.physics.add.group();

    //  The score
    this.scoreText = this.add.text(16, 16, 'score: 0', { fontSize: '32px', color: '#000' });

    // //  Collide the player and the rockets with the platforms
    this.physics.add.collider(this.player, this.platforms);
    this.physics.add.collider(this.rockets, this.platforms);
    
    this.physics.add.collider(this.bombs, this.platforms);

    //  Checks to see if the player overlaps with any of the rockets, if he does call the collectStar function
    this.physics.add.overlap(this.player, this.rockets, this.collectRocket, null, this);

    this.physics.add.collider(this.player, this.bombs, this.hitBomb, null, this);

    // Add music
    this.music =  this.sound.add('goatsong', {
        volume: 0.5,
        loop: true
    })

    if (!this.sound.locked)
    {
        // already unlocked so play
        this.music.play()
    }
    else
    {
        // wait for 'unlocked' to fire and then play
        this.sound.once(Phaser.Sound.Events.UNLOCKED, () => {
            this.music.play()
        })
    }
  }

  update(): void {
      if (this.gameOver)
      {
          let clickButton = this.add.text(300, 300, 'Try Again?!', { color: '#0f0', backgroundColor: '#fc035a', fontSize: '38px' })
              .setPadding({ x: 20, y: 10 })
              .setInteractive()
              .on('pointerdown', () => 
              {
                  this.music.stop();
                  this.scene.restart();
                  
                  this.gameOver = false;
              });
           // TODO: figure out why i can't update the text style
           // .on('pointerover', () => enterButtonHoverState(clickButton) )
           // .on('pointerout', () => enterButtonRestState(clickButton) );
          return;
      }

      if (this.cursors.left.isDown)
      {
          this.player.setVelocityX(-160);

          this.player.anims.play('left', true);
      }
      else if (this.cursors.right.isDown)
      {
          this.player.setVelocityX(160);

          this.player.anims.play('right', true);
      }
      else
      {
          this.player.setVelocityX(0);

          this.player.anims.play('turn');
      }

      if (this.cursors.up.isDown && this.player.body.touching.down)
      {
          this.player.setVelocityY(-430);
          this.makeStars();
      }
  }

  private makeStars(): void {
      //  Some stars to collect, 12 in total, evenly spaced 70 pixels apart along the x axis
      this.stars = this.physics.add.group({
          key: 'star',
          repeat: 11,
          setXY: { x: (this.player.x < 400) ? Phaser.Math.Between(400, 800) : Phaser.Math.Between(0, 400), y: 0, stepX: 35 }
      });

      this.stars.children.iterate(function (child: Phaser.Physics.Arcade.Body) {

          //  Give each rocket a slightly different bounce
          child.setBounceY(Phaser.Math.FloatBetween(0.8, 1.0));
          child.allowGravity = false;
          child.setVelocity(Phaser.Math.Between(-200, 200), 20);
      });

      this.physics.add.collider(this.stars, this.ground);
  }

  private collectRocket (player: Phaser.Physics.Arcade.Sprite, rocket: Phaser.Physics.Arcade.Sprite): void {
      rocket.disableBody(true, true);

      //  Add and update the score
      this.score += 10;
      this.scoreText.setText('Score: ' + this.score);

      if (this.rockets.countActive(true) === 0)
      {
          //  A new batch of rockets to collect
          this.rockets.children.iterate(function (child: Phaser.Physics.Arcade.Sprite) {

              child.enableBody(true, child.x, 0, true, true);

          });

          var x = (this.player.x < 400) ? Phaser.Math.Between(400, 800) : Phaser.Math.Between(0, 400);

          var bomb = this.bombs.create(x, 16, 'bomb');
          bomb.setBounce(1);
          bomb.setCollideWorldBounds(true);
          bomb.setVelocity(Phaser.Math.Between(-200, 200), 20);
          bomb.allowGravity = false;

      }
  }

  private hitBomb (player: Phaser.Physics.Arcade.Sprite, bomb: Phaser.Physics.Arcade.Sprite): void {

      // add bomb explosion
      var particles = this.add.particles('fire');

      var emitter = particles.createEmitter({
          speed: 100,
          scale: { start: 1, end: 0 },
          blendMode: 'ADD'
      });

      emitter.startFollow(bomb);

      this.physics.pause();

      this.player.setTint(0xff0000);

      this.player.anims.play('turn');

      this.gameOver = true;

  }
}
