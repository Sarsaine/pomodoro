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
      this.current.state = States.BREAK;
      this.sound.breakAlarm();
    } else if (this.current.state === States.BREAK) {
      const breakTime = this.current.iteration >= this.config.maxIteration ? this.config.workTime * 2 : this.config.workTime + this.config.breakTime;
      if (this.current.time >= breakTime) {
        this.current.time = 0;
        this.current.state = States.WAIT;
        this.current.iteration++;
        if (this.current.iteration > this.config.maxIteration) {
          this.current.iteration = 1;
        }
        this.sound.workAlarm();
      }
    }
    this.saveCurrent();
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
    key: 'workTime' | 'breakTime' | 'maxIteration' | 'longTimeFormat',
    value: number): Promise<void> {
    this.config[key] = value;
    await this.storage.saveConfig(this.config);
    this.config$.next(this.config);
  }

  private async changeState(newState: States) {
    this.sound.stopAlarm();
    this.current.state = newState;
    await this.saveCurrent();
  }

  async start() {
    await this.changeState(States.WORK);
  }

  async break() {
    this.current.time = this.config.workTime;
    await this.changeState(States.BREAK);
    await this.saveCurrent();
  }

  async finish() {
    this.current.time = 0;
    this.current.iteration++;
    if (this.current.iteration > this.config.maxIteration) {
      this.current.iteration = 1;
    }
    await this.changeState(States.WAIT);
  }

  async reset() {
    this.current.time = 0;
    this.current.iteration = 1;
    await this.changeState(States.WAIT);
  }
}
