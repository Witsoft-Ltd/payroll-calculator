import { Component, OnInit } from '@angular/core';

export interface RateItem {
  monthly: string;
  annual: string;
  rate: number;
}

const ELEMENT_DATA: RateItem[] = [
  {monthly: '0 - 24,000', annual: '0 - 288,000', rate: 10},
  {monthly: '24,001 - 40,667', annual: '288,001 - 488,000', rate: 15},
  {monthly: '40,668 - 57,333', annual: '488,001 - 688,000', rate: 20},
  {monthly: 'Above 57,333', annual: 'Above 688,000', rate: 25}
];

@Component({
  selector: 'app-rates',
  templateUrl: './rates.component.html',
  styleUrls: ['./rates.component.css']
})
export class RatesComponent implements OnInit {

  displayedColumns: string[] = ['monthly', 'annual', 'rate'];
  dataSource = ELEMENT_DATA;

  constructor() { }

  ngOnInit(): void {
  }


}
