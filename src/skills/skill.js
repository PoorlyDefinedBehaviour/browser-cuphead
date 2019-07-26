"use strict";

class Skill {
  position = { x: 0, y: 0 };
  velocity_incrementer = { x: 0, y: 0 };
  velocity = { x: 0, y: 0 };
  damage = 1;
  owned_by_player = false;
  animation;
  direction;

  constructor(x, y, direction) {
    this.position.x = x;
    this.position.y = y;
    this.direction = direction;
  }

  get_damage = () => this.damage;

  set_owned_by_player = boolean => {
    this.owned_by_player = boolean;
    return this;
  };

  is_owned_by_player = () => this.owned_by_player;

  set_loaded_animation = animation => {
    this.animation = animation;
    return this;
  };

  set_animation = frames => {
    this.animation = new Animation(frames);
    return this;
  };

  get_animation = () => this.animation;

  set_update_fn = fn => {
    this.update = () => fn(this);
    return this;
  };

  update = () => {
    this.position.x += this.velocity.x;
    this.position.y += this.velocity.y;
    this.velocity.x += this.velocity_incrementer.x;
    this.velocity.y += this.velocity_incrementer.y;

    return this;
  };

  set_direction = direction => {
    this.direction = direction;
    return this;
  };

  set_velocity = velocity => {
    this.velocity = velocity;
    return this;
  };

  set_velocity_incrementer = incrementer => {
    this.velocity_incrementer = incrementer;
    return this;
  };

  get_direction = () => this.direction;

  set_position = position => {
    this.position = position;
    return this;
  };

  get_position = () => this.position;
}
