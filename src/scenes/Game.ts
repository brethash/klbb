import Phaser from 'phaser';
import { Image } from '../objects/image';
import { Character } from '../objects/character';
import { Physics } from "../objects/physics";

export default class GameScene extends Phaser.Scene {
    constructor() {
        super('GameScene');
    }

    private player: Character;
    private stars: Phaser.Arcade.Group;
    private rockets: Phaser.Physics.Arcade.Group;
    private bombs: Phaser.Physics.Arcade.Group;
    private ground: Image;
    private platforms: Phaser.Physics.Arcade.StaticGroup;
    private cursors: Phaser.Input.Keyboard;
    private score: number = 0;
    private gameOver: Boolean;
    private scoreText: Phaser.GameObjects.Text;
    private hitPoints: number = 0;
    private hitPointsText: Phaser.GameObjects.Text;
    private music: Phaser.Sound;
    private name: string;

    init(data: object)
    {
        console.log('init', data);

        this.name = data.name;
    }

    preload() {
        this.load.spritesheet('dude', '/assets/characters/dude.png', { frameWidth: 32, frameHeight: 48 });
        this.load.spritesheet('potatohat', '/assets/characters/potatohat.png', { frameWidth: 32, frameHeight: 54 });
        this.load.spritesheet('vgchk', '/assets/characters/vgchk.png', { frameWidth: 32, frameHeight: 24 });

        //this.load.image('sky', '/assets/scenes/sky.png');
        this.load.image('appleWorld', '/assets/scenes/game/appleWorld.png');
        this.load.image('ground', '/assets/scenes/game/platform.png');
        this.load.image('star', '/assets/scenes/game/star.png');
        this.load.image('bomb', '/assets/scenes/game/bomb.png');
        this.load.image('fire', '/assets/scenes/game/fire.png');
        this.load.image('rockets', '/assets/scenes/game/rocket.png');

        this.load.audio("goatSong", ["/assets/audio/goatminjr.ogg"]);
        this.load.audio("jumpSound", ["/assets/audio/hero_jump.wav"])
    }

    create() {
        this.cameras.main.fadeIn(1000, 0, 0, 0);
        this.add.image(400, 300, 'appleWorld');

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
        this.hitPoints = 3;
        const playerConfig = {
            scene: this,
            spriteId: 'potatohat',
            startX: 100,
            startY: 450,
            jumpSound: 'jumpSound',
            physics: new Physics({ bounceX: 0.2, colliderWorldBounds: true }),
            hitPoints: 3
        };

        this.player = new Character(playerConfig);

        //  Our player animations, turning, walking left and walking right.
        // todo: maybe move animations into Character?
        this.anims.create({
            key: 'left',
            frames: this.anims.generateFrameNumbers('potatohat', { start: 0, end: 3 }),
            frameRate: 10,
            repeat: -1
        });

        this.anims.create({
            key: 'turn',
            frames: [{ key: 'potatohat', frame: 4 }],
            frameRate: 20
        });

        this.anims.create({
            key: 'right',
            frames: this.anims.generateFrameNumbers('potatohat', { start: 5, end: 8 }),
            frameRate: 10,
            repeat: -1
        });

        // bgawk bgawk
        // should they spawn in random spots? maybe yes.
        // const chickenConfig = {
        //     scene: this,
        //     spriteId: 'chicken',
        //     startX: 300,
        //     startY: 450,
        //     physics: new Physics({ bounceX: 0.2, colliderWorldBounds: true}),
        //     hitPoints: 1
        // };
        //
        // this.chicken = new Character(chickenConfig);

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
        this.hitPointsText = this.add.text(16, 40, this.name + '\'s hit points: ' + this.player.hitPoints, { fontSize: '32px', color: '#000' });

        // //  Collide the player and the rockets with the platforms
        this.physics.add.collider(this.player, this.platforms);
        this.physics.add.collider(this.rockets, this.platforms);

        this.physics.add.collider(this.bombs, this.platforms);

        //  Checks to see if the player overlaps with any of the rockets, if he does call the collectStar function
        this.physics.add.overlap(this.player, this.rockets, this.collectRocket, null, this);

        this.physics.add.collider(this.player, this.bombs, this.hitBomb, null, this);

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
    }

    update(): void {
        if (this.gameOver) {
            let clickButton = this.add.text(300, 300, 'Try Again?!', { color: '#0f0', backgroundColor: '#fc035a', fontSize: '38px' })
                .setPadding({ x: 20, y: 10 })
                .setInteractive()
                .on('pointerdown', () => {
                    this.music.stop();
                    this.scene.restart();
                    this.score = 0;
                    this.gameOver = false;
                });
            // TODO: figure out why i can't update the text style
            // .on('pointerover', () => enterButtonHoverState(clickButton) )
            // .on('pointerout', () => enterButtonRestState(clickButton) );
            return;
        }

        if (this.cursors.left.isDown) {
            this.player.setVelocityX(-160);

            this.player.anims.play('left', true);
        }
        else if (this.cursors.right.isDown) {
            this.player.setVelocityX(160);

            this.player.anims.play('right', true);
        }
        else {
            this.player.setVelocityX(0);

            this.player.anims.play('turn');
        }

        if (this.cursors.up.isDown && this.player.body.touching.down) {
            this.sound.play(this.player.jumpSound, {
                volume: 0.9,
                loop: false
            });
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

    private collectRocket(player: Phaser.Physics.Arcade.Sprite, rocket: Phaser.Physics.Arcade.Sprite): void {
        rocket.disableBody(true, true);

        //  Add and update the score
        this.score += 10;
        this.scoreText.setText('Score: ' + this.score);

        if (this.rockets.countActive(true) === 0) {
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

    private hitBomb(player: Phaser.Physics.Arcade.Sprite, bomb: Phaser.Physics.Arcade.Sprite): void {

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

        this.player.hitPoints--;

        if (this.player.hitPoints == 0) {
            this.gameOver = true;
            this.hitPointsText.setText("hit points: 0");
        } else {
            this.physics.resume();
            this.hitPointsText.setText("hit points: " + this.player.hitPoints);
            this.player.setTint();
        }
    }
}
