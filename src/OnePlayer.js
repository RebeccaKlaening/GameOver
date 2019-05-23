import Phaser from 'phaser';
// import config from './config';
let platforms;
let score = 0;
let scoreText;
let player;
let largebubbles;
let mediumbubbles;
let smallbubbles;
let bullets;
let bullet;
let cursors;
let bubbleCount;
let fireCoolDown = -1;
let keys;
let gameOver;
let button;

let hitByBubble;
let shootBubble;
let shootMediumBubble;
let shootSmallestBubble;
let fireBullet;


class OnePlayer extends Phaser.Scene {
    constructor(){
        super({
            key: 'OnePlayer'

      });
    }

  preload() {
  this.load.image('field', require('./assets/field.jpg'));
  this.load.image('ground', require('./assets/ground.png'));
  this.load.image('bullets', require('./assets/bullet.png'));
  this.load.image('largebubble', require('./assets/largebubble.png'));
  this.load.image('mediumbubble', require('./assets/mediumbubble.png'));
  this.load.image('smallbubble', require('./assets/smallbubble.png'));
  this.load.image('button', require('./assets/button.png'));
  this.load.spritesheet('dude', require('./assets/dude.png'), {
    frameWidth: 32,
    frameHeight: 48
  });

}

  create() {
  this.add.image(400, 300, 'field');
  this.add.image(400, 300, 'button');

  platforms = this.physics.add.staticGroup();

  platforms
    .create(400, 568, 'ground')
    .setScale(2)
    .refreshBody();

  // Player one
  player = this.physics.add.sprite(100, 450, 'dude');
  player.setBounce(0.2);
  player.setCollideWorldBounds(true);
  player.body.setGravityY(300);

  bullet = this.physics.add.sprite(player.x, player.y, 'bullets');


  this.anims.create({
    key: 'left',
    frames: this.anims.generateFrameNumbers('dude', {
      start: 0,
      end: 3
    }),
    frameRate: 10,
    repeat: -1
  });

  this.anims.create({
    key: 'turn',
    frames: [
      {
        key: 'dude',
        frame: 4
      }
    ],
    frameRate: 20
  });

  this.anims.create({
    key: 'right',
    frames: this.anims.generateFrameNumbers('dude', {
      start: 5,
      end: 8
    }),
    frameRate: 10,
    repeat: -1
  });


  largebubbles = this.physics.add.group({
    key: 'largebubble',
    repeat: bubbleCount
  });

  mediumbubbles = this.physics.add.group({
    // key: 'mediumbubble'
    // repeat: bubbleCount
    // setXY: {
    //   x: 12,
    //   y: 0,
    //   stepX: 70
    // }
  });

  smallbubbles = this.physics.add.group({
    // key: 'smallbubble'
    // repeat: bubbleSplit
    // setXY: {
    //   x: bullet.x,
    //   y: bullet.y,
    //   stepX: 20
    // }
  });

  largebubbles.children.iterate(function(child) {
    child.setBounce(1);
    child.setVelocity(Phaser.Math.Between(-200, 200), 20);
    child.setCollideWorldBounds(true);
  });
  mediumbubbles.children.iterate(function(child) {
    child.setBounce(1);
    child.setVelocity(Phaser.Math.Between(-200, 200), 20);
    child.setCollideWorldBounds(true);
  });
  smallbubbles.children.iterate(function(child) {
    child.setBounce(1);
    child.setVelocity(Phaser.Math.Between(-200, 200), 20);
    child.setCollideWorldBounds(true);
  });

  scoreText = this.add.text(16, 16, 'score: 0', {
    fontSize: '32px',
    fill: '#000'
  });

  //player one
  this.physics.add.collider(player, platforms);
  this.physics.add.collider(bullet, platforms);


  this.physics.add.collider(largebubbles, platforms);
  this.physics.add.collider(mediumbubbles, platforms);
  this.physics.add.collider(smallbubbles, platforms);

  this.physics.add.collider(player, largebubbles, hitByBubble, null, this);

  this.physics.add.collider(player, mediumbubbles, hitByBubble, null, this);

  this.physics.add.collider(player, smallbubbles, hitByBubble, null, this);

  this.physics.add.overlap(bullet, largebubbles, shootBubble, null, this);

  this.physics.add.overlap(
    bullet,
    mediumbubbles,
    shootMediumBubble,
    null,
    this
  );
  this.physics.add.overlap(
    bullet,
    smallbubbles,
    shootSmallestBubble,
    null,
    this
  );

}

function update(time, delta) {
  cursors = this.input.keyboard.createCursorKeys();

  //player one keyboard
  if (cursors.left.isDown) {
    player.setVelocityX(-160);

    player.anims.play('left', true);
  } else if (cursors.right.isDown) {
    player.setVelocityX(160);

    player.anims.play('right', true);
  } else {
    player.setVelocityX(0);

    player.anims.play('turn');
  }

  fireCoolDown -= delta;
  if (cursors.space.isDown && fireCoolDown < 0) {
    fireCoolDown = 1000;
    firebambu();
  }

}

function firebambu() {
  // this.bamboos = this.add.group();
  // let newBambu = new Bambu({ scene: this, x: player.x });
  bambu.enableBody(true, player.x, player.y, true, true);
  bambu.setVelocityY(-500);
  bambu.body.setGravityY(-500);
}


