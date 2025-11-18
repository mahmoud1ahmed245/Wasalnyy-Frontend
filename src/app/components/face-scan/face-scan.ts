import { Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FaceService } from '../../services/face.service';
import { AuthService } from '../../services/auth';
@Component({
  selector: 'app-face-scan',
  templateUrl: './face-scan.html',
})
export class FaceScan implements OnInit, OnDestroy {
  @ViewChild('video', { static: true }) videoRef!: ElementRef<HTMLVideoElement>;

  mode: 'register'|'login' = 'login';
  userId?: string;
  preview?: string;
  private stream?: MediaStream;

  constructor(private route: ActivatedRoute, private router: Router, private faceService: FaceService,private authService: AuthService) {}

  ngOnInit() {
    const path = this.route.snapshot.routeConfig?.path || '';
    if (path.startsWith('face-scan/register')) {
      this.mode = 'register';
      this.userId = this.route.snapshot.paramMap.get('userId') || undefined;
    } else {
      this.mode = 'login';
    }
    this.startCamera();
  }

  async startCamera() {
    try {
      this.stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'user' } });
      this.videoRef.nativeElement.srcObject = this.stream;
    } catch (err) {
      console.error('Camera error', err);
      alert('Camera access required');
    }
  }

  captureAndUpload() {
    const video = this.videoRef.nativeElement;
    const canvas = document.createElement('canvas');
    canvas.width = video.videoWidth || 640;
    canvas.height = video.videoHeight || 480;
    const ctx = canvas.getContext('2d')!;
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
    this.preview = canvas.toDataURL('image/jpeg', 0.9);

    canvas.toBlob(blob => {
      if (!blob) return alert('Capture failed');
      const file = new File([blob], 'capture.jpg', { type: 'image/jpeg' });

      if (this.mode === 'register') {
        this.faceService.uploadDriverFace(this.userId!, file).subscribe({
          next: (res:any) => {
            alert('Face registered');
           // this.router.navigate(['/driver-dashboard']); // or wherever
          },
          error: (err:any) => { console.error(err); alert('Face registration failed'); }
        });
      } else {
        this.faceService.loginWithFace(file).subscribe({
          next: (res: any) => {
            if ( res.token) {
              this.authService.saveToken(res.token);
              this.router.navigate(['/driver-dashboard']); // or wherever
              alert('Login successful');
            } else {
              alert('No matching face found');
            }
          },
          error: (err:any) => { console.error(err); alert('Face login failed'); }
        });
      }
    }, 'image/jpeg', 0.9);
  }

  ngOnDestroy() {
    this.stream?.getTracks().forEach(t => t.stop());
  }
}
