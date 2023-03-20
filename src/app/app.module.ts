import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { TodoListComponent } from '@components/todo-list/todo-list.component';
import { TodoListItemComponent } from '@components/todo-list/todo-list-item/todo-list-item.component';

import { StorageService } from '@services/storage.service';
import {TableModule} from "@components/table/table.module";
import {ImageModule} from "@components/image/image.module";
import {MessageModule} from "@components/message/message.module";

@NgModule({
  declarations: [
    AppComponent,
    TodoListComponent,
    TodoListItemComponent,
  ],
  imports: [
    BrowserModule,
    FormsModule,
    AppRoutingModule,
    TableModule,
    ImageModule,
    MessageModule
  ],
  providers: [StorageService],
  bootstrap: [AppComponent],
})
export class AppModule {}
