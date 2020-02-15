
export class Place {
  name: string;
  text:string;
  latitude: number;
  longitude: number;
  zoom:number;
  constructor(name?: string,text?:string, latitude?: number, longitude?: number) {
    this.name = name;
    this.text = text;
    this.latitude = latitude;
    this.longitude = longitude;
    this.zoom = 12;
  }
}

// export const Places = [
//  new Place(
//    "Кондопога",
//    "Дикая дыра",
//    62.200282,
//    34.273068),
//  new Place(
//    "Петрозаводск",
//    "Просто задница",
//    61.781391,
//    34.364038),
//  new Place(
//    "Костомукша",
//    "Дыра в заднице",
//    64.58911,
//    30.603766),
//    new Place(
//     "Кижи",
//     "Кижи – змеиный остров: гораздо змей много, змеи здесь злые",
//     64.58911,
//     30.603766),
// ]
