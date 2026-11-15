'use client';

import React, { useEffect, useMemo, useState, useSyncExternalStore } from 'react';
import { GoogleMap, InfoWindowF, MarkerClustererF, MarkerF, useJsApiLoader, type MarkerClustererProps } from '@react-google-maps/api';

type Clusterer = Parameters<NonNullable<MarkerClustererProps['onLoad']>>[0];
import { useTranslations } from 'next-intl';
import { User } from '@/domain/types/user';
import { routeEvents, routeUsers } from '@/domain/constants/routes';
import { getUserTypeImages, getUserTypeLabels } from '@/functions/user-type';
import { UserTypeIcon } from '@/components/user/user-type-icon';
import { UserType } from '@/domain/enums/user-type';
import { imgUserDefaultImg } from '@/domain/constants/images';
import Link from 'next/link';
import ReactCountryFlag from 'react-country-flag';
import { getCountryNameByCode } from '@/functions/get-country-name-by-code';
import { IconArrowRight, IconArrowUpRight } from '@tabler/icons-react';
import { MapFilters, MAP_LAYERS, type MapLayer } from './freestyler-map-filters';
import {
  DEFAULT_EVENT_FILTERS,
  EVENT_CLUSTER_MAX_ZOOM,
  EVENT_TIME_WINDOWS,
  EventCardOverlay,
  EventGroupPin,
  EventSheet,
  filterMapEvents,
  groupMapEvents,
  MAP_EVENT_TYPES,
  type EventFilterState,
  type EventGroup,
  type EventSelection,
  type EventTimeWindow,
} from './freestyler-map-events';
import { MapEvent } from '@/domain/types/map-event';
import { EventType } from '@/domain/enums/event-type';
import { IconCalendarOff } from '@tabler/icons-react';
import { Gender } from '@/domain/enums/gender';
import LoadingSpinner from './animation/loading-spinner';
import { isNaturalPerson } from '../functions/is-natural-person';
import { cn } from '@/lib/utils';

interface IMapWrapperProps {
  /** ongoing/upcoming events with coordinates; omit to hide the events layer (iframe) */
  events?: MapEvent[];
  /** initial layer / event filter from the URL (layer, et, etype, ereg) */
  initialLayer?: string;
  initialEventTime?: string;
  initialEventTypes?: string;
  initialEventRegOpen?: string;
  userList: User[];
  selectedUsernames?: string[];
  region?: string;
  language?: string;
  lat?: number;
  lng?: number;
  zoom?: number;
  streetViewEnabled?: boolean;
  isIframe?: boolean;
}

const MapWrapper = ({
  userList = [],
  selectedUsernames = [],
  region = 'DE',
  language = 'EN',
  lat = 54.5259614, // Central Europe
  lng = 15.2551187, // Central Europe
  zoom = 6,
  streetViewEnabled = false,
  isIframe = false,
  ...eventProps
}: IMapWrapperProps) => {
  const [apiKey, setApiKey] = useState<string | null>(null);

  useEffect(() => {
    const fetchApiKey = async () => {
      const res = await fetch('/api/maps-api-key');
      const data = await res.json();
      setApiKey(data.apiKey);
    };

    fetchApiKey();
  }, []);

  if (!apiKey) return <LoadingSpinner />;

  return (
    <Map
      googleMapsApiKey={apiKey}
      userList={userList}
      selectedUsernames={selectedUsernames}
      region={region}
      language={language}
      lat={lat}
      lng={lng}
      zoom={zoom}
      streetViewEnabled={streetViewEnabled}
      isIframe={isIframe}
      {...eventProps}
    />
  );
};

