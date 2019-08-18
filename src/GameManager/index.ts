import { Entity, EDirections } from "../Entity";
import { Skill } from "../Skills/Skill";
import { Maybe } from "../types/maybe";
import { Vec2 } from "../Vec2";

import { CollisionManager } from "../CollisionManager";

import { GameImages } from "./images";
import { Animations } from "./animations";

import { preload_images, preload_characters } from "../Misc/preload";
import { draw_entity, draw_health, draw_skills } from "../Misc/drawing";

import { GameSounds } from "./sounds";

import { IFrameDimensions, Animation } from "../Animation";

import { shoot_ray } from "../Skills/ShootRay";
import { launch_seed_missile } from "../Skills/LaunchSeedMissile";
import { create_boomerang } from "../Skills/CreateBoomerang";
import { create_venus } from "../Skills/CreateVenus";
import { create_pollen } from "../Skills/CreatePollen";

import { random_int } from "../Utils/RandomInt";
import { random_choice } from "../Utils/RandomChoice";
import { Match } from "../Utils/Match";

import { sketch } from "../P5/Index";

export class GameManager {
  private cuphead: Entity;
  private cagney: Entity;

  private skill_list: Array<Skill> = [];

  private floor_height: number;
  private cuphead_jump_height: number = 10;

  start = (): void => {
    sketch.preload = (): void => {
      preload_images(sketch);
      [this.cagney, this.cuphead] = preload_characters(sketch);
    };

    sketch.setup = (): void => {
      sketch.frameRate(60);
      sketch.createCanvas(sketch.windowWidth, sketch.windowHeight);

      this.floor_height = sketch.windowHeight - 250;

      (document as any).getElementById("main-container").style.display = "none";
    };

    sketch.draw = (): void => {
      sketch.background(100);
      sketch.image(
        GameImages.game_background,
        0,
        0,
        sketch.windowWidth,
        sketch.windowHeight
      );

      if (CollisionManager.is_on_ground(this.cuphead, this.floor_height)) {
        this.cuphead.set_velocity(this.cuphead.get_velocity().x, 0);
        this.cuphead.set_animation(Animations.cuphead.idle);
      } else {
        this.gravity();
      }

      this.make_boss_attack(this.cagney, this.cuphead, this.skill_list);

      this.handle_key_press(this.cuphead, this.skill_list);
      this.handle_deaths();

      draw_entity(this.cuphead);
      draw_entity(this.cagney);
      draw_health(this.cuphead);
      draw_skills(this.skill_list);

      this.collision();

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

      this.floor_height = sketch.windowHeight - 250;

      if (this.cagney)
        this.cagney.set_position(
          sketch.windowWidth - 380,
          sketch.windowHeight - 650
        );
    };
  };

  private handle_deaths = (): void => {
    if (
      this.cuphead.is_dead() &&
      (this.cuphead.get_animation() as any).toString() !==
        Animations.cuphead.death
    ) {
      this.cuphead
        .set_animation(Animations.cuphead.death)
        .when_over(this.restart);
      GameSounds.cuphead_death.play();
    }

    if (this.cagney.is_dead())
      this.cagney
        .set_animation(Animations.cagney.death, true)
        .when_over(this.restart),
        (this.skill_list = []);
  };

  private collision = (): void => {
    if (CollisionManager.aabb(this.cuphead, this.cagney))
      this.cuphead.receive_damage(1), GameSounds.entity_hit.play();

    for (let i = this.skill_list.length - 1; i > -1; --i) {
      if (CollisionManager.out_of_screen(this.skill_list[i])) {
        this.skill_list.splice(i, 1);
        continue;
      }

      CollisionManager.collision_between_skills(i, this.skill_list);
      CollisionManager.collision_skill_entity(this.cagney, this.skill_list);
      CollisionManager.collision_skill_entity(this.cuphead, this.skill_list);
    }
  };

