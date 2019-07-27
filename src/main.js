"use strict";

let floor_height;

let main_theme;

let cuphead_attack_sound;
let cuphead_jump_sound;
let cuphead_death_sound;

let cagney_firing_seeds_sound;
let cagney_intro_yell;

let entity_hit_sound;

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
  game_background = loadImage("../assets/resized/background_optimized.png");
  flowers_parallax = loadImage("../assets/resized/flowers_optimized.png");
  grass = loadImage("../assets/resized/grass_optimized.png");
  cuphead_health_icon_filled = loadImage(
    "../assets/resized/life_filled_optimized.png"
  );
  cuphead_health_icon_dark = loadImage(
    "../assets/resized/life_dark_optimized.png"
  );

  missile_animation = new Animation(skill_frames.missile);

  main_theme = loadSound("../assets/audio/cuphead_ost_floral_fury.mp3", () => {
    main_theme.setVolume(0.1);
    main_theme.loop();
  });

  entity_hit_sound = loadSound("../assets/audio/player_hit_01.wav", () =>
    entity_hit_sound.setVolume(0.008)
  );

  cuphead_attack_sound = loadSound(
    "../assets/cuphead/sounds/player_spreadshot_fire_loop.wav",
    () => cuphead_attack_sound.setVolume(0.01)
  );

  cuphead_jump_sound = loadSound(
    "../assets/cuphead/sounds/player_jump_01.wav",
    () => cuphead_jump_sound.setVolume(0.03)
  );

  cuphead_death_sound = loadSound(
    "../assets/cuphead/sounds/player_death_01.wav",
    () => cuphead_death_sound.setVolume(0.005)
  );

  cagney_firing_seeds_sound = loadSound(
    "../assets/Cagney/sounds/flower_gattling_loop.wav",
    () => cagney_firing_seeds_sound.setVolume(0.2)
  );

  cagney_intro_yell = loadSound(
    "../assets/Cagney/sounds/flower_intro_yell.wav",
    () => cagney_intro_yell.setVolume(0.08)
  );

  cuphead = new Entity()
    .set_id("player")
    .set_health(3)
    .add_animation(cuphead_animations.idle, cuphead_frames.idle, 90)
    .add_animation(cuphead_animations.run.normal, cuphead_frames.run.normal)
    .add_animation(cuphead_animations.run.gun, cuphead_frames.run.gun)
    .add_animation(cuphead_animations.shoot, cuphead_frames.shoot, 60)
    .add_animation(cuphead_animations.jump, cuphead_frames.jump)
    .add_animation(
      cuphead_animations.death,
      cuphead_frames.death,
      60,
      "none",
      false
    )
    .set_animation(cuphead_animations.jump);

  cagney = new Entity()
    .set_id("boss")
    .set_health(500)
    .set_position(windowWidth - 380, windowHeight - 650)
    .add_animation(cagney_animations.idle, cagney_frames.idle)
    .add_animation(cagney_animations.create_object, cagney_frames.create_object)
    .add_animation(
      cagney_animations.firing_seeds,
      cagney_frames.firing_seeds,
      60,
      "missile"
    )
    .set_animation(cagney_animations.idle);

  setTimeout(() => {
    cagney
      .add_animation(
        cagney_animations.death,
        cagney_frames.death,
        150,
        "none",
        true
      )
      .add_animation(
        cagney_animations.intro,
        cagney_frames.intro,
        70,
        "none",
        true
      );
  }, 10000);
}

function setup() {
  collideDebug(true);
  frameRate(60);
  createCanvas(windowWidth, windowHeight);
  floor_height = windowHeight - 250;

  document.getElementById("main-container").style.display = "none";
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
  cagney.set_position(windowWidth - 380, windowHeight - 650);
}

