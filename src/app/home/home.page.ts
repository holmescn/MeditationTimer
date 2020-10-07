import { Component } from '@angular/core';
import { PickerController, PopoverController } from '@ionic/angular';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {
  timeRemain: string = "等待设置";

  constructor(private popover: PopoverController, private picker: PickerController) {
  }

  onClick(event) {
    console.log("onClick");
  }
}
