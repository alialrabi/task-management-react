
export interface Task {
  id: string;
  name: string;
  description: string;
  position: number;
  icon: any;
  iconContentType: string;
  taskgroups: any;
  createdBy: string;
  createdDate: string;
  lastModifiedBy: string;
  lastModifiedDate: string;
  status: string;
  domain: string;
}
