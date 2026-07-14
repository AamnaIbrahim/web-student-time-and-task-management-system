export const TASK_STATUS = {
  PENDING: "Pending",
  COMPLETED: "Completed",
};

export const TASK_PRIORITY = {
  LOW: "Low",
  MEDIUM: "Medium",
  HIGH: "High",
};

export const mockTasks = [
  {
    id: "task_1",
    title: "Assignment 3 - Binary Trees",
    description: "Implement AVL tree insertion and deletion operations.",
    subjectId: "subj_1",
    priority: TASK_PRIORITY.HIGH,
    dueDate: "2026-07-16",
    dueTime: "23:59",
    status: TASK_STATUS.PENDING,
  },
  {
    id: "task_2",
    title: "ER Diagram Submission",
    description: "Submit the ER diagram for the library management system project.",
    subjectId: "subj_2",
    priority: TASK_PRIORITY.MEDIUM,
    dueDate: "2026-07-17",
    dueTime: "17:00",
    status: TASK_STATUS.PENDING,
  },
  {
    id: "task_3",
    title: "Sprint Retrospective Report",
    description: "Write the retrospective report for Sprint 2.",
    subjectId: "subj_3",
    priority: TASK_PRIORITY.LOW,
    dueDate: "2026-07-15",
    dueTime: "18:00",
    status: TASK_STATUS.COMPLETED,
  },
  {
    id: "task_4",
    title: "Quiz 2 Preparation",
    description: "Revise chapters 4 and 5 on the OSI model.",
    subjectId: "subj_4",
    priority: TASK_PRIORITY.MEDIUM,
    dueDate: "2026-07-18",
    dueTime: "10:00",
    status: TASK_STATUS.PENDING,
  },
  {
    id: "task_5",
    title: "Lab Manual - Joins & Subqueries",
    description: "Complete exercises 1 through 10 in the lab manual.",
    subjectId: "subj_2",
    priority: TASK_PRIORITY.LOW,
    dueDate: "2026-07-15",
    dueTime: "23:59",
    status: TASK_STATUS.PENDING,
  },
  {
    id: "task_6",
    title: "Project Proposal Presentation",
    description: "Prepare slides for the FYP proposal defense.",
    subjectId: "subj_3",
    priority: TASK_PRIORITY.HIGH,
    dueDate: "2026-07-20",
    dueTime: "14:00",
    status: TASK_STATUS.PENDING,
  },
];