import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { UserService } from '../user.service';
import { User } from '../user.model';

@Component({
  selector: 'app-user-form',
  templateUrl: './user-form.component.html',
  styleUrls: ['./user-form.component.css']
})
export class UserFormComponent implements OnInit {
  userForm: FormGroup;
  userId: string | null = null; // Define la propiedad userId

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private userService: UserService
  ) {
    this.userForm = this.fb.group({
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required],
      username: ['', Validators.required]
    });
  }

  ngOnInit(): void {
    this.userId = this.route.snapshot.paramMap.get('id'); // Asegúrate de que userId sea string o null
    if (this.userId) {
      this.userService.getUser(this.userId).subscribe(data => {
        this.userForm.patchValue(data);
      });
    }
  }

  onSubmit(): void {
    console.log("es clicki",this.userForm.valid)
    if (this.userForm.valid) {
      const user: User = this.userForm.value;
      if (this.userId) {
        this.userService.updateUser(this.userId, user).subscribe(() => {
          this.router.navigate(['/users']);
        });
      } else {
        this.userService.createUser(user).subscribe(() => {
          this.router.navigate(['/users']);
        });
      }
    }
  }
}
