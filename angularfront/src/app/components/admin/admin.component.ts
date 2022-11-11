import { Component, OnInit } from '@angular/core';
import { ProtectAccessService } from 'src/app/services/protect-access.service';

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.css']
})
export class AdminComponent implements OnInit {

  adminMessage!: string;
  constructor(private protectAccess: ProtectAccessService) { }

  ngOnInit(): void {
    this.protectAccess.getDataForAdmin().subscribe({
      next: response => {
        this.adminMessage = response.message;
      },
      error: err => {
        console.log(err)
      }
    })
  }
}
