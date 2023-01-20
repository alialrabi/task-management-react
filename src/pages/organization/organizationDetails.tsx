import { Box, Card, CardActionArea, CardContent, CardMedia, Divider, Grid, Stack, Typography } from '@mui/material';
import { useState, useEffect, useCallback } from 'react';
import { useParams } from 'react-router-dom';
import Sidebar from 'src/component/Sidebar';
import { selectOrganization } from 'src/reducer/organization';
import { getTaskgroupsWithTasks } from 'src/reducer/taskgroup';
import { useDispatch, useSelector } from 'src/store';

function OrganizationDetails() {

  const dispatch = useDispatch();

  const { id } = useParams(); 

  useEffect(() => {
    dispatch(selectOrganization(id));
    dispatch(getTaskgroupsWithTasks(id));

  }, []);

  
  const organization = useSelector((state) => state.organization.organization);
  const taskgroups = useSelector((state) => state.taskgroup.taskgroupsTasks);

  
  return (
    <Grid container>
      <Grid item md={2}>
        <Sidebar/>
      </Grid>    
      <Grid item md={10} pt={10}>

      <Grid container>
        <Grid item md={12}>
          <h1>details page for  { organization?.name } Organization</h1>
          <Card  sx={{
                p: 1,
                mb: 3
              }}>
    
                <Typography variant="h6" color="text.secondary">
                { organization?.description }
                </Typography>
              
          </Card>
        </Grid> 

        <Grid item md={12}>
          <Card  sx={{
              p: 1,
              mb: 3
            }}>
                {taskgroups.map((row: any, index) => {
                  return (
                    <>
                      <Typography variant='h4'>{ row.name }</Typography>  
                      {row.taskgroupTasks.map((row: any, index) => {
                        return (
                          <>
             
                            <Stack direction="row" spacing={20} p={2}>
                              <Typography>{ row.name }</Typography>
                              <Typography>{ row.status }</Typography>
                              <Typography>{ row.createdBy }</Typography>
                              <Typography>{ row.createdDate }</Typography>
                            </Stack>
                          </>
                        )
                        }
                      )}

                    </>
                  )
                  }
                )}
          </Card> 
        </Grid> 
      </Grid> 

       
        
      </Grid>     
    </Grid>
  );
}

export default OrganizationDetails;