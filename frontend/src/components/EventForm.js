import {
  Form,
  useNavigate,
  useNavigation,
  useActionData,
  json,
  redirect
} from "react-router-dom";

import classes from "./EventForm.module.css";

function EventForm({ method, event }) {
  const data = useActionData();
  const navigate = useNavigate();
  const navigation = useNavigation();
  const isSubmitting = navigation.state === "submitting";

  function cancelHandler() {
    navigate("..");
  }

  return (
    /**
     * this <Form></Form> rrovided by react-router-dom and its features are:
     * 1. its automaticlly prevent browser default behaviour of sending request to server when submit the form
     * 2. every form input must has name attribute to use it to extract its data
     * 3. it will take that request and give it to your router action
     */
    <Form method={method} className={classes.form}>
      {data && data.errors && (
        <ul>
          {Object.values(data.errors).map((err) => (
            <li key={err}>{err}</li>
          ))}
        </ul>
      )}
      <p>
        <label htmlFor="title">Title</label>
        <input
          id="title"
          type="text"
          name="title"
          required
          defaultValue={event ? event.title : ""}
        />
      </p>
      <p>
        <label htmlFor="image">Image</label>
        <input
          id="image"
          type="url"
          name="image"
          required
          defaultValue={event ? event.image : ""}
        />
      </p>
      <p>
        <label htmlFor="date">Date</label>
        <input
          id="date"
          type="date"
          name="date"
          required
          defaultValue={event ? event.date : ""}
        />
      </p>
      <p>
        <label htmlFor="description">Description</label>
        <textarea
          id="description"
          name="description"
          rows="5"
          required
          defaultValue={event ? event.description : ""}
        />
      </p>
      <div className={classes.actions}>
        <button type="button" onClick={cancelHandler} disabled={isSubmitting}>
          Cancel
        </button>
        <button disabled={isSubmitting}>
          {isSubmitting ? "Submitting" : "Save"}
        </button>
      </div>
    </Form>
  );
}

export default EventForm;

/**
 * Note: this function will be assigned to action property inside the routes' objects
 * and according to that it will gets some parameters {request, params}
 * use reqeust.formData() to get the <Form></Form> data
 * use data.get() and pass to it the value of the name attribute of Form's inputs
 */
export async function action({request, params}) {
  console.log('EventForm action request : ', request)
  console.log('EventForm action params : ', params)
  const method = request.method;
  const data = await request.formData();

  const eventData = {
      title: data.get('title'),
      image: data.get('image'),
      date: data.get('date'),
      description: data.get('description'),
  }
  
  let url = 'http://localhost:8080/events';

  if(method === 'PATCH') {
    const eventId = params.eventId;
    url = 'http://localhost:8080/events/' + eventId;
  }

  const response = await fetch(url, {
      method: method,
      headers: {
          'Content-Type': 'application/json'
      },
      body: JSON.stringify(eventData)
  })

  if(response.status === 422) {
      return response
  }

  if(!response.ok) {
      throw json({message: 'Could not save event.'}, {status: 500})
  }

  /**
   * redirect is a function provided by react-router-dom that returns a special response object
   * and we can use it to navigate to another page
   */
  return redirect('/events')
}