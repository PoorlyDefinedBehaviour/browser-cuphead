"use strict";

const shoot_ray = debounce(() => {
  const position = cuphead.get_position();
  const direction = cuphead.get_direction();

  const skill = new Skill(
    direction === "right" ? position.x + 125 : position.x - 5,
    position.y + 65,
    direction
  )
    .set_velocity(direction === "right" ? 5 : -5, 0)
    .set_velocity_incrementer(direction === "right" ? 0.2 : -0.2, 0)
    .set_animation(skill_frames.ray)
    .set_owned_by_player(true);

  skill_list.push(skill);
  cuphead_attack_sound.play();
}, 150);
