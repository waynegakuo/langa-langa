import { Pipe, PipeTransform } from '@angular/core';
import { formatLapTime } from '../utils/time.util';

@Pipe({ name: 'lapTime', standalone: true })
export class LapTimePipe implements PipeTransform {
  transform(seconds: number | null | undefined): string {
    return formatLapTime(seconds);
  }
}
