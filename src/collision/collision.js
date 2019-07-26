function aabb(one, other) {
  const one_position = one.get_position();
  const one_dimensions = one.get_animation().get_dimensions();

  const other_position = other.get_position();
  const other_dimensions = other.get_animation().get_dimensions();

  return collideRectRect(
    one_position.x,
    one_position.y,
    one_dimensions.width,
    one_dimensions.height,
    other_position.x,
    other_position.y,
    other_dimensions.width,
    other_dimensions.height
  );
}

function collision_skill_entity(entity, skill_list) {
  for (let i = skill_list.length - 1; i > -1; --i) {
    if (skill_list[i].is_owned_by_player() && entity.get_id() === "player")
      continue;

    if (entity.get_id() !== "player" && !skill_list[i].is_owned_by_player())
      continue;

    if (aabb(entity, skill_list[i])) {
      entity.receive_damage(skill_list[i].get_damage());
      skill_list.splice(i, 1);
    }
  }
}

function collision_between_skills(current_skill_index, skill_list) {
  const current_skill = skill_list[current_skill_index];

  for (let i = skill_list.length - 1; i > -1; --i) {
    if (
      skill_list[i].is_owned_by_player() &&
      current_skill.is_owned_by_player()
    )
      continue;

    if (
      !current_skill.is_owned_by_player() &&
      !skill_list[i].is_owned_by_player()
    )
      continue;

    if (i === current_skill_index) continue;

    if (aabb(current_skill, skill_list[i])) skill_list.splice(i, 1);
  }
}

function out_of_screen(skill) {
  if (!skill) return;

  const { x, y } = skill.get_position();
  const { width, height } = skill.get_animation().get_dimensions();

  const minimum_distance = 2000;

  return (
    x - width < -minimum_distance ||
    x > windowWidth + minimum_distance ||
    y - height < -minimum_distance ||
    y > windowHeight + minimum_distance
  );
}
