import { Component, ElementRef, ViewChild } from '@angular/core';
import { PickerColumn } from '@ionic/core';
import { PickerController, PopoverController } from '@ionic/angular';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {
  @ViewChild('player') playerRef: ElementRef<HTMLAudioElement>;
  timePickerColumns: PickerColumn[] = [{
    name: 'hours',
    options: [...Array(99).keys()].map(i => Object.assign({
      text: (i < 10 ? `0${i}` : `${i}`),
      value: i
    }))
  }, {
    name: 'minutes',
    options: [...Array(99).keys()].map(i => Object.assign({
      text: (i < 10 ? `0${i}` : `${i}`),
      value: i
    }))
  }];
  soundPickerColumns: PickerColumn[] = [{
    name: 'sound',
    options: [{
      text: 'sound-1',
      value: 'sound-1'
    }]
  }];
  timeRemain    = "等待设置";
  targetMinutes = 0;
  targetSound   = 'sound-1';
  state = '';

  constructor(private popover: PopoverController, private picker: PickerController) {
    
  }

  get player() {
    return this.playerRef.nativeElement;
  }

  async pick(type: string) {
    if (type === 'time') {
      const picker = await this.picker.create({
        columns: this.timePickerColumns,
        buttons: [
          {
            text: 'Cancel',
            role: 'cancel'
          },
          {
            text: 'Confirm',
            handler: (value) => {
              this.targetMinutes = value.hours.value * 60 + value.minutes.value
            }
          }
        ]
      });
      await picker.present();
    } else if (type === 'sound') {
      const picker = await this.picker.create({
        columns: this.soundPickerColumns,
        buttons: [
          {
            text: 'Cancel',
            role: 'cancel'
          },
          {
            text: 'Confirm',
            handler: (value) => {
              console.log(`Got Value`, value);
            }
          }
        ]
      });
      await picker.present();
    }
  }

  onClick(event) {
    this.player.play();
  }

  formatTime(minutes: number): string {
    const h = Math.floor(minutes / 60);
    const m = minutes % 60;
    const hh = h < 10 ? `0${h}` : `${h}`;
    const mm = m < 10 ? `0${m}` : `${m}`;
    return `${hh}:${mm}`;
  }
}
