import { mockResolve, mockReject, generateMockId } from "../utils/mockApiHelper";
import { mockSubjects } from "../mockData/subjects";

let subjects = [...mockSubjects];

export function getSubjects() {
  return mockResolve([...subjects]);
}

export function getSubjectById(id) {
  const subject = subjects.find((s) => s.id === id);
  if (!subject) {
    return mockReject("Subject not found.");
  }
  return mockResolve(subject);
}

export function createSubject(subjectData) {
  if (!subjectData.name || !subjectData.code) {
    return mockReject("Subject name and code are required.");
  }

  const newSubject = {
    id: generateMockId(),
    color: "#4672d1",
    ...subjectData,
  };
  subjects = [...subjects, newSubject];
  return mockResolve(newSubject);
}

export function updateSubject(id, updates) {
  const index = subjects.findIndex((s) => s.id === id);
  if (index === -1) {
    return mockReject("Subject not found.");
  }

  const updatedSubject = { ...subjects[index], ...updates };
  subjects = subjects.map((s) => (s.id === id ? updatedSubject : s));
  return mockResolve(updatedSubject);
}

export function deleteSubject(id) {
  const exists = subjects.some((s) => s.id === id);
  if (!exists) {
    return mockReject("Subject not found.");
  }

  subjects = subjects.filter((s) => s.id !== id);
  return mockResolve({ id });
}