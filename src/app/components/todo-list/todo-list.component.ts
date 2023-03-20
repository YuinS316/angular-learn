import { Component, OnInit, SimpleChanges } from '@angular/core';
import { Todo } from './Todo';
import { StorageService } from './../../services/storage.service';
import { filter, map } from 'rxjs/operators';

@Component({
  selector: 'app-todo-list',
  templateUrl: './todo-list.component.html',
  styleUrls: ['./todo-list.component.sass'],
})
export class TodoListComponent implements OnInit {
  constructor(public storage: StorageService) {
    const ob = this.storage.getRxjsData();
    ob.pipe(
      filter((value) => value % 2 === 0),
      map((value) => {
        return value + '!';
      })
    ).subscribe((data) => {
      console.log('data---', data);
    });
  }

  todoList: Todo[] = [];

  get renderTodoList() {
    return this.renderType === ''
      ? this.todoList
      : this.todoList.filter((i) => i.status === +this.renderType);
  }

  newToDoName: string = '';

  renderType: string = '';

  ngOnInit() {
    //  组件和指令初始化完成， 并不是真正的dom加载完成

    this.todoList = [
      { id: 0, name: 'aaaa', status: 1 },
      { id: 1, name: 'bbbb', status: 1 },
      { id: 2, name: 'cccc', status: -1 },
      { id: 3, name: 'dddd', status: 0 },
      { id: 4, name: 'eeee', status: 0 },
    ];
  }

  handleSelectChange(e: Event) {
    // console.log('change--', e);
    this.renderType = (e.target! as HTMLSelectElement).value;
  }

  handleChangeTodo(item: { id: number; newName: string }) {
    const position = this.todoList.findIndex((i) => i.id === item.id);
    this.todoList[position].name = item.newName;
  }

  handleDeleteTodo(id: number) {
    const position = this.todoList.findIndex((i) => i.id === id);
    this.todoList.splice(position, 1);
  }

  handleAddTodo() {
    this.todoList.push({
      id: this.todoList.length,
      name: this.newToDoName,
      status: 0,
    });

    this.newToDoName = '';
  }
}
