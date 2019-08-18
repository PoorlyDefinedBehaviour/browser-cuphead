import { Vec2 } from "../Vec2";
import { Animation } from "../Animation";
import { EDirections } from "../Entity";

export class Skill {
  private position: Vec2 = { x: 0, y: 0 };
  private velocity_incrementer: Vec2 = { x: 0, y: 0 };
  private velocity: Vec2 = { x: 0, y: 0 };
  private damage: number = 1;
  private animation: Animation;
  private owned_by_player: boolean = false;

  public direction: EDirections;

  constructor(x: number, y: number, direction: EDirections) {
    this.position.x = x;
    this.position.y = y;
    this.direction = direction;
  }

  public get_damage = () => this.damage;

  public set_owned_by_player = (owned: boolean): Skill => {
    this.owned_by_player = owned;
    return this;
  };

  public is_owned_by_player = (): boolean => this.owned_by_player;

  public set_animation = (frames: Array<string>): Skill => {
    this.animation = new Animation(frames);
    return this;
  };

  public get_animation = (): any => this.animation;

  public set_update_fn = (fn: any): Skill => {
    this.update = () => fn(this);
    return this;
  };

  public update = (): Skill => {
    this.position.x += this.velocity.x;
    this.position.y += this.velocity.y;
    this.velocity.x += this.velocity_incrementer.x;
    this.velocity.y += this.velocity_incrementer.y;

    return this;
  };

  public set_velocity = (x: number, y: number): Skill => {
    this.velocity = { x, y };
    return this;
  };

  public get_velocity = (): Vec2 => this.velocity;

  public set_velocity_incrementer = (x: number, y: number): Skill => {
    this.velocity_incrementer = { x, y };
    return this;
  };

  public get_velocity_incrementer = (): Vec2 => this.velocity_incrementer;

  public set_position = (x: number, y: number): Skill => {
    this.position = { x, y };
    return this;
  };

  public get_position = (): Vec2 => this.position;
}
