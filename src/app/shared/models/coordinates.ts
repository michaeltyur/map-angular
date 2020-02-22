
export class Place {
  id: string;
  name: string;
  text: string;
  latitude: number;
  longitude: number;
  zoom: number;
  images: string[];

  constructor(name?: string, text?: string, latitude?: number, longitude?: number) {
    this.name = name;
    this.text = text ? text : "";
    this.latitude = latitude;
    this.longitude = longitude;
    this.zoom = 12;
    this.images=[]
  }

}
export class GeoPoint {
  latitude: number;
  longitude: number;
  constructor(latitude, longitude) {
    this.latitude = latitude;
    this.longitude = longitude;
  }
}
