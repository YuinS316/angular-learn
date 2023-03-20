import {
  AfterViewInit,
  Component,
  ElementRef,
  EventEmitter,
  Input,
  OnInit,
  Output,
  SimpleChanges,
  ViewChild,
} from '@angular/core';
import { onClickOutside } from 'src/utils/dom';

@Component({
  selector: 'app-todo-list-item',
  templateUrl: './todo-list-item.component.html',
  styleUrls: ['./todo-list-item.component.sass'],
})
export class TodoListItemComponent implements AfterViewInit {
  @Input() name?: string;
  @Input() id?: number;
  @Input() seq?: number;
  @Input() status?: number;
  @Output() onDeleteItem = new EventEmitter<number>();
  @Output() onChangeItem = new EventEmitter<{ id: number; newName: string }>();

  @ViewChild('editRef')
  inputEl!: ElementRef<HTMLInputElement>;

  isEdit: boolean = false;
  newEditName: string = '';

  handleOpenEdit(e: Event) {
    console.log('dbclick!');

    e.stopPropagation();
    e.preventDefault();

    this.isEdit = true;
    this.newEditName = this.name ?? '';
    setTimeout(() => {
      this.inputEl.nativeElement.focus();
    }, 300);
  }

  handleEditTask() {
    if (!this.newEditName) return;
    this.onChangeItem.emit({
      id: this.id!,
      newName: this.newEditName,
    });
    this.isEdit = false;
  }

  ngOnChanges(changes: SimpleChanges) {}

  public clickOutsideFn!: Function;
  ngAfterViewInit(): void {
    // this.inputEl.nativeElement
    this.clickOutsideFn = onClickOutside(this.inputEl.nativeElement, () => {
      this.isEdit = false;
    });
  }

  ngOnDestroy() {
    this.clickOutsideFn();
  }

  onDelete() {
    this.onDeleteItem.emit(this.id);
  }

  ngOnInit() {}
}
