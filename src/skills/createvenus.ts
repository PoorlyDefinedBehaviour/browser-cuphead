import { debounce } from "../Decorators/debounce";

import { Entity, EDirections } from "../Entity";

import { Vec2 } from "../Vec2";

import { Skill } from "./Skill";

import { AnimationFrames } from "../Frames";

import { random_int } from "../Utils/RandomInt";
import { random_float } from "../Utils/RandomFloat";
import { Match } from "../Utils/Match";

import { sketch } from "../P5/Index";

export const create_venus = debounce(
  (target: Entity, skill_list: Array<Skill>): void => {
    const side_of_screen: number = random_int(0, 3);

    const skill_position: Vec2 = Match(
      side_of_screen,
      [
        0,
        {
          x: -50,
          y: random_float(-50, sketch.windowHeight + 50)
        }
      ],
      [
        1,
        {
          x: random_float(-50, sketch.windowWidth + 50),
          y: -50
        }
      ],
      [
        2,
        {
          x: sketch.windowWidth + 50,
          y: random_float(-50, sketch.windowHeight + 50)
        }
      ],
      [
        3,
        {
          x: random_float(-50, sketch.windowWidth + 50),
          y: sketch.windowHeight + 50
        }
      ]
    );

    const skill: Skill = new Skill(
      skill_position.x,
      skill_position.y,
      EDirections.RIGHT
    )
      .set_animation(AnimationFrames.skills.venus)
      .set_velocity(0, 0.04)
      .set_velocity_incrementer(-0.06, 0.06)
      .set_update_fn(
        (self: Entity): void => {
          const target_position: Vec2 = target.get_position();

          const position: Vec2 = self.get_position();

          self.set_velocity(
            (target_position.x - position.x) * 0.01,
            (target_position.y - position.y) * 0.01
          );

          const velocity: Vec2 = self.get_velocity();

          self.direction =
            velocity.x < 0 ? EDirections.RIGHT : EDirections.LEFT;

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
