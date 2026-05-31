import mapboxgl from "mapbox-gl"
import type { RouteInfo, RouteStep, UserProfile } from "./types"
import { MOCK_TASKER } from "./types"

const DIRECTION_API = "https://api.mapbox.com/directions/v5/mapbox/driving"

export function haversineDistance(a: [number, number], b: [number, number]): number {
  const R = 6371
  const dLat = ((b[1] - a[1]) * Math.PI) / 180
  const dLng = ((b[0] - a[0]) * Math.PI) / 180
  const lat1 = (a[1] * Math.PI) / 180
  const lat2 = (b[1] * Math.PI) / 180
  const h =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(lat1) * Math.cos(lat2) * Math.sin(dLng / 2) ** 2
  return R * 2 * Math.atan2(Math.sqrt(h), Math.sqrt(1 - h))
}

export function getDirection(from: [number, number], to: [number, number]): string {
  const dLng = to[0] - from[0]
  const dLat = to[1] - from[1]
  const angle = (Math.atan2(dLng, dLat) * 180) / Math.PI
  const dirs = ["N", "NE", "E", "SE", "S", "SW", "W", "NW"]
  return dirs[Math.round(angle / 45) % 8]
}

export function formatDistance(km: number): string {
  return km >= 1 ? `${km.toFixed(1)} km` : `${Math.round(km * 1000)} m`
}

export function formatDuration(minutes: number): string {
  if (minutes < 1) return "< 1 min"
  if (minutes < 60) return `${Math.round(minutes)} mins`
  const h = Math.floor(minutes / 60)
  const m = Math.round(minutes % 60)
  return m > 0 ? `${h}h ${m}m` : `${h}h`
}

function jitterCoord(coord: [number, number], offset: number): [number, number] {
  return [coord[0] + (Math.random() - 0.5) * offset, coord[1] + (Math.random() - 0.5) * offset]
}

export function generateMockPath(start: [number, number], end: [number, number], steps = 5): [number, number][] {
  const path: [number, number][] = [start]
  for (let i = 1; i <= steps; i++) {
    const t = i / (steps + 1)
    const base: [number, number] = [
      start[0] + (end[0] - start[0]) * t,
      start[1] + (end[1] - start[1]) * t,
    ]
    path.push(jitterCoord(base, 0.004))
  }
  path.push(end)
  return path
}

export function getDirectionIcon(direction: string): string {
  const map: Record<string, string> = {
    N: "fa-arrow-up",
    NE: "fa-arrow-up",
    E: "fa-arrow-right",
    SE: "fa-arrow-down",
    S: "fa-arrow-down",
    SW: "fa-arrow-down",
    W: "fa-arrow-left",
    NW: "fa-arrow-left",
  }
  return map[direction] || "fa-arrow-right"
}

export function generateMockSteps(path: [number, number][], totalDistanceKm: number): RouteStep[] {
  const segCount = path.length - 1
  const segDist = totalDistanceKm / segCount
  const steps: RouteStep[] = []

  for (let i = 0; i < segCount; i++) {
    const dir = i === 0 ? getDirection(path[i], path[i + 1]) : getDirection(path[i], path[i + 1])
    const prevDir = i > 0 ? getDirection(path[i - 1], path[i]) : dir
    const turned = dir !== prevDir

    let instruction: string
    let icon: string

    if (i === 0) {
      instruction = `Head ${dir} towards destination`
      icon = getDirectionIcon(dir)
    } else if (turned) {
      const turn = dir === "N" || dir === "NE" || dir === "NW" ? "left" : "right"
      instruction = `Turn ${turn} onto the road`
      icon = turn === "left" ? "fa-turn-left" : "fa-turn-right"
    } else {
      instruction = `Continue ${dir}`
      icon = "fa-arrow-up"
    }

    steps.push({
      instruction,
      distanceKm: Math.round(segDist * 100) / 100,
      direction: dir,
      icon,
    })
  }

  const last = steps.length - 1
  if (last >= 0) {
    steps[last].instruction = "Arrive at destination"
    steps[last].icon = "fa-location-dot"
  }

  return steps
}

export async function fetchDirections(
  start: [number, number],
  end: [number, number],
  user: UserProfile
): Promise<RouteInfo> {
  const token = mapboxgl.accessToken || process.env.NEXT_PUBLIC_MAPBOX_TOKEN || ""
  const url = `${DIRECTION_API}/${start[0]},${start[1]};${end[0]},${end[1]}?geometries=geojson&steps=true&overview=full&access_token=${token}`

  try {
    const res = await fetch(url)
    if (!res.ok) throw new Error(`Directions API returned ${res.status}`)
    const data = await res.json()

    if (!data.routes?.length) throw new Error("No routes found")

    const route = data.routes[0]
    const coords: [number, number][] = route.geometry.coordinates
    const distanceKm = route.distance / 1000
    const durationMin = route.duration / 60

    const steps: RouteStep[] = []
    for (const leg of route.legs) {
      for (const step of leg.steps) {
        const dir = step.maneuver?.direction
          ? ["N", "NE", "E", "SE", "S", "SW", "W", "NW"][Math.round(step.maneuver.direction / 45) % 8]
          : "N"
        steps.push({
          instruction: step.maneuver?.instruction || step.name || "Continue",
          distanceKm: Math.round((step.distance / 1000) * 100) / 100,
          direction: dir,
          icon: getDirectionIcon(dir),
        })
      }
    }

    return {
      tasker: MOCK_TASKER,
      user,
      path: coords,
      totalDistanceKm: Math.round(distanceKm * 10) / 10,
      estimatedMinutes: Math.round(durationMin),
      steps,
      source: "api",
    }
  } catch {
    const dist = Math.round(haversineDistance(start, end) * 10) / 10
    const duration = Math.round(dist * 3.5)
    const path = generateMockPath(start, end)
    const steps = generateMockSteps(path, dist)

    return {
      tasker: MOCK_TASKER,
      user,
      path,
      totalDistanceKm: dist,
      estimatedMinutes: duration,
      steps,
      source: "mock",
    }
  }
}
