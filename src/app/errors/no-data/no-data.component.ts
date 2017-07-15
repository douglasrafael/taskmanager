import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'no-data',
  styleUrls: ['./no-data.component.scss'],
  template: `
    <div class="no-data-message">
      <h4 class="flow-text">{{ message?.title }}</h4>
      <p>{{ message?.content }}</p>
    </div>
  `
})
export class NoDataComponent implements OnInit {

  @Input() message: any;

  constructor() { }

  ngOnInit() {
  }
}