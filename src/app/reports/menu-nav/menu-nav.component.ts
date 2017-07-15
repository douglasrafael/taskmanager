import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'menu-nav',
  templateUrl: './menu-nav.component.html',
  styleUrls: ['./menu-nav.component.scss']
})
export class MenuNavComponent implements OnInit {

  @Input() isProductivity: boolean;
  @Output() notifyItemMenuClicked: EventEmitter<any>;

  param: any;

  constructor() {
    this.param = "monthCurrent";
    this.notifyItemMenuClicked = new EventEmitter();
  }

  ngOnInit() {
  }

  emitValue() {
    this.notifyItemMenuClicked.emit(this.param);
  }
}
