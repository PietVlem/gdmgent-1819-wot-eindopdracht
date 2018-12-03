import { Component, OnInit } from '@angular/core';
import { faLongArrowAltRight, faUser } from '@fortawesome/free-solid-svg-icons';
import { RpsService } from 'src/app/services/rps.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  /*
  Icons
  */
  faLongArrowAltRight = faLongArrowAltRight;
  faUser = faUser;

  constructor(private router: Router) { }

  ngOnInit() {
  }

  play = (nickname) => {
    localStorage.setItem('nickname', nickname);
    this.router.navigate(['/prs'])
  }

}
