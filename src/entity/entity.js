"use strict";

class Entity {
  id;
  position = { x: 0, y: 0 };
  velocity = { x: 0, y: 0 };

  animations = new Map();

  health = 100;
  move_speed = 5;

  direction = "right";
  currentAnimation = "idle";

  set_id = id => {
    this.id = id;
    return this;
  };

  get_id = () => this.id;

  set_health = health => {
    this.health = health;
    return this;
  };

  receive_damage = amount => {
    this.health -= amount;
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

  set_animation = animation_name => {
    this.currentAnimation = animation_name;
    return this;
  };

  get_animation = () => this.animations.get(this.currentAnimation);

  add_animation = (animation_name, frames, delay = 60, id) => {
    if (!animation_name) throw new Error("Animation identifier is required");

    this.animations.set(animation_name, new Animation(frames, delay, id));
    return this;
  };

  remove_animation = animation_name => {
    this.animations.delete(animation_name);
    return this;
  };
}
