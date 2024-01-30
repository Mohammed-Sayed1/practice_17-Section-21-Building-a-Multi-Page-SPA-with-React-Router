import { useRouteLoaderData, json, redirect } from "react-router-dom";

import EventItem from "../components/EventItem";

function EventDetailPage() {
  const data = useRouteLoaderData("event-detail");
  return <EventItem event={data.event} />;
}

export default EventDetailPage;

//* Note: you can't use react hooks outside react component function
export async function loader({ request, params }) {
  const id = params.eventId;

  const response = await fetch("http://localhost:8080/events/" + id);

  if (!response.ok) {
    throw json(
      { message: "Could not fetch details for selected event." },
      { status: 500 }
    );
  }

  return response;
}

//* Note: if you will destructure what was passed to action function must do it like that { params, request } and don't edit anything, because its an object contains these 2 properties
export async function action({ params, request }) {
  console.log(`EventDetail params : `, params)
  console.log( `EventDetail request : `, request)
  const eventId = params.eventId;

  const response = await fetch("http://localhost:8080/events/" + eventId, {
    method: request.method,
  });

  if (!response.ok) {
    throw json({ message: "Could not delete event." }, { status: 500 });
  }

  return redirect("/events");
}
