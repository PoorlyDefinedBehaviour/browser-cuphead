import { Entity, EDirections } from "../Entity";
import { Skill } from "./Skill";
import { Vec2 } from "../Vec2";
import { AnimationFrames } from "../Frames";
import { debounce } from "../Decorators/debounce";
import { random_choice } from "../Utils/RandomChoice";

export const create_pollen = debounce(
  (entity: Entity, skill_list: Array<Skill>): void => {
    const position: Vec2 = entity.get_position();

    const skill: Skill = new Skill(
      position.x + 50,
      position.y + 250,
      EDirections.LEFT
    )
      .set_animation(AnimationFrames.skills.pollen)
      .set_velocity(-1.0, -1.0)
      .set_velocity_incrementer(
        random_choice(-0.02, -0.04),
        random_choice(-0.04, 0.04)
      )
      .set_update_fn(
        (self: Skill): void => {
          const position: Vec2 = self.get_position();
          const velocity: Vec2 = self.get_velocity();
          const velocity_incrementer: Vec2 = self.get_velocity_incrementer();

          self
            .set_velocity(
              velocity.x + velocity_incrementer.x,
              velocity.y + velocity_incrementer.y
            )
            .set_position(
              position.x + velocity.x,
              position.y + Math.cos(velocity.y) * 10
            );
        }
      );

    skill_list.push(skill);
  },
  1000
);
