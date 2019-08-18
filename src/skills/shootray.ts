import { Entity, EDirections } from "../Entity";
import { debounce } from "../Decorators/debounce";
import { Skill } from "./Skill";
import { AnimationFrames } from "../Frames";
import { GameSounds } from "../GameManager/sounds";
import { Vec2 } from "../Vec2";

export const shoot_ray = debounce(
  (entity: Entity, skill_list: Array<Skill>): void => {
    const position: Vec2 = entity.get_position();

    const skill: Skill = new Skill(
      entity.direction === EDirections.RIGHT
        ? position.x + 125
        : position.x - 5,
      position.y + 65,
      entity.direction
    )
      .set_velocity(entity.direction === EDirections.RIGHT ? 5 : -5, 0)
      .set_velocity_incrementer(
        entity.direction === EDirections.RIGHT ? 0.2 : -0.2,
        0
      )
      .set_animation(AnimationFrames.skills.ray)
      .set_owned_by_player(true);

    skill_list.push(skill);
    GameSounds.cuphead_attack.play();
  },
  150
);
