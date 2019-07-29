import { debounce } from "../decorators/debounce";
import { Entity } from "../entity/entity";
import { Vector2D } from "../vector2d/vector2d";
import { Skill } from "./skill";
import { AnimationFrames } from "../frames/frames";
import { random_int } from "../util/randomint";
import { random_float } from "../util/randomfloat";
import { Game } from "../game/game";

export const create_venus = debounce(
  (target: Entity, skill_list: Array<Skill>): void => {
    let skill_position: Vector2D = { x: 0, y: 0 };

    const side_of_screen: number = random_int(0, 3);

    switch (side_of_screen) {
      case 0:
        skill_position = {
          x: -50,
          y: random_float(-50, Game.window_height + 50)
        };
        break;
      case 1:
        skill_position = {
          x: random_float(-50, Game.window_width + 50),
          y: -50
        };
        break;

      case 2:
        skill_position = {
          x: Game.window_width + 50,
          y: random_float(-50, Game.window_height + 50)
        };
        break;
      case 3:
        skill_position = {
          x: random_float(-50, Game.window_width + 50),
          y: Game.window_height + 50
        };
        break;
    }

    const skill: Skill = new Skill(skill_position.x, skill_position.y, "left")
      .set_animation(AnimationFrames.skills.venus)
      .set_velocity(0, 0.04)
      .set_velocity_incrementer(-0.06, 0.06)
      .set_update_fn(
        (self: Entity): void => {
          const target_position: Vector2D = target.get_position();

          const position: Vector2D = self.get_position();

          self.set_velocity(
            (target_position.x - position.x) * 0.01,
            (target_position.y - position.y) * 0.01
          );

          const velocity: Vector2D = self.get_velocity();

          self.set_direction(velocity.x < 0 ? "right" : "left");

          self.set_position(
            (position.x += velocity.x),
            (position.y += velocity.y)
          );
        }
      );

    skill_list.push(skill);
  },
  1000
);
