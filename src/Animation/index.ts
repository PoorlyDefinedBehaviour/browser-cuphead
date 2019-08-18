import { sketch } from "../P5/Index";

export interface IFrameDimensions {
  width: number;
  height: number;
}

export class Animation {
  private id: string;
  private frames: Array<any> = [];
  private skippable: boolean = true;
  private current_frame: number = 0;
  private last_frame_request_timestamp: number = 0;
  private frame_delay: number;

  constructor(
    frames: Array<string>,
    frame_delay: number = 60,
    id: string = "none",
    skippable: boolean = true
  ) {
    this.frames = frames.map(frame => sketch.loadImage(frame));
    this.frame_delay = frame_delay;
    this.id = id;
    this.skippable = skippable;
  }

  public get_id = (): string => this.id;

  public set_skippable = (skippable: boolean): Animation => {
    this.skippable = skippable;
    return this;
  };

  public is_skippable = (): boolean => this.skippable;

  public next_frame = (): any => {
    const timePassed = Date.now() - this.last_frame_request_timestamp;

    if (timePassed > this.frame_delay) {
      ++this.current_frame;
      this.last_frame_request_timestamp = Date.now();
    }

    if (this.current_frame > this.frames.length - 1) this.current_frame = 0;

    return this.frames[this.current_frame];
  };

  public is_last_frame = (): boolean =>
    this.current_frame === this.frames.length - 1;

  public get_dimensions = (): IFrameDimensions => ({
    width: this.frames[this.current_frame].width,
    height: this.frames[this.current_frame].height
  });

  public get_current_frame_number = (): number => this.current_frame;

  public get_num_frames = (): number => this.frames.length;
}
