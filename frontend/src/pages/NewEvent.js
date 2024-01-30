import { json, redirect } from 'react-router-dom';
import EventForm from '../components/EventForm'

function NewEventPage() {
    return <EventForm />
}

export default NewEventPage;

/**
 * Note: this function will be assigned to action property inside the routes' objects
 * and according to that it will gets some parameters {request, params}
 * use reqeust.formData() to get the <Form></Form> data
 * use data.get() and pass to it the value of the name attribute of Form's inputs
 */
export async function action({request, params}) {
    const data = await request.formData();

    const eventData = {
        title: data.get('title'),
        image: data.get('image'),
        date: data.get('date'),
        description: data.get('description'),
    }

    const response = await fetch('http://localhost:8080/events', {
        method: "POST",
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(eventData)
    })

    if(!response.ok) {
        throw json({message: 'Could not save event.'}, {status: 500})
    }

    /**
     * redirect is a function provided by react-router-dom that returns a special response object
     * and we can use it to navigate to another page
     */
    return redirect('/events')
}