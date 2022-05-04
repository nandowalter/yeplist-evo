import * as Hammer from 'hammerjs';
import { HammerGestureConfig } from "@angular/platform-browser";
import { Injectable } from '@angular/core';

@Injectable()
export class GestureConfig extends HammerGestureConfig {
  override overrides = <any> {
    'swipe': { direction: Hammer.DIRECTION_ALL },
    'pinch': { enable: false },
    'rotate': { enable: false },
    'pan': { direction: Hammer.DIRECTION_HORIZONTAL, threshold:20 }
  };

  override buildHammer(element: HTMLElement) {
    const mc = new Hammer(element, {
      touchAction: 'pan-y'
    });

    return mc;
  }
}