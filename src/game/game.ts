import p5 from "p5";
import "p5/lib/addons/p5.sound";
import "p5/lib/addons/p5.dom";

import { Entity } from "../entity/entity";
import { Skill } from "../skills/skill";
import { Maybe } from "../types/maybe";
import { Vector2D } from "../vector2d/vector2d";

import { Collider } from "../collision/collider";

import { GameImages } from "./images";
import { Animations } from "./animations";

import { preload_images, preload_characters } from "../misc/preload";
import { draw_entity, draw_health, draw_skills } from "../misc/drawing";

import { GameSounds } from "./sounds";

import { IFrameDimensions, Animation } from "../animation/animation";
import { shoot_ray } from "../skills/shootray";
import { launch_seed_missile } from "../skills/launchseedmissile";
import { create_boomerang } from "../skills/createboomerang";
import { create_venus } from "../skills/createvenus";
import { create_pollen } from "../skills/createpollen";

import { random_int } from "../util/randomint";
import { random_choice } from "../util/randomchoice";

export class Game {
  private collider: Collider = new Collider();

  private static p5_sketch: p5;

  private cuphead: Entity;
  private cagney: Entity;

  private skill_list: Array<Skill> = [];

  public static floor_height: number;
  public static window_width: number;
  public static window_height: number;

  start = (): void => {
    Game.p5_sketch = new p5((sketch: p5) => {
      sketch.preload = (): void => {
        preload_images(sketch);
        [this.cagney, this.cuphead] = preload_characters(sketch);
      };

      sketch.setup = (): void => {
        sketch.frameRate(60);
        sketch.createCanvas(sketch.windowWidth, sketch.windowHeight);

        Game.floor_height = sketch.windowHeight - 250;
        Game.window_width = sketch.windowWidth;
        Game.window_height = sketch.windowHeight;

        (document as any).getElementById("main-container").style.display =
          "none";
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

        if (this.collider.is_on_ground(this.cuphead))
          this.cuphead.set_velocity(this.cuphead.get_velocity().x, 0),
            this.cuphead.set_animation(Animations.cuphead.idle);
        else this.gravity();

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

        Game.floor_height = sketch.windowHeight - 250;
        Game.window_width = sketch.windowWidth;
        Game.window_height = sketch.windowHeight;

        if (this.cagney)
          this.cagney.set_position(
            sketch.windowWidth - 380,
            sketch.windowHeight - 650
          );
      };
    });
  };

  public static is_key_down = (key_code: number): boolean =>
    Game.p5_sketch.keyIsDown(key_code);

  public static push = (): void => Game.p5_sketch.push();

  public static pop = (): void => Game.p5_sketch.pop();

  public static translate = (x: number, y: number): void =>
    Game.p5_sketch.translate(x, y) as any;

  public static scale = (x: number, y: number): void =>
    Game.p5_sketch.scale(x, y) as any;

  public static load_image = (path: string): any =>
    Game.p5_sketch.loadImage(path);

  public static render_image = (
    image: any,
    dx: any,
    dy: any,
    dWidth?: any,
    dHeight?: any,
    sx?: any,
    sy?: any,
    sWidth?: any,
    sHeight?: any
  ) =>
    Game.p5_sketch.image(
      image,
      dx,
      dy,
      dWidth,
      dHeight,
      sx,
      sy,
      sWidth,
      sHeight
    ) as any;

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
    if (this.collider.aabb(this.cuphead, this.cagney))
      this.cuphead.receive_damage(1), GameSounds.entity_hit.play();

    for (let i = this.skill_list.length - 1; i > -1; --i) {
      if (this.collider.out_of_screen(this.skill_list[i])) {
        this.skill_list.splice(i, 1);
        continue;
      }

      this.collider.collision_between_skills(i, this.skill_list);
      this.collider.collision_skill_entity(this.cagney, this.skill_list);
      this.collider.collision_skill_entity(this.cuphead, this.skill_list);
    }
  };

  private gravity = (): void => {
    const force: number = 0.37;

    const position: Vector2D = this.cuphead.get_position();
    const velocity: Vector2D = this.cuphead.get_velocity();

    this.cuphead.set_velocity(velocity.x, velocity.y + force);
    this.cuphead.set_position(position.x + velocity.x, position.y + velocity.y);
  };

  private handle_key_press = (
    entity: Entity,
    skill_list: Array<Skill>
  ): void => {
    const animation: Maybe<Animation> = entity.get_animation();
    if (!animation) return;

    const jump_height: number = 10;

    const position: Vector2D = entity.get_position();
    const velocity: Vector2D = entity.get_velocity();

    const dimensions: IFrameDimensions = animation.get_dimensions();

    if (Game.is_key_down(32)) {
      if (this.collider.is_on_ground(entity))
        entity.set_animation(Animations.cuphead.shoot);
      shoot_ray(entity, skill_list);
    }

    if (Game.is_key_down(65)) {
      entity.set_direction("left");

      if (this.collider.is_on_ground(entity))
        entity.set_animation(Animations.cuphead.run.normal);

      if (position.x > 0)
        entity.set_position(position.x - entity.get_move_speed(), position.y);
    }

    if (Game.is_key_down(68)) {
      entity.set_direction("right");

      if (this.collider.is_on_ground(entity))
        entity.set_animation(Animations.cuphead.run.normal);

      if (position.x + dimensions.width < Game.window_width)
        entity.set_position(position.x + entity.get_move_speed(), position.y);
    }

    if (Game.is_key_down(65) && Game.is_key_down(32)) {
      entity.set_direction("left");

      if (this.collider.is_on_ground(entity))
        entity.set_animation(Animations.cuphead.run.gun);

      if (position.x > 0)
        entity.set_position(position.x - entity.get_move_speed(), position.y);
    }

    if (Game.is_key_down(68) && Game.is_key_down(32)) {
      entity.set_direction("right");

      if (this.collider.is_on_ground(entity))
        entity.set_animation(Animations.cuphead.run.gun);

      if (position.x + dimensions.width < Game.window_width)
        entity.set_position(position.x + entity.get_move_speed(), position.y);
    }

    if (Game.is_key_down(87) && this.collider.is_on_ground(entity)) {
      entity.set_animation(Animations.cuphead.jump);
      entity.set_velocity(velocity.x, -jump_height);
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

    switch (random_int(0, 3)) {
      case 0:
        cagney.set_animation(Animations.cagney.firing_seeds);
        launch_seed_missile(skill_list);
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
