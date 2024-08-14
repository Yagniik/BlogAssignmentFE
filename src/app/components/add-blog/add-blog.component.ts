import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { Blog } from 'src/app/Models/Blog';
import { BlogService } from 'src/app/services/blog.service';
import { AlertDialogComponent } from 'src/app/shard/alert-dialog/alert-dialog.component';

@Component({
  selector: 'app-add-blog',
  templateUrl: './add-blog.component.html',
  styleUrls: ['./add-blog.component.css']
})
export class AddBlogComponent implements OnInit{
  blogForm: FormGroup;
  showSuccessMessage = false;
  isEditMode = false;
  blogId: number | null = null;
  @Output() blogCreated = new EventEmitter<void>();

  constructor(
    private fb: FormBuilder,
    private blogService: BlogService,
    private dialog: MatDialog,
    private route: ActivatedRoute,
    private router: Router
  ) {
    this.blogForm = this.fb.group({
      username: ['', Validators.required],
      text: ['', Validators.required]
    });
  }

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      this.blogId = params['id'] ? +params['id'] : null;
      if (this.blogId) {
        this.isEditMode = true;
        this.loadBlog();
      } else {
        this.isEditMode = false;
      }
    });
  }

  loadBlog(): void {
    if (this.blogId) {
      this.blogService.getBlogs(0, 0,null, null,null,this.blogId).subscribe(
        (data: any) => {
          const blog = data.data;
          this.blogForm.patchValue({
            username: blog.username,
            text: blog.text
          });
        },
        error => {
          console.error('Error fetching blogs:', error);
        }
      );

    }
  }

  onSubmit(): void {
    if (this.blogForm.valid) {
      if (this.isEditMode && this.blogId) {
        const updatedBlog: Blog = {
          id: this.blogId,
          username: this.blogForm.get('username')?.value,
          dateCreated: new Date(),
          text: this.blogForm.get('text')?.value
        };
        this.blogService.createBlog(updatedBlog).subscribe(
          () => {
            this.showAlert('Success', 'Record Update successfully', true);
            this.router.navigate(['/blog-list']);
          },
          error => console.error(error)
        );
      } else {
        const newBlog: Blog = {
          id: 0,
          username: this.blogForm.get('username')?.value,
          dateCreated: new Date(),
          text: this.blogForm.get('text')?.value
        };
        this.blogService.createBlog(newBlog).subscribe(
          () => {
            this.showAlert('Success', 'Record added successfully', true);
            this.blogForm.reset();
            this.router.navigate(['/blog-list']);
          },
          error => console.error(error)
        );
      }
    }
  }

  isFieldInvalid(field: string): boolean {
    const control = this.blogForm.get(field);
    return control ? control.invalid && (control.dirty || control.touched) : false;
  }
  showAlert(title: string, message: string, confirm: boolean): void {
    this.dialog.open(AlertDialogComponent, {
      data: { title, message, confirm }
    });
  }
  goBack(): void {
    this.router.navigate(['/blog-list']);
  }
}
