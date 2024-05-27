import { Component , OnInit} from '@angular/core';

import { ActivatedRoute, Router } from '@angular/router';
import { UserService } from '../../services/user.service';

@Component({
  selector: 'app-user-edit',
  templateUrl: './user-edit.component.html',
  styleUrl: './user-edit.component.css'
})
export class UserEditComponent  implements OnInit {
  user = { name: '', email: '', password: '' };
  id: string = '';

  constructor(private route: ActivatedRoute, private userService: UserService, private router: Router) { }

  ngOnInit(): void {
    this.id = this.route.snapshot.paramMap.get('id')!;
    this.userService.getUser(this.id).subscribe((data: any) => {
      this.user = data;
    });
  }

  updateUser(): void {
    this.userService.updateUser(this.id, this.user).subscribe(() => {
      this.router.navigate(['/users']);
    });
  }
}
