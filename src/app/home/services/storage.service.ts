import { Injectable } from '@angular/core';
import { Storage } from "@ionic/storage-angular";
import { Config } from "../models/config";
import { Current } from "../models/current";
import { States } from "../enum/states";
import { wait } from "../utils/wait";

@Injectable({
  providedIn: 'root'
})
export class StorageService {

  private storage: Storage | null = null;

  private initialized = false

  constructor(
    private _storage: Storage,
  ) {
    this.init()
  }

  async init() {
    this.storage = await this._storage.create();
    this.initialized = true;
  }

  async waitInit(): Promise<void> {
    while (!this.initialized) {
      await wait(10);
    }
  }

  async load(key: string): Promise<string> {
    await this.waitInit();
    return await this.storage.get(key);
  }

  async save(key: string, value: string): Promise<void> {
    await this.waitInit();
    await this.storage.set(key, value);
  }

  async loadConfig(): Promise<Config> {
    const config = await this.load("config");

    if (config) {
      return JSON.parse(config);
    }
    return {
      workTime: 20,
      breakTime: 5,
      maxIteration: 4,
      longTimeFormat: 0,
    }
  }

  async saveConfig(config: Config): Promise<void> {
    await this.save("config", JSON.stringify(config));
  }

  async loadCurrent(): Promise<Current> {
    const current = await this.load("current");

    if (current) {
      return JSON.parse(current);
    }
    return {
      time: 0,
      state: States.WAIT,
      iteration: 1,
    }
  }

  async saveCurrent(current: Current): Promise<void> {
    await this.save("current", JSON.stringify(current));
  }
}
