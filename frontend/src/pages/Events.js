import { Suspense } from "react";
import { Await, defer, json, useLoaderData } from "react-router-dom";

import EventsList from "../components/EventsList";

function EventsPage() {
  //* this code before using defer
  // const data = useLoaderData(); // you can use useLoaderData() in the element of a route that has loader property in the routes or in its children components like <EventsList />
  //* error related code
  // if(data.isError) {
    //   return <p>{data.message}</p>
    // }
    
    // const events = data.events;
    // return <EventsList events={events} />;
    
    //* and this code after using defer
    const {events} = useLoaderData(); // you can use useLoaderData() in the element of a route that has loader property in the routes or in its children components like <EventsList />
    /**
     * what happening here is:
     * we use defer() in loader() to hold the promise returned by loadEvents() in an object with a event property
     * and then when the loader() excuted by react router when navigating to this route
     * using useLoaderData() to extract event property which is a promise
     * and use <Await resolve={events}></Await> to resolve this promise
     * and between Await openning and closing tags we use a functions which excuted by react-router-dom once events promise resolved (once the data is there)
     * to output a dynamic data and this function receives the promise data.
     * then use <Suspense></Suspense> component to show a fullback until the promise data arrive
     */
  return <Suspense fallback={<p style={{textAlign: 'center'}}>Loading...</p>}>
    <Await resolve={events}>
    {(loadedEvents) => <EventsList events={loadedEvents}></EventsList>}
  </Await>
  </Suspense>
}

export default EventsPage;

async function loadEvents() {
  const response = await fetch("http://localhost:8080/events"); // fetch function returns Promise<Response>

  if (!response.ok) {
    // return {isError: true, message: 'Could not fetch events.'}

    // throw {message: 'Could not fetch events.'} // if throw an error inside loader function, and because its a route error the react router will show the closest errorElement

    // throw new Response(JSON.stringify({message: 'Could not fetch events.'}), {status: 500})

    throw json({message: 'Could not fetch events.'}, {status: 500})
  } else {
    // return response; // so we can return the response like this without extracting the data from it, bedause useLoaderData() function do this

    const resData = await response.json();
    return resData.events;
  }
}

export async function loader() {
  return defer({
    events: loadEvents()
  })
}