 function shootSmallestBubble(bullet, smallbubble) {
  smallbubble.disableBody(true, true);
  // smallbubble.disableBody(true, true);
  bullet.disableBody(true, true);

  score += 10;
  scoreText.setText('Score: ' + score);
  if (
    largebubbles.countActive(true) === 0 &&
    mediumbubbles.countActive(true) === 0 &&
    smallbubbles.countActive(true) === 0
  ) {
    bubbleCount += 1;
    setTimeout(() => {
      largebubbles.children.iterate(function(child) {
        child.enableBody(true, Phaser.Math.Between(0, 800), 0, true, true);
        child.setVelocity(Phaser.Math.Between(-200, 200), 20);
      });

      let x = player.x < 400;
      player.x < 400
        ? Phaser.Math.Between(400, 800)
        : Phaser.Math.Between(0, 400);
      let largebubble = largebubbles.create(x, 16, 'largebubble');
      largebubble.setBounce(1);
      largebubble.setCollideWorldBounds(true);
      largebubble.setVelocity(Phaser.Math.Between(-200, 200), 20);
    }, 1000);
  }
  // redbubble.enableBody(true, 0, 0, false, false);
}

// Player one
function shootMediumBubble(bullet, mediumbubble) {
  mediumbubble.disableBody(true, true);
  // mediumbubble.disableBody(true, true);
  bullet.disableBody(true, true);

  score += 10;
  scoreText.setText('Score: ' + score);

  if (this.physics.add.overlap(bullet, mediumbubbles)) {
    // mediumbubble.disableBody(true, true);
    let x = mediumbubble.x;
    let y = mediumbubble.y;
    for (let i = 0; i <= 1; i++) {
      let smallbubble = smallbubbles.create(x, y, 'smallbubble');
      smallbubble.enableBody(true, x, y, true, true);
      smallbubble.setBounce(1);
      smallbubble.setCollideWorldBounds(true);
      smallbubble.setVelocity(Phaser.Math.Between(-200, 200), 20);
    }
  }
  // if (this.physics.add.overlap(bullet, mediumbubbles)) {
  //   // mediumbubble.disableBody(true, true);
  //   let x = mediumbubble.x;
  //   let y = mediumbubble.y;
  //   for (let i = 0; i <= 1; i++) {
  //     let smallbubble = smallbubbles.create(x, y, 'smallbubble');
  //     smallbubble.enableBody(true, x, y, true, true);
  //     smallbubble.setBounce(1);
  //     smallbubble.setCollideWorldBounds(true);
  //     smallbubble.setVelocity(Phaser.Math.Between(-200, 200), 20);
  //   }
  // }
}

function shootBubble(bullet, largebubble) {
  largebubble.disableBody(true, true);
  bullet.disableBody(true, true);

  score += 10;
  scoreText.setText('Score: ' + score);

  if (this.physics.add.overlap(bullet, largebubbles)) {
    console.log(largebubbles);
    let x = largebubble.x;
    let y = largebubble.y;
    for (let i = 0; i <= 1; i++) {
      let mediumbubble = mediumbubbles.create(x, y, 'mediumbubble');
      mediumbubble.enableBody(true, x, y, true, true);
      mediumbubble.setBounce(1);
      mediumbubble.setCollideWorldBounds(true);
      mediumbubble.setVelocity(Phaser.Math.Between(-200, 200), 20);
    }
  }
}

 function hitByBubble(player, bubble) {
  this.physics.pause();

  player.setTint(0xff0000);

  player.anims.play('turn');

  gameOver = true;

  button.setInteractive().on('pointerdown', () => {
  this.scene.stop('OnePlayer')
  this.scene.start('OnePlayer', {

  })
 })


}

export default OnePlayer;