interface IMapProps {
  /** ongoing/upcoming events with coordinates; omit to hide the events layer (iframe) */
  events?: MapEvent[];
  /** initial layer / event filter from the URL (layer, et, etype, ereg) */
  initialLayer?: string;
  initialEventTime?: string;
  initialEventTypes?: string;
  initialEventRegOpen?: string;
  googleMapsApiKey: string;
  userList: User[];
  selectedUsernames?: string[];
  region?: string;
  language?: string;
  lat?: number;
  lng?: number;
  zoom?: number;
  streetViewEnabled?: boolean;
  isIframe?: boolean;
}

const containerStyle = {
  width: '100%',
  height: '100%',
};

const DEFAULT_MAP_USER_TYPES: UserType[] = [UserType.FREESTYLER, UserType.ASSOCIATION, UserType.BRAND, UserType.DJ, UserType.EVENT_ORGANIZER, UserType.MC, UserType.MEDIA];


const DEFAULT_MAP_GENDERS: Gender[] = [Gender.FEMALE, Gender.MALE];


/** max zoom at which people are clustered; from the next level on, pins at the same spot are fanned out */
const PEOPLE_CLUSTER_MAX_ZOOM = 16;

function clusterIconUrl(size: number) {
  const r = size / 2;
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 ${size} ${size}"><circle cx="${r}" cy="${r}" r="${r - 1}" fill="#141D26" fill-opacity="0.18"/><circle cx="${r}" cy="${r}" r="${r - 5}" fill="#141D26" stroke="#ffffff" stroke-width="2.5"/></svg>`;
  return `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(svg)}`;
}

const PEOPLE_CLUSTER_STYLES = [36, 44, 54].map(size => ({
  url: clusterIconUrl(size),
  width: size,
  height: size,
  textColor: '#ffffff',
  textSize: size > 44 ? 14 : 12,
  fontWeight: '700',
  fontFamily: 'Inter, ui-sans-serif, system-ui, sans-serif',
}));

/**
 * Many profiles share the exact same coordinates (city centre). Fan those out on a small sunflower spiral (~45 m
 * steps) so that, once clusters split at max zoom, every pin is still reachable.
 */
// the API delivers coordinates as numbers or numeric strings
const userLat = (u: User) => Number(u.locLatitude) || 0;
const userLng = (u: User) => Number(u.locLongitude) || 0;

function spreadIdenticalPositions(users: User[]) {
  const groups = new globalThis.Map<string, User[]>();
  for (const u of users) {
    const key = `${userLat(u).toFixed(5)},${userLng(u).toFixed(5)}`;
    groups.set(key, [...(groups.get(key) ?? []), u]);
  }
  const positions = new globalThis.Map<string, { lat: number; lng: number }>();
  for (const list of groups.values()) {
    const base = { lat: userLat(list[0]), lng: userLng(list[0]) };
    if (list.length === 1) {
      positions.set(list[0].username, base);
      continue;
    }
    const lngScale = 1 / Math.max(0.2, Math.cos((base.lat * Math.PI) / 180));
    [...list]
      .sort((a, b) => a.username.localeCompare(b.username))
      .forEach((u, i) => {
        const r = 0.0004 * Math.sqrt(i + 0.5);
        const a = i * 2.399963;
        positions.set(u.username, { lat: base.lat + r * Math.sin(a), lng: base.lng + r * Math.cos(a) * lngScale });
      });
  }
  return positions;
}

function parseLayer(v?: string): MapLayer {
  return MAP_LAYERS.includes(v as MapLayer) ? (v as MapLayer) : 'all';
}

function parseEventFilters(time?: string, types?: string, regOpen?: string): EventFilterState {
  const parsedTypes = (types ?? '')
    .split(',')
    .filter(v => MAP_EVENT_TYPES.includes(v as EventType)) as EventType[];
  return {
    time: EVENT_TIME_WINDOWS.includes(time as EventTimeWindow) ? (time as EventTimeWindow) : DEFAULT_EVENT_FILTERS.time,
    types: types ? parsedTypes : [...DEFAULT_EVENT_FILTERS.types],
    registrationOpenOnly: regOpen === '1',
  };
}

