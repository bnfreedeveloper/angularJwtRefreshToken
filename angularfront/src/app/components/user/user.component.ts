import { Component, OnInit } from '@angular/core';
import { ProtectAccessService } from 'src/app/services/protect-access.service';

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.css']
})
export class UserComponent implements OnInit {
  userMessage!: string;
  constructor(private protectAccess: ProtectAccessService) { }

  ngOnInit(): void {
    this.protectAccess.getData().subscribe({
      next: response => {

      },
      error: err => {
        console.log(err)
      }
    })
  }

}
