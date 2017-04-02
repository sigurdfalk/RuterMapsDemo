import { WorkshopXYToLatLon, WorkshopLatLonToXY } from './geoutils'

export function calculateMinMaxUrl(latitude, longitude, latitudeDelta, longitudeDelta){
    minXY = WorkshopLatLonToXY(latitude - latitudeDelta, longitude - longitudeDelta)
    maxXY = WorkshopLatLonToXY(latitude + latitudeDelta, longitude + longitudeDelta)

    return `https://reisapi.ruter.no/Place/GetStopsByArea?xmin=${minXY.x}&xmax=${maxXY.x}&ymin=${minXY.y}&ymax=${maxXY.y}`
}
