import { Image } from '../objects/image';
import { Character } from '../objects/character';

export class MainScene extends Phaser.Scene {
  private player: Phaser.Physics.Arcade.Sprite;
  private stars: Image;
  private rockets: Phaser.Physics.Arcade.Group;
  private bombs: Phaser.Physics.Arcade.Group;
  private ground: Image;
  private platforms: Phaser.Physics.Arcade.StaticGroup;
  private cursors: Phaser.Input.keyboard;
  private score: 0;
  private gameOver: false;
  private scoreText: string;

  constructor() {
    super({ key: 'MainScene' });
  }

  preload(): void {
    this.load.image('sky', './assets/sky.png');
    this.load.image('ground', './assets/platform.png');
    this.load.image('star', './assets/star.png');
    this.load.image('bomb', './assets/bomb.png');
    this.load.image('fire', './assets/fire.png');
    this.load.image('rockets', './assets/rocket.png');
    this.load.spritesheet('dude', './assets/dude.png', { frameWidth: 32, frameHeight: 48 });
    this.load.audio("goatsong", ["./assets/audio/goatminjr.ogg"]);
  }

  create(): void {
    // const particles = this.add.particles('redParticle');

    // const emitter = particles.createEmitter({
    //   speed: 100,
    //   scale: { start: 0.5, end: 0 },
    //   blendMode: 'ADD'
    // });

    // this.myRedhat = new Redhat({
    //   scene: this,
    //   x: 400,
    //   y: 300,
    //   texture: 'redhat'
    // });

    // emitter.startFollow(this.myRedhat);

    //  A simple background for our game
    this.add.image(400, 300, 'sky');

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

    this.rockets.children.iterate(function (child) {

        //  Give each star a slightly different bounce
        child.setBounceY(Phaser.Math.FloatBetween(0.4, 0.8));

    });

    // makeStars(this);

    this.bombs = this.physics.add.group();

    //  The score
    this.scoreText = this.add.text(16, 16, 'score: 0', { fontSize: '32px', fill: '#000' });

    // //  Collide the player and the rockets with the platforms
    this.physics.add.collider(this.player, this.platforms);
    this.physics.add.collider(this.rockets, this.platforms);
    
    this.physics.add.collider(this.bombs, this.platforms);

    // //  Checks to see if the player overlaps with any of the rockets, if he does call the collectStar function
    // this.physics.add.overlap(player, rockets, collectRocket, null, this);

    // this.physics.add.collider(player, bombs, hitBomb, null, this);

    // // Add music
    // this.music =  this.sound.add('goatsong', {
    //     volume: 0.5,
    //     loop: true
    // })

    // if (!this.sound.locked)
    // {
    //     // already unlocked so play
    //     this.music.play()
    // }
    // else
    // {
    //     // wait for 'unlocked' to fire and then play
    //     this.sound.once(Phaser.Sound.Events.UNLOCKED, () => {
    //         this.music.play()
    //     })
    // }
  }

update(): void {
    if (this.gameOver)
    {
        let clickButton = this.add.text(300, 300, 'Try Again?!', { fill: '#0f0', backgroundColor: '#fc035a', fontSize: '38px' })
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
        //makeStars(this);
    }
}
}
