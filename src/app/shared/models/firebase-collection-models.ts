export class Place {
  placeID: number;
  name: string;
  text: string;
  comment: string;
  latitude: number;
  longitude: number;
  zoom: number;
  images: PlaceImages[];

  constructor() {
    this.name = "";
    this.text = "";
    this.latitude = 0;
    this.longitude = 0;
    this.zoom = 12;
  }

}

export class PlaceImages {
  placeImagesID: number;
  name: string = "";
  imagePath: string = "";
  fileName: string = "";
}

export class Book {
  bookID: number;
  name: string;
  autor: string;
  text: string;

  constructor() {
    this.name = "";
    this.autor = "";
    this.text = "";
  }
}

export class BookImages {
  bookImagesID: number;
  name: string = "";
  imagePath: string = "";
  fileName: string = "";
}

export interface ServerResponse {
  ID: number;
  Error: string;
  Message: string;
}

export class ImagesRequest {
  ParentID: number;
  ParentName: string;
  ParentType:string;
  Files: any[];
  constructor(){

  }
}
