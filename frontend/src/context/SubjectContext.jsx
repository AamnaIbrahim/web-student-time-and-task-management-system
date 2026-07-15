import { createContext, useEffect, useReducer, useCallback } from "react";
import { subjectReducer, initialSubjectState } from "./subjectReducer";
import { SUBJECT_ACTIONS } from "./subjectActionTypes";
import * as subjectService from "../services/subjectService";

export const SubjectContext = createContext(null);

export function SubjectProvider({ children }) {
  const [state, dispatch] = useReducer(subjectReducer, initialSubjectState);

  const fetchSubjects = useCallback(async () => {
    dispatch({ type: SUBJECT_ACTIONS.FETCH_START });
    try {
      const res = await subjectService.getSubjects();
      dispatch({ type: SUBJECT_ACTIONS.FETCH_SUCCESS, payload: res.data });
    } catch (err) {
      dispatch({ type: SUBJECT_ACTIONS.FETCH_FAILURE, payload: err.message });
    }
  }, []);

  useEffect(() => {
    fetchSubjects();
  }, [fetchSubjects]);

  const addSubject = useCallback(async (subjectData) => {
    const res = await subjectService.createSubject(subjectData);
    dispatch({ type: SUBJECT_ACTIONS.ADD_SUBJECT, payload: res.data });
    return res.data;
  }, []);

  const editSubject = useCallback(async (id, updates) => {
    const res = await subjectService.updateSubject(id, updates);
    dispatch({ type: SUBJECT_ACTIONS.UPDATE_SUBJECT, payload: res.data });
    return res.data;
  }, []);

  const removeSubject = useCallback(async (id) => {
    await subjectService.deleteSubject(id);
    dispatch({ type: SUBJECT_ACTIONS.DELETE_SUBJECT, payload: { id } });
  }, []);

  const value = {
    ...state,
    fetchSubjects,
    addSubject,
    editSubject,
    removeSubject,
  };

  return <SubjectContext.Provider value={value}>{children}</SubjectContext.Provider>;
}