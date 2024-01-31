import {
  useRouteLoaderData,
  json,
  redirect,
  defer,
  Await,
} from "react-router-dom";

import EventItem from "../components/EventItem";
import EventsList from "../components/EventsList";
import { Suspense } from "react";

function EventDetailPage() {
  const { event, events } = useRouteLoaderData("event-detail");
  return (
    <>
      <Suspense fallback={<p style={{ textAlign: "center" }}>Loading...</p>}>
        <Await resolve={event}>
          {(loadedEvent) => <EventItem event={loadedEvent} />}
        </Await>  
      </Suspense>
      <Suspense fallback={<p style={{ textAlign: "center" }}>Loading...</p>}>
        <Await resolve={events}>
          {(loadedEvents) => <EventsList events={loadedEvents} />}
        </Await>
      </Suspense>
    </>
  );
}

export default EventDetailPage;

async function loadEvent(id) {
  const response = await fetch("http://localhost:8080/events/" + id);

  if (!response.ok) {
    throw json(
      { message: "Could not fetch details for selected event." },
      { status: 500 }
    );
  }

  const resData = await response.json();
  return resData.event;
}

async function loadEvents() {
  const response = await fetch("http://localhost:8080/events"); // fetch function returns Promise<Response>

  if (!response.ok) {
    // return {isError: true, message: 'Could not fetch events.'}

    // throw {message: 'Could not fetch events.'} // if throw an error inside loader function, and because its a route error the react router will show the closest errorElement

    // throw new Response(JSON.stringify({message: 'Could not fetch events.'}), {status: 500})

    throw json({ message: "Could not fetch events." }, { status: 500 });
  } else {
    // return response; // so we can return the response like this without extracting the data from it, bedause useLoaderData() function do this

    const resData = await response.json();
    return resData.events;
  }
}

//* Note: you can't use react hooks outside react component function
export async function loader({ request, params }) {
  const id = params.eventId;

  return defer({
    event: loadEvent(id),
    events: loadEvents(),
  });
}

//* Note: if you will destructure what was passed to action function must do it like that { params, request } and don't edit anything, because its an object contains these 2 properties
export async function action({ params, request }) {
  console.log(`EventDetail params : `, params);
  console.log(`EventDetail request : `, request);
  const eventId = params.eventId;

  const response = await fetch("http://localhost:8080/events/" + eventId, {
    method: request.method,
  });

  if (!response.ok) {
    throw json({ message: "Could not delete event." }, { status: 500 });
  }

  return redirect("/events");
}