/** mirror layer / event filters into the URL without a navigation (the page is server rendered) */
function syncUrl(layer: MapLayer, ef: EventFilterState) {
  const url = new URL(window.location.href);
  const set = (k: string, v: string | null) => (v === null ? url.searchParams.delete(k) : url.searchParams.set(k, v));
  set('layer', layer === 'all' ? null : layer);
  set('et', ef.time === DEFAULT_EVENT_FILTERS.time ? null : ef.time);
  const typesDefault = ef.types.length === DEFAULT_EVENT_FILTERS.types.length && ef.types.every(v => DEFAULT_EVENT_FILTERS.types.includes(v));
  set('etype', typesDefault ? null : ef.types.join(','));
  set('ereg', ef.registrationOpenOnly ? '1' : null);
  window.history.replaceState(window.history.state, '', url.toString());
}

function useIsSmUp() {
  return useSyncExternalStore(
    onStoreChange => {
      const mq = window.matchMedia('(min-width: 640px)');
      mq.addEventListener('change', onStoreChange);
      return () => mq.removeEventListener('change', onStoreChange);
    },
    () => window.matchMedia('(min-width: 640px)').matches,
    () => true,
  );
}

const getSelectedUsers = (users: User[], selectedUsernames: string[]): User[] => {
  return users.filter(usr => selectedUsernames.includes(usr.username));
};

