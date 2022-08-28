import { Component, Input } from '@angular/core';
import { Current } from "../../models/current";
import { Config } from "../../models/config";

@Component({
  selector: 'app-remain',
  templateUrl: './remain.component.html',
  styleUrls: ['./remain.component.scss'],
})
export class RemainComponent {

  @Input() current: Current;
  @Input() config: Config;

  constructor() { }

}
