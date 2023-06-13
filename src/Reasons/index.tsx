import React from 'react';
// import useForm from './useform';

// function LoginForm() {
//   const { values, errors, touched, submitting, handleChange, handleBlur, handleSubmit } = useForm({
//     initialValues: {
//       email: '',
//       password: '',
//     },
//     onSubmit: async (x) => {
//       // Simulate API call
//       await new Promise((resolve) => setTimeout(resolve, 1000));

//       if (x.email !== 'test@example.com' || x.password !== 'password') {
//         throw new Error('Invalid email or password');
//       }
//     },
//   });

//   return (
//     <form onSubmit={handleSubmit}>
//       <label>
//         Email:
//         <input type="email" name="email" value={values.email} onChange={handleChange} onBlur={handleBlur} />
//         {touched.email && errors.email && <div>{errors.email}</div>}
//       </label>
//       <label>
//         Password:
//         <input type="password" name="password" value={values.password} onChange={handleChange} onBlur={handleBlur} />
//         {touched.password && errors.password && <div>{errors.password}</div>}
//       </label>
//       <button type="submit" disabled={submitting}>
//         Submit
//       </button>
//     </form>
//   );
// }

function Reasons() {



    return (
        <>
            Reasons
            {/* <LoginForm/> */}
        </>
    )
}

export default Reasons