export interface Task {
  id: string;
  priority: 'Low' | 'Medium' | 'High';
  status: 'Assigned' | 'InProgress' | 'Completed' | 'Pending';
  createdDate: string;
  updatedDate: string;
  day: string;
}

export const countStatus = (data: Task[]): Record<string, number> => {
  const result: Record<string, number> = {};
  for (const item of data) {
    result[item.status] = (result[item.status] || 0) + 1;
  }
  return result;
};

export const filterByStatus = (data: Task[], status: Task['status']): Task[] => {
  return data.filter(item => item.status === status);
}; 