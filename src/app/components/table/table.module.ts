import {NgModule} from "@angular/core";
import {ContentDirective, ExpandContentDirective, UxTableComponent} from "@components/table/table.component";
import {TablePageComponent} from "@/pages/table-page/table-page.component";
import {BrowserModule} from "@angular/platform-browser";
import {FormsModule} from "@angular/forms";
import {ColumnComponent} from "@components/table/column/column.component";
import { HeaderComponent } from './header/header.component';

@NgModule({
  imports: [
    BrowserModule, FormsModule
  ],
  exports: [
    UxTableComponent,
    ColumnComponent,
    TablePageComponent,
    ContentDirective,
    ExpandContentDirective,
    HeaderComponent
  ],
  declarations: [
    UxTableComponent,
    ColumnComponent,
    TablePageComponent,
    ContentDirective,
    ExpandContentDirective,
    HeaderComponent
  ],
  providers: []
})
export class TableModule {

}
