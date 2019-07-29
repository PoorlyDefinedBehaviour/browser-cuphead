import { Entity } from "../entity/entity";
import { Animation } from "../animation/animation";
import { Skill } from "../skills/skill";
import { GameImages } from "../game/images";
import { Animations } from "../game/animations";
import { Maybe } from "../types/maybe";
import { Vector2D } from "../vector2d/vector2d";
import { Game } from "../game/game";

export const draw_entity = (entity: Entity): void => {
  const position: Vector2D = entity.get_position();

  const animation: Maybe<Animation> = entity.get_animation();
  if (!animation) return;

  const frame: any = animation.next_frame();

  Game.push();
  Game.translate(position.x, position.y);

  if (entity.get_direction() === "left") {
    Game.translate(frame.width, 0);
    Game.scale(-1.0, 1.0);
  } else {
    Game.scale(1.0, 1.0);
  }

  if (
    entity.get_id() === "boss" &&
    animation.get_id() === "missile" &&
    animation.get_current_frame_number() > 5 &&
    animation.get_current_frame_number() < 18
  ) {
    Game.render_image(Animations.skills.missile.next_frame(), 90, -110);
  }

  Game.render_image(frame, 0, 0);
  Game.pop();
};

export const draw_skills = (skill_list: Array<Skill>): void => {
  for (const skill of skill_list) {
    skill.update();

    const position = skill.get_position();
    const frame = skill.get_animation().next_frame();

    Game.push();
    Game.translate(position.x, position.y);

    skill.get_direction() === "left"
      ? Game.scale(-1.0, 1.0)
      : Game.scale(1.0, 1.0);

    Game.render_image(frame, 0, 0);
    Game.pop();
  }
};

export const draw_health = (cuphead: Entity): void => {
  for (let i = 0; i < 3; ++i) {
    Game.render_image(
      i < cuphead.get_health()
        ? GameImages.cuphead_health_icon_filled
        : GameImages.cuphead_health_icon_dark,
      i * 90,
      10
    );
  }
};
