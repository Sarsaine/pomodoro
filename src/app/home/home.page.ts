import { Component } from '@angular/core';
import {Observable} from "rxjs";
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

  constructor(
    private time: TimeService
  ) {
    this.current$ = this.time.getCurrent();
    this.config$ = this.time.getConfig();
  }

  async start() {
    await this.time.changeState(States.WORK);
  }

  async pause() {
    await this.time.changeState(States.WAIT);
  }

  async stop() {
    await this.time.reset();
  }

}
