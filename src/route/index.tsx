import { RouteObject } from 'react-router';

import Authenticated from 'src/component/Authenticated';
import { Navigate } from 'react-router-dom';

import Home from 'src/pages/home';
import Task from 'src/pages/task';
import User from 'src/pages/user';
import Organization from 'src/pages/organization';
import OrganizationDetails from 'src/pages/organization/organizationDetails';

const router: RouteObject[] = [
  {
    path: '',
    element: (
      <Authenticated>
        <Home />
      </Authenticated>
    )
  },
  {
    path: 'organization',
    element: (
      <Authenticated>
        <Organization />
      </Authenticated>
    )
  },
  {
    path: 'task',
    element: (
      <Authenticated>
        <Task />
      </Authenticated>
    )
  },
  {
    path: 'user',
    element: (
      <Authenticated>
        <User />
      </Authenticated>
    )
  },
  {
    path: 'organization/details/:id',
    element: (
      <Authenticated>
        <OrganizationDetails />
      </Authenticated>
    )
  },
];

export default router;
