import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Todo } from 'src/app/models/todo.model';
import { map, tap } from 'rxjs/operators';
@Injectable({
  providedIn: 'root',
})
export class TodoService {
  private todosSubject$ = new BehaviorSubject<Todo[]>([]);
  todos$ = this.todosSubject$.asObservable().pipe(tap(console.log));
  constructor(private http: HttpClient) {
    this.getTodos().subscribe();
  }

  getTodos(): Observable<Todo[]> {
    return this.http.get<Todo[]>('todos').pipe(
      map((todos) => todos.filter((todo) => !todo.deleted)),
      tap((todos) => this.todosSubject$.next(todos))
    );
  }

  getCurrentTodos(): Todo[] {
    return this.todosSubject$.getValue();
  }

  addTodo(todo: Todo): Observable<Todo> {
    return this.http
      .post<Todo>('todos', todo)
      .pipe(
        tap((todoRes) =>
          this.todosSubject$.next([...this.getCurrentTodos(), todoRes])
        )
      );
  }

  editTodo(editTodo: Todo): Observable<Todo> {
    return this.http.put<Todo>(`todos/${editTodo.id}`, editTodo).pipe(
      tap((todoRes) => {
        const todoIndex = this.getCurrentTodos().findIndex(
          (todo) => Number(todo.id) === todoRes.id
        );
        const newTodos = this.getCurrentTodos();
        newTodos[todoIndex] = todoRes;
        this.todosSubject$.next(newTodos);
      })
    );
  }
}
