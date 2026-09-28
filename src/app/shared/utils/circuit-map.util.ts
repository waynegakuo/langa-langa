import { Lap, Location } from '../../core/models/openf1.models';

export interface CircuitPoint {
  x: number;
  y: number;
}

export interface CircuitMapData {
  path: string;
  viewBox: string;
  startFinish: CircuitPoint;
  width: number;
  height: number;
}

const VIEW_WIDTH = 420;
const VIEW_HEIGHT = 300;
const PADDING = 28;
const MAX_JUMP = 600;
const MIN_POINT_DIST = 8;

export function getReferenceLap(laps: Lap[]): Lap | null {
  const clean = laps.filter(
    (lap) => !lap.is_pit_out_lap && lap.lap_duration != null && lap.date_start
  );
  if (!clean.length) return null;

  const index = Math.min(Math.max(Math.floor(clean.length * 0.4), 0), clean.length - 1);
  return clean[index];
}

export function lapDateRange(lap: Lap): { from: string; to: string } {
  const startMs = new Date(lap.date_start).getTime();
  const durationMs = (lap.lap_duration ?? 90) * 1000 + 800;
  return {
    from: lap.date_start,
    to: new Date(startMs + durationMs).toISOString(),
  };
}

export function filterLocationPoints(locations: Location[]): CircuitPoint[] {
  const points: CircuitPoint[] = [];

  for (const loc of locations) {
    if (loc.x === 0 && loc.y === 0) continue;

    const point = { x: loc.x, y: loc.y };
    const previous = points.at(-1);

    if (previous) {
      const distance = Math.hypot(point.x - previous.x, point.y - previous.y);
      if (distance > MAX_JUMP) break;
      if (distance < MIN_POINT_DIST) continue;
    }

    points.push(point);
  }

  return points;
}

export function buildCircuitMap(locations: Location[]): CircuitMapData | null {
  const rawPoints = filterLocationPoints(locations);
  if (rawPoints.length < 20) return null;

  const normalized = normalizePoints(rawPoints, VIEW_WIDTH, VIEW_HEIGHT, PADDING);
  const path = normalized
    .map((point, index) => `${index === 0 ? 'M' : 'L'} ${point.x.toFixed(1)} ${point.y.toFixed(1)}`)
    .join(' ');

  return {
    path,
    viewBox: `0 0 ${VIEW_WIDTH} ${VIEW_HEIGHT}`,
    startFinish: normalized[0],
    width: VIEW_WIDTH,
    height: VIEW_HEIGHT,
  };
}

function normalizePoints(
  points: CircuitPoint[],
  width: number,
  height: number,
  padding: number
): CircuitPoint[] {
  const xs = points.map((p) => p.x);
  const ys = points.map((p) => p.y);
  const minX = Math.min(...xs);
  const maxX = Math.max(...xs);
  const minY = Math.min(...ys);
  const maxY = Math.max(...ys);

  const spanX = maxX - minX || 1;
  const spanY = maxY - minY || 1;
  const innerWidth = width - padding * 2;
  const innerHeight = height - padding * 2;
  const scale = Math.min(innerWidth / spanX, innerHeight / spanY);

  const offsetX = padding + (innerWidth - spanX * scale) / 2;
  const offsetY = padding + (innerHeight - spanY * scale) / 2;

  return points.map((point) => ({
    x: offsetX + (point.x - minX) * scale,
    y: height - offsetY - (point.y - minY) * scale,
  }));
}
