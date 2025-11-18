import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../enviroments/enviroment';

@Injectable({
  providedIn: 'root',
})
export class FaceService {
 baseUrl=`${environment.apiUrl}/auth`;
  constructor(private http: HttpClient) {}
uploadDriverFace(userId: string, file: File) {
  const fd = new FormData();
  fd.append("DriverId", userId);
  fd.append("FaceImage", file, file.name);



  return this.http.post(
    `${this.baseUrl}/register/driver-face`,
    fd
  );
}

loginWithFace(file: File) {
  const fd = new FormData();
  fd.append('FaceImage', file);
  return this.http.post(`${this.baseUrl}/login/driver-face`, fd);
}
  
}
