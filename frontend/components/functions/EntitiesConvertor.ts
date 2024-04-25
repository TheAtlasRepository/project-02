import { CoordinateEntity } from "../types/BackendResponse";
import { MapMarker } from "../types/MapMarker";

/**
 * Converts list of CoordinateEntity to list of MapMarkers with extra values, 
 * and their own number id,
 * 
 * @param entities Array of CoordinateEntities
 * @param existingMarkers List of existing markers
 * @returns Array of MapMarkers
 */
export const entitiesConvertor = (entities: CoordinateEntity[], existingMarkers?: MapMarker[]): MapMarker[] => {
  let markers: MapMarker[] = [];
  let x = 0;

  if (existingMarkers != undefined && existingMarkers.length > 0) {
    x = existingMarkers.length;
    markers = existingMarkers;
  }

  entities.forEach(ent => {
    //If marker displayname does not already exist, add it
    if (markers.findIndex(mark => mark.display_name == ent.display_name) == -1) {
      markers.push({
        display_name: ent.display_name,
        latitude: ent.lat,
        longitude: ent.lon,
        numId: x,
        img_url: ent.img_url,
        toggled: true
      })
      x++;
    }
  })

  return markers
}