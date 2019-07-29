import { Skill } from "./skill";
import { AnimationFrames } from "../frames/frames";
import { random_int } from "../util/randomint";
import { Game } from "../game/game";

export const launch_seed_missile = (skill_list: Array<Skill>): void => {
  const skill: Skill = new Skill(
    random_int((Game.window_width * 60) / 100, Game.window_width - 50),
    -50,
    "left"
  )
    .set_animation(AnimationFrames.skills.seed_missile)
    .set_velocity(0, 0.04)
    .set_velocity_incrementer(-0.06, 0.06);

  console.log(skill.get_position());
  skill_list.push(skill);
};
