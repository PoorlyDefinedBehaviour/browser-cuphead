import { Vector2D } from "../vector2d/vector2d";
import { Animation } from "../animation/animation";

export class Skill {
  private position: Vector2D = { x: 0, y: 0 };
  private velocity_incrementer: Vector2D = { x: 0, y: 0 };
  private velocity: Vector2D = { x: 0, y: 0 };
  private damage: number = 1;
  private animation: Animation;
  private direction: string;
  private owned_by_player: boolean = false;

  constructor(x: number, y: number, direction: string) {
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

  public set_direction = (direction: string): Skill => {
    this.direction = direction;
    return this;
  };

  public set_velocity = (x: number, y: number): Skill => {
    this.velocity = { x, y };
    return this;
  };

  public get_velocity = (): Vector2D => this.velocity;

  public set_velocity_incrementer = (x: number, y: number): Skill => {
    this.velocity_incrementer = { x, y };
    return this;
  };

  public get_velocity_incrementer = (): Vector2D => this.velocity_incrementer;

  public get_direction = (): string => this.direction;

  public set_position = (x: number, y: number): Skill => {
    this.position = { x, y };
    return this;
  };

  public get_position = (): Vector2D => this.position;
}
