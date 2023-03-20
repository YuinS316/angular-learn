import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TodoListComponent } from '@components/todo-list/todo-list.component';
import {TablePageComponent} from "@/pages/table-page/table-page.component";
import {ImagePageComponent} from "@/pages/image-page/image-page.component";
import {MessagePageComponent} from "@/pages/message-page/message-page.component";
const routes: Routes = [
  {
    path: '',
    // loadChildren: 'src/app/todo-list/todo-list.module#TodoModule',
    component: TodoListComponent,
  },
  {
    path: "table",
    component: TablePageComponent
  },
  {
    path: "image",
    component: ImagePageComponent
  },
  {
    path: "message",
    component: MessagePageComponent
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
