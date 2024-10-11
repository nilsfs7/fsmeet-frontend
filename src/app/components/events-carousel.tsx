'use client';

import EventCard from '@/components/events/EventCard';
import { Carousel, CarouselContent, CarouselItem } from '@/components/ui/carousel';
import { routeEvents } from '@/domain/constants/routes';
import Autoplay from 'embla-carousel-autoplay';
import Link from 'next/link';
import { Event } from '@/types/event';

interface IEventsCarousel {
  upcomingEvents: Event[];
  ongoingEvents: Event[];
  recentEvents: Event[];
}

export const EventsCarousel = ({ upcomingEvents, ongoingEvents, recentEvents }: IEventsCarousel) => {
  return (
    <Carousel
      opts={{
        loop: true,
      }}
      plugins={[
        Autoplay({
          delay: 6000,
        }),
      ]}
      className="w-full max-w-lg"
    >
      <CarouselContent>
        {/* Ongoing Events */}
        {Array.from({ length: ongoingEvents.length }).map((_, index) => (
          <CarouselItem key={`ongoing-${index}`}>
            <>
              <h1 className="mt-2 text-center text-2xl">{`Ongoing Event`}</h1>

              <div className="mt-2 flex max-h-full justify-center px-2">
                <div className="w-full">
                  {ongoingEvents.map((item: any, i: number) => {
                    return (
                      <div key={i.toString()} className={i == 0 ? '' : `mt-2`}>
                        <Link href={`${routeEvents}/${item.id}`}>
                          <EventCard event={item} />
                        </Link>
                      </div>
                    );
                  })}
                </div>
              </div>
            </>
          </CarouselItem>
        ))}

        {/* Upcoming Events */}
        {Array.from({ length: upcomingEvents.length }).map((_, index) => (
          <CarouselItem key={`upcoming-${index}`}>
            <>
              <h1 className="mt-2 text-center text-2xl">{`Upcoming Event`}</h1>

              <div className="mt-2 flex max-h-full justify-center px-2">
                <div className="w-full">
                  {upcomingEvents.map((item: any, i: number) => {
                    return (
                      <div key={i.toString()} className={i == 0 ? '' : `mt-2`}>
                        <Link href={`${routeEvents}/${item.id}`}>
                          <EventCard event={item} />
                        </Link>
                      </div>
                    );
                  })}
                </div>
              </div>
            </>
          </CarouselItem>
        ))}

        {/* Recent Events */}
        {Array.from({ length: recentEvents.length }).map((_, index) => (
          <CarouselItem key={`recent-${index}`}>
            <>
              <h1 className="mt-2 text-center text-2xl">{`Recent Event`}</h1>

              <div className="mt-2 flex max-h-full justify-center px-2">
                <div className="w-full">
                  {recentEvents.map((item: any, i: number) => {
                    return (
                      <div key={i.toString()} className={i == 0 ? '' : `mt-2`}>
                        <Link href={`${routeEvents}/${item.id}`}>
                          <EventCard event={item} />
                        </Link>
                      </div>
                    );
                  })}
                </div>
              </div>
            </>
          </CarouselItem>
        ))}
      </CarouselContent>
    </Carousel>
  );
};
