import {
  Component,
  OnInit,
  Input,
  Output,
  ViewChild,
  ContentChild,
  Directive,
  OnChanges,
  SimpleChanges,
  AfterViewInit,
  TemplateRef,
  ElementRef,
  OnDestroy,
  ChangeDetectorRef,
  ChangeDetectionStrategy,
  EventEmitter,
  AfterContentInit
} from '@angular/core';
import { Observable, fromEvent } from 'rxjs';
import { debounceTime } from 'rxjs/operators';
import * as _ from 'lodash';

interface CellType {
  row: any;
  col: string;
  rowIndex: number;
  columnIndex: number;
}

export interface ColumnType {
  field?: string;
  header?: string;
  width?: number;
  minWidth?: number;
  formatValue?: (tmp: CellType) => string;
  cellStyle?: (tmp: CellType) => Record<string, string>;
  cellClass?: (tmp: CellType) => string;
  slots?: boolean;
  onClick?: (row: any, rowIndex: number) => void;
  sortable?: boolean;
  fixed?: boolean;
  tdStyle?: (column: ColumnType) => any;
  rowspan?: number;
  colspan?: number;
  depth?: number;
  children?: ColumnType[]
}

export interface MergeCellType {
  row: number;
  col: number;
  rowspan: number;
  colspan: number;
}

export interface ConfigType {
  scrollable?: boolean;
  height?: number;
  sortMethod?: (tmp: { data: any[]; column: string; orderDirection: string }) => any[];
}

export interface PaginationConfig {
  limit: number;
  page: number;
  pageSizes: number[];
  total: number;
}

@Directive({
  selector: '[cellSlots]'
})
export class ContentDirective {
  constructor(public templateRef: TemplateRef<any>) {}
}

@Directive({
  selector: '[expandSlots]'
})
export class ExpandContentDirective {
  constructor(public templateRef: TemplateRef<any>) {}
}

