import { Entity } from "../entity/entity";
import { Vector2D } from "../vector2d/vector2d";
import { IFrameDimensions, Animation } from "../animation/animation";
import { Skill } from "../skills/skill";
import { Game } from "../game/game";
import { GameSounds } from "../game/sounds";
import { Maybe } from "../types/maybe";

export class Collider {
  public rect_rect = (
    x: number,
    y: number,
    w: number,
    h: number,
    x2: number,
    y2: number,
    w2: number,
    h2: number
  ): boolean => x + w >= x2 && x <= x2 + w2 && y + h >= y2 && y <= y2 + h2;

  public aabb = (a: Entity | Skill, b: Entity | Skill): boolean => {
    const a_position: Vector2D = a.get_position();
    const a_dimensions: IFrameDimensions = a.get_animation().get_dimensions();

    const b_position: Vector2D = b.get_position();
    const b_dimensions: IFrameDimensions = b.get_animation().get_dimensions();

    return this.rect_rect(
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

  public collision_skill_entity = (
    entity: Entity,
    skill_list: Array<Skill>
  ): void => {
    for (let i = skill_list.length - 1; i > -1; --i) {
      if (skill_list[i].is_owned_by_player() && entity.get_id() === "player")
        continue;

      if (entity.get_id() !== "player" && !skill_list[i].is_owned_by_player())
        continue;

      if (this.aabb(entity, skill_list[i])) {
        entity.receive_damage(skill_list[i].get_damage());
        skill_list.splice(i, 1);
        GameSounds.entity_hit.play();
      }
    }
  };

  public collision_between_skills = (
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
      if (this.aabb(current_skill, skill_list[i])) skill_list.splice(i, 1);
    }
  };

  public out_of_screen = (skill: Skill): boolean => {
    if (!skill) return false;

    const minimum_distance: number = 2000;

    const { x, y }: Vector2D = skill.get_position();
    const {
      width,
      height
    }: IFrameDimensions = skill.get_animation().get_dimensions();

    return (
      x - width < -minimum_distance ||
      x > Game.window_width + minimum_distance ||
      y - height < -minimum_distance ||
      y > Game.window_height + minimum_distance
    );
  };

  public is_on_ground = (entity: Entity): boolean => {
    const animation: Maybe<Animation> = entity.get_animation();
    if (!animation) return true;

    const velocity: Vector2D = entity.get_velocity();
    if (velocity.y < 0) return false;

    const position: Vector2D = entity.get_position();
    const dimensions: IFrameDimensions = animation.get_dimensions();

    return this.rect_rect(
      position.x,
      position.y,
      dimensions.width,
      dimensions.height,
      0,
      Game.floor_height,
      Game.window_width,
      Game.window_height
    );
  };
}
