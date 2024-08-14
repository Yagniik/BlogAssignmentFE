import { Injectable } from '@angular/core';
import { map, Observable, Subject, tap } from 'rxjs';
import { environment } from 'src/environments/environment.prod';
import { HttpClient } from '@angular/common/http';
import { Blog, GenericResponse, PaginatedResult } from '../Models/Blog';

@Injectable({
  providedIn: 'root'
})
export class BlogService {
  private apiUrl = `${environment.apiUrl}/BlogMaster`;

          // https://localhost:7029/api/BlogMaster%20+%20'/DeleteBlog'/1
          // https://localhost:7029/api/BlogMaster/DeleteBlog?id=1

  private refreshNeeded$ = new Subject<void>();

  constructor(private http: HttpClient) {}

  get refreshNeeded() {
    return this.refreshNeeded$;
  }

  getBlogs(pageNumber: number = 1, pageSize: number = 5, searchTerm :  any, sortBy : any,direction : any,id?: number): Observable<GenericResponse<PaginatedResult<Blog[]>> | GenericResponse<Blog>> {
    const params = {
      pageNumber:pageNumber ,
      pageSize:pageSize,
      searchTerm: searchTerm ?? '',
      sortBy: sortBy ?? 'date',
      direction: direction ?? 'asc',
      id: id ?? null
    };

    return this.http.post<GenericResponse<PaginatedResult<Blog[]>> | GenericResponse<Blog>>(this.apiUrl+ '/GetBlogs', params );
  }


  createBlog(blog: Blog): Observable<Blog> {
    return this.http.post<GenericResponse<Blog>>(this.apiUrl + '/AddOrUpdateBlog', blog).pipe(
      map(response => response.data),
      tap(() => {
        this.refreshNeeded$.next();
      })
    );
  }

  deleteBlog(id: number): Observable<void> {
    return this.http.delete<GenericResponse<void>>(`${this.apiUrl}/DeleteBlog/?id=${id}`).pipe(
      map(response => response.data),
      tap(() => {
        this.refreshNeeded$.next();
      })
    );
  }
}
