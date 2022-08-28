import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-progress',
  templateUrl: './progress.component.html',
  styleUrls: ['./progress.component.scss'],
})
export class ProgressComponent implements OnInit {

  @Input() title: string;
  @Input() value: number;
  @Input() buffer: number;
  @Input() max: number;

  constructor() { }

  ngOnInit() {}

}
