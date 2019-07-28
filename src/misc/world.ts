import { Entity } from "../entity/entity";
import { Vector2D } from "../vector2d/vector2d";
import { Animation, IFrameDimensions } from "../animation/animation";
import { collide_rect_rect } from "../collision/collision";
import { floor_height, p5_sketch } from "../main";
import { Maybe } from "../types/maybe";

export const apply_gravity = (entity: Entity): void => {
  const force = 0.37;

  const position: Vector2D = entity.get_position();
  const velocity: Vector2D = entity.get_velocity();

  entity.set_velocity(velocity.x, velocity.y + force);
  entity.set_position(position.x + velocity.x, position.y + velocity.y);
};

export const is_on_ground = (entity: Entity): boolean => {
  const animation: Maybe<Animation> = entity.get_animation();
  if (!animation) return true;

  const position: Vector2D = entity.get_position();
  const dimensions: IFrameDimensions = animation.get_dimensions();

  return collide_rect_rect(
    position.x,
    position.y,
    dimensions.width,
    dimensions.height,
    0,
    floor_height,
    p5_sketch.windowWidth,
    p5_sketch.windowHeight
  );
};
