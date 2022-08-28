import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { FormsModule } from '@angular/forms';

import { HomePage } from './home.page';
import { HomePageRoutingModule } from './home-routing.module';
import { ProgressComponent } from "./components/progress/progress.component";
import { FormComponent } from "./components/form/form.component";
import { RemainComponent } from "./components/remain/remain.component";
import { FormatTimePipe } from './pipe/format-time.pipe';


@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    HomePageRoutingModule
  ],
  declarations: [
    HomePage,
    ProgressComponent,
    FormComponent,
    RemainComponent,
    FormatTimePipe,
  ]
})
export class HomePageModule {}
