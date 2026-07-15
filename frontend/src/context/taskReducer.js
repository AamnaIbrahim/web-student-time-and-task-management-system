import { TASK_ACTIONS } from "./taskActionTypes";

export const initialTaskState = {
  tasks: [],
  loading: true,
  error: null,
};

export function taskReducer(state, action) {
  switch (action.type) {
    case TASK_ACTIONS.FETCH_START:
      return { ...state, loading: true, error: null };

    case TASK_ACTIONS.FETCH_SUCCESS:
      return { ...state, tasks: action.payload, loading: false, error: null };

    case TASK_ACTIONS.FETCH_FAILURE:
      return { ...state, loading: false, error: action.payload };

    case TASK_ACTIONS.ADD_TASK:
      return { ...state, tasks: [...state.tasks, action.payload] };

    case TASK_ACTIONS.UPDATE_TASK:
      return {
        ...state,
        tasks: state.tasks.map((task) =>
          task.id === action.payload.id ? action.payload : task
        ),
      };

    case TASK_ACTIONS.DELETE_TASK:
      return {
        ...state,
        tasks: state.tasks.filter((task) => task.id !== action.payload.id),
      };

    default:
      return state;
  }
}