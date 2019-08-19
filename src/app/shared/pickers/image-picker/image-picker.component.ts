import { Component, OnInit, Output, EventEmitter, Input } from '@angular/core';
import { Plugins, Capacitor, CameraSource, CameraResultType } from '@capacitor/core';
import { Platform } from '@ionic/angular';
@Component({
  selector: 'app-image-picker',
  templateUrl: './image-picker.component.html',
  styleUrls: ['./image-picker.component.scss'],
})
export class ImagePickerComponent implements OnInit {
  selectedImage: string;
  usePicker = false;
  @Output() imagePick = new EventEmitter<string>();
  @Input() showPreview = false;
  constructor(private platform: Platform) {
  }

  ngOnInit() {
    if ((this.platform.is('mobile') && !this.platform.is('hybrid')) || this.platform.is('desktop')) {
      this.usePicker = true;
      // npm install --save @ionic/pwa-elements
      // import in main.ts
    }
  }

  onPickImage() {
    if (!Capacitor.isPluginAvailable('Camera')) {
      return;
    }
    Plugins.Camera.getPhoto({
      quality: 50,
      source: CameraSource.Prompt,
      correctOrientation: true,
      width: 320,
      height: 200,
      resultType: CameraResultType.Base64
    }).then(image => {
      this.selectedImage = 'data:image/jpeg;base64,' + image.base64String;
      this.imagePick.emit(image.base64String);
    }).catch(e => {
      console.log(e);
    });
  }

  // onFileChosen(event: Event) {
  //   const pickedFile = (event.target as HTMLInputElement).files[0];
  //   if (!pickedFile) {
  //     return;
  //   }
  //   const fr = new FileReader();
  //   fr.onload = () => {
  //     const dataUrl = fr.result.toString();
  //     this.selectedImage = dataUrl;
  //     this.imagePick.emit(pickedFile);
  //   };
  //   fr.readAsDataURL(pickedFile);
  // }

}
