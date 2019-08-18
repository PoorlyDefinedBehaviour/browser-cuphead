import { Skill } from "./Skill";
import { Entity, EDirections } from "../Entity";
import { Vec2 } from "../Vec2";
import { AnimationFrames } from "../Frames";
import { random_choice } from "../Utils/RandomChoice";

export const create_boomerang = (
  entity: Entity,
  skill_list: Array<Skill>
): void => {
  const position: Vec2 = entity.get_position();

  const skill: Skill = new Skill(position.x, position.y + 250, EDirections.LEFT)
    .set_animation(AnimationFrames.skills.boomerang)
    .set_velocity(-1.0, -1.0)
    .set_velocity_incrementer(
      random_choice(-0.1, -0.1),
      random_choice(-0.1, 0.1)
    )
    .set_update_fn(
      (self: Skill): void => {
        const position: Vec2 = self.get_position();
        const velocity: Vec2 = self.get_velocity();
        const velocity_incrementer: Vec2 = self.get_velocity_incrementer();

        self.set_position(position.x + velocity.x, position.y + velocity.y);

        if (velocity.y < -8 || velocity.y > 8)
          self.set_velocity(velocity.x, (velocity.y *= -1));

        self.set_velocity(
          velocity.x + velocity_incrementer.x,
          velocity.y + velocity_incrementer.y
        );
      }
    );

  skill_list.push(skill);
};
