import { useRouteLoaderData } from 'react-router-dom';

import EventForm from '../components/EventForm'

function EditEventPage() {
    const data = useRouteLoaderData('event-detail') // use this with the id of the heigher level route to access its loader
    return <EventForm event={data.event}/>
}

export default EditEventPage;