import { Entity } from "../entity/entity";
import { Vector2D } from "../vector2d/vector2d";
import { IFrameDimensions } from "../animation/animation";
import { Skill } from "../skills/skill";
import { p5_sketch } from "../main";
import { GameSounds } from "../game/sounds";

export const collide_rect_rect = (
  x: number,
  y: number,
  w: number,
  h: number,
  x2: number,
  y2: number,
  w2: number,
  h2: number
): boolean => x + w >= x2 && x <= x2 + w2 && y + h >= y2 && y <= y2 + h2;

export const aabb = (a: Entity | Skill, b: Entity | Skill) => {
  const a_position: Vector2D = a.get_position();
  const a_dimensions: IFrameDimensions = a.get_animation().get_dimensions();

  const b_position: Vector2D = b.get_position();
  const b_dimensions: IFrameDimensions = b.get_animation().get_dimensions();

  return collide_rect_rect(
    a_position.x,
    a_position.y,
    a_dimensions.width,
    a_dimensions.height,
    b_position.x,
    b_position.y,
    b_dimensions.width,
    b_dimensions.height
  );
};

export const collision_skill_entity = (
  entity: Entity,
  skill_list: Array<Skill>
): void => {
  for (let i = skill_list.length - 1; i > -1; --i) {
    if (skill_list[i].is_owned_by_player() && entity.get_id() === "player")
      continue;

    if (entity.get_id() !== "player" && !skill_list[i].is_owned_by_player())
      continue;

    if (aabb(entity, skill_list[i])) {
      entity.receive_damage(skill_list[i].get_damage());
      skill_list.splice(i, 1);
      GameSounds.entity_hit.play();
    }
  }
};

export const collision_between_skills = (
  skill_index: number,
  skill_list: Array<Skill>
): void => {
  const current_skill = skill_list[skill_index];

  if (!current_skill) return;

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

    if (i === skill_index) continue;
    if (aabb(current_skill, skill_list[i])) skill_list.splice(i, 1);
  }
};

export const out_of_screen = (skill: Skill): boolean => {
  if (!skill) return false;

  const minimum_distance: number = 2000;

  const { x, y }: Vector2D = skill.get_position();
  const {
    width,
    height
  }: IFrameDimensions = skill.get_animation().get_dimensions();

  return (
    x - width < -minimum_distance ||
    x > p5_sketch.windowWidth + minimum_distance ||
    y - height < -minimum_distance ||
    y > p5_sketch.windowHeight + minimum_distance
  );
};
