import { Pipe, PipeTransform } from '@angular/core';
import { TranslationService } from '../translation.service';

@Pipe({
    name: 'translate'
})
export class TranslationPipe implements PipeTransform {

    constructor() { }

    transform(value: string): string {
        return TranslationService.translate(value);
    }
}
