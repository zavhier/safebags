import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { SearchPage } from './search.page';
import { FormsModule } from '@angular/forms';

@NgModule({
  imports: [
    CommonModule,
    IonicModule,
    SearchPageModule,
    FormsModule,
  ],
  declarations: [SearchPage]
})
export class SearchPageModule {}
