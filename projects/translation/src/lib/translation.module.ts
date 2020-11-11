import { NgModule } from '@angular/core';
import { StoreModule } from '@ngrx/store';
import { TranslationPipe } from './pipe/translation.pipe';
import { reducer } from './state/translate.reducer';

@NgModule({
  declarations: [TranslationPipe],
  imports: [
    StoreModule.forFeature('translate', reducer)
  ],
  exports: [
    TranslationPipe
  ]
})
export class TranslationModule { }
