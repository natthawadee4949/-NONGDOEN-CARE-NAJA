import { Student, Assignment, Submission, SubjectItem, AttendanceRecord, User } from '../types';
import { INITIAL_STUDENTS, INITIAL_ASSIGNMENTS, INITIAL_SUBMISSIONS, INITIAL_SUBJECTS, generateInitialAttendance, DEMO_TEACHER } from '../data/initialData';

const STORAGE_KEY = 'nongdoen_care_app_state_v2';
const USER_KEY = 'nongdoen_care_current_user_v2';

export interface AppStateData {
  students: Student[];
  assignments: Assignment[];
  submissions: Submission[];
  attendance: AttendanceRecord[];
  subjects: SubjectItem[];
  users: User[];
}

export function loadAppState(): AppStateData {
  if (typeof window === 'undefined') {
    return {
      students: [],
      assignments: INITIAL_ASSIGNMENTS,
      submissions: [],
      attendance: [],
      subjects: INITIAL_SUBJECTS,
      users: [DEMO_TEACHER],
    };
  }

  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (parsed && Array.isArray(parsed.students)) {
        return parsed;
      }
    }
  } catch (e) {
    console.error('Failed to load state from localStorage:', e);
  }

  const initial: AppStateData = {
    students: [], // เริ่มต้นไม่มีรายชื่อนักเรียนตัวอย่าง ตามคำขอของผู้ใช้
    assignments: INITIAL_ASSIGNMENTS,
    submissions: [],
    attendance: [],
    subjects: INITIAL_SUBJECTS,
    users: [DEMO_TEACHER],
  };
  saveAppState(initial);
  return initial;
}

export function saveAppState(state: AppStateData): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch (e) {
    console.error('Failed to save state to localStorage:', e);
  }
}

export function loadCurrentUser(): User | null {
  if (typeof window === 'undefined') return null;
  try {
    const raw = localStorage.getItem(USER_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (parsed && parsed.role) {
        return parsed;
      }
    }
  } catch (e) {
    console.error('Failed to load user:', e);
  }
  // ต้องเข้าสู่ระบบก่อน: ค่าเริ่มต้นเป็น null
  return null;
}

export function saveCurrentUser(user: User | null): void {
  if (typeof window === 'undefined') return;
  try {
    if (user) {
      localStorage.setItem(USER_KEY, JSON.stringify(user));
    } else {
      localStorage.removeItem(USER_KEY);
    }
  } catch (e) {
    console.error('Failed to save user:', e);
  }
}

export function exportBackupFile(data: AppStateData): void {
  const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `nongdoen-care-backup-${new Date().toISOString().slice(0, 10)}.json`;
  a.click();
  URL.revokeObjectURL(url);
}
