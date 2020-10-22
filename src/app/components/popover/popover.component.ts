import { Component, OnInit } from '@angular/core';
import { PopoverController } from '@ionic/angular';

@Component({
  selector: 'app-popover',
  templateUrl: './popover.component.html',
  styleUrls: ['./popover.component.scss'],
})
export class PopoverComponent implements OnInit {
  theme: string;
  themeText: string;

  constructor(private popover: PopoverController) {}

  ngOnInit() {
    this.theme = localStorage.getItem('theme') || 'light';
    this.themeText = this.theme === 'light' ? '夜间模式' : '白天模式';
  }

  switchTheme(theme: string) {
    this.theme = theme === 'light' ? 'dark' : 'light';
    if (this.theme === 'light') {
      document.body.classList.remove('dark');
    } else {
      document.body.classList.add('dark');
    }
    localStorage.setItem('theme', this.theme);
    this.popover.dismiss();
  }
}
