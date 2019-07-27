"use strict";

function launch_seed_missile() {
  const skill = new Skill(
    random_int(windowWidth - 400, windowWidth - 50),
    random_int(-50, -250),
    "left"
  )
    .set_animation(skill_frames.seed_missile)
    .set_velocity(0, 0.04)
    .set_velocity_incrementer(-0.06, 0.06);

  skill_list.push(skill);
  cagney_firing_seeds_sound.play(0, 1, 0.03, 0, 1);
}
