export class Place {
  id: string;
  name: string;
  text: string;
  comment: string;
  latitude: number;
  longitude: number;
  zoom: number;
 // images: string[];

  constructor() {
    this.name = "";
    this.text = "";
    this.latitude = 0;
    this.longitude = 0;
    this.zoom = 12;
  }

}

export class PlaceImages {
  id: string = "";
  name: string = "";
  images: string[] = [];
}

export class Book {
  id: string;
  name: string;
  autor: string;
  text: string;
 // images: string[];
  constructor() {
    this.name = "";
    this.autor = "";
    this.text = "";
   // this.images = [];
  }
}

export class BookImages {
  id: string = "";
  name: string = "";
  images: string[] = [];
}

