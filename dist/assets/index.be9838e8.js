var h=Object.defineProperty;var l=(n,e,o)=>e in n?h(n,e,{enumerable:!0,configurable:!0,writable:!0,value:o}):n[e]=o;var t=(n,e,o)=>(l(n,typeof e!="symbol"?e+"":e,o),o);import{P as i,U as d}from"./vendor.8b48de62.js";const u=function(){const e=document.createElement("link").relList;if(e&&e.supports&&e.supports("modulepreload"))return;for(const s of document.querySelectorAll('link[rel="modulepreload"]'))a(s);new MutationObserver(s=>{for(const r of s)if(r.type==="childList")for(const c of r.addedNodes)c.tagName==="LINK"&&c.rel==="modulepreload"&&a(c)}).observe(document,{childList:!0,subtree:!0});function o(s){const r={};return s.integrity&&(r.integrity=s.integrity),s.referrerpolicy&&(r.referrerPolicy=s.referrerpolicy),s.crossorigin==="use-credentials"?r.credentials="include":s.crossorigin==="anonymous"?r.credentials="omit":r.credentials="same-origin",r}function a(s){if(s.ep)return;s.ep=!0;const r=o(s);fetch(s.href,r)}};u();var p={type:i.AUTO,parent:"klbb",backgroundColor:"#33A5E7",physics:{default:"arcade",arcade:{gravity:{y:500}}},dom:{createContainer:!0},scale:{width:800,height:600,mode:i.Scale.FIT,autoCenter:i.Scale.CENTER_BOTH},plugins:{scene:[{key:"rexUI",plugin:d,mapping:"rexUI"}]}};class y extends i.Physics.Arcade.Sprite{constructor(e){super(e.scene,e.startX,e.startY,e.spriteId);t(this,"body");t(this,"_hitPoints");t(this,"_jumpSound");t(this,"_physics");this.initSprite(),this.initPhysics(e.physics),e.jumpSound&&(this.jumpSound=e.jumpSound),e.hitPoints&&(this.hitPoints=e.hitPoints),this.scene.add.existing(this)}initSprite(){this.setScale(1)}initPhysics(e){this.scene.physics.world.enable(this),e.velocityX&&e.velocityY?this.body.setVelocity(e.velocityX,e.velocityY):e.velocityX?this.body.setVelocityX(e.velocityX):e.velocityY&&this.body.setVelocityY(e.velocityY),e.bounceX&&e.bounceY?this.body.setBounce(e.bounceX,e.bounceY):e.bounceX?this.body.setBounceX(e.bounceX):e.bounceY&&this.body.setBounceY(e.bounceY),this.body.setCollideWorldBounds(e.colliderWorldBounds)}get hitPoints(){return this._hitPoints}set hitPoints(e){this._hitPoints=e}get jumpSound(){return this._jumpSound}set jumpSound(e){this._jumpSound=e}set physics(e){this._physics=e,this.initPhysics(this.physics)}get physics(){return this._physics}}class m{constructor(e){t(this,"_bounceX",0);t(this,"_bounceY",0);t(this,"_velocityX",0);t(this,"_velocityY",0);t(this,"_colliderWorldBounds",!1);e.bounceX&&(this.bounceX=e.bounceX),e.bounceY&&(this.bounceY=e.bounceY),e.velocityX&&(this.velocityX=e.velocityX),e.velocityY&&(this.velocityY=e.velocityY),e.colliderWorldBounds&&(this.colliderWorldBounds=e.colliderWorldBounds)}get colliderWorldBounds(){return this._colliderWorldBounds}set colliderWorldBounds(e){this._colliderWorldBounds=e}get bounceY(){return this._bounceY}set bounceY(e){this._bounceY=e}get bounceX(){return this._bounceX}set bounceX(e){this._bounceX=e}get velocityY(){return this._velocityY}set velocityY(e){this._velocityY=e}get velocityX(){return this._velocityX}set velocityX(e){this._velocityX=e}}class f extends i.Scene{constructor(){super("GameScene");t(this,"player");t(this,"stars");t(this,"rockets");t(this,"bombs");t(this,"ground");t(this,"platforms");t(this,"cursors");t(this,"score",0);t(this,"gameOver");t(this,"scoreText");t(this,"hitPoints",0);t(this,"hitPointsText");t(this,"music");t(this,"name")}init(e){console.log("init",e),this.name=e.name}preload(){this.load.spritesheet("dude","./assets/characters/dude.png",{frameWidth:32,frameHeight:48}),this.load.spritesheet("potatohat","./assets/characters/potatohat.png",{frameWidth:32,frameHeight:54}),this.load.spritesheet("vgchk","./assets/characters/vgchk.png",{frameWidth:32,frameHeight:24}),this.load.image("appleWorld","./assets/scenes/main/appleWorld.png"),this.load.image("ground","./assets/platform.png"),this.load.image("star","./assets/star.png"),this.load.image("bomb","./assets/bomb.png"),this.load.image("fire","./assets/fire.png"),this.load.image("rockets","./assets/rocket.png"),this.load.audio("goatSong",["./assets/audio/goatminjr.ogg"]),this.load.audio("jumpSound",["./assets/audio/hero_jump.wav"])}create(){this.cameras.main.fadeIn(1e3,0,0,0),this.add.image(400,300,"appleWorld"),this.platforms=this.physics.add.staticGroup(),this.ground=this.platforms.create(400,568,"ground").setScale(2).refreshBody(),this.platforms.create(600,400,"ground"),this.platforms.create(50,250,"ground"),this.platforms.create(750,220,"ground"),this.hitPoints=3;const e={scene:this,spriteId:"potatohat",startX:100,startY:450,jumpSound:"jumpSound",physics:new m({bounceX:.2,colliderWorldBounds:!0}),hitPoints:3};this.player=new y(e),this.anims.create({key:"left",frames:this.anims.generateFrameNumbers("potatohat",{start:0,end:3}),frameRate:10,repeat:-1}),this.anims.create({key:"turn",frames:[{key:"potatohat",frame:4}],frameRate:20}),this.anims.create({key:"right",frames:this.anims.generateFrameNumbers("potatohat",{start:5,end:8}),frameRate:10,repeat:-1}),this.cursors=this.input.keyboard.createCursorKeys(),this.rockets=this.physics.add.group({key:"rockets",repeat:11,setXY:{x:12,y:0,stepX:70}}),this.rockets.children.iterate(function(o){o.setBounceY(i.Math.FloatBetween(.4,.8))}),this.makeStars(),this.bombs=this.physics.add.group(),this.scoreText=this.add.text(16,16,"score: 0",{fontSize:"32px",color:"#000"}),this.hitPointsText=this.add.text(16,40,this.name+"'s hit points: "+this.player.hitPoints,{fontSize:"32px",color:"#000"}),this.physics.add.collider(this.player,this.platforms),this.physics.add.collider(this.rockets,this.platforms),this.physics.add.collider(this.bombs,this.platforms),this.physics.add.overlap(this.player,this.rockets,this.collectRocket,null,this),this.physics.add.collider(this.player,this.bombs,this.hitBomb,null,this),this.music=this.sound.add("goatSong",{volume:.5,loop:!0}),this.sound.locked?this.sound.once(i.Sound.Events.UNLOCKED,()=>{this.music.play()}):this.music.play()}update(){if(this.gameOver){this.add.text(300,300,"Try Again?!",{color:"#0f0",backgroundColor:"#fc035a",fontSize:"38px"}).setPadding({x:20,y:10}).setInteractive().on("pointerdown",()=>{this.music.stop(),this.scene.restart(),this.score=0,this.gameOver=!1});return}this.cursors.left.isDown?(this.player.setVelocityX(-160),this.player.anims.play("left",!0)):this.cursors.right.isDown?(this.player.setVelocityX(160),this.player.anims.play("right",!0)):(this.player.setVelocityX(0),this.player.anims.play("turn")),this.cursors.up.isDown&&this.player.body.touching.down&&(this.sound.play(this.player.jumpSound,{volume:.9,loop:!1}),this.player.setVelocityY(-430),this.makeStars())}makeStars(){this.stars=this.physics.add.group({key:"star",repeat:11,setXY:{x:this.player.x<400?i.Math.Between(400,800):i.Math.Between(0,400),y:0,stepX:35}}),this.stars.children.iterate(function(e){e.setBounceY(i.Math.FloatBetween(.8,1)),e.allowGravity=!1,e.setVelocity(i.Math.Between(-200,200),20)}),this.physics.add.collider(this.stars,this.ground)}collectRocket(e,o){if(o.disableBody(!0,!0),this.score+=10,this.scoreText.setText("Score: "+this.score),this.rockets.countActive(!0)===0){this.rockets.children.iterate(function(r){r.enableBody(!0,r.x,0,!0,!0)});var a=this.player.x<400?i.Math.Between(400,800):i.Math.Between(0,400),s=this.bombs.create(a,16,"bomb");s.setBounce(1),s.setCollideWorldBounds(!0),s.setVelocity(i.Math.Between(-200,200),20),s.allowGravity=!1}}hitBomb(e,o){var a=this.add.particles("fire"),s=a.createEmitter({speed:100,scale:{start:1,end:0},blendMode:"ADD"});s.startFollow(o),this.physics.pause(),this.player.setTint(16711680),this.player.anims.play("turn"),this.player.hitPoints--,this.player.hitPoints==0?(this.gameOver=!0,this.hitPointsText.setText("hit points: 0")):(this.physics.resume(),this.hitPointsText.setText("hit points: "+this.player.hitPoints),this.player.setTint())}}class g extends i.Scene{constructor(){super("TitleScreenScene");t(this,"titleText");t(this,"music")}preload(){this.load.audio("goatSong",["./assets/audio/goatminjr.ogg"])}create(){this.music=this.sound.add("goatSong",{volume:.5,loop:!0}),this.sound.locked?this.sound.once(i.Sound.Events.UNLOCKED,()=>{this.music.play()}):this.music.play(),this.cameras.main.setBackgroundColor("#421278");const e=this.add.text(400,300,"Who dis?",{fixedWidth:150,fixedHeight:36});e.setOrigin(.5,.5),e.setInteractive().on("pointerdown",()=>{this.rexUI.edit(e)}),this.titleText=this.add.text(200,160,"Klbb: The Game",{fontSize:"40px",color:"#0f0"}),this.input.keyboard.once("keydown-ENTER",()=>{this.cameras.main.fadeOut(1e3,0,0,0)}),this.cameras.main.once(i.Cameras.Scene2D.Events.FADE_OUT_COMPLETE,(o,a)=>{this.scene.start("GameScene",{name:e.text})})}}new i.Game(Object.assign(p,{scene:[g,f]}));
