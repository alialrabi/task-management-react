import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import _ from 'lodash';
import type { AppThunk } from 'src/store';
import axiosInt from 'src/utils/axios';
import type { Organization } from 'src/models/Organization';

interface OrganizationState {
  organizations: Organization[];
  organization: Organization;
  selectedRange: {
    start: number;
    end: number;
  } | null;
}

const initialState: OrganizationState = {
  organizations: [],
  organization: null,
  selectedRange: null
};

const slice = createSlice({
  name: 'organization',
  initialState,
  reducers: {
    getOrganizations(
      state: OrganizationState,
      action: PayloadAction<any>
    ) {
      const organizations  = action.payload.content;
      state.organizations = organizations;
    },
    selectOrganization(
      state: OrganizationState,
      action: PayloadAction<Organization>
    ) {
      const organization = action.payload;

      state.organization = organization;
    },
    createOrganization(state: OrganizationState, action: PayloadAction<{ organization: Organization }>) {
      const { organization } = action.payload;

      state.organizations = [...state.organizations, organization];
    },
    updateOrganization(state: OrganizationState, action: PayloadAction<{ organization: Organization }>) {
      const { organization } = action.payload;

      state.organizations = _.map(state.organizations, (_organization) => {
        if (_organization.id === organization.id) {
          return organization;
        }

        return _organization;
      });
    },
    deleteOrganization(
      state: OrganizationState,
      action: PayloadAction<{ organizationId: string }>
    ) {
      const { organizationId } = action.payload;

      state.organizations = _.reject(state.organizations, { id: organizationId });
    }
  }
});

export const reducer = slice.reducer;

export const getOrganizations =
  (): AppThunk =>
  async (dispatch): Promise<void> => {
    const response = await axiosInt.get<Organization[]>(
      '/api/organizations'
    );
    
    dispatch(slice.actions.getOrganizations(response.data));
  };

export const selectOrganization =
  (id?: string): AppThunk =>
    async (dispatch) => {
      const response = await axiosInt.get<Organization>('api/organization/' + id, {
      });

      dispatch(slice.actions.selectOrganization(response.data));
};

export const createOrganization =
  (data: any): AppThunk =>
  async (dispatch): Promise<void> => {
    const response = await axiosInt.post<{ organization: Organization }>(
      '/api/organization/meetings/create',
      data
    );

    dispatch(slice.actions.createOrganization(response.data));
  }; 

export const updateOrganization =
  (organizationId: string, update: any): AppThunk =>
  async (dispatch) => {
    const response = await axiosInt.post<{ organization: Organization }>(
      '/api/organization/meetings/update',
      {
        organizationId,
        update
      }
    );

    dispatch(slice.actions.updateOrganization(response.data));
  };

export const deleteOrganization =
  (organizationId: string): AppThunk =>
  async (dispatch) => {
    await axiosInt.post('/api/organization/meetings/delete', {
      organizationId
    });

    dispatch(slice.actions.deleteOrganization({ organizationId }));
  };

export default slice;