  private gravity = (): void => {
    const force: number = 0.37;

    const position: Vec2 = this.cuphead.get_position();
    const velocity: Vec2 = this.cuphead.get_velocity();

    this.cuphead.set_velocity(velocity.x, velocity.y + force);
    this.cuphead.set_position(position.x + velocity.x, position.y + velocity.y);
  };

  private handle_key_press = (
    entity: Entity,
    skill_list: Array<Skill>
  ): void => {
    const animation: Maybe<Animation> = entity.get_animation();
    if (!animation) return;

    const position: Vec2 = entity.get_position();
    const velocity: Vec2 = entity.get_velocity();

    const dimensions: IFrameDimensions = animation.get_dimensions();

    if (sketch.keyIsDown(32) && !this.cuphead.is_dead()) {
      if (CollisionManager.is_on_ground(entity, this.floor_height)) {
        entity.set_animation(Animations.cuphead.shoot);
      }

      shoot_ray(entity, skill_list);
    }

    if (sketch.keyIsDown(65)) {
      entity.direction = EDirections.LEFT;

      if (CollisionManager.is_on_ground(entity, this.floor_height)) {
        entity.set_animation(Animations.cuphead.run.normal);
      }

      if (position.x > 0) {
        entity.set_position(position.x - entity.get_move_speed(), position.y);
      }
    }

    if (sketch.keyIsDown(68)) {
      entity.direction = EDirections.RIGHT;

      if (CollisionManager.is_on_ground(entity, this.floor_height)) {
        entity.set_animation(Animations.cuphead.run.normal);
      }

      if (position.x + dimensions.width < sketch.windowWidth) {
        entity.set_position(position.x + entity.get_move_speed(), position.y);
      }
    }

    if (sketch.keyIsDown(65) && sketch.keyIsDown(32)) {
      entity.direction = EDirections.LEFT;

      if (CollisionManager.is_on_ground(entity, this.floor_height)) {
        entity.set_animation(Animations.cuphead.run.gun);
      }

      if (position.x > 0) {
        entity.set_position(position.x - entity.get_move_speed(), position.y);
      }
    }

    if (sketch.keyIsDown(68) && sketch.keyIsDown(32)) {
      entity.direction = EDirections.RIGHT;

      if (CollisionManager.is_on_ground(entity, this.floor_height)) {
        entity.set_animation(Animations.cuphead.run.gun);
      }

      if (position.x + dimensions.width < sketch.windowWidth) {
        entity.set_position(position.x + entity.get_move_speed(), position.y);
      }
    }

    if (
      sketch.keyIsDown(87) &&
      CollisionManager.is_on_ground(entity, this.floor_height)
    ) {
      entity.set_animation(Animations.cuphead.jump);
      entity.set_velocity(velocity.x, -this.cuphead_jump_height);
      GameSounds.cuphead_jump.play();
    }
  };

  private make_boss_attack = (
    cagney: Entity,
    cuphead: Entity,
    skill_list: Array<Skill>
  ): void => {
    const animation: Maybe<Animation> = cagney.get_animation();
    if (!animation || !animation.is_last_frame()) return;

    Match(
      random_int(0, 3),
      [
        0,
        () => {
          cagney.set_animation(Animations.cagney.firing_seeds);
          launch_seed_missile(skill_list);
          GameSounds.cagney_firing_seeds.play(0, 1, 0.03, 0, 1);
        }
      ],
      [
        1,
        () => {
          cagney.set_animation(Animations.cagney.create_object),
            random_choice(create_boomerang, create_pollen)(cagney, skill_list);
        }
      ],
      [2, () => create_venus(cuphead, skill_list)],
      [3, () => cagney.set_animation(Animations.cagney.idle)]
    );
  };

  private restart = (): void => {
    this.cuphead
      .set_health(3)
      .set_animation(Animations.cuphead.jump, true)
      .set_position(10, 10)
      .set_velocity(0, 0);

    this.cagney.set_health(500).set_animation(Animations.cagney.intro, true);

    GameSounds.cagney_intro_yell.play();
  };
}
