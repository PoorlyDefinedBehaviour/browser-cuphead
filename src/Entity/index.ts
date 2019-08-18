import { Animation } from "../Animation";
import { Vec2 } from "../Vec2";
import { Maybe } from "../types/maybe";

export enum EDirections {
  LEFT,
  RIGHT,
  UP,
  DOWN
}

export class Entity {
  private id: string;
  private position: Vec2 = { x: 0, y: 0 };
  private velocity: Vec2 = { x: 0, y: 0 };

  private animations: Map<string, Animation> = new Map<string, Animation>();

  private when_animation_over_fn: any = () => {};

  private move_speed: number = 5;

  private current_animation: string = "idle";

  public direction: number = EDirections.RIGHT;
  public health: number = 100;

  constructor() {
    setInterval(() => {
      const animation: Maybe<Animation> = this.get_animation();

      if (animation && animation.is_last_frame()) {
        this.when_animation_over_fn();
        this.when_animation_over_fn = () => {};
      }
    }, 60);
  }

  public set_id = (id: string): Entity => {
    this.id = id;
    return this;
  };

  public get_id = (): string => this.id;

  public set_health = (health: number): Entity => {
    this.health = health;
    return this;
  };

  public get_health = (): number => this.health;

  public is_dead = (): boolean => this.health <= 0;

  public receive_damage = (amount: number): Entity => {
    if (!this.is_dead()) this.health -= amount;
    return this;
  };

  public set_move_speed = (speed: number): Entity => {
    this.move_speed = speed;
    return this;
  };

  public get_move_speed = (): number => this.move_speed;

  public set_position = (x: number, y: number): Entity => {
    this.position = { x, y };
    return this;
  };

  public get_position = (): Vec2 => this.position;

  public set_velocity = (x: number, y: number): Entity => {
    this.velocity = { x, y };
    return this;
  };

  public get_velocity = (): Vec2 => this.velocity;

  set_animation = (name: string, force: boolean = false): Entity => {
    const animation: Maybe<Animation> = this.get_animation();

    if (force || !animation || animation.is_skippable())
      this.current_animation = name;

    return this;
  };

  public get_animation = (): Maybe<Animation> =>
    this.animations.get(this.current_animation);

  public when_over = (fn: any): Entity => {
    this.when_animation_over_fn = fn;
    return this;
  };

  public add_animation = (
    name: string,
    frames: Array<string>,
    delay?: number,
    id?: string,
    skippable?: boolean
  ): Entity => {
    if (!name) throw new Error("Animation identifier is required");
    if (!frames) throw new Error("Frames are required");

    this.animations.set(name, new Animation(frames, delay, id, skippable));
    return this;
  };

  public remove_animation = (name: string): Entity => {
    this.animations.delete(name);
    return this;
  };
}
