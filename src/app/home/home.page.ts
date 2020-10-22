import { Component, ElementRef, ViewChild, OnInit } from '@angular/core';
import { PickerColumn } from '@ionic/core';
import { PickerController, PopoverController } from '@ionic/angular';
import { PopoverComponent } from '../components/popover/popover.component';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage implements OnInit {
  @ViewChild('player') playerRef: ElementRef<HTMLAudioElement>;
  timePickerColumns: PickerColumn[] = [{
    name: 'hours',
    options: [...Array(99).keys()].map(i => Object.assign({
      text: (i < 10 ? `0${i}` : `${i}`),
      value: i
    }))
  }, {
    name: 'minutes',
    options: [...Array(99).keys()].filter(i => i > 0).map(i => Object.assign({
      text: (i < 10 ? `0${i}` : `${i}`),
      value: i
    }))
  }];
  soundPickerColumns: PickerColumn[] = [{
    name: 'sound',
    options: [{
      text: '声音 01',
      value: 'sound-01.aac'
    }, {
      text: '声音 02',
      value: 'sound-02.aac'
    }, {
      text: '声音 03',
      value: 'sound-03.aac'
    }, {
      text: '声音 04',
      value: 'sound-04.aac'
    }, {
      text: '声音 05',
      value: 'sound-05.aac'
    }]
  }];
  remainText     = '等待设置';
  soundText      = '声音 01';
  durationText   = '请选择';
  buttonText     = '开始';
  buttonDisabled = true;
  totalSeconds   = 0;
  startTime      = 0;
  soundSrc       = '/assets/sounds/sound-01.aac';
  timer          = 0;
  selectedSeconds = 0;

  constructor(private popover: PopoverController, private picker: PickerController) {
    
  }

  get player() {
    return this.playerRef.nativeElement;
  }

  ngOnInit() {
    const theme = localStorage.getItem('theme');
    if (theme === 'dark') {
      document.body .classList.add('dark');
    } else {
      document.body .classList.remove('dark');
    }
    setTimeout(() => {
      this.player.addEventListener('ended', this.onEnded.bind(this));
      this.player.addEventListener('onLoadedMetadata', this.onEnded.bind(this));
    }, 100);
  }

  onEnded(event: Event) {
    if (this.startTime > 0 && Date.now() - this.startTime < this.totalSeconds * 1000) {
      this.player.play();
    } else if (this.timer) {
      window.clearInterval(this.timer);
      this.timer     = 0;
      this.startTime = 0;
      this.update(this.selectedSeconds);
    }
  }

  onLoadedMetadata(event: Event) {
    if (this.selectedSeconds > 0) {
      this.update(this.selectedSeconds);
    }
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
              const seconds = value.hours.value * 3600.0 + value.minutes.value * 60.0;
              this.selectedSeconds = seconds;
              this.update(seconds);
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
              this.soundText = value.sound.text;
              this.soundSrc = `/assets/sounds/${value.sound.value}`;
            }
          }
        ]
      });
      await picker.present();
    }
  }

  async onMenuClick(event: Event) {
    const popover = await this.popover.create({
      component: PopoverComponent,
      cssClass: 'popover-menu',
      event,
      translucent: true,
      showBackdrop: false
    });
    return await popover.present();
  }

  onBtnClick(event: Event) {
    if (this.timer) {
      window.clearInterval(this.timer);
      this.timer     = 0;
      this.startTime = 0;
      this.update(this.selectedSeconds);
      this.buttonText = '开始';
    } else {
      this.buttonText = '停止';
      this.startTime = Date.now();
      this.timer = window.setInterval(() => {
        this.remainText = this.formatRemain(Date.now());
      }, 1000);
      this.player.play();
    }
  }

  formatDuration(seconds: number): string {
    const h = Math.floor(seconds / 3600);
    const m = Math.floor(seconds % 3600 / 60);
    const s = Math.ceil(seconds % 3600 % 60);
    if (h > 0) {
      return `${h}h ${m}m`;
    } else {
      return `${m}m ${s}s`;
    }
  }

  formatRemain(now: number): string {
    const remain = Math.ceil(this.totalSeconds - Math.floor((now - this.startTime) / 1000));
    const m = Math.floor(remain / 60);
    const s = remain - m * 60;
    if (remain > 0) {
      if (m > 0) {
        return `${m}m ${s}s`;
      } else {
        return `${remain}s`;
      }  
    } else {
      return '...';
    }
  }

  update(seconds: number, now: number=0) {
    const soundDuration = this.player.duration;
    if (soundDuration >= seconds) {
      this.totalSeconds = soundDuration;
    } else {
      this.totalSeconds = Math.ceil(seconds / soundDuration) * soundDuration;
    }
    this.durationText = this.formatDuration(this.totalSeconds);
    this.remainText = this.formatRemain(now);
    this.buttonDisabled = false;
  }
}
