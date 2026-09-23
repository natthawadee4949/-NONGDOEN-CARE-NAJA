export type UserRole = 'teacher' | 'student';

export type ClassRoom = 'อ.1' | 'อ.2' | 'อ.3' | 'ป.1' | 'ป.2' | 'ป.3' | 'ป.4' | 'ป.5' | 'ป.6';

export type AttendanceStatus = 'มา' | 'สาย' | 'ลา' | 'ขาด';

export type StudentCareStatus = 'normal' | 'watch' | 'danger';

export interface User {
  id: string;
  role: UserRole;
  login: string;
  prefix?: string;
  firstName: string;
  lastName: string;
  nickname?: string;
  room?: ClassRoom;
  number?: number;
  phone?: string;
  email?: string;
  password?: string;
  bio?: string;
  avatarUrl?: string;
  avatarSize?: number;
  themeColor?: string;
  exp: number;
}

export interface Student {
  id: string;
  prefix: string;
  firstName: string;
  lastName: string;
  nickname: string;
  room: ClassRoom;
  number: number;
  phone: string;
  status: StudentCareStatus;
  exp: number;
  avatarUrl?: string;
}

export interface AttendanceRecord {
  id: string;
  date: string; // YYYY-MM-DD
  studentId: string;
  room: ClassRoom;
  status: AttendanceStatus;
  note?: string;
  updatedAt: string;
  updatedBy?: string;
}

export interface Assignment {
  id: string;
  room: ClassRoom | 'ทุกห้อง';
  title: string;
  subject: string;
  description: string;
  dueDate: string;
  evalType: 'score' | 'scale';
  maxScore: number;
  imageUrl?: string;
  teacherId?: string;
  createdAt: string;
}

export interface Submission {
  id: string;
  assignmentId: string;
  studentId: string;
  fileUrl?: string;
  note?: string;
  submittedAt: string;
  status: 'submitted' | 'graded';
  score?: number;
  feedback?: string;
}

export interface SubjectItem {
  id: string;
  name: string;
  groupName: string;
}

export type NavigationTab =
  | 'home'
  | 'student-portal'
  | 'seating'
  | 'tools'
  | 'grading'
  | 'homework'
  | 'students'
  | 'profile';
