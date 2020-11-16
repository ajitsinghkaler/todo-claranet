import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { map, switchMap, tap } from 'rxjs/operators';
import { Todo } from 'src/app/models/todo.model';
import { TodoService } from 'src/app/services/todo/todo.service';

@Component({
  selector: 'app-todo-create',
  templateUrl: './todo-create.component.html',
  styleUrls: ['./todo-create.component.scss'],
})
export class TodoCreateComponent implements OnInit {
  todoForm: FormGroup = new FormGroup({
    title: new FormControl('', [Validators.required]),
    owner: new FormControl('', [Validators.required]),
    body: new FormControl(''),
    media: new FormControl(''),
    status: new FormControl('todo'),
    created: new FormControl(new Date().toISOString()),
    edited: new FormControl(''),
    deleted: new FormControl(false),
  });
  message = '';
  edit = false;
  todo$ = this.todoService.todos$.pipe(
    map((todos: Todo[]) => {
      return todos.find((todo) => (todo.id === Number(this.route.snapshot.params.id)));
    }),
    tap((todo) => {
      if (todo) {
        this.edit = true;
        this.todoForm.get('title')?.setValue(todo.title);
        this.todoForm.get('owner')?.setValue(todo.owner);
        this.todoForm.get('body')?.setValue(todo.body);
        this.todoForm.get('media')?.setValue(todo.media);
        this.todoForm.get('status')?.setValue(todo.status);
        this.todoForm.get('created')?.setValue(todo.created);
      }
    })
  );

  constructor(
    private todoService: TodoService,
    private route: ActivatedRoute
  ) {}
  ngOnInit(): void {
    // this.todo$ = this.todoService.todos$.pipe(
    //   map((todos: Todo[]) =>
    //     todos.find((todo) => (todo.id = this.route.snapshot.params.id))
    //   ),
    //   tap((todo) => {
    //     this.todoForm.get()
    //   })
    // );
  }
  addUpdateTodo(): void {
    if (this.edit) {
      this.todoService
        .editTodo({
          id: Number(this.route.snapshot.params.id) ,
          ...this.todoForm.value,
        })
        .subscribe();
    } else {
      this.todoService.addTodo(this.todoForm.value).subscribe();
    }
  }
}
