import { Skill } from "./Skill";
import { AnimationFrames } from "../Frames";
import { random_int } from "../Utils/RandomInt";
import { EDirections } from "../Entity";
import { sketch } from "../P5/Index";

export const launch_seed_missile = (skill_list: Array<Skill>): void => {
  const skill: Skill = new Skill(
    random_int((sketch.windowWidth * 60) / 100, sketch.windowWidth - 50),
    -50,
    EDirections.LEFT
  )
    .set_animation(AnimationFrames.skills.seed_missile)
    .set_velocity(0, 0.04)
    .set_velocity_incrementer(-0.06, 0.06);

  skill_list.push(skill);
};
