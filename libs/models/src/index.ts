export interface VideoPlayerConfig {
  /** Video player's themes */
  theme: VideoPlayerThemes;
  /** Default width */
  width: number;
  /** Default height */
  height: number;
}

export enum VideoPlayerThemes {
  dark = 0,
  light = 1,
}
