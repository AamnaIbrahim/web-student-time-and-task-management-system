import { SUBJECT_ACTIONS } from "./subjectActionTypes";

export const initialSubjectState = {
  subjects: [],
  loading: true,
  error: null,
};

export function subjectReducer(state, action) {
  switch (action.type) {
    case SUBJECT_ACTIONS.FETCH_START:
      return { ...state, loading: true, error: null };

    case SUBJECT_ACTIONS.FETCH_SUCCESS:
      return { ...state, subjects: action.payload, loading: false, error: null };

    case SUBJECT_ACTIONS.FETCH_FAILURE:
      return { ...state, loading: false, error: action.payload };

    case SUBJECT_ACTIONS.ADD_SUBJECT:
      return { ...state, subjects: [...state.subjects, action.payload] };

    case SUBJECT_ACTIONS.UPDATE_SUBJECT:
      return {
        ...state,
        subjects: state.subjects.map((subject) =>
          subject.id === action.payload.id ? action.payload : subject
        ),
      };

    case SUBJECT_ACTIONS.DELETE_SUBJECT:
      return {
        ...state,
        subjects: state.subjects.filter((subject) => subject.id !== action.payload.id),
      };

    default:
      return state;
  }
}