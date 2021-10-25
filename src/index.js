import 'phaser';

// todo: cleanup, timer, scene transition (scene2.html), 
// name, object modeling, ~get the star from the other project and make them shooting stars~, maybe he farts when he jumps?
var config = {
    type: Phaser.AUTO,
    width: 800,
    height: 600,
    physics: {
        default: 'arcade',
        arcade: {
            gravity: { y: 500 },
            debug: false
        }
    },
    scene: {
        preload: preload,
        create: create,
        update: update
    }
};

var player;
var stars;
var rockets;
var bombs;
var ground;
var platforms;
var cursors;
var score = 0;
var gameOver = false;
var scoreText;
var createScene;

var game = new Phaser.Game(config);

function preload ()
{
    this.load.image('sky', './assets/sky.png');
    this.load.image('ground', './assets/platform.png');
    this.load.image('star', './assets/star.png');
    this.load.image('bomb', './assets/bomb.png');
    this.load.image('fire', './assets/fire.png');
    this.load.image('rockets', './assets/rocket.png');
    this.load.spritesheet('dude', './assets/dude.png', { frameWidth: 32, frameHeight: 48 });
    this.load.audio("goatsong", ["./assets/audio/goatminjr.ogg"]);

}

function createScene() {
    goatsong = this.sound.add("goatsong", { loop: true });
}

function create ()
{
    

    //  A simple background for our game
    this.add.image(400, 300, 'sky');

    //  The platforms group contains the ground and the 2 ledges we can jump on
    platforms = this.physics.add.staticGroup();

    //  Here we create the ground.
    //  Scale it to fit the width of the game (the original sprite is 400x32 in size)
    ground = platforms.create(400, 568, 'ground').setScale(2).refreshBody();

    //  Now let's create some ledges
    platforms.create(600, 400, 'ground');
    platforms.create(50, 250, 'ground');
    platforms.create(750, 220, 'ground');

    // The player and its settings
    player = this.physics.add.sprite(100, 450, 'dude');

    //  Player physics properties. Give the little guy a slight bounce.
    player.setBounce(0.2);
    player.setCollideWorldBounds(true);

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

    //  Input Events
    cursors = this.input.keyboard.createCursorKeys();

    //  Some rockets to collect, 12 in total, evenly spaced 70 pixels apart along the x axis
    rockets = this.physics.add.group({
        key: 'rockets',
        repeat: 11,
        setXY: { x: 12, y: 0, stepX: 70 }
    });

    rockets.children.iterate(function (child) {

        //  Give each star a slightly different bounce
        child.setBounceY(Phaser.Math.FloatBetween(0.4, 0.8));

    });

    makeStars(this);

    bombs = this.physics.add.group();

    //  The score
    scoreText = this.add.text(16, 16, 'score: 0', { fontSize: '32px', fill: '#000' });

    //  Collide the player and the rockets with the platforms
    this.physics.add.collider(player, platforms);
    this.physics.add.collider(rockets, platforms);
    
    this.physics.add.collider(bombs, platforms);

    //  Checks to see if the player overlaps with any of the rockets, if he does call the collectStar function
    this.physics.add.overlap(player, rockets, collectRocket, null, this);

    this.physics.add.collider(player, bombs, hitBomb, null, this);

    // Add music
    this.music =  this.sound.add('goatsong', {
        volume: 0.2,
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


function update ()
{
    if (gameOver)
    {
        let clickButton = this.add.text(300, 300, 'Try Again?!', { fill: '#0f0', backgroundColor: '#fc035a', fontSize: '38px' })
            .setPadding({ x: 20, y: 10 })
            .setInteractive()
            .on('pointerdown', () => 
            {
                this.scene.restart();
                gameOver = false;
            });
         // TODO: figure out why i can't update the text style
         // .on('pointerover', () => enterButtonHoverState(clickButton) )
         // .on('pointerout', () => enterButtonRestState(clickButton) );
        return;
    }

    if (cursors.left.isDown)
    {
        player.setVelocityX(-160);

        player.anims.play('left', true);
    }
    else if (cursors.right.isDown)
    {
        player.setVelocityX(160);

        player.anims.play('right', true);
    }
    else
    {
        player.setVelocityX(0);

        player.anims.play('turn');
    }

    if (cursors.up.isDown && player.body.touching.down)
    {
        player.setVelocityY(-430);
        makeStars(this);
    }
}

// TODO: figure out why i can't update the text style
// function enterButtonHoverState(button) {
//     button.setStyle({ fill: '#ff0'});
//   }

// function enterButtonRestState(button) {
//     button.setStyle({ fill: '#0f0' });
//   }

function makeStars(context)
{
    //  Some stars to collect, 12 in total, evenly spaced 70 pixels apart along the x axis
    stars = context.physics.add.group({
        key: 'star',
        repeat: 11,
        setXY: { x: (player.x < 400) ? Phaser.Math.Between(400, 800) : Phaser.Math.Between(0, 400), y: 0, stepX: 35 }
    });

    stars.children.iterate(function (child) {

        //  Give each rocket a slightly different bounce
        child.setBounceY(Phaser.Math.FloatBetween(0.8, 1.0));
        child.allowGravity = false;
        child.setVelocity(Phaser.Math.Between(-200, 200), 20);
    });

    context.physics.add.collider(stars, ground);
}

function collectRocket (player, rocket)
{
    rocket.disableBody(true, true);

    //  Add and update the score
    score += 10;
    scoreText.setText('Score: ' + score);

    if (rockets.countActive(true) === 0)
    {
        //  A new batch of rockets to collect
        rockets.children.iterate(function (child) {

            child.enableBody(true, child.x, 0, true, true);

        });

        var x = (player.x < 400) ? Phaser.Math.Between(400, 800) : Phaser.Math.Between(0, 400);

        var bomb = bombs.create(x, 16, 'bomb');
        bomb.setBounce(1);
        bomb.setCollideWorldBounds(true);
        bomb.setVelocity(Phaser.Math.Between(-200, 200), 20);
        bomb.allowGravity = false;

    }
}

function hitBomb (player, bomb)
{

    // add bomb explosion
    var particles = this.add.particles('fire');

    var emitter = particles.createEmitter({
        speed: 100,
        scale: { start: 1, end: 0 },
        blendMode: 'ADD'
    });

    emitter.startFollow(bomb);

    this.physics.pause();

    player.setTint(0xff0000);

    player.anims.play('turn');

    gameOver = true;

}

