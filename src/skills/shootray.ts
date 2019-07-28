import { Entity } from "../entity/entity";
import { debounce } from "../decorators/debounce";
import { Skill } from "./skill";
import { AnimationFrames } from "../frames/frames";
import { GameSounds } from "../game/sounds";

export const shoot_ray = debounce(
  (entity: Entity, skill_list: Array<Skill>): void => {
    const position = entity.get_position();
    const direction = entity.get_direction();

    const skill = new Skill(
      direction === "right" ? position.x + 125 : position.x - 5,
      position.y + 65,
      direction
    )
      .set_velocity(direction === "right" ? 5 : -5, 0)
      .set_velocity_incrementer(direction === "right" ? 0.2 : -0.2, 0)
      .set_animation(AnimationFrames.skills.ray)
      .set_owned_by_player(true);

    skill_list.push(skill);
    GameSounds.cuphead_attack.play();
  },
  150
);
