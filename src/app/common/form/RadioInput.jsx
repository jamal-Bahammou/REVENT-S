import React from 'react';
import { Form } from 'semantic-ui-react'

const RadioInput = ({ input, width, type, label }) => {
   return (
      <Form.Field>
         <input {...input} type={type} /> {' '}
         <label>{label}</label>
      </Form.Field>
   )
}

export default RadioInput 