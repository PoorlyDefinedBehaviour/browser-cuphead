"use strict";

class Animation {
  id;
  frames = [];
  skippable = true;
  current_frame = 0;
  last_frame_request_timestamp = 0;
  frame_delay;

  constructor(frames, frame_delay = 60, id = "none", skippable = true) {
    this.frames = frames.map(frame => loadImage(frame));
    this.frame_delay = frame_delay;
    this.id = id;
    this.skippable = skippable;
  }

  get_id = () => this.id;

  set_skippable = skippable => {
    this.skippable = boolean;
    return this;
  };

  is_skippable = () => this.skippable;

  next_frame = () => {
    const timePassed = Date.now() - this.last_frame_request_timestamp;

    if (timePassed > this.frame_delay) {
      ++this.current_frame;
      this.last_frame_request_timestamp = Date.now();
    }

    if (this.current_frame > this.frames.length - 1) this.current_frame = 0;

    return this.frames[this.current_frame];
  };

  is_last_frame = () => this.current_frame === this.frames.length - 1;

  get_dimensions = () => ({
    width: this.frames[this.current_frame].width,
    height: this.frames[this.current_frame].height
  });

  get_current_frame_number = () => this.current_frame;

  get_num_frames = () => this.frames.length;
}
