"use strict";

let floor_height;

let main_theme;
let game_background;
let flowers_parallax;
let grass;
let cuphead_health_icon_filled;
let cuphead_health_icon_dark;
let missile_animation;

let cuphead;
let cagney;

let skill_list = [];

const cuphead_animations = {
  idle: Symbol(),
  run: { normal: Symbol(), gun: Symbol() },
  jump: Symbol(),
  death: Symbol(),
  ghost: Symbol(),
  shoot: Symbol()
};

const cagney_animations = {
  intro: Symbol(),
  idle: Symbol(),
  create_object: Symbol(),
  death: Symbol(),
  firing_seeds: Symbol()
};

function preload() {
  game_background = loadImage("../assets/background.png");
  flowers_parallax = loadImage("../assets/flowers.png");
  grass = loadImage("../assets/grass.png");
  cuphead_health_icon_filled = loadImage("../assets/life_filled.png");
  cuphead_health_icon_dark = loadImage("../assets/life_dark.png");

  missile_animation = new Animation(skill_frames.missile);

  main_theme = loadSound("../assets/audio/cuphead_ost_floral_fury.mp3", () => {
    main_theme.setVolume(0.1);
    //main_theme.loop();
  });

  cuphead = new Entity()
    .set_id("player")
    .set_health(3)
    .add_animation(cuphead_animations.idle, cuphead_frames.idle, 90)
    .add_animation(cuphead_animations.run.normal, cuphead_frames.run.normal)
    .add_animation(cuphead_animations.run.gun, cuphead_frames.run.gun)
    .add_animation(cuphead_animations.shoot, cuphead_frames.shoot, 60)
    .add_animation(cuphead_animations.jump, cuphead_frames.jump)
    .add_animation(cuphead_animations.death, cuphead_frames.death)
    .add_animation(cuphead_animations.ghost, cuphead_frames.ghost)
    .set_animation(cuphead_animations.death);

  cagney = new Entity()
    .set_id("boss")
    .set_health(500)
    .set_position(windowWidth - 380, windowHeight - 650)
    .add_animation(cagney_animations.idle, cagney_frames.idle)
    .add_animation(cagney_animations.intro, cagney_frames.intro, 70)
    .add_animation(cagney_animations.create_object, cagney_frames.create_object)
    //.add_animation(cagney_animations.death, cagney_frames.death)
    .add_animation(
      cagney_animations.firing_seeds,
      cagney_frames.firing_seeds,
      60,
      "missile"
    )
    .set_animation(cagney_animations.firing_seeds);
}

function setup() {
  collideDebug(true);
  frameRate(60);
  createCanvas(windowWidth, windowHeight);
  floor_height = windowHeight - 250;
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
  cagney.set_position(windowWidth - 380, windowHeight - 650);
}

function handle_key_press() {
  const { x, y } = cuphead.get_position();
  const velocity = cuphead.get_velocity();

  const jumpHeight = 10;

  if (keyIsDown(87)) {
    if (is_on_ground(cuphead)) {
      cuphead.set_animation(cuphead_animations.jump);
      cuphead.set_velocity(velocity.x, -jumpHeight);
    }
  }

  if (keyIsDown(32)) {
    if (is_on_ground(cuphead)) cuphead.set_animation(cuphead_animations.shoot);
    shoot_ray();
  }

  if (keyIsDown(65) && keyIsDown(32)) {
    if (is_on_ground(cuphead))
      cuphead.set_animation(cuphead_animations.run.gun);
    cuphead.set_direction("left");
    cuphead.set_position(x - cuphead.get_move_speed(), y);

    return;
  }

  if (keyIsDown(68) && keyIsDown(32)) {
    if (is_on_ground(cuphead))
      cuphead.set_animation(cuphead_animations.run.gun);
    cuphead.set_direction("right");
    cuphead.set_position(x + cuphead.get_move_speed(), y);
    return;
  }

  if (keyIsDown(65)) {
    if (is_on_ground(cuphead))
      cuphead.set_animation(cuphead_animations.run.normal);
    cuphead.set_direction("left");
    cuphead.set_position(x - cuphead.get_move_speed(), y);

    return;
  }

  if (keyIsDown(68)) {
    if (is_on_ground(cuphead))
      cuphead.set_animation(cuphead_animations.run.normal);
    cuphead.set_direction("right");
    cuphead.set_position(x + cuphead.get_move_speed(), y);
    return;
  }
}

function is_on_ground(entity) {
  const entityPosition = entity.get_position();
  const entityDimensions = entity.get_animation().get_dimensions();

  return collideRectRect(
    entityPosition.x,
    entityPosition.y,
    entityDimensions.width,
    entityDimensions.height,
    0,
    floor_height,
    windowWidth,
    windowHeight
  );
}

