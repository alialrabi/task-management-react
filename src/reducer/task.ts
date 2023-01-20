import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import _ from 'lodash';
import type { AppThunk } from 'src/store';
import axiosInt from 'src/utils/axios';
import type { Task } from 'src/models/Task';

interface TaskState {
  tasks: Task[];
  task: Task;
  selectedRange: {
    start: number;
    end: number;
  } | null;
}

const initialState: TaskState = {
  tasks: [],
  task: null,
  selectedRange: null
};

const slice = createSlice({
  name: 'task',
  initialState,
  reducers: {
    getTasks(
      state: TaskState,
      action: PayloadAction<any>
    ) {
      const tasks  = action.payload.content;
      state.tasks = tasks;
    },
    selectTask(
      state: TaskState,
      action: PayloadAction<Task>
    ) {
      const task = action.payload;

      state.task = task;
    },
    createTask(state: TaskState, action: PayloadAction<{ task: Task }>) {
      const { task } = action.payload;

      state.tasks = [...state.tasks, task];
    },
    updateTask(state: TaskState, action: PayloadAction<{ task: Task }>) {
      const { task } = action.payload;

      state.tasks = _.map(state.tasks, (_task) => {
        if (_task.id === task.id) {
          return task;
        }

        return _task;
      });
    },
    deleteTask(
      state: TaskState,
      action: PayloadAction<{ taskId: string }>
    ) {
      const { taskId } = action.payload;

      state.tasks = _.reject(state.tasks, { id: taskId });
    }
  }
});

export const reducer = slice.reducer;

export const getTasks =
  (): AppThunk =>
  async (dispatch): Promise<void> => {
    const response = await axiosInt.get<Task[]>(
      '/api/tasks'
    );

    dispatch(slice.actions.getTasks(response.data));
  };

export const selectTask =
  (id?: string): AppThunk =>
    async (dispatch) => {
      const response = await axiosInt.get<Task>('api/task/' + id, {
      });

      dispatch(slice.actions.selectTask(response.data));
};

export const createTask =
  (data: any): AppThunk =>
  async (dispatch): Promise<void> => {
    const response = await axiosInt.post<{ task: Task }>(
      '/api/task/meetings/create',
      data
    );

    dispatch(slice.actions.createTask(response.data));
  }; 

export const updateTask =
  (taskId: string, update: any): AppThunk =>
  async (dispatch) => {
    const response = await axiosInt.post<{ task: Task }>(
      '/api/task/meetings/update',
      {
        taskId,
        update
      }
    );

    dispatch(slice.actions.updateTask(response.data));
  };

export const deleteTask =
  (taskId: string): AppThunk =>
  async (dispatch) => {
    await axiosInt.post('/api/task/meetings/delete', {
      taskId
    });

    dispatch(slice.actions.deleteTask({ taskId }));
  };

export default slice;
