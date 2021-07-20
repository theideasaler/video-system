export interface VideoPlayerConfig {
  /** Video player's themes */
  theme?: VideoPlayerThemes;
  /** Default width */
  width?: string;
  /** Default height */
  height?: string;
  /** Auto play video on load */
  autoplay?: boolean;
  /** Preload thumbnail at front end*/
  frontendPreload?: boolean;
  /** Mute video at beginning */
  mute?: boolean;
}

export interface VideoControlConfig {
    /** Show thumbnail image*/
    showThumbnail?: boolean;
}

export enum VideoPlayerThemes {
  dark = 0,
  light = 1,
}
