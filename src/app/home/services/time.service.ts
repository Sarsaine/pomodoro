import { Injectable } from '@angular/core';
import { BehaviorSubject, interval, Observable, of } from "rxjs";
import { switchMap, tap } from "rxjs/operators";
import { StorageService } from "./storage.service";
import { States } from "../enum/states";
import { Current } from "../models/current";
import { Config } from "../models/config";
import { SoundService } from "./sound.service";

@Injectable({
  providedIn: 'root'
})
export class TimeService {

  private current: Current = null;
  private config: Config = null;

  private config$ = new BehaviorSubject<Config>(null);

  constructor(
    private storage: StorageService,
    private sound: SoundService,
  ) {
    this.init()
  }

  private async saveCurrent() {
    await this.storage.saveCurrent(this.current);
  }

  private async init() {
    this.storage.loadCurrent().then(current => {
      this.current = current;
    });
    this.storage.loadConfig().then(config => {
      this.config = config;
      this.config$.next(config);
    });
  }

  private incTime() {
    if (this.current.state === States.WAIT)
      return;

    this.current.time++;
    if (this.current.state === States.WORK && this.current.time >= this.config.workTime) {
      this.current.state = States.PAUSE;
      this.sound.pauseAlarm();
    } else if (this.current.state === States.PAUSE) {
      const pauseTime = this.current.iteration >= this.config.maxIteration ? this.config.workTime * 2 : this.config.workTime + this.config.pauseTime;
      if (this.current.time >= pauseTime) {
        this.current.time = 0;
        this.current.state = States.WAIT;
        this.current.iteration++;
        if (this.current.iteration > this.config.maxIteration) {
          this.current.iteration = 1;
        }
        this.sound.workAlarm();
      }
    }
    this.saveCurrent()
  }

  getCurrent(): Observable<Current> {
    return interval(1000).pipe(
      tap(async _ => {
        this.incTime()
      }),
      switchMap(_ => {
        return of(this.current)
      })
    );
  }

  getConfig(): Observable<Config> {
    return this.config$;
  }

  async setConfig(
    key: 'workTime' | 'pauseTime' | 'maxIteration',
    value: any): Promise<void> {
    this.config[key] = value;
    await this.storage.saveConfig(this.config);
    this.config$.next(this.config);
  }

  async changeState(newState: States) {
    this.sound.stopAlarm();
    this.current.state = newState;
    await this.saveCurrent();
  }

  async finish() {
    this.current.time = 0;
    this.current.state = States.WAIT;
    this.current.iteration++;
    if (this.current.iteration > this.config.maxIteration) {
      this.current.iteration = 1;
    }
    await this.saveCurrent();
  }

  async reset() {
    this.current.time = 0;
    this.current.state = States.WAIT;
    this.current.iteration = 1;
    await this.saveCurrent();
  }
}
