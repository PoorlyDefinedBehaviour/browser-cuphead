"use strict";

function create_boomerang() {
  const position = cagney.get_position();

  const skill = new Skill(position.x, position.y + 250, "left")
    .set_update_fn(self => {
      self.position.x += self.velocity.x;
      self.position.y += self.velocity.y;
      self.velocity.x += self.velocity_incrementer.x;
      self.velocity.y += self.velocity_incrementer.y;

      if (self.velocity.y < -8 || self.velocity.y > 8) self.velocity.y *= -1;
    })
    .set_animation(skill_frames.boomerang)
    .set_velocity(-1.0, -1.0)
    .set_velocity_incrementer(
      random_choice(-0.1, -0.1),
      random_choice(-0.1, 0.1)
    );

  skill_list.push(skill);
}
