
export class Place {
  name: string;
  latitude: number;
  longitude: number;
  text:string;
  constructor(name: string,text:string, latitude: number, longitude: number) {
    this.name = name;
    this.text = text;
    this.latitude = latitude;
    this.longitude = longitude;
  }
}

export const Places = [
 new Place(
   "Кондопога",
   "Дикая дыра",
   62.200282,
   34.273068),
 new Place(
   "Петрозаводск",
   "Просто задница",
   61.781391,
   34.364038),
 new Place(
   "Костомукша",
   "Дыра в заднице",
   64.58911,
   30.603766),
]
