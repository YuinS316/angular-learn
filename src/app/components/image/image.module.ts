import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {LazyLoadDirective, ImageComponent} from './image.component';
import {ImagePageComponent} from "@/pages/image-page/image-page.component";



@NgModule({
  declarations: [
    ImageComponent,
    ImagePageComponent,
    LazyLoadDirective
  ],
  imports: [
    CommonModule
  ],
  exports: [
    ImageComponent,
    ImagePageComponent,
    LazyLoadDirective
  ]
})
export class ImageModule { }
