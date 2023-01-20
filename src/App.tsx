import { useRoutes } from 'react-router-dom';
import router from 'src/route';

import AdapterDateFns from '@mui/lab/AdapterDateFns';
import LocalizationProvider from '@mui/lab/LocalizationProvider';
import useAuth from 'src/hooks/useAuth';

import { CssBaseline } from '@mui/material';
import AppInit from './component/AppInit';

function App() {
  const content = useRoutes(router);
  const auth = useAuth();

  return (
  //  <ThemeProvider>
      <LocalizationProvider dateAdapter={AdapterDateFns}>
        
          <CssBaseline />
          {auth.isInitialized ? content : <AppInit />}
      </LocalizationProvider>
  //  </ThemeProvider>
  );
}
export default App;