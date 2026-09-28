import { HttpClient, HttpErrorResponse, HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import {
  catchError,
  defer,
  map,
  Observable,
  of,
  retry,
  shareReplay,
  switchMap,
  tap,
  timer,
} from 'rxjs';

import { OPENF1_BASE_URL } from '../constants/f1.constants';
import {
  Driver,
  DriverChampionshipEntry,
  Lap,
  Location,
  Meeting,
  OpenF1QueryParams,
  Session,
  SessionResult,
} from '../models/openf1.models';
import { PodiumEntry } from '../../shared/models/podium.model';
import { buildPodium } from '../../shared/utils/result.util';
import { SeasonService } from './season.service';

/** OpenF1: max 30 requests/minute → ~1 request every 2.1s to stay safe. */
const REQUEST_GAP_MS = 2100;
const CACHE_TTL_MS = 20 * 60 * 1000;
const MAX_RETRIES = 5;
const MINUTE_LIMIT_BACKOFF_MS = 65_000;

interface CacheEntry<T> {
  data: T;
  expiresAt: number;
}

@Injectable({ providedIn: 'root' })
export class OpenF1ApiService {
  private readonly http = inject(HttpClient);
  private readonly season = inject(SeasonService);

  private queueTail$: Observable<unknown> = of(undefined);
  private readonly cache = new Map<string, CacheEntry<unknown>>();
  private readonly inflight = new Map<string, Observable<unknown>>();

  getSessions(params: OpenF1QueryParams = {}): Observable<Session[]> {
    const yearFilter =
      params['session_key'] != null ? {} : { year: this.season.selectedYear() };
    return this.fetchCached<Session>('sessions', { ...yearFilter, ...params });
  }

  getSession(sessionKey: number): Observable<Session | null> {
    return this.getSessions({ session_key: sessionKey }).pipe(
      map((sessions) => sessions[0] ?? null)
    );
  }

  getMeetings(params: OpenF1QueryParams = {}): Observable<Meeting[]> {
    return this.fetchCached<Meeting>('meetings', { year: this.season.selectedYear(), ...params });
  }

  getMeeting(meetingKey: number): Observable<Meeting | null> {
    return this.fetchCached<Meeting>('meetings', { meeting_key: meetingKey }).pipe(
      map((meetings) => meetings[0] ?? null)
    );
  }

  getDrivers(params: OpenF1QueryParams): Observable<Driver[]> {
    return this.fetchCached<Driver>('drivers', params);
  }

  getSessionResults(sessionKey: number): Observable<SessionResult[]> {
    return this.fetchCached<SessionResult>('session_result', { session_key: sessionKey });
  }

  getLocation(
    sessionKey: number,
    driverNumber: number,
    dateRange?: { from: string; to: string }
  ): Observable<Location[]> {
    const params: OpenF1QueryParams = {
      session_key: sessionKey,
      driver_number: driverNumber,
    };

    if (dateRange) {
      params['date>='] = dateRange.from;
      params['date<='] = dateRange.to;
    }

    return this.fetchCached<Location>('location', params);
  }

  getLaps(sessionKey: number, driverNumber?: number): Observable<Lap[]> {
    const params: OpenF1QueryParams = { session_key: sessionKey };
    if (driverNumber !== undefined) {
      params['driver_number'] = driverNumber;
    }
    return this.fetchCached<Lap>('laps', params);
  }

  getDriverChampionship(sessionKey: number): Observable<DriverChampionshipEntry[]> {
    return this.fetchCached<DriverChampionshipEntry>('drivers_championship', {
      session_key: sessionKey,
    });
  }

  getPodium(sessionKey: number): Observable<PodiumEntry[]> {
    return this.getSessionResults(sessionKey).pipe(
      switchMap((results) =>
        this.getDrivers({ session_key: sessionKey }).pipe(
          map((drivers) => buildPodium(results, drivers))
        )
      )
    );
  }

  private fetchCached<T>(endpoint: string, params: OpenF1QueryParams = {}): Observable<T[]> {
    const key = this.cacheKey(endpoint, params);
    const hit = this.getFromCache<T[]>(key);
    if (hit) return of(hit);

    const existing = this.inflight.get(key);
    if (existing) return existing as Observable<T[]>;

    const request$ = this.fetchQueued<T>(endpoint, params).pipe(
      tap((data) => {
        this.setCache(key, data);
        this.inflight.delete(key);
      }),
      catchError((err) => {
        this.inflight.delete(key);
        throw err;
      }),
      shareReplay(1)
    );

    this.inflight.set(key, request$);
    return request$;
  }

  private fetchQueued<T>(endpoint: string, params: OpenF1QueryParams = {}): Observable<T[]> {
    const request$ = defer(() =>
      this.http.get<T[]>(`${OPENF1_BASE_URL}/${endpoint}`, {
        params: this.buildParams(params),
      })
    ).pipe(
      retry({
        count: MAX_RETRIES,
        delay: (error: unknown, retryIndex: number) => {
          const status = (error as HttpErrorResponse)?.status;
          if (status === 429 || status === 503) {
            const wait =
              retryIndex >= 2 ? MINUTE_LIMIT_BACKOFF_MS : REQUEST_GAP_MS * Math.pow(2, retryIndex + 2);
            return timer(wait);
          }
          throw error;
        },
      }),
      catchError((error: HttpErrorResponse) => {
        if (error?.status === 429) {
          console.warn(`[OpenF1] Rate limited on /${endpoint} — try again shortly`);
        }
        return of([] as T[]);
      })
    );

    const scheduled$ = this.queueTail$.pipe(
      switchMap(() => timer(REQUEST_GAP_MS)),
      switchMap(() => request$)
    );

    this.queueTail$ = scheduled$.pipe(
      map(() => undefined),
      catchError(() => of(undefined))
    );

    return scheduled$;
  }

  private cacheKey(endpoint: string, params: OpenF1QueryParams): string {
    const sorted = Object.keys(params)
      .sort()
      .reduce<OpenF1QueryParams>((acc, key) => {
        acc[key] = params[key];
        return acc;
      }, {});
    return `${endpoint}:${JSON.stringify(sorted)}`;
  }

  private getFromCache<T>(key: string): T | null {
    const entry = this.cache.get(key);
    if (!entry) return null;
    if (entry.expiresAt <= Date.now()) {
      this.cache.delete(key);
      return null;
    }
    return entry.data as T;
  }

  private setCache<T>(key: string, data: T): void {
    this.cache.set(key, { data, expiresAt: Date.now() + CACHE_TTL_MS });
  }

  private buildParams(params: OpenF1QueryParams): HttpParams {
    let httpParams = new HttpParams();
    for (const [key, value] of Object.entries(params)) {
      if (value !== undefined && value !== null && value !== '') {
        httpParams = httpParams.set(key, String(value));
      }
    }
    return httpParams;
  }
}
