import { sketch } from "../P5/Index";

import { Entity, EDirections } from "../Entity";

import { Skill } from "../Skills/Skill";

import { Animation } from "../Animation";

import { GameImages } from "../GameManager/images";
import { Animations } from "../GameManager/animations";

import { Maybe } from "../types/maybe";

import { Vec2 } from "../Vec2";

export const draw_entity = (entity: Entity): void => {
  const position: Vec2 = entity.get_position();

  const animation: Maybe<Animation> = entity.get_animation();
  if (!animation) return;

  const frame: any = animation.next_frame();

  sketch.push();
  sketch.translate(position.x, position.y);

  if (entity.direction === EDirections.LEFT) {
    sketch.translate(frame.width, 0);
    sketch.scale(-1.0, 1.0);
  } else {
    sketch.scale(1.0, 1.0);
  }

  if (
    entity.get_id() === "boss" &&
    animation.get_id() === "missile" &&
    animation.get_current_frame_number() > 5 &&
    animation.get_current_frame_number() < 18
  ) {
    sketch.image(Animations.skills.missile.next_frame(), 90, -110);
  }

  sketch.image(frame, 0, 0);
  sketch.pop();
};

export const draw_skills = (skill_list: Array<Skill>): void => {
  for (const skill of skill_list) {
    skill.update();

    const position = skill.get_position();
    const frame = skill.get_animation().next_frame();

    sketch.push();
    sketch.translate(position.x, position.y);

    skill.direction === EDirections.LEFT
      ? sketch.scale(-1.0, 1.0)
      : sketch.scale(1.0, 1.0);

    sketch.image(frame, 0, 0);
    sketch.pop();
  }
};

export const draw_health = (cuphead: Entity): void => {
  for (let i = 0; i < 3; ++i) {
    sketch.image(
      i < cuphead.get_health()
        ? GameImages.cuphead_health_icon_filled
        : GameImages.cuphead_health_icon_dark,
      i * 90,
      10
    );
  }
};