function handle_key_press() {
  const { x, y } = cuphead.get_position();
  const velocity = cuphead.get_velocity();

  const jumpHeight = 10;

  if (!cuphead.is_dead()) {
    if (keyIsDown(87) && is_on_ground(cuphead)) {
      cuphead.set_animation(cuphead_animations.jump);
      cuphead.set_velocity(velocity.x, -jumpHeight);
      cuphead_jump_sound.play();
    }

    if (keyIsDown(32)) {
      if (is_on_ground(cuphead))
        cuphead.set_animation(cuphead_animations.shoot);
      shoot_ray();
    }

    if (keyIsDown(65) && keyIsDown(32)) {
      cuphead.set_direction("left");

      if (is_on_ground(cuphead))
        cuphead.set_animation(cuphead_animations.run.gun);

      if (cuphead.get_position().x > 0)
        cuphead.set_position(x - cuphead.get_move_speed(), y);

      return;
    }

    if (keyIsDown(68) && keyIsDown(32)) {
      cuphead.set_direction("right");

      if (is_on_ground(cuphead))
        cuphead.set_animation(cuphead_animations.run.gun);

      if (
        cuphead.get_position().x +
          cuphead.get_animation().get_dimensions().width <
        windowWidth
      )
        cuphead.set_position(x + cuphead.get_move_speed(), y);

      return;
    }
  }

  if (keyIsDown(65)) {
    cuphead.set_direction("left");

    if (is_on_ground(cuphead))
      cuphead.set_animation(cuphead_animations.run.normal);

    if (cuphead.get_position().x > 0)
      cuphead.set_position(x - cuphead.get_move_speed(), y);

    return;
  }

  if (keyIsDown(68)) {
    cuphead.set_direction("right");

    if (is_on_ground(cuphead))
      cuphead.set_animation(cuphead_animations.run.normal);

    if (
      cuphead.get_position().x +
        cuphead.get_animation().get_dimensions().width <
      windowWidth
    )
      cuphead.set_position(x + cuphead.get_move_speed(), y);
    return;
  }
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
      i < cuphead.health
        ? cuphead_health_icon_filled
        : cuphead_health_icon_dark,
      i * 90,
      10
    );
  }
}

function draw_skills() {
  for (const skill of skill_list) {
    skill.update();

    const position = skill.get_position();
    const frame = skill.get_animation().next_frame();

    push();
    translate(position.x, position.y);

    skill.get_direction() === "left" ? scale(-1.0, 1.0) : scale(1.0, 1.0);

    image(frame, 0, 0);
    pop();
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

function make_boss_attack() {
  if (!cagney.get_animation().is_last_frame()) return;

  const attack = random_int(0, 3);

  switch (attack) {
    case 0: {
      cagney.set_animation(cagney_animations.firing_seeds);
      launch_seed_missile();
      break;
    }
    case 1: {
      cagney.set_animation(cagney_animations.create_object);
      random_choice(create_boomerang, create_pollen)();
      break;
    }
    case 2:
      create_venus(cuphead);
      break;
    case 3:
      cagney.set_animation(cagney_animations.idle);
      break;
  }
}

function restart_game() {
  cuphead
    .set_health(3)
    .set_animation(cuphead_animations.jump, true)
    .set_position(10, 10)
    .set_velocity(0, 0);

  cagney.set_health(500).set_animation(cagney_animations.intro, true);

  cagney_intro_yell.play();
}

function handle_deaths() {
  if (
    cuphead.is_dead() &&
    cuphead.get_animation().toString() !== cuphead_animations.death
  ) {
    cuphead.set_animation(cuphead_animations.death).when_over(restart_game);
    cuphead_death_sound.play();
  }

  if (cagney.is_dead()) {
    cagney.set_animation(cagney_animations.death, true).when_over(restart_game);
    skill_list = [];
  }
}

function draw() {
  background(100);
  image(game_background, 0, 0, windowWidth, windowHeight);

  apply_gravity();
  keep_cuphead_above_floor();
  make_boss_attack();

  handle_key_press();
  handle_deaths();

  draw_entity(cuphead);
  draw_entity(cagney);
  draw_cuphead_health();
  draw_skills();

  collision();

  image(grass, windowWidth - 420, 450);
  image(flowers_parallax, -60, windowHeight - 250, windowWidth + 60);
}
