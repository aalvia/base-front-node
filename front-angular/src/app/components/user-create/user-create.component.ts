import { Component } from '@angular/core';

import { UserService } from '../../services/user.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-user-create',
  templateUrl: './user-create.component.html',
  styleUrl: './user-create.component.css'
})
export class UserCreateComponent {
  user = { name: '', email: '', password: '' };

  constructor(private userService: UserService, private router: Router) { }

  createUser(): void {
    this.userService.createUser(this.user).subscribe(() => {
      this.router.navigate(['/users']);
    });
  }
}
