import { Component, OnInit } from '@angular/core';
import { Leader } from '../shared/leader';
import { Leaders } from '../shared/leaders';
import { LeaderService } from '../services/leader.service';

@Component({
  selector: 'app-about',
  templateUrl: './about.component.html',
  styleUrls: ['./about.component.scss']
})
export class AboutComponent implements OnInit {
	leaders: Leader[];
	selectedLeader: Leader;

  constructor(private leaderservice: LeaderService) { }

  ngOnInit() {

  	this.leaders = this.leaderservice.getLeaders()
  		

  }
   onSelect(leader: Leader) {
    this.selectedLeader = leader;
  }

}