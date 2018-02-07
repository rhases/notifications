import { Routes, RouterModule } from '@angular/router';

import { LoginComponent } from './login';
import { DevicesComponent } from './devices';
import { MessagesComponent } from './messages';
import { AuthGuard} from './_guards/auth.guards';

const appRoutes: Routes = [
    // { path: '', component: HomeComponent, canActivate: [AuthGuard] },
    { path: 'login/:token', component: LoginComponent },
    { path: 'login', component: LoginComponent },
    { path: 'devices', component: DevicesComponent, canActivate: [AuthGuard] },
    { path: 'messages', component: MessagesComponent, canActivate: [AuthGuard] },
    // { path: 'register', component: RegisterComponent },

    // otherwise redirect to home
    { path: '**', redirectTo: '', canActivate: [AuthGuard]  }
];

export const routing = RouterModule.forRoot(appRoutes);
