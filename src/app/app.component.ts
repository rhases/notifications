import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'app';
  navLinks = [
    { path: 'messages', label: 'Mensagens', icon: 'notifications' },
    { path: 'devices', label: 'Dispositivos', icon: 'devices' }
  ];
}
