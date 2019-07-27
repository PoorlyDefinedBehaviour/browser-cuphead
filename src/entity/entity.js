"use strict";

class Entity {
  id;
  position = { x: 0, y: 0 };
  velocity = { x: 0, y: 0 };

  animations = new Map();

  when_animation_over_fn = () => {};

  health = 100;
  move_speed = 5;

  direction = "right";
  current_animation = "idle";

  constructor() {
    setInterval(() => {
      if (this.get_animation().is_last_frame()) {
        this.when_animation_over_fn();
        this.when_animation_over_fn = () => {};
      }
    }, 60);
  }

  set_id = id => {
    this.id = id;
    return this;
  };

  get_id = () => this.id;

  set_health = health => {
    this.health = health;
    return this;
  };

  is_dead = () => this.health <= 0;

  receive_damage = amount => {
    if (!this.is_dead()) this.health -= amount;
    return this;
  };

  set_direction = direction => {
    this.direction = direction;
    return this;
  };

  get_direction = () => this.direction;

  set_move_speed = speed => {
    this.movespeed = speed;
    return this;
  };

  get_move_speed = () => this.move_speed;

  set_position = (x, y) => {
    this.position = { x, y };
    return this;
  };

  get_position = () => this.position;

  set_velocity = (x, y) => {
    this.velocity = { x, y };
    return this;
  };

  get_velocity = () => this.velocity;

  set_animation = (animation_name, force = false) => {
    if (force || !this.get_animation() || this.get_animation().is_skippable())
      this.current_animation = animation_name;

    return this;
  };

  get_animation = () => this.animations.get(this.current_animation);

  when_over = fn => {
    this.when_animation_over_fn = fn;
    return this;
  };

  add_animation = (animation_name, frames, delay, id, skippable) => {
    if (!animation_name) throw new Error("Animation identifier is required");
    if(!frames) throw new Error("Frames are required");

    this.animations.set(
      animation_name,
      new Animation(frames, delay, id, skippable)
    );
    return this;
  };

  remove_animation = animation_name => {
    this.animations.delete(animation_name);
    return this;
  };
}
