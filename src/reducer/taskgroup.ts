import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import _ from 'lodash';
import type { AppThunk } from 'src/store';
import axiosInt from 'src/utils/axios';
import type { Taskgroup } from 'src/models/Taskgroup';

interface TaskgroupState {
  taskgroups: Taskgroup[];
  taskgroupsTasks: Taskgroup[];
  taskgroup: Taskgroup;
  selectedRange: {
    start: number;
    end: number;
  } | null;
}

const initialState: TaskgroupState = {
  taskgroups: [],
  taskgroupsTasks: [],
  taskgroup: null,
  selectedRange: null
};

const slice = createSlice({
  name: 'taskgroup',
  initialState,
  reducers: {
    getTaskgroups(
      state: TaskgroupState,
      action: PayloadAction<any>
    ) {
      const taskgroups  = action.payload.content;
      state.taskgroups = taskgroups;
    },

    getTaskgroupsTasks(
      state: TaskgroupState,
      action: PayloadAction<any>
    ) {
      const taskgroups  = action.payload;
      state.taskgroupsTasks = taskgroups;
    },
    
    selectTaskgroup(
      state: TaskgroupState,
      action: PayloadAction<Taskgroup>
    ) {
      const taskgroup = action.payload;

      state.taskgroup = taskgroup;
    },
    createTaskgroup(state: TaskgroupState, action: PayloadAction<{ taskgroup: Taskgroup }>) {
      const { taskgroup } = action.payload;

      state.taskgroups = [...state.taskgroups, taskgroup];
    },
    updateTaskgroup(state: TaskgroupState, action: PayloadAction<{ taskgroup: Taskgroup }>) {
      const { taskgroup } = action.payload;

      state.taskgroups = _.map(state.taskgroups, (_taskgroup) => {
        if (_taskgroup.id === taskgroup.id) {
          return taskgroup;
        }

        return _taskgroup;
      });
    },
    deleteTaskgroup(
      state: TaskgroupState,
      action: PayloadAction<{ taskgroupId: string }>
    ) {
      const { taskgroupId } = action.payload;

      state.taskgroups = _.reject(state.taskgroups, { id: taskgroupId });
    }
  }
});

export const reducer = slice.reducer;

export const getTaskgroups =
  (): AppThunk =>
  async (dispatch): Promise<void> => {
    const response = await axiosInt.get<Taskgroup[]>(
      '/api/taskgroups'
    );

    dispatch(slice.actions.getTaskgroups(response.data));
  };

export const getTaskgroupsWithTasks =
  (id: string): AppThunk =>
  async (dispatch): Promise<void> => {
    const response = await axiosInt.get<Taskgroup[]>(
      '/api/organization/taskgroups?page=0&size=10&organizationId=' + id );

    dispatch(slice.actions.getTaskgroupsTasks(response.data));
  };

export const selectTaskgroup =
  (id?: string): AppThunk =>
    async (dispatch) => {
      const response = await axiosInt.get<Taskgroup>('api/taskgroup/' + id, {
      });

      dispatch(slice.actions.selectTaskgroup(response.data));
};

export const createTaskgroup =
  (data: any): AppThunk =>
  async (dispatch): Promise<void> => {
    const response = await axiosInt.post<{ taskgroup: Taskgroup }>(
      '/api/taskgroup/meetings/create',
      data
    );

    dispatch(slice.actions.createTaskgroup(response.data));
  }; 

export const updateTaskgroup =
  (taskgroupId: string, update: any): AppThunk =>
  async (dispatch) => {
    const response = await axiosInt.post<{ taskgroup: Taskgroup }>(
      '/api/taskgroup/meetings/update',
      {
        taskgroupId,
        update
      }
    );

    dispatch(slice.actions.updateTaskgroup(response.data));
  };

export const deleteTaskgroup =
  (taskgroupId: string): AppThunk =>
  async (dispatch) => {
    await axiosInt.post('/api/taskgroup/meetings/delete', {
      taskgroupId
    });

    dispatch(slice.actions.deleteTaskgroup({ taskgroupId }));
  };

export default slice;
