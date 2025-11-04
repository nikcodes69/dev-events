<<<<<<< HEAD
import ExploreBtn from "@/components/ExploreBtn"

=======
import EventCard from "@/components/EventCard"
import ExploreBtn from "@/components/ExploreBtn"

import events from "@/lib/constants"

>>>>>>> 8d09f27 (worked further on homepage)
const Page = () => {
  return (
    <section>
      <h1 className="text-center">The Hub for Every Dev <br/> Event You Can't Miss</h1>
      <p className="text-center mt-5">Hackathons, Meetups, and Conferences, All in One Place</p>
      <ExploreBtn/>  

       <div className="mt-20 space-y-7">
          <h3>Featured Events</h3>

          <ul className="events">

<<<<<<< HEAD
            {[1,2,3,4].map((event)=>(
              <li key={event}>Event {event}</li>
            ))}
=======
            {events.map((event)=>(
              <li key={event.title}>
                <EventCard {...event}/>

              </li>
            ))} 
>>>>>>> 8d09f27 (worked further on homepage)
                  
          </ul>

        </div>

    </section>
  )
}

export default Page