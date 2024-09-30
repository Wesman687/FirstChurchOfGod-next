import React, { useState, useEffect } from 'react';
import { useForm, ValidationError } from '@formspree/react';
import RingSpinner from '../RingSpinner';

function ContactForm() {
  const [state, handleSubmit] = useForm("mpwavoyz"); // Ensure correct form ID
  const [loading, setLoading] = useState(false);

  // Set loading state to false when submission is completed
  useEffect(() => {
    if (state.succeeded || state.errors?.length > 0) {
      setLoading(false);
    }
  }, [state.succeeded, state.errors]);

  return (
    <>
      <div className="sc_form_info">
        {loading ? (
          <div className="settings-ring-container">
            <RingSpinner />
          </div>
        ) : (
            
          <form
            onSubmit={(e) => {
              setLoading(true); // Start loading when submitting the form
              handleSubmit(e);
            }}
          >
            {state.succeeded ? <div className='contact-success-container'><p>Thanks for Contacting us, we will review it as soon as we can.</p></div> :
            <>
            <div className="sc_form_item sc_form_field label_over">
              <label className="required" htmlFor="Name">
                Name
              </label>
              <input id="username" type="text" name="username" placeholder="Name" />
              <ValidationError prefix="Name" field="name" errors={state.errors} />
            </div>
            <div className="sc_form_item sc_form_field label_over">
              <label className="required" htmlFor="email">
                E-mail
              </label>
              <input id="email" type="email" name="email" placeholder="Email" />
              <ValidationError prefix="Email" field="email" errors={state.errors} />
            </div>
            <div className="sc_form_item sc_form_field label_over">
              <label className="required" htmlFor="phone">
                Phone
              </label>
              <input id="phone" type="number" name="phone" placeholder="Phone" />
            </div>

            <div className="sc_form_item sc_form_message label_over">
              <label className="required" htmlFor="sc_form_message">
                Message
              </label>
              <textarea id="sc_form_message" name="message" placeholder="Message"></textarea>
              <ValidationError prefix="Message" field="message" errors={state.errors} />
            </div>

            <div className="sc_form_item sc_form_button">
              <button type="submit" className="light-blue-button" disabled={state.submitting}>
                Send Message
              </button>
            </div></>}
          </form>
        )}
        
      </div>
    </>
  );
}

export default ContactForm;
