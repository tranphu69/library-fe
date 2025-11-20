import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'truncate',
  standalone: true
})
export class TruncatePipe implements PipeTransform {
  transform(value: any, limit = 20): string {
    if (value == null) return '';
    const str = value.toString();
    return str.length > limit ? str.slice(0, limit) + '…' : str;
  }
}
