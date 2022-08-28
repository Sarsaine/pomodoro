import { Component, Input } from '@angular/core';
import { TimeService } from "../../services/time.service";
import { Observable } from "rxjs";
import { Config } from "../../models/config";

@Component({
  selector: 'app-form',
  templateUrl: './form.component.html',
  styleUrls: ['./form.component.scss'],
})
export class FormComponent {

  @Input() disabled = false;

  config$: Observable<Config>;

  constructor(
    private time: TimeService
  ) {
    this.config$ = this.time.getConfig();
  }

  change(
    key: 'workTime' | 'breakTime' | 'maxIteration' | 'longTimeFormat',
    value: any) {
    this.time.setConfig(key, value)
  }

}
