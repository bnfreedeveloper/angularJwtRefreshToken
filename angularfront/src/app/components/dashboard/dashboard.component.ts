import { Component, OnInit } from '@angular/core';
import { TokenManagementService } from 'src/app/services/tokenManagement.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {

  username!: string | null;
  constructor(private TokenManagement: TokenManagementService) { }

  ngOnInit(): void {
    this.username = this.TokenManagement.getUserName()
  }

}
