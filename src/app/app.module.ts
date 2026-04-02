import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { RouterModule, Routes } from '@angular/router';
import { AppComponent } from './app.component';
import { HomeComponent } from './features/home/home.component';
import { LoginComponent } from './features/auth/login/login.component';
import { SignupComponent } from './features/auth/signup/signup.component';
import { GuestComponent } from './features/guest/guest.component';
import { PlayerSetupComponent } from './features/setup/player-setup.component';
import { ScoreComponent } from './features/scoring/score.component';
import { DropdownModule } from 'carbon-components-angular';

const routes: Routes = [
  { path: '', redirectTo: 'home', pathMatch: 'full' },
  { path: 'home', component: HomeComponent },
  { path: 'login', component: LoginComponent },
  { path: 'signup', component: SignupComponent },
  { path: 'guest', component: GuestComponent },
  { path: 'score', component: ScoreComponent },
  { path: ':username', component: PlayerSetupComponent },
  { path: '**', redirectTo: 'home' }
];

@NgModule({
  declarations: [AppComponent, HomeComponent, LoginComponent, SignupComponent, GuestComponent, PlayerSetupComponent, ScoreComponent],
  imports: [BrowserModule, ReactiveFormsModule, FormsModule, RouterModule.forRoot(routes), DropdownModule],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule {}
