import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'formatTime'
})
export class FormatTimePipe implements PipeTransform {

  transform(value: number, format: 'short' | 'long' = 'short'): string {
    let min: string = String(Math.floor(value / 60));
    let sec: string = String(value % 60);

    if (+min < 10) {
      min = "0" + min
    }

    if (+sec < 10) {
      sec = "0" + sec
    }

    if (format === 'long') {
      return min + " min " + sec + " sec";
    }

    return min + ":" + sec;
  }

}
