import { Entity } from "../Entity";
import { GameImages } from "../GameManager/images";
import { Animations } from "../GameManager/animations";
import { AnimationFrames } from "../Frames";
import { GameSounds } from "../GameManager/sounds";
import { Animation } from "../Animation";

export const preload_characters = (sketch: p5): Array<Entity> => {
  const cuphead: Entity = new Entity()
    .set_id("player")
    .set_health(3)
    .add_animation(Animations.cuphead.idle, AnimationFrames.cuphead.idle, 90)
    .add_animation(
      Animations.cuphead.run.normal,
      AnimationFrames.cuphead.run.normal
    )
    .add_animation(Animations.cuphead.run.gun, AnimationFrames.cuphead.run.gun)
    .add_animation(Animations.cuphead.shoot, AnimationFrames.cuphead.shoot, 60)
    .add_animation(Animations.cuphead.jump, AnimationFrames.cuphead.jump)
    .add_animation(
      Animations.cuphead.death,
      AnimationFrames.cuphead.death,
      60,
      "none",
      false
    )
    .set_animation(Animations.cuphead.jump);

  const cagney: Entity = new Entity()
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

  return [cagney, cuphead];
};

export const preload_images = (sketch: p5): void => {
  Animations.skills.missile = new Animation(AnimationFrames.skills.missile);

  GameImages.game_background = sketch.loadImage(
    "../assets/resized/background_optimized.png"
  );
  GameImages.flowers_parallax = sketch.loadImage(
    "../assets/resized/flowers_optimized.png"
  );
  GameImages.grass = sketch.loadImage("../assets/resized/grass_optimized.png");

  GameImages.cuphead_health_icon_filled = sketch.loadImage(
    "../assets/resized/life_filled_optimized.png"
  );

  GameImages.cuphead_health_icon_dark = sketch.loadImage(
    "../assets/resized/life_dark_optimized.png"
  );

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
};
