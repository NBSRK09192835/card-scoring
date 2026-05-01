import { NgModule } from "@angular/core";
import { BrowserModule } from "@angular/platform-browser";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { ReactiveFormsModule, FormsModule } from "@angular/forms";
import { RouterModule, Routes } from "@angular/router";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatSelectModule } from "@angular/material/select";
import { MatCheckboxModule } from "@angular/material/checkbox";
import { MatDividerModule } from "@angular/material/divider";
import { MatButtonModule } from "@angular/material/button";
import { MatDialogModule } from "@angular/material/dialog";
import { MatInputModule } from "@angular/material/input";
import { MatPseudoCheckboxModule } from "@angular/material/core";
import { AppComponent } from "./app.component";
import { HomeComponent } from "./features/home/home.component";
import { PlayerSetupComponent } from "./features/setup/player-setup.component";
import { ScoreComponent } from "./features/score/score.component";
import { GuestComponent } from "./features/guest/guest.component";
import { DialogHostComponent } from "./shared/dialog-host/dialog-host.component";
import { ToastComponent } from "./shared/components/toast/toast.component";

const routes: Routes = [
  { path: "", redirectTo: "home", pathMatch: "full" },
  { path: "home", component: HomeComponent },
  { path: "guest", component: GuestComponent },
  { path: ":username/score", component: ScoreComponent },
  { path: ":username", component: PlayerSetupComponent },
  { path: "**", redirectTo: "home" },
];

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    PlayerSetupComponent,
    ScoreComponent,
    GuestComponent,
    DialogHostComponent,
    ToastComponent,
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    ReactiveFormsModule,
    FormsModule,
    RouterModule.forRoot(routes),
    MatFormFieldModule,
    MatSelectModule,
    MatCheckboxModule,
    MatDividerModule,
    MatButtonModule,
    MatDialogModule,
    MatInputModule,
    MatPseudoCheckboxModule,
  ],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
