import { Student, Assignment, Submission, SubjectItem, User, AttendanceRecord, ClassRoom } from '../types';

export const INITIAL_SUBJECTS: SubjectItem[] = [
  { id: 'sub-1', name: 'ภาษาไทย', groupName: 'ภาษาไทย' },
  { id: 'sub-2', name: 'คณิตศาสตร์', groupName: 'คณิตศาสตร์' },
  { id: 'sub-3', name: 'วิทยาศาสตร์และเทคโนโลยี', groupName: 'วิทยาศาสตร์' },
  { id: 'sub-4', name: 'สังคมศึกษา ศาสนา และวัฒนธรรม', groupName: 'สังคมศึกษา' },
  { id: 'sub-5', name: 'ภาษาต่างประเทศ (ภาษาอังกฤษ)', groupName: 'ภาษาต่างประเทศ' },
  { id: 'sub-6', name: 'สุขศึกษาและพลศึกษา', groupName: 'สุขศึกษาและพลศึกษา' },
  { id: 'sub-7', name: 'ศิลปะ', groupName: 'ศิลปะ' },
  { id: 'sub-8', name: 'การงานอาชีพ', groupName: 'การงานอาชีพ' },
];

export const INITIAL_STUDENTS: Student[] = [
  // ว่างเปล่าตามที่ผู้ใช้ร้องขอ: ไม่เอาชื่อนักเรียนตัวอย่าง เพื่อให้คุณครูกรอกรายชื่อจริงเอง
];

export const INITIAL_ASSIGNMENTS: Assignment[] = [
  {
    id: 'asg-01',
    room: 'ป.1',
    title: 'แบบฝึกหัดคณิตศาสตร์: การบวกเลขไม่เกิน 20',
    subject: 'คณิตศาสตร์',
    description: 'ให้นักเรียนทำแบบฝึกหัดในสมุดหน้า 12 ข้อ 1-10 พร้อมแสดงวิธีคิดและระบายสีให้สวยงาม',
    dueDate: new Date(Date.now() + 86400000 * 2).toISOString().slice(0, 10),
    evalType: 'score',
    maxScore: 10,
    createdAt: new Date(Date.now() - 86400000).toISOString(),
  },
  {
    id: 'asg-02',
    room: 'ป.1',
    title: 'คัดลายมือภาษาไทย: บทอาขยาน มานี มานะ',
    subject: 'ภาษาไทย',
    description: 'คัดลายมือตัวบรรจงเต็มบรรทัด 5 บรรทัด และฝึกอ่านออกเสียงกับผู้ปกครอง',
    dueDate: new Date(Date.now() + 86400000 * 3).toISOString().slice(0, 10),
    evalType: 'score',
    maxScore: 10,
    createdAt: new Date(Date.now() - 86400000 * 2).toISOString(),
  },
  {
    id: 'asg-03',
    room: 'ป.1',
    title: 'สำรวจพืชและสัตว์รอบบริเวณโรงเรียนหนองเดิ่นศรีเจริญวิทยา',
    subject: 'วิทยาศาสตร์และเทคโนโลยี',
    description: 'วาดภาพพืชหรือสัตว์ที่พบรอบโรงเรียน 1 ชนิด พร้อมบอกชื่อและลักษณะสำคัญ',
    dueDate: new Date(Date.now() + 86400000 * 4).toISOString().slice(0, 10),
    evalType: 'score',
    maxScore: 10,
    createdAt: new Date(Date.now() - 86400000 * 3).toISOString(),
  },
];

export const INITIAL_SUBMISSIONS: Submission[] = [];

export const DEMO_TEACHER: User = {
  id: 'usr-teacher-care',
  role: 'teacher',
  login: '0910610997',
  prefix: 'คุณครู',
  firstName: 'ครูแคร์',
  lastName: 'ศรีเจริญ',
  nickname: 'ครูแคร์',
  room: 'ป.1',
  phone: '0910610997',
  bio: 'ครูประจำชั้นประถมศึกษาปีที่ 1 โรงเรียนหนองเดิ่นศรีเจริญวิทยา สพป.หนองคาย เขต 1 (บัญชีทดลองใช้: ครูแคร์)',
  exp: 999,
  avatarUrl: 'https://images.unsplash.com/photo-1544717305-2782549b5136?w=200&auto=format&fit=crop&q=80',
  avatarSize: 96,
  themeColor: 'rose',
};

export const DEMO_STUDENT: User = {
  id: 'std-p1-doen',
  role: 'student',
  login: '0881234567',
  prefix: 'เด็กชาย',
  firstName: 'น้องเดิ่น',
  lastName: 'ศรีเจริญ',
  nickname: 'น้องเดิ่น',
  room: 'ป.1',
  number: 1,
  phone: '0910610997',
  bio: 'นักเรียนชั้น ป.1 เลขที่ 1 โรงเรียนหนองเดิ่นศรีเจริญวิทยา (บัญชีทดลองใช้: น้องเดิ่น)',
  exp: 150,
  avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80',
  avatarSize: 96,
  themeColor: 'sakura',
};

export function getTodayDateString(): string {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
}

export function generateInitialAttendance(): AttendanceRecord[] {
  const today = getTodayDateString();
  return INITIAL_STUDENTS.map((student, idx) => {
    // Give realistic statuses for today
    let status: 'มา' | 'สาย' | 'ลา' | 'ขาด' = 'มา';
    if (idx === 3) status = 'สาย';
    if (idx === 6) status = 'ขาด';
    if (idx === 10) status = 'ลา';
    return {
      id: `att-${student.id}-${today}`,
      date: today,
      studentId: student.id,
      room: student.room,
      status,
      updatedAt: new Date().toISOString(),
      updatedBy: 'ครูประจำชั้น',
    };
  });
}
