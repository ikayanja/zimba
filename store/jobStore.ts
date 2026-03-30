import { create } from "zustand";

type JobState = {
  jobs: any[];
  setJobs: (jobs: any[]) => void;
  addJob: (job: any) => void;
};

export const useJobStore = create<JobState>((set) => ({
  jobs: [],
  setJobs: (jobs) => set({ jobs }),
  addJob: (job) => set((state) => ({ jobs: [job, ...state.jobs] })),
}));
