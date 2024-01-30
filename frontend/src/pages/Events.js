import { json, useLoaderData } from "react-router-dom";

import EventsList from "../components/EventsList";

function EventsPage() {
  const data = useLoaderData(); // you can use useLoaderData() in the element of a route that has loader property in the routes or in its children components like <EventsList />
  //* error related code
  // if(data.isError) {
  //   return <p>{data.message}</p>
  // }
  const events = data.events;
  return <EventsList events={events} />;
}

export default EventsPage;

export async function loader() {
  const response = await fetch("http://localhost:8080/events"); // fetch function returns Promise<Response>

  if (!response.ok) {
    // return {isError: true, message: 'Could not fetch events.'}

    // throw {message: 'Could not fetch events.'} // if throw an error inside loader function, and because its a route error the react router will show the closest errorElement

    // throw new Response(JSON.stringify({message: 'Could not fetch events.'}), {status: 500})

    throw json({message: 'Could not fetch events.'}, {status: 500})
  } else {
    return response; // so we can return the response like this without extracting the data from it, bedause useLoaderData() function do this
  }
}
