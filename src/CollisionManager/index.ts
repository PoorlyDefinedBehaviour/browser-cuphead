import { Entity } from "../Entity";

import { Vec2 } from "../Vec2";

import { IFrameDimensions, Animation } from "../Animation";

import { Skill } from "../Skills/Skill";

import { GameSounds } from "../GameManager/sounds";

import { Maybe } from "../types/maybe";

import { sketch } from "../P5/Index";

export class CollisionManager {
  public static rect_rect = (
    x: number,
    y: number,
    w: number,
    h: number,
    x2: number,
    y2: number,
    w2: number,
    h2: number
  ): boolean => x + w >= x2 && x <= x2 + w2 && y + h >= y2 && y <= y2 + h2;

  public static aabb = (a: Entity | Skill, b: Entity | Skill): boolean => {
    const a_position: Vec2 = a.get_position();
    const a_dimensions: IFrameDimensions = a.get_animation().get_dimensions();

    const b_position: Vec2 = b.get_position();
    const b_dimensions: IFrameDimensions = b.get_animation().get_dimensions();

    return CollisionManager.rect_rect(
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

  public static collision_skill_entity = (
    entity: Entity,
    skill_list: Array<Skill>
  ): void => {
    for (let i = skill_list.length - 1; i > -1; --i) {
      if (skill_list[i].is_owned_by_player() && entity.get_id() === "player")
        continue;

      if (entity.get_id() !== "player" && !skill_list[i].is_owned_by_player())
        continue;

      if (CollisionManager.aabb(entity, skill_list[i])) {
        entity.receive_damage(skill_list[i].get_damage());
        skill_list.splice(i, 1);
        GameSounds.entity_hit.play();
      }
    }
  };

  public static collision_between_skills = (
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
      if (CollisionManager.aabb(current_skill, skill_list[i]))
        skill_list.splice(i, 1);
    }
  };

  public static out_of_screen = (skill: Skill): boolean => {
    if (!skill) return false;

    const minimum_distance: number = 2000;

    const { x, y }: Vec2 = skill.get_position();
    const {
      width,
      height
    }: IFrameDimensions = skill.get_animation().get_dimensions();

    return (
      x - width < -minimum_distance ||
      x > sketch.windowWidth + minimum_distance ||
      y - height < -minimum_distance ||
      y > sketch.windowWidth + minimum_distance
    );
  };

  public static is_on_ground = (
    entity: Entity,
    floor_height: number
  ): boolean => {
    const animation: Maybe<Animation> = entity.get_animation();
    if (!animation) {
      return true;
    }

    const velocity: Vec2 = entity.get_velocity();
    if (velocity.y < 0) {
      return false;
    }

    const position: Vec2 = entity.get_position();
    const dimensions: IFrameDimensions = animation.get_dimensions();

    return CollisionManager.rect_rect(
      position.x,
      position.y,
      dimensions.width,
      dimensions.height,
      0,
      floor_height,
      sketch.windowWidth,
      sketch.windowWidth
    );
  };
}
