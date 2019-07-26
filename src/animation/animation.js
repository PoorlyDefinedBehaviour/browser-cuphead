"use strict";

class Animation {
  id;
  frames = [];
  current_frame = 0;
  last_frame_request_timestamp = 0;
  frame_delay;

  constructor(frames, frame_delay = 60, id) {
    this.frames = frames.map(frame => loadImage(frame));
    this.frame_delay = frame_delay;
    this.id = id;
  }

  get_id = () => this.id;

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