const Map = ({
  googleMapsApiKey,
  userList = [],
  selectedUsernames = [],
  region = 'DE',
  language = 'EN',
  lat = 54.5259614, // Central Europe
  lng = 15.2551187, // Central Europe
  zoom = 6,
  streetViewEnabled = false,
  isIframe = false,
  events,
  initialLayer,
  initialEventTime,
  initialEventTypes,
  initialEventRegOpen,
}: IMapProps) => {
  let t = useTranslations('/map');

  const [selectedUsers, setSelectedUsers] = useState<User[]>(getSelectedUsers(userList, selectedUsernames));
  const [filterName, setFilterName] = useState('');
  const [filterGender, setFilterGender] = useState<Gender[]>(() => [...DEFAULT_MAP_GENDERS]);
  const [filterUserType, setFilterUserType] = useState<UserType[]>(() => [...DEFAULT_MAP_USER_TYPES]);
  const [filterCountryCode, setFilterCountryCode] = useState('');
  const [map, setMap] = React.useState<google.maps.Map | null>();
  const [mapOptions, setMapOptions] = useState<google.maps.MapOptions>();
  const [layer, setLayer] = useState<MapLayer>(() => (events ? parseLayer(initialLayer) : 'people'));
  const [eventFilters, setEventFilters] = useState<EventFilterState>(() => parseEventFilters(initialEventTime, initialEventTypes, initialEventRegOpen));
  const [currentZoom, setCurrentZoom] = useState(zoom);
  const [eventSelection, setEventSelection] = useState<EventSelection | null>(null);
  const [now] = useState(() => Date.now());
  const [peopleClusterer, setPeopleClusterer] = useState<Clusterer | null>(null);
  const isSmUp = useIsSmUp();

  const { isLoaded } = useJsApiLoader({
    id: 'google-map-script-fs-map',
    googleMapsApiKey,
    region,
    language,
  });

  // prepare icons (one per user type / gender)
  const icons = useMemo(() => {
    if (!isLoaded) return null;
    const make = (type: UserType, gender?: Gender) => {
      const img = getUserTypeImages(type, gender, true);
      return { url: img.path, size: new window.google.maps.Size(img.size, img.size), scaledSize: new window.google.maps.Size(img.size, img.size), px: img.size };
    };
    return {
      male: make(UserType.FREESTYLER, Gender.MALE),
      female: make(UserType.FREESTYLER, Gender.FEMALE),
      [UserType.ASSOCIATION]: make(UserType.ASSOCIATION),
      [UserType.BRAND]: make(UserType.BRAND),
      [UserType.DJ]: make(UserType.DJ),
      [UserType.EVENT_ORGANIZER]: make(UserType.EVENT_ORGANIZER),
      [UserType.MC]: make(UserType.MC),
      [UserType.MEDIA]: make(UserType.MEDIA),
    } as Record<string, { url: string; size: google.maps.Size; scaledSize: google.maps.Size; px: number }>;
  }, [isLoaded]);

  const iconForUser = (user: User) => icons?.[user.type] ?? (user.gender === Gender.MALE ? icons?.male : icons?.female);

  const userCountryOptions = useMemo(() => {
    const seen = new globalThis.Map<string, number>();
    for (const u of userList) {
      const c = (u.countryCode || '').trim().toUpperCase();
      if (c) seen.set(c, (seen.get(c) ?? 0) + 1);
    }
    return [...seen.entries()]
      .map(([code, count]) => {
        const name = getCountryNameByCode(code) || code;
        return { code, name, count };
      })
      .sort((a, b) => a.name.localeCompare(b.name, undefined, { sensitivity: 'base' }));
  }, [userList]);

  // a country can only be picked from the options, so it is always one of them; no reset effect needed

  const typeCounts = useMemo(() => {
    const counts: Partial<Record<UserType, number>> = {};
    for (const u of userList) counts[u.type] = (counts[u.type] ?? 0) + 1;
    return counts;
  }, [userList]);

  // Memoize filtered users to avoid filtering on every render
  const filteredUsers = useMemo(() => {
    const selectedCc = filterCountryCode.trim().toUpperCase();

    return userList.filter(user => {
      // filter by name
      let fullName = user.firstName?.toLowerCase() || '';
      if (user.lastName) fullName += ` ${user.lastName.toLowerCase()}`; // append last name if exists
      const nameOk = fullName.includes(filterName.toLowerCase());

      // filter by gender
      const genderOk = !isNaturalPerson(user.type) || filterGender.includes(user.gender as Gender);

      // filter by type
      const typeOk = filterUserType.includes(user.type);

      // filter by country (associations & brands always pass — they typically have no country code)
      const countryOk = !selectedCc || user.type === UserType.ASSOCIATION || user.type === UserType.BRAND || (user.countryCode || '').trim().toUpperCase() === selectedCc;

      return nameOk && genderOk && typeOk && countryOk;
    });
  }, [userList, filterName, filterGender, filterUserType, filterCountryCode]);

  const showPeople = layer !== 'events';
  const showEvents = Boolean(events) && layer !== 'people';

  const peoplePositions = useMemo(() => spreadIdenticalPositions(filteredUsers), [filteredUsers]);

  // markers are added without redrawing each time (noClustererRedraw); repaint once after the set changed
  useEffect(() => {
    peopleClusterer?.repaint();
  }, [peopleClusterer, filteredUsers, showPeople]);

  // events matching everything but the type filter → counts on the type chips
  const eventTypeCounts = useMemo(() => {
    const counts: Partial<Record<EventType, number>> = {};
    for (const e of filterMapEvents(events ?? [], { ...eventFilters, types: [...MAP_EVENT_TYPES] }, filterName, now)) counts[e.type] = (counts[e.type] ?? 0) + 1;
    return counts;
  }, [events, eventFilters, filterName, now]);

  const filteredEvents = useMemo(() => filterMapEvents(events ?? [], eventFilters, filterName, now), [events, eventFilters, filterName, now]);
  const eventGroups = useMemo(() => (showEvents ? groupMapEvents(filteredEvents, currentZoom) : []), [showEvents, filteredEvents, currentZoom]);

  // a selection whose events got filtered away (or whose layer was hidden) is simply not shown
  const activeSelection = useMemo(() => {
    if (!eventSelection || !showEvents) return null;
    const ids = new Set(filteredEvents.map(e => e.id));
    const remaining = eventSelection.group.events.filter(e => ids.has(e.id));
    if (remaining.length === 0) return null;
    const group = { ...eventSelection.group, events: remaining };
    const eventId = eventSelection.eventId && ids.has(eventSelection.eventId) ? eventSelection.eventId : remaining.length === 1 ? remaining[0].id : null;
    return { group, eventId };
  }, [eventSelection, showEvents, filteredEvents]);

  const changeLayer = (next: MapLayer) => {
    setLayer(next);
    syncUrl(next, eventFilters);
  };

  const changeEventFilters = (next: EventFilterState) => {
    setEventFilters(next);
    syncUrl(layer, next);
  };

  /** bring a pin into view with room for the card (desktop: below the pin, mobile: sheet at the bottom) */
  const focusPosition = (pos: { lat: number; lng: number }) => {
    const projection = map?.getProjection();
    if (!map || !projection) return;
    const height = map.getDiv().clientHeight;
    // desktop: pin tip ~120px from the top so the card below it fits; mobile: pin (≈55px tall incl. date badge)
    // between the floating toolbar (~170px) and the bottom sheet
    const offsetPx = isSmUp ? Math.max(0, height / 2 - 120) : 80;
    const point = projection.fromLatLngToPoint(pos);
    if (!point) return;
    const scale = 2 ** (map.getZoom() ?? currentZoom);
    const center = projection.fromPointToLatLng(new google.maps.Point(point.x, point.y + offsetPx / scale));
    if (center) map.panTo(center);
  };

  const onEventGroupClick = (group: EventGroup) => {
    if (!map) return;
    if (group.venueCount > 1 && currentZoom < EVENT_CLUSTER_MAX_ZOOM) {
      // zoom cluster: zoom in until it splits (never past the level at which events stop clustering)
      const bounds = new google.maps.LatLngBounds();
      group.events.forEach(e => bounds.extend({ lat: e.lat, lng: e.lng }));
      map.fitBounds(bounds, 90);
      google.maps.event.addListenerOnce(map, 'idle', () => {
        if ((map.getZoom() ?? 0) > EVENT_CLUSTER_MAX_ZOOM) map.setZoom(EVENT_CLUSTER_MAX_ZOOM);
      });
      setEventSelection(null);
      return;
    }
    setSelectedUsers([]);
    setEventSelection({ group, eventId: group.events.length === 1 ? group.events[0].id : null });
    focusPosition({ lat: group.lat, lng: group.lng });
  };

  const onSheetNavigate = (event: MapEvent) => {
    const venueGroup = groupMapEvents(filteredEvents, EVENT_CLUSTER_MAX_ZOOM).find(g => g.events.some(e => e.id === event.id));
    if (!venueGroup) return;
    setEventSelection({ group: venueGroup, eventId: event.id });
    focusPosition({ lat: venueGroup.lat, lng: venueGroup.lng });
  };

  const addToSelectedUsers = (user: User) => {
    const users = Array.from(selectedUsers);
    users.push(user);
    setSelectedUsers(users);
  };

  const removeFromSelectedUsers = (user: User) => {
    let users = Array.from(selectedUsers);
    users = users.filter(usr => usr.username !== user.username);

    setSelectedUsers(users);
  };

  const clearAllFilters = () => {
    setFilterName('');
    setFilterCountryCode('');
    setFilterGender([...DEFAULT_MAP_GENDERS]);
    setFilterUserType([...DEFAULT_MAP_USER_TYPES]);
    if (events) {
      setLayer('all');
      setEventFilters({ ...DEFAULT_EVENT_FILTERS, types: [...DEFAULT_EVENT_FILTERS.types] });
      syncUrl('all', DEFAULT_EVENT_FILTERS);
    }
  };

  const onLoad = React.useCallback(function callback(map: google.maps.Map) {
    setMapOptions({
      center: new google.maps.LatLng(lat, lng),
      streetViewControl: streetViewEnabled,
      zoom: zoom,
      // the floating search panel sits top-left, so move the map/satellite toggle out of its way
      ...(isIframe ? {} : { mapTypeControlOptions: { position: google.maps.ControlPosition.LEFT_BOTTOM } }),
    });
    setMap(map);
  }, []);

  const onUnmount = React.useCallback(function callback(map: google.maps.Map) {
    setMap(null);
  }, []);

  if (!isLoaded || !icons) return <LoadingSpinner />;

  return (
    <div className={cn('relative flex min-h-0 flex-1 flex-col', !isIframe && 'overflow-hidden rounded-3xl border border-border bg-muted shadow-sm')}>
      {!isIframe && (
        <MapFilters
          filters={{ name: filterName, countryCode: filterCountryCode, genders: filterGender, userTypes: filterUserType }}
          onChange={next => {
            setFilterName(next.name);
            setFilterCountryCode(next.countryCode);
            setFilterGender(next.genders);
            setFilterUserType(next.userTypes);
          }}
          onReset={clearAllFilters}
          defaultUserTypes={DEFAULT_MAP_USER_TYPES}
          defaultGenders={DEFAULT_MAP_GENDERS}
          countryOptions={userCountryOptions}
          typeCounts={typeCounts}
          resultCount={filteredUsers.length}
          totalCount={userList.length}
          events={
            events
              ? {
                  layer,
                  onLayerChange: changeLayer,
                  filters: eventFilters,
                  onChange: changeEventFilters,
                  resultCount: filteredEvents.length,
                  typeCounts: eventTypeCounts,
                }
              : undefined
          }
        />
      )}
      <div className="min-h-0 flex-1 overflow-hidden">
        <GoogleMap
          mapContainerStyle={containerStyle}
          options={mapOptions}
          onLoad={onLoad}
          onUnmount={onUnmount}
          onZoomChanged={() => {
            const z = map?.getZoom();
            if (z !== undefined && z !== currentZoom) setCurrentZoom(z);
          }}
          onClick={() => setEventSelection(null)}
        >
          {showPeople && (
            <MarkerClustererF onLoad={setPeopleClusterer} onUnmount={() => setPeopleClusterer(null)} options={{ styles: PEOPLE_CLUSTER_STYLES, maxZoom: PEOPLE_CLUSTER_MAX_ZOOM, gridSize: 56, averageCenter: true, title: t('peopleClusterTitle') }}>
              {clusterer => (
                <>
                  {filteredUsers.map(user => (
                    <MarkerF
                      key={`marker-${user.username}`}
                      clickable={true}
                      title={user.username}
                      icon={iconForUser(user)}
                      clusterer={clusterer}
                      noClustererRedraw
                      position={peoplePositions.get(user.username) ?? { lat: userLat(user), lng: userLng(user) }}
                      onClick={() => {
                        setEventSelection(null);
                        addToSelectedUsers(user);
                      }}
                    />
                  ))}
                </>
              )}
            </MarkerClustererF>
          )}

          {showPeople &&
            selectedUsers
              .filter(sel => filteredUsers.some(u => u.username === sel.username))
              .map(user => (
                <InfoWindowF
                  key={`info-${user.username}`}
                  position={peoplePositions.get(user.username) ?? { lat: userLat(user), lng: userLng(user) }}
                  options={{ pixelOffset: new google.maps.Size(0, -(iconForUser(user)?.px ?? 20)) }}
                  onCloseClick={() => {
                    removeFromSelectedUsers(user);
                  }}
                >
                  <div className="w-56 max-w-full p-0.5 font-sans text-zinc-900">
                    <div className="flex items-center gap-3">
                      <img src={user.imageUrl ? user.imageUrl : imgUserDefaultImg} alt="" className="h-11 w-11 shrink-0 rounded-full object-cover ring-1 ring-zinc-200" />
                      <div className="min-w-0">
                        <div className="truncate text-sm font-semibold">{user.lastName ? `${user.firstName} ${user.lastName}` : `${user.firstName}`}</div>

                        {user.type === UserType.FREESTYLER && user.countryCode && (
                          <div className="mt-0.5 flex items-center gap-1.5 text-xs text-zinc-600">
                            <ReactCountryFlag countryCode={user.countryCode} svg style={{ width: '1rem', height: '0.75rem', borderRadius: '2px' }} title={user.countryCode} />
                            <span className="truncate">{getCountryNameByCode(user.countryCode)}</span>
                          </div>
                        )}

                        {user.type !== UserType.FREESTYLER && (
                          <div className="mt-0.5 flex items-center gap-1.5 text-xs text-zinc-600">
                            <UserTypeIcon userType={user.type} variant="tile" className="h-4 w-4 rounded" />
                            {user.type && <span className="truncate">{`${getUserTypeLabels(user.type, t)}`}</span>}
                          </div>
                        )}
                      </div>
                    </div>

                    {!isIframe && (
                      <Link
                        href={`${routeUsers}/${user.username}`}
                        className="mt-3 flex items-center justify-center gap-1 rounded-lg bg-brand px-3 py-1.5 text-xs font-semibold text-brand-foreground! no-underline transition-colors hover:bg-brand-strong"
                      >
                        {t('infoWindowGoToProfileInternal')}
                        <IconArrowRight className="h-3.5 w-3.5" stroke={2} aria-hidden />
                      </Link>
                    )}

                    {isIframe && (
                      <a
                        href={`${window.location.origin}${routeUsers}/${user.username}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="mt-3 flex items-center justify-center gap-1 rounded-lg bg-brand px-3 py-1.5 text-xs font-semibold text-brand-foreground! no-underline transition-colors hover:bg-brand-strong"
                      >
                        {t('infoWindowGoToProfileExternal')}
                        <IconArrowUpRight className="h-3.5 w-3.5" stroke={2} aria-hidden />
                      </a>
                    )}
                  </div>
                </InfoWindowF>
              ))}

          {/* events render after (and above) people */}
          {eventGroups.map(group => (
            <EventGroupPin
              key={`event-${group.key}`}
              group={group}
              now={now}
              selected={Boolean(activeSelection && group.events.some(e => activeSelection.group.events.some(s => s.id === e.id)))}
              onClick={onEventGroupClick}
            />
          ))}

          {activeSelection && isSmUp && (
            <EventCardOverlay
              selection={activeSelection}
              now={now}
              onClose={() => setEventSelection(null)}
              onPickEvent={eventId => setEventSelection({ group: activeSelection.group, eventId })}
            />
          )}
        </GoogleMap>
      </div>

      {activeSelection && !isSmUp && (
        <EventSheet
          selection={activeSelection}
          now={now}
          onClose={() => setEventSelection(null)}
          onPickEvent={eventId => setEventSelection({ group: activeSelection.group, eventId })}
          allEvents={filteredEvents}
          onNavigate={onSheetNavigate}
        />
      )}

      {events && layer === 'events' && filteredEvents.length === 0 && (
        <div className="pointer-events-none absolute inset-x-3 bottom-6 z-10 flex justify-center">
          <div className="pointer-events-auto flex max-w-sm items-center gap-3 rounded-2xl border border-border bg-background/95 p-3.5 pr-4 shadow-lg backdrop-blur-md" data-testid="map-events-empty">
            <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-brand-soft text-brand-strong">
              <IconCalendarOff className="h-5 w-5" stroke={1.75} aria-hidden />
            </span>
            <div className="min-w-0 text-sm">
              <div className="font-semibold">{t('eventsEmptyTitle')}</div>
              <Link href={routeEvents} className="text-xs font-semibold text-brand-strong hover:underline">
                {t('eventsEmptyLink')}
              </Link>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export { MapWrapper as FreestylerMap };
