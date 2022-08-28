import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class SoundService {

  constructor() { }

  stopAlarm() {

  }

  pauseAlarm() {
    this.stopAlarm();

  }

  workAlarm() {
    this.stopAlarm();

  }
}
