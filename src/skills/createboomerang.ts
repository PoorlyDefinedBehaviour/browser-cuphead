import { Skill } from "./skill";
import { Entity } from "../entity/entity";
import { Vector2D } from "../vector2d/vector2d";
import { AnimationFrames } from "../frames/frames";
import { random_choice } from "../util/randomchoice";

export const create_boomerang = (
  entity: Entity,
  skill_list: Array<Skill>
): void => {
  const position: Vector2D = entity.get_position();

  const skill = new Skill(position.x, position.y + 250, "left")
    .set_update_fn(
      (self: Skill): void => {
        const position: Vector2D = self.get_position();
        const velocity: Vector2D = self.get_velocity();
        const velocity_incrementer: Vector2D = self.get_velocity_incrementer();

        self.set_position(position.x + velocity.x, position.y + velocity.y);

        if (velocity.y < -8 || velocity.y > 8)
          self.set_velocity(velocity.x, (velocity.y *= -1));

        self.set_velocity(
          velocity.x + velocity_incrementer.x,
          velocity.y + velocity_incrementer.y
        );
      }
    )
    .set_animation(AnimationFrames.skills.boomerang)
    .set_velocity(-1.0, -1.0)
    .set_velocity_incrementer(
      random_choice(-0.1, -0.1),
      random_choice(-0.1, 0.1)
    );

  skill_list.push(skill);
};
