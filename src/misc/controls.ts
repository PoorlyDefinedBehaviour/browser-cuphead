import { Vector2D } from "../vector2d/vector2d";
import { Animations } from "../game/animations";
import { p5_sketch } from "../main";
import { IFrameDimensions, Animation } from "../animation/animation";
import { is_on_ground } from "./world";
import { GameSounds } from "../game/sounds";
import { Entity } from "../entity/entity";
import { shoot_ray } from "../skills/shootray";
import { Skill } from "../skills/skill";
import { random_int } from "../util/randomint";
import { launch_seed_missile } from "../skills/launchseedmissile";
import { create_pollen } from "../skills/createpollen";
import { random_choice } from "../util/randomchoice";
import { create_boomerang } from "../skills/createboomerang";
import { create_venus } from "../skills/createvenus";
import { Maybe } from "../types/maybe";

export const handle_key_press = (
  entity: Entity,
  skill_list: Array<Skill>
): void => {
  const animation: Maybe<Animation> = entity.get_animation();
  if (!animation) return;

  const jump_height: number = 10;

  const position: Vector2D = entity.get_position();
  const velocity: Vector2D = entity.get_velocity();

  const dimensions: IFrameDimensions = animation.get_dimensions();

  if (!entity.is_dead()) {
    if (p5_sketch.keyIsDown(87) && is_on_ground(entity)) {
      entity.set_animation(Animations.cuphead.jump);
      entity.set_velocity(velocity.x, -jump_height);
      GameSounds.cuphead_jump.play();
    }

    if (p5_sketch.keyIsDown(32)) {
      if (is_on_ground(entity)) entity.set_animation(Animations.cuphead.shoot);
      shoot_ray(entity, skill_list);
    }

    if (p5_sketch.keyIsDown(65) && p5_sketch.keyIsDown(32)) {
      entity.set_direction("left");

      if (is_on_ground(entity))
        entity.set_animation(Animations.cuphead.run.gun);

      if (position.x > 0)
        entity.set_position(position.x - entity.get_move_speed(), position.y);

      return;
    }

    if (p5_sketch.keyIsDown(68) && p5_sketch.keyIsDown(32)) {
      entity.set_direction("right");

      if (is_on_ground(entity))
        entity.set_animation(Animations.cuphead.run.gun);

      if (position.x + dimensions.width < p5_sketch.windowWidth)
        entity.set_position(position.x + entity.get_move_speed(), position.y);

      return;
    }
  }

  if (p5_sketch.keyIsDown(65)) {
    entity.set_direction("left");

    if (is_on_ground(entity))
      entity.set_animation(Animations.cuphead.run.normal);

    if (position.x > 0)
      entity.set_position(position.x - entity.get_move_speed(), position.y);

    return;
  }

  if (p5_sketch.keyIsDown(68)) {
    entity.set_direction("right");

    if (is_on_ground(entity))
      entity.set_animation(Animations.cuphead.run.normal);

    if (position.x + dimensions.width < p5_sketch.windowWidth)
      entity.set_position(position.x + entity.get_move_speed(), position.y);
    return;
  }
};

export const make_boss_attack = (
  cagney: Entity,
  cuphead: Entity,
  skill_list: Array<Skill>
): void => {
  const animation: Maybe<Animation> = cagney.get_animation();
  if (!animation || !animation.is_last_frame()) return;

  const attack: number = random_int(0, 3);

  switch (attack) {
    case 0:
      cagney.set_animation(Animations.cagney.firing_seeds);
      launch_seed_missile(cagney, skill_list);
      GameSounds.cagney_firing_seeds.play(0, 1, 0.03, 0, 1);
      break;

    case 1:
      cagney.set_animation(Animations.cagney.create_object);
      random_choice(create_boomerang, create_pollen)(cagney, skill_list);
      break;

    case 2:
      create_venus(cuphead, skill_list);
      break;
    case 3:
      cagney.set_animation(Animations.cagney.idle);
      break;
  }
};
