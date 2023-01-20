import React from 'react';
import logo from './logo.svg';
import './App.css';
import { Box, Button, Checkbox, CircularProgress, FormControlLabel, FormHelperText, Grid, Link, TextField, Typography } from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';
import { Formik } from 'formik';
import * as Yup from 'yup';
import useAuth from 'src/hooks/useAuth';

 const Login = () => {   

  const { login } = useAuth();


  return (
    <>
    <Grid container>
    <Grid item xs={3}>
    </Grid>
      <Grid item xs={6}>
       <Formik
         initialValues={{
           email: 'demo@gmail.com',
           password: 'security123',
           submit: null
         }}
         validationSchema={Yup.object().shape({
           email: Yup.string()
             .email('The email provided should be a valid email address')
             .max(255)
             .required('The email field is required'),
           password: Yup.string()
             .max(255)
             .required('The password field is required')
         })}
         onSubmit={async (
           values,
           { setErrors, setStatus, setSubmitting }
         ): Promise<void> => {
           try {              
             await login(values.email, values.password);
           } catch (err) {
             console.error(err);
           }
         }}
       >
         {({
           errors,
           handleBlur,
           handleChange,
           handleSubmit,
           isSubmitting,
           touched,
           values
         }): JSX.Element => (
           <form noValidate onSubmit={handleSubmit}>
             <TextField
               error={Boolean(touched.email && errors.email)}
               fullWidth
               margin="normal"
               autoFocus
               helperText={touched.email && errors.email}
               label={'Email address'}
               name="email"
               onBlur={handleBlur}
               onChange={handleChange}
               type="email"
               value={values.email}
               variant="outlined"
             />
             <TextField
               error={Boolean(touched.password && errors.password)}
               fullWidth
               margin="normal"
               helperText={touched.password && errors.password}
               label={'Password'}
               name="password"
               onBlur={handleBlur}
               onChange={handleChange}
               type="password"
               value={values.password}
               variant="outlined"
             />
             <Box
               alignItems="center"
               display={{ xs: 'block', md: 'flex' }}
               justifyContent="space-between"
             >
               <Box display={{ xs: 'block', md: 'flex' }}>
                
               </Box>
             
             </Box>

             <Button
               sx={{
                 mt: 3
               }}
               color="primary"
               startIcon={isSubmitting ? <CircularProgress size="1rem" /> : null}
               disabled={isSubmitting}
               type="submit"
               fullWidth
               size="large"
               variant="contained"
             >
               Sign in
             </Button>
           </form>
         )}
       </Formik>
      </Grid> 
    </Grid>
   
 </>
    );
}
export default Login;