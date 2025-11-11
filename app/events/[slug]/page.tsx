import { notFound } from "next/navigation";
import Image from "next/image";
import BookEvent from "@/components/BookEvent";
import { IEvent } from "@/database/event.model";
import { getSimilarEventsBySlug } from "@/lib/actions/event.actions";
import EventCard from "@/components/EventCard";

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;

const EventDetailItem = ({ icon, alt, label }: { icon: string, alt: string, label: string }) => {

  return (
    <div className="flex-row-gap-2 items-center">
      <Image src={icon} alt={alt} width={17} height={17} />
      <p>{label}</p>
    </div>
  )
}

const EventAgenda = ({ agenda }: { agenda: string[] }) => {

  return (
    <div className="agenda">
      <h2>Agenda</h2>
      <ul>
        {
          agenda.map((item) => (
            <li key={item}>{item}</li>
          ))
        }
      </ul>
    </div>
  )
}

const EventTags = ({ tags }: { tags: string[] }) => {

  return (
    <div className="flex flex-row gap-1.5 flex-wrap">
      {
        tags.map((tag) => (
          <div className="pill" key={tag}>{tag}</div>
        ))
      }
    </div>
  )
}

const EventDetailsPage = async ({ params }: { params: Promise<{ slug: string }> }) => {

  const { slug } = await params;

  const request = await fetch(`${BASE_URL}/api/events/${slug}`);

  const { event: { description, image, overview, date, time, location, mode, agenda, audience, organizer, tags } } = await request.json();

  if (!description) {
    return notFound();
  }

  const similarEvents: IEvent[] = await getSimilarEventsBySlug(slug);

  const bookings = 10;

  return (
    <section id="event">
      <div className="header">
        <h1>Event Details: <br /> {slug}</h1>
        <p>{description}</p>
      </div>

      <div className="details">
        {/* Left Side : Event Content*/}
        <div className="content">
          <Image src={image} alt="Event Banner" width={800} height={800} className="banner" />

          <section className="flex-col-gap-2">
            <h2>Overview</h2>
            <p>{overview}</p>
          </section>

          <section className="flex-col-gap-2">
            <h2>Event Details</h2>

            <EventDetailItem icon="/icons/calendar.svg" alt="calendar" label={date} />
            <EventDetailItem icon="/icons/clock.svg" alt="clock" label={time} />
            <EventDetailItem icon="/icons/location.svg" alt="location" label={location} />
            <EventDetailItem icon="/icons/mode.svg" alt="calendar" label={mode} />
            <EventDetailItem icon="/icons/audience.svg" alt="calendar" label={audience} />
          </section>

          <EventAgenda agenda={agenda} />

          <section className="flex-col-gap-2">
            <h2>About the Organizer</h2>
            <p>{organizer}</p>
          </section>

          <EventTags tags={tags} />
        </div>

        {/* Right Side : Booking Form*/}
        <aside className="booking">
          <div className="signup-card">
            <h2>Book Your Spot</h2>
            {
              bookings > 0 ? (
                  <p className="text-sm">
                  Join {bookings} people who already booked their spot!
                  </p>
              )
                  :
                  (
                    <p className="text-sm">Be the first to book your spot</p>
                  )
              }
              <BookEvent/>
          </div>
        </aside>
      </div>

      <div className="flex w-full flex-col gap-4 pt-20">
        <h2>Similar Events</h2>
        <div className="events">
          {
            similarEvents.length>0 && similarEvents.map((similarEvent: IEvent)=>(
              <EventCard key={similarEvent.title} {...similarEvent}/>
            ))
          }
        </div>
      </div>

    </section>
  )
}

export default EventDetailsPage