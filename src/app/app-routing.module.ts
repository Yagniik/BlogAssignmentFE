import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AddBlogComponent } from './components/add-blog/add-blog.component';
import { BlogsListComponent } from './components/blogs-list/blogs-list.component';

const routes: Routes = [
  { path: 'blog-list', component: BlogsListComponent },
  { path: 'add-blog', component: AddBlogComponent },
  { path: '', redirectTo: '/blog-list', pathMatch: 'full' },
  { path: '**', redirectTo: '/blog-list' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
