import {Component, OnInit} from '@angular/core';
import {ColumnType, ConfigType, MergeCellType} from "@components/table/table.component";

@Component({
  selector: 'app-table-page',
  templateUrl: './table-page.component.html',
  styleUrls: ['./table-page.component.sass']
})
export class TablePageComponent implements OnInit {

  constructor() {
  }

  public config: ConfigType = {
    scrollable: true,
    height: 500
  }

  public columns: ColumnType[] = [

  ]

  public data: any[] = [
    {
      name: "小明",
      chinese: 78,
      math: 66
    },
    {
      name: "小红",
      chinese: 88,
      math: 78
    },
    {
      name: "小强",
      chinese: 60,
      math: 90
    }
  ]

  handleClick(target) {
    alert("click--" + JSON.stringify(target) );
  }

  initColumns() {
    const ctx = this;
    this.columns = [
      {
        field: "name",
        header: "名字",
        width: 80,
        onClick(row) {
          ctx.handleClick(row)
        }
      },
      {
        field: "chinese",
        header: "语文成绩",
        minWidth: 100,
      },
      {
        field: "math",
        header: "数学成绩",
      },
    ]
  }

  ngOnInit(): void {
    this.initColumns();
  }

}
