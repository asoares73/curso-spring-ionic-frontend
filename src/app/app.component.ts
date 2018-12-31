import { AuthService } from './../services/auth.service';
import { Component, ViewChild } from '@angular/core';
import { Nav, Platform } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { StorageService } from '../services/storage.service';
import { ClienteService } from '../services/domain/cliente.service';
import { ClienteDTO } from '../models/cliente.dto';
import { API_CONFIG } from '../config/api.config';

@Component({
  selector : 'myapp',
  templateUrl: 'app.html'
})
export class MyApp {
  cliente : ClienteDTO;

  @ViewChild(Nav) nav: Nav;

  rootPage: string = 'HomePage';

  pages: Array<{title: string, component: string, icon: string}>;

  constructor(
    public platform: Platform, 
    public statusBar: StatusBar, 
    public splashScreen: SplashScreen,
    public auth: AuthService,
    public storage: StorageService,
    public clienteService: ClienteService) {
    this.initializeApp();

    // used for an example of ngFor and navigation
    this.pages = [
      { title: 'Perfil', component: 'ProfilePage', icon: 'contact' },
      { title: 'Categorias', component: 'CategoriasPage', icon: 'folder' },
      { title: 'Carrinho', component: 'CartPage', icon: 'cart' },
      { title: 'Logout', component: 'CategoriasPage', icon: 'exit' },
    ];

  }

  initializeApp() {
    this.platform.ready().then(() => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      this.statusBar.styleDefault();
      this.splashScreen.hide();

      this.carrega();
    });
  }

  openPage(page : {title:string, component:string}) {
    switch (page.title) {
      case 'Logout':
      this.auth.logout();
      this.nav.setRoot('HomePage');
      break;

      default: 
      this.nav.setRoot(page.component);
    }
  }

  carrega() {
    let localUser = this.storage.getLocalUser();
    if (localUser && localUser.email) {
      this.clienteService.findByEmail(localUser.email)
        .subscribe(response => {
          this.cliente = response as ClienteDTO;
          this.getImageIfExists();
        },
        error => {});
    }

  }

  getImageIfExists() {
    this.clienteService.getImageFromBucket(this.cliente.id)
      .subscribe(response => {
        this.cliente.imageUrl = `${API_CONFIG.bucketBaseUrl}/cp${this.cliente.id}.jpg`;
      },
        error => {});
  }
}
