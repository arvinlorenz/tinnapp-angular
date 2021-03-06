import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';

import { IonicModule, IonicRouteStrategy } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { AngularFireModule } from 'angularfire2';
import { AngularFireStorageModule } from 'angularfire2/storage';


import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { HttpClientModule, HttpHeaders } from '@angular/common/http';
import { ApolloModule, APOLLO_OPTIONS, Apollo } from 'apollo-angular';
import { setContext } from 'apollo-link-context';
import { HttpLinkModule, HttpLink } from 'apollo-angular-link-http';
import { InMemoryCache } from 'apollo-cache-inmemory';
import { Plugins } from '@capacitor/core';
import { OrderService } from './orders/order.service';
import { ProductsService } from './products/products.service';

export function createApollo(httpLink: HttpLink) {
  // https://tinnapp.herokuapp.com/
  // http://localhost:4000
  const http = httpLink.create({ uri: 'https://tinnapp.herokuapp.com'});

  const auth = setContext(async (_, { headers }) => {
     const tokenRes = await Plugins.Storage.get({ key: 'authData' });
     if (tokenRes.value) {
      const token = JSON.parse(tokenRes.value).token;
      return {
        headers: new HttpHeaders().set('Authorization', `Bearer ${token}`)
      };
    } else {
        return {};
    }
  });

  return {
    link: auth.concat(http),
    cache: new InMemoryCache()
  };
}

@NgModule({
  declarations: [AppComponent],
  entryComponents: [],
  imports: [
    BrowserModule,
    IonicModule.forRoot(),
    AppRoutingModule,
    HttpClientModule,
    ApolloModule,
    HttpLinkModule,
    AngularFireModule.initializeApp({
      apiKey: 'AIzaSyDvwV4B-Fc2pZdYmdQ__sUcDD-R46ZWXu8',
      authDomain: 'tinnapp-2eefe.firebaseapp.com',
      storageBucket: 'tinnapp-2eefe.appspot.com',
      projectId: 'tinnapp-2eefe'
    }),
    AngularFireStorageModule
  ],
  providers: [
    StatusBar,
    SplashScreen,
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy },
    {
      provide: APOLLO_OPTIONS,
      useFactory: createApollo,
      deps: [HttpLink]
    },
    OrderService,
    ProductsService

  ],
  bootstrap: [AppComponent]
})
export class AppModule {}
