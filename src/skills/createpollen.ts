import { Entity } from "../entity/entity";
import { Skill } from "./skill";
import { Vector2D } from "../vector2d/vector2d";
import { AnimationFrames } from "../frames/frames";
import { debounce } from "../decorators/debounce";
import { random_choice } from "../util/randomchoice";

export const create_pollen = debounce(
  (entity: Entity, skill_list: Array<Skill>): void => {
    const position: Vector2D = entity.get_position();

    const skill = new Skill(position.x + 50, position.y + 250, "left")
      .set_update_fn(
        (self: Skill): void => {
          const position: Vector2D = self.get_position();
          const velocity: Vector2D = self.get_velocity();
          const velocity_incrementer: Vector2D = self.get_velocity_incrementer();

          if (velocity.y < -4 || velocity.y > 4)
            self.set_velocity(velocity.x, -velocity.y);

          self.set_position((position.x = velocity.x), position.y + velocity.y);
          self.set_velocity(
            velocity.x + velocity_incrementer.x,
            velocity.y + velocity_incrementer.y
          );
        }
      )
      .set_animation(AnimationFrames.skills.pollen)
      .set_velocity(-1.0, -1.0)
      .set_velocity_incrementer(
        random_choice(-0.1, -0.1),
        random_choice(-0.1, 0.1)
      );

    skill_list.push(skill);
  },
  1000
);
