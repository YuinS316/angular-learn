import {Component, ContentChild, Input, OnInit} from '@angular/core';
import {
  ColumnType,
  ConfigType,
  ContentDirective,
  ExpandContentDirective,
  MergeCellType
} from "@components/table/table.component";

@Component({
  selector: 'table-column',
  templateUrl: './column.component.html',
  styleUrls: ['./column.component.sass']
})
export class ColumnComponent implements OnInit {

  @ContentChild(ContentDirective) cellSlots!: ContentDirective;
  @ContentChild(ExpandContentDirective) expandSlots!: ExpandContentDirective;

  @Input() value: any[] = [];
  @Input() columns: ColumnType[] = [];
  @Input() mergeCells: MergeCellType[] = [];
  @Input() config: ConfigType = {};
  @Input() expandRowIds: number[] = [];

  public shouldNotRenderCells: Array<{ row: number; col: number }> = [];

  public cellDefaultWidth = 80;

  public minCellWidth = 50;

  constructor() { }

  ngOnInit(): void {
  }

  calcCellWidth(column: ColumnType) {
    if (column.minWidth) {
      if (this.cellDefaultWidth < column.minWidth) {
        return column.minWidth;
      } else {
        return this.cellDefaultWidth;
      }
    }

    return column.width || this.cellDefaultWidth;
  }

  shouldRenderCell(rowIndex: number, colIndex: number) {
    if (!this.mergeCells) {
      return true;
    }

    return !this.shouldNotRenderCells.some(({ row, col }) => row === rowIndex && col === colIndex);
  }

  calcShouldNotRenderCells() {
    const shouldNotRenderCells: Array<{ row: number; col: number }> = [];
    this.mergeCells.forEach(({ row, col, rowspan, colspan }) => {
      for (let i = 0; i < rowspan; i++) {
        for (let j = 0; j < colspan; j++) {
          if (i === 0 && j === 0) {
            continue;
          }
          shouldNotRenderCells.push({
            row: row + i,
            col: col + j
          });
        }
      }
    });

    this.shouldNotRenderCells = shouldNotRenderCells;
  }

  calcRowSpan(rowIndex: number, colIndex: number) {
    if (!this.mergeCells) {
      return 1;
    }

    // return this.mergeCells.some(item => item.row === rowIndex && item.col === colIndex);
    const target = this.mergeCells.find(item => item.row === rowIndex && item.col === colIndex);
    return target ? target.rowspan : 1;
  }

  calcColSpan(rowIndex: number, colIndex: number) {
    if (!this.mergeCells) {
      return 1;
    }

    // return this.mergeCells.some(item => item.row === rowIndex && item.col === colIndex);
    const target = this.mergeCells.find(item => item.row === rowIndex && item.col === colIndex);
    return target ? target.colspan : 1;
  }

  onCellClick(cell: { row: any; column: ColumnType; rowIndex: number; columnIndex: number }) {
    if (cell.column.onClick) {
      cell.column.onClick(cell.row, cell.rowIndex);
    }
  }

  shouldRenderExpandRow(rowId: number) {
    return this.expandRowIds.includes(rowId);
  }

}
