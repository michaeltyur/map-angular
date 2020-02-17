
export class Place {
  id:string;
  name: string;
  text:string;
  latitude: number;
  longitude: number;
  zoom:number;
  constructor(name?: string,text?:string, latitude?: number, longitude?: number) {
    this.name = name;
    this.text = text ? text : "";
    this.latitude = latitude;
    this.longitude = longitude;
    this.zoom = 12;
  }
}
