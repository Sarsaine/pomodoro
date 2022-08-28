import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class SoundService {

  constructor() { }

  stopAlarm() {

  }

  breakAlarm() {
    this.stopAlarm();

  }

  workAlarm() {
    this.stopAlarm();

  }
}
