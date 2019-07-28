import { Entity } from "../entity/entity";
import { Skill } from "./skill";
import { AnimationFrames } from "../frames/frames";
import { random_int } from "../util/randomint";
import { p5_sketch } from "../main";

export const launch_seed_missile = (
  entity: Entity,
  skill_list: Array<Skill>
): void => {
  const skill = new Skill(
    random_int(p5_sketch.windowWidth - 400, p5_sketch.windowWidth - 50),
    random_int(-50, -250),
    "left"
  )
    .set_animation(AnimationFrames.skills.seed_missile)
    .set_velocity(0, 0.04)
    .set_velocity_incrementer(-0.06, 0.06);

  skill_list.push(skill);
};
