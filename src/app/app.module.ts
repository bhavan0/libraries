import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { InterceptorMessageService, StoreService, TokenInterceptor } from 'projects/core/src/public-api';
import { HTTP_INTERCEPTORS } from '@angular/common/http';

const rxjsServices = [TokenInterceptor, InterceptorMessageService];

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
  ],
  providers: [
    ...rxjsServices,
    {
      provide: HTTP_INTERCEPTORS,
      useClass: TokenInterceptor,
      multi: true
    },
    StoreService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