function keep_cuphead_above_floor() {
  const cuphead_velocity = cuphead.get_velocity();

  if (is_on_ground(cuphead)) {
    cuphead.set_velocity(cuphead_velocity.x, 0);
    cuphead.set_animation(cuphead_animations.idle);
  }
}

function apply_gravity() {
  const force = 0.37;

  const position = cuphead.get_position();
  const velocity = cuphead.get_velocity();

  cuphead.set_velocity(velocity.x, velocity.y + force);
  cuphead.set_position(position.x + velocity.x, position.y + velocity.y);
}

function draw_entity(entity) {
  const position = entity.get_position();

  const frame = entity.get_animation().next_frame();

  push();
  translate(position.x, position.y);

  if (entity.get_direction() === "left") {
    translate(frame.width, 0);
    scale(-1.0, 1.0);
  } else {
    scale(1.0, 1.0);
  }

  if (
    entity.get_id() === "boss" &&
    entity.get_animation().get_id() === "missile" &&
    entity.get_animation().get_current_frame_number() > 5 &&
    entity.get_animation().get_current_frame_number() < 18
  ) {
    image(missile_animation.next_frame(), 90, -110);
  }

  image(frame, 0, 0);
  pop();
}

function draw_cuphead_health() {
  for (let i = 0; i < 3; ++i) {
    image(
      i <= cuphead.health
        ? cuphead_health_icon_filled
        : cuphead_health_icon_dark,
      i * 90,
      10
    );
  }
}

function draw_projectiles() {
  for (const projectile of skill_list) {
    projectile.update();
    const frame = projectile.get_animation().next_frame();
    image(frame, projectile.position.x, projectile.position.y);
  }
}

function collision() {
  for (let i = skill_list.length - 1; i > -1; --i) {
    if (out_of_screen(skill_list[i])) {
      skill_list.splice(i, 1);
      continue;
    }

    collision_between_skills(i, skill_list);
    collision_skill_entity(cagney, skill_list);
    collision_skill_entity(cuphead, skill_list);
  }
}

const shoot_ray = debounce(() => {
  const position = cuphead.get_position();
  const direction = cuphead.get_direction();

  const skill = new Skill(
    direction === "right" ? position.x + 125 : position.x - 70,
    position.y + 65,
    direction
  )
    .set_velocity({ x: direction === "right" ? 5 : -5, y: 0 })
    .set_velocity_incrementer({ x: direction === "right" ? 0.2 : -0.2, y: 0 })
    .set_animation(skill_frames.ray)
    .set_owned_by_player(true);

  skill_list.push(skill);
}, 150);

function make_boss_attack() {
  if (!cagney.get_animation().is_last_frame()) return;

  const attack = random_int(0, 2);

  const position = cagney.get_position();

  switch (attack) {
    case 0: {
      const skill = new Skill(
        random_int(windowWidth - 400, windowWidth - 100),
        random_int(0, -200),
        "left"
      )
        .set_animation(skill_frames.seed_missile)
        .set_velocity({ x: -1, y: 1 })
        .set_velocity_incrementer({ x: -0.15, y: 0.1 });

      skill_list.push(skill);
      break;
    }
    case 1: {
      cagney.set_animation(cagney_animations.create_object);
      const skill = new Skill(position.x, position.y + 250, "left")
        .set_update_fn(self => {
          self.position.x += self.velocity.x;
          self.position.y += self.velocity.y;
          self.velocity.x += self.velocity_incrementer.x;
          self.velocity.y += self.velocity_incrementer.y;

          if (self.velocity.y < -8 || self.velocity.y > 8)
            self.velocity.y *= -1;
        })
        .set_animation(skill_frames.boomerang)
        .set_velocity({ x: -1.0, y: -1.0 })
        .set_velocity_incrementer(
          random_choice({ x: -0.1, y: -0.1 }, { x: -0.1, y: 0.1 })
        );

      skill_list.push(skill);
      break;
    }
    case 2:
      break;
  }
}

function draw() {
  background(100);
  image(game_background, 0, 0, windowWidth, windowHeight);

  apply_gravity();
  keep_cuphead_above_floor();
  make_boss_attack();

  handle_key_press();

  draw_entity(cuphead);
  draw_entity(cagney);
  draw_cuphead_health();
  draw_projectiles();

  collision();

  image(grass, windowWidth - 420, 450);
  image(flowers_parallax, -60, windowHeight - 250, windowWidth + 60);
}
