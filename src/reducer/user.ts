import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import _ from 'lodash';
import type { AppThunk } from 'src/store';
import axiosInt from 'src/utils/axios';
import type { User } from 'src/models/User';

interface UserState {
  users: User[];
  selectedUserId: string | null;
  selectedRange: {
    start: number;
    end: number;
  } | null;
}

const initialState: UserState = {
  users: [],
  selectedUserId: null,
  selectedRange: null
};

const slice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    getUsers(
      state: UserState,
      action: PayloadAction<User[]>
    ) {
      const users  = action.payload;
      console.log('ooooooooooooopppppppppppppppppp')
      console.log(users)
      state.users = users;
    },
    createUser(state: UserState, action: PayloadAction<{ user: User }>) {
      const { user } = action.payload;

      state.users = [...state.users, user];
    },
    selectUser(
      state: UserState,
      action: PayloadAction<{ userId?: string }>
    ) {
      const { userId = null } = action.payload;

      state.selectedUserId = userId;
    },
    updateUser(state: UserState, action: PayloadAction<{ user: User }>) {
      const { user } = action.payload;

      state.users = _.map(state.users, (_user) => {
        if (_user.id === user.id) {
          return user;
        }

        return _user;
      });
    },
    deleteUser(
      state: UserState,
      action: PayloadAction<{ userId: string }>
    ) {
      const { userId } = action.payload;

      state.users = _.reject(state.users, { id: userId });
    }
  }
});

export const reducer = slice.reducer;

export const getUsers =
  (): AppThunk =>
  async (dispatch): Promise<void> => {
    const response = await axiosInt.get<User[]>(
      '/api/users'
    );

    dispatch(slice.actions.getUsers(response.data));
  };

export const createUser =
  (data: any): AppThunk =>
  async (dispatch): Promise<void> => {
    const response = await axiosInt.post<{ user: User }>(
      '/api/user/meetings/create',
      data
    );

    dispatch(slice.actions.createUser(response.data));
  };

export const selectUser =
  (userId?: string): AppThunk =>
  async (dispatch) => {
    dispatch(slice.actions.selectUser({ userId }));
  };

export const updateUser =
  (userId: string, update: any): AppThunk =>
  async (dispatch) => {
    const response = await axiosInt.post<{ user: User }>(
      '/api/user/meetings/update',
      {
        userId,
        update
      }
    );

    dispatch(slice.actions.updateUser(response.data));
  };

export const deleteUser =
  (userId: string): AppThunk =>
  async (dispatch) => {
    await axiosInt.post('/api/user/meetings/delete', {
      userId
    });

    dispatch(slice.actions.deleteUser({ userId }));
  };

export default slice;
