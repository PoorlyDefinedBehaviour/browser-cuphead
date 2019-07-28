import { Entity } from "../entity/entity";
import { Animation } from "../animation/animation";
import { p5_sketch } from "../main";
import { Skill } from "../skills/skill";
import { GameImages } from "../game/images";
import { Animations } from "../game/animations";
import { Maybe } from "../types/maybe";

export const draw_entity = (entity: Entity): void => {
  const position = entity.get_position();

  const animation: Maybe<Animation> = entity.get_animation();
  if (!animation) return;

  const frame: any = animation.next_frame();

  p5_sketch.push();
  p5_sketch.translate(position.x, position.y);

  if (entity.get_direction() === "left") {
    p5_sketch.translate(frame.width, 0);
    p5_sketch.scale(-1.0, 1.0);
  } else {
    p5_sketch.scale(1.0, 1.0);
  }

  if (
    entity.get_id() === "boss" &&
    animation.get_id() === "missile" &&
    animation.get_current_frame_number() > 5 &&
    animation.get_current_frame_number() < 18
  ) {
    p5_sketch.image(Animations.skills.missile.next_frame(), 90, -110);
  }

  p5_sketch.image(frame, 0, 0);
  p5_sketch.pop();
};

export const draw_skills = (skill_list: Array<Skill>): void => {
  for (const skill of skill_list) {
    skill.update();

    const position = skill.get_position();
    const frame = skill.get_animation().next_frame();

    p5_sketch.push();
    p5_sketch.translate(position.x, position.y);

    skill.get_direction() === "left"
      ? p5_sketch.scale(-1.0, 1.0)
      : p5_sketch.scale(1.0, 1.0);

    p5_sketch.image(frame, 0, 0);
    p5_sketch.pop();
  }
};

export const draw_health = (cuphead: Entity): void => {
  for (let i = 0; i < 3; ++i) {
    p5_sketch.image(
      i < cuphead.get_health()
        ? GameImages.cuphead_health_icon_filled
        : GameImages.cuphead_health_icon_dark,
      i * 90,
      10
    );
  }
};