@Component({
  selector: 'u-table',
  templateUrl: './table.component.html',
  styleUrls: ['./table.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class UxTableComponent implements OnInit, OnChanges, AfterViewInit, OnDestroy {
  @ViewChild('mainRef') mainRef: ElementRef | undefined;
  @ViewChild('headerRef') headerRef: ElementRef | undefined;
  @ViewChild('bodyRef') bodyRef: ElementRef | undefined;
  @ContentChild(ContentDirective) cellSlots!: ContentDirective;
  @ContentChild(ExpandContentDirective) expandSlots!: ExpandContentDirective;

  @Input() columns: ColumnType[] = [];
  @Input() data: any[] = [];
  @Input() mergeCells: MergeCellType[] = [];
  @Input() expandRowIds: number[] = [];
  @Input() config: ConfigType = {
    scrollable: false
    // scrollable: true,
    // height: 500
  };
  @Input() pagination: false | PaginationConfig = false;
  @Output() onPageChange = new EventEmitter<{rows: string, page: number}>();


  _data: any[] = [];
  _columns: ColumnType[] = [];

  public headerColumns: Array<ColumnType[]> = [];
  public bodyColumns: ColumnType[] = [];

  public cancelScrollListener: Function | undefined;
  public onScreenChange: ((this: HTMLElement, ev: UIEvent) => any) | undefined;

  public resize$: Observable<any> | undefined;

  public cellDefaultWidth = 80;

  public minCellWidth = 80;

  get scrollBarWidth() {
    return this.config.scrollable ? 17 + 2 : 2;
  }

  public orderKey = '';
  public orderDirection = 'desc';

  public shouldNotRenderCells: Array<{ row: number; col: number }> = [];

  ngOnChanges(changes: SimpleChanges) {
    if (changes['columns'] || changes['mergeCells']) {
      this.calcShouldNotRenderCells();
      this.calcCellDefaultWidth();
      this.handleFixedColumns(this.columns);
      this.handleFormatValue(this.columns);

      this.headerColumns = this.handleFlexibleColumns(this.columns);
      this.bodyColumns = this.handleBodyColumns(this.columns);
    }

    if (changes['data']) {
      console.log("change data--", changes);
      const copyData = this.buildSelfData();
      console.log("copyData--", copyData);
      this._data = copyData;
      this.resetOrder();
      this.doResize();
    }
  }

  ngAfterViewInit() {
    if (this.mainRef) {
      this.calcCellDefaultWidth();
    }

    // if (this.config.scrollable) {
    // }
    this.cancelScrollListener = this.initWhenScrollable();

    this.resize$ = fromEvent(window, 'resize').pipe(debounceTime(300));
    this.resize$.subscribe(() => {
      this.calcCellDefaultWidth();
      this.forceUpdate();
    });
  }

  ngOnDestroy() {
    if (this.cancelScrollListener) {
      this.cancelScrollListener();
    }
  }

  buildSelfData(data?: any[]) {
    const copyData = _.cloneDeep(data || this.data || []);
    copyData.forEach((item, index) => {
      item.rowId = index;
    });
    return copyData;
  }

  resetOrder() {
    this.orderDirection = "";
    this.orderKey = "";
  }

  doResize() {
    setTimeout(function() {
      if (document.createEvent) {
        const event = document.createEvent('HTMLEvents');
        event.initEvent('resize', true, true);
        window.dispatchEvent(event);
      }
    }, 100);
  }

  forceUpdate() {
    this.cd.markForCheck();
    this.cd.detectChanges();
  }

  initWhenScrollable() {
    const that = this;
    const onBodyRefScroll = function(e: any) {
      that.headerRef!.nativeElement.scrollLeft = e.target!.scrollLeft;
    };
    this.bodyRef!.nativeElement.addEventListener('scroll', onBodyRefScroll);
    if (this.config.height) {
      this.bodyRef!.nativeElement.style.maxHeight = this.config.height + 'px';
    }
    return () => {
      this.bodyRef!.nativeElement.removeEventListener('scroll', onBodyRefScroll);
    };
  }

  calcCellDefaultWidth() {
    if (this.columns.every(item => item.width !== undefined)) {
      return;
    }

    if (!this.mainRef) {
      return;
    }

    const el = this.mainRef!.nativeElement;
    const width = el.getBoundingClientRect().width;

    if (width <= this.minCellWidth) {
      return;
    }

    const scrollBarWidth = this.scrollBarWidth;
    const specificWidth = this.columns
      .filter(col => col.width !== undefined)
      .reduce((pre, cur) => pre + cur.width!, 0);

    const colNums = this.columns.filter(col => col.width === undefined).length;
    // debugger;

    let resultWidth = (width - scrollBarWidth - specificWidth) / colNums;

    if (resultWidth < this.minCellWidth) {
      resultWidth = this.minCellWidth;
    }

    this.cellDefaultWidth = resultWidth;

    // console.log('calc--', this.cellDefaultWidth);
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

  onCellClick(cell: { row: any; column: ColumnType; rowIndex: number; columnIndex: number }) {
    if (cell.column.onClick) {
      cell.column.onClick(cell.row, cell.rowIndex);
    }
  }

  isFalsy(target: any) {
    const arr = [undefined, null, NaN];

    return arr.some(item => Object.is(item, target));
  }

  handleFormatValue(columns: ColumnType[]) {
    const ctx = this;
    //  娣诲姞榛樿鍊?--

    const handler = (list: ColumnType[]) => {
      list.forEach(col => {
        if (col.children) {
          handler(col.children)
        }

        if (col.formatValue) {
          const _formatValue = col.formatValue;

          col.formatValue = function(cell) {

            let value = _formatValue(cell);

            if (ctx.isFalsy(value)) {
              return "-"
            }

            return value;
          }
        } else {
          col.formatValue = function({row, col}) {
            if (ctx.isFalsy(row[col])) {
              return "-"
            }
            return row[col];
          }
        }
      })
    }

    handler(columns);
  }

  //  =================  鍐荤粨鍒?start ==================
  handleFixedColumns(columns: ColumnType[]) {
    const hasFixedColumns = columns.findIndex(col => col.fixed === true) !== -1;
    if (!hasFixedColumns) return;

    const fixedColumns = columns.filter(col => col.fixed === true);

    let fixedLeft = 0;
    fixedColumns.forEach(col => {
      let left = fixedLeft;

      const fixedStyle = {
        position: "sticky",
        left: left + "px",
        "z-index": 2
      }

      if (col.tdStyle) {
        const _cellStyle = col.tdStyle;
        col.tdStyle = function (column) {

          const tmpStyle = _cellStyle(column);
          return {
            ...tmpStyle,
            ...fixedStyle
          }
        }
      } else {
        col.tdStyle = function( column) {
          return {
            ...fixedStyle
          }
        }
      }

      fixedLeft += col.width || this.cellDefaultWidth;
    })
  }
  //  =================  鍐荤粨鍒?end ==================



  //  =================  澶勭悊澶嶅悎琛ㄥごstart ===================

  handleFlexibleColumns(columns: ColumnType[]) {

    const _columns = _.cloneDeep(columns);

    const getColSpan = (list: ColumnType[]) => {
      let num = 0;
      list.forEach((item) => {
        let colspan = 0;
        if (item.children && item.children.length) {
          colspan = getColSpan(item.children);
        }
        colspan && (item.colspan = colspan);
        num += colspan || 1;
      });
      return num;
    };
    const calcRowSpan = (list: ColumnType[], maxRowspan: number) => {
      list.forEach((item) => {
        if (item.children && item.children.length) {
          calcRowSpan(item.children, maxRowspan - 1);
        } else {
          item.rowspan = maxRowspan;
        }
      });
    };
    const getRowspan = (list: ColumnType[]) => {
      let num = 0;
      const noChildItems: ColumnType[] = [];
      const hasChildItems: ColumnType[] = [];
      list.forEach((item) => {
        if (item.children && item.children.length) {
          item.depth = getRowspan(item.children) + 1;
          num = Math.max(num, item.depth);
          hasChildItems.push(item);
        } else {
          item.depth = 0;
          noChildItems.push(item);
        }
      });
      noChildItems.forEach((item) => {
        if (num !== 0) {
          item.rowspan = num + 1;
        }
      });
      const lessDepthItems = hasChildItems.filter((item) => item.depth! < num);
      calcRowSpan(lessDepthItems, num + 1);
      return num;
    };
    getColSpan(_columns);
    getRowspan(_columns);
    const arrFlattened: Array<ColumnType[]> = [];
    const flattenArr = (list: ColumnType[], index = 0) => {
      list.forEach((item) => {
        arrFlattened[index] = arrFlattened[index] || [];
        arrFlattened[index].push({
          ... _.omit(item, ["children"]),
          rowspan: item.rowspan || 1,
          colspan: item.colspan || 1,
        });
        flattenArr(item.children || [], index + 1);
      });
    };
    flattenArr(_columns);
    console.log(arrFlattened);
    return arrFlattened;
  }

  handleBodyColumns(columns: ColumnType[]) {
    const _columns = _.cloneDeep(columns);

    let result: any[] = [];

    const findField = (list: ColumnType[]) => {
      list.forEach(col => {
        if (col.children) {
          findField(col.children);
        }

        if (col.field) {
          result.push(col);
        }
      })
    }

    findField(_columns);

    return result;
  }

  //  ================= 澶勭悊澶嶅悎琛ㄥごend ===================




  //  =================  琛屽睍寮€ start ==================
  shouldRenderCell(rowIndex: number, colIndex: number) {
    if (!this.mergeCells) {
      return true;
    }

    return !this.shouldNotRenderCells.some(({ row, col }) => row === rowIndex && col === colIndex);
  }

  shouldRenderExpandRow(rowId: number) {
    return this.expandRowIds.indexOf(rowId) !== -1;
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
  //  =================  琛屽睍寮€ end ==================

  //  =================  鎺掑簭 start ==================
  handleSort(column: string, direction: string) {
    if (column === this.orderKey && direction === this.orderDirection) {
      this.orderKey = '';
      this.orderDirection = '';
      this._data = this.buildSelfData(this.data);
      return;
    }

    this.orderKey = column;
    this.orderDirection = direction;

    let data: any[] = [];
    if (this.config.sortMethod) {
      const ctx = this;
      data = this.config.sortMethod({
        data: ctx.data,
        column,
        orderDirection: direction
      });
    } else {
      data = this.defaultSort(column, direction);
    }

    this._data = this.buildSelfData(data);
  }

  defaultSort(orderKey: string, orderDirection: string = '') {
    const copyData = _.cloneDeep(this._data);

    copyData.sort((a, b) => {
      const prev = a[orderKey];
      const next = b[orderKey];
      if (typeof prev === 'string' && typeof next === 'string') {
        if (orderDirection === 'desc') {
          return next.localeCompare(prev);
        }
        if (orderDirection === 'asc') {
          return prev.localeCompare(next);
        }
        return 0;
      } else if (typeof prev === 'number' && typeof next === 'number') {
        if (orderDirection === 'desc') {
          return next - prev;
        }
        if (orderDirection === 'asc') {
          return prev - next;
        }
        return 0;
      }
      return 0;
    });

    return copyData;
  }

  constructor(public cd: ChangeDetectorRef) {}


  handlePageChange(...args: any[]) {
    if (this.onPageChange) {
      this.onPageChange.emit(...args)
    }
  }


  ngOnInit(): void {}
}
