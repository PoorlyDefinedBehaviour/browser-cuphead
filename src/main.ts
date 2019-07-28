import p5 from "p5";
import "p5/lib/addons/p5.sound";
import "p5/lib/addons/p5.dom";

import { Entity } from "./entity/entity";
import { Skill } from "./skills/skill";

import { Animations } from "./game/animations";
import { GameImages } from "./game/images";
import { GameSounds } from "./game/sounds";

import {
  out_of_screen,
  collision_between_skills,
  collision_skill_entity,
  aabb
} from "./collision/collision";

import { apply_gravity, is_on_ground } from "./misc/world";
import { draw_entity, draw_health, draw_skills } from "./misc/drawing";
import { handle_key_press, make_boss_attack } from "./misc/controls";
import { AnimationFrames } from "./frames/frames";
import { Animation } from "./animation/animation";

export let floor_height: number;

let cuphead: Entity;
let cagney: Entity;

let skill_list: Array<Skill> = [];

export const p5_sketch = new p5((sketch: p5) => {
  sketch.preload = () => {
    GameImages.game_background = sketch.loadImage(
      "../assets/resized/background_optimized.png"
    );
    GameImages.flowers_parallax = sketch.loadImage(
      "../assets/resized/flowers_optimized.png"
    );
    GameImages.grass = sketch.loadImage(
      "../assets/resized/grass_optimized.png"
    );

    GameImages.cuphead_health_icon_filled = sketch.loadImage(
      "../assets/resized/life_filled_optimized.png"
    );

    GameImages.cuphead_health_icon_dark = sketch.loadImage(
      "../assets/resized/life_dark_optimized.png"
    );

    Animations.skills.missile = new Animation(AnimationFrames.skills.missile);

    GameSounds.main_theme = ((sketch as any) as p5.SoundFile).loadSound(
      "../assets/audio/cuphead_ost_floral_fury.mp3",
      () => {
        GameSounds.main_theme.setVolume(0.1);
        GameSounds.main_theme.loop();
      }
    );

    GameSounds.entity_hit = ((sketch as any) as p5.SoundFile).loadSound(
      "../assets/audio/player_hit_01.wav",
      () => GameSounds.entity_hit.setVolume(0.008)
    );

    GameSounds.cuphead_attack = ((sketch as any) as p5.SoundFile).loadSound(
      "../assets/cuphead/sounds/player_spreadshot_fire_loop.wav",
      () => GameSounds.cuphead_attack.setVolume(0.02)
    );

    GameSounds.cuphead_jump = ((sketch as any) as p5.SoundFile).loadSound(
      "../assets/cuphead/sounds/player_jump_01.wav",
      () => GameSounds.cuphead_jump.setVolume(0.03)
    );

    GameSounds.cuphead_death = ((sketch as any) as p5.SoundFile).loadSound(
      "../assets/cuphead/sounds/player_death_01.wav",
      () => GameSounds.cuphead_death.setVolume(0.005)
    );

    GameSounds.cagney_firing_seeds = ((sketch as any) as p5.SoundFile).loadSound(
      "../assets/Cagney/sounds/flower_gattling_loop.wav",
      () => GameSounds.cagney_firing_seeds.setVolume(0.2)
    );

    GameSounds.cagney_intro_yell = ((sketch as any) as p5.SoundFile).loadSound(
      "../assets/Cagney/sounds/flower_intro_yell.wav",
      () => GameSounds.cagney_intro_yell.setVolume(0.08)
    );

    cuphead = new Entity()
      .set_id("player")
      .set_health(3)
      .add_animation(Animations.cuphead.idle, AnimationFrames.cuphead.idle, 90)
      .add_animation(
        Animations.cuphead.run.normal,
        AnimationFrames.cuphead.run.normal
      )
      .add_animation(
        Animations.cuphead.run.gun,
        AnimationFrames.cuphead.run.gun
      )
      .add_animation(
        Animations.cuphead.shoot,
        AnimationFrames.cuphead.shoot,
        60
      )
      .add_animation(Animations.cuphead.jump, AnimationFrames.cuphead.jump)
      .add_animation(
        Animations.cuphead.death,
        AnimationFrames.cuphead.death,
        60,
        "none",
        false
      )
      .set_animation(Animations.cuphead.jump);

    cagney = new Entity()
      .set_id("boss")
      .set_health(500)
      .set_position(sketch.windowWidth - 380, sketch.windowHeight - 650)
      .add_animation(Animations.cagney.idle, AnimationFrames.cagney.idle)
      .add_animation(
        Animations.cagney.create_object,
        AnimationFrames.cagney.create_object
      )
      .add_animation(
        Animations.cagney.firing_seeds,
        AnimationFrames.cagney.firing_seeds,
        60,
        "missile"
      )
      .set_animation(Animations.cagney.idle);

    console.log("preload", cuphead);

    setTimeout(() => {
      cagney
        .add_animation(
          Animations.cagney.death,
          AnimationFrames.cagney.death,
          150,
          "none",
          true
        )
        .add_animation(
          Animations.cagney.intro,
          AnimationFrames.cagney.intro,
          70,
          "none",
          true
        );
    }, 10000);

    sketch.setup = () => {
      sketch.frameRate(60);
      sketch.createCanvas(sketch.windowWidth, sketch.windowHeight);
      floor_height = sketch.windowHeight - 250;

      (document as any).getElementById("main-container").style.display = "none";
    };

    sketch.draw = () => {
      sketch.background(100);
      sketch.image(
        GameImages.game_background,
        0,
        0,
        sketch.windowWidth,
        sketch.windowHeight
      );

      apply_gravity(cuphead);
      if (is_on_ground(cuphead))
        cuphead.set_velocity(cuphead.get_velocity().x, 0),
          cuphead.set_animation(Animations.cuphead.idle);

      make_boss_attack(cagney, cuphead, skill_list);

      handle_key_press(cuphead, skill_list);
      handle_deaths();

      draw_entity(cuphead);
      draw_entity(cagney);
      draw_health(cuphead);
      draw_skills(skill_list);

      collision();

      sketch.image(GameImages.grass, sketch.windowWidth - 420, 450);
      sketch.image(
        GameImages.flowers_parallax,
        -60,
        sketch.windowHeight - 250,
        sketch.windowWidth + 60
      );
    };

    sketch.windowResized = () => {
      sketch.resizeCanvas(sketch.windowWidth, sketch.windowHeight);
      floor_height = sketch.windowHeight - 250;

      if (cagney)
        cagney.set_position(
          sketch.windowWidth - 380,
          sketch.windowHeight - 650
        );
    };
  };
});

function collision() {
  if (aabb(cuphead, cagney)) {
    cuphead.receive_damage(1);
    GameSounds.entity_hit.play();
  }
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

function restart_game(): void {
  cuphead
    .set_health(3)
    .set_animation(Animations.cuphead.jump, true)
    .set_position(10, 10)
    .set_velocity(0, 0);

  cagney.set_health(500).set_animation(Animations.cagney.intro, true);

  GameSounds.cagney_intro_yell.play();
}

function handle_deaths(): void {
  if (
    cuphead.is_dead() &&
    (cuphead.get_animation() as any).toString() !== Animations.cuphead.death
  ) {
    cuphead.set_animation(Animations.cuphead.death).when_over(restart_game);
    GameSounds.cuphead_death.play();
  }

  if (cagney.is_dead()) {
    cagney.set_animation(Animations.cagney.death, true).when_over(restart_game);
    skill_list = [];
  }
}
