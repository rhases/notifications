import { Routes, RouterModule } from '@angular/router';

import { LoginComponent } from './login';
import { DevicesComponent } from './devices';

const appRoutes: Routes = [
    // { path: '', component: HomeComponent, canActivate: [AuthGuard] },
    { path: 'login/:token', component: LoginComponent },
    { path: 'devices', component: DevicesComponent },
    // { path: 'register', component: RegisterComponent },

    // otherwise redirect to home
    { path: '**', redirectTo: '' }
];

export const routing = RouterModule.forRoot(appRoutes);
