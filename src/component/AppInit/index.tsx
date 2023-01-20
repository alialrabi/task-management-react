import { Box } from '@mui/material';
import Login from 'src/pages/Auth/Login/Cover';


function AppInit() {
  return (
    <Box
      sx={{
        position: 'fixed',
        left: 0,
        top: 0,
        bottom: 0,
        right: 0,
        width: '100%',
        height: '100%'
      }}
      display="flex"
      alignItems="center"
      justifyContent="center"
    >
      <Login/>
    </Box>
  );
}

export default AppInit;
