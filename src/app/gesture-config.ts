import * as Hammer from 'hammerjs';
import { HammerGestureConfig } from "@angular/platform-browser";

export class GestureConfig extends HammerGestureConfig {
  override overrides = <any> {
    swipe: { direction: Hammer.DIRECTION_ALL },
  };
}