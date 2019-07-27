"use strict";

const create_venus = debounce(target => {
  let skill_position = { x: 0, y: 0 };

  const side_of_screen = random_int(0, 3);

  switch (side_of_screen) {
    case 0:
      skill_position = { x: -50, y: random_float(-50, windowHeight + 50) };
      break;
    case 1:
      skill_position = { x: random_float(-50, windowWidth + 50), y: -50 };
      break;

    case 2:
      skill_position = {
        x: windowWidth + 50,
        y: random_float(-50, windowHeight + 50)
      };
      break;
    case 3:
      skill_position = {
        x: random_float(-50, windowWidth + 50),
        y: windowHeight + 50
      };
      break;
  }

  const skill = new Skill(skill_position.x, skill_position.y, "left")
    .set_animation(skill_frames.venus)
    .set_velocity(0, 0.04)
    .set_velocity_incrementer(-0.06, 0.06)
    .set_update_fn(self => {
      const target_position = target.get_position();

      self.velocity = {
        x: target_position.x - self.position.x,
        y: target_position.y - self.position.y
      };

      self.velocity = { x: self.velocity.x * 0.01, y: self.velocity.y * 0.01 };
      self.direction = self.velocity.x < 0 ? "right" : "left";

      self.position.x += self.velocity.x;
      self.position.y += self.velocity.y;
    });

  skill_list.push(skill);
}, 1000);
