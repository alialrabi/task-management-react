import { combineReducers } from '@reduxjs/toolkit';
import { reducer as userReducer } from 'src/reducer/user';
import { reducer as organizationReducer } from 'src/reducer/organization';
import { reducer as taskReducer } from 'src/reducer/task';
import { reducer as taskgroupReducer } from 'src/reducer/taskgroup';

const rootReducer = combineReducers({
  user: userReducer,
  organization: organizationReducer,
  task: taskReducer,
  taskgroup: taskgroupReducer
});

export default rootReducer;
