import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { TranslationResolver } from 'projects/translation/src/public-api';

const routes: Routes = [
  {
    path: '',
    resolve: {
      news: TranslationResolver,
    },
    data: { module: 'test' }
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
