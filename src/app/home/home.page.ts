import { Component } from '@angular/core';
import { Observable } from "rxjs";
import { States } from "./enum/states";
import { TimeService } from "./services/time.service";
import { Config } from "./models/config";
import { Current } from "./models/current";

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {

  States = States

  current$: Observable<Current>;
  config$: Observable<Config>;

  openConfiguration = false;

  constructor(
    private time: TimeService,
  ) {
    this.current$ = this.time.getCurrent();
    this.config$ = this.time.getConfig();
  }

  async start() {
    await this.time.start();
  }

  async break() {
    await this.time.break();
  }

  async finish() {
    await this.time.finish();
  }

  async stop() {
    await this.time.finish();
  }

  async reset() {
    await this.time.reset();
  }

  toggleConfiguration() {
    this.openConfiguration = !this.openConfiguration
  }

}
