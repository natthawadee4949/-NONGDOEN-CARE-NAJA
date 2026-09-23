import React from 'react';
import { Student, Assignment, AttendanceRecord, SubjectItem, ClassRoom, User, NavigationTab, Submission } from '../types';
import {
  Users,
  CalendarCheck,
  BookOpen,
  GraduationCap,
  Music,
  Send,
  Bell,
  Globe,
  MapPin,
  Phone,
  CheckCircle2,
  ExternalLink,
  Layers,
  Sparkles,
  Award,
  ArrowRight,
  User as UserIcon,
  LayoutGrid,
  Timer,
  Star,
  QrCode,
  TrendingUp,
  Clock,
  Compass,
  FileCheck,
} from 'lucide-react';
import { MascotIcon } from './MascotIcon';

interface TabHomeProps {
  students: Student[];
  assignments: Assignment[];
  submissions?: Submission[];
  attendance: AttendanceRecord[];
  subjects: SubjectItem[];
  currentRoom: ClassRoom;
  currentUser: User | null;
  todayDate: string;
  onNavigateTab: (tab: NavigationTab) => void;
  onOpenLineModal: (mode: 'attendance' | 'homework') => void;
  onOpenMarchModal: () => void;
  onOpenAddStudent?: () => void;
  onOpenAddAssignment?: () => void;
}

export const TabHome: React.FC<TabHomeProps> = ({
  students,
  assignments,
  submissions = [],
  attendance,
  subjects,
  currentRoom,
  currentUser,
  todayDate,
  onNavigateTab,
  onOpenLineModal,
  onOpenMarchModal,
}) => {
  const isTeacher = currentUser?.role === 'teacher';
  const isStudent = currentUser?.role === 'student';

  // Statistics
  const totalStudents = students.length;
  const kindergartenStudents = students.filter((s) => s.room.startsWith('อ.')).length;
  const primaryStudents = students.filter((s) => s.room.startsWith('ป.')).length;

  const userRoom = isStudent ? currentUser?.room || currentRoom : currentRoom;
  const currentRoomStudents = students.filter((s) => s.room === userRoom);
  const roomAttendance = attendance.filter((a) => a.room === userRoom && a.date === todayDate);

  const presentCount = roomAttendance.filter((a) => a.status === 'มา').length;
  const lateCount = roomAttendance.filter((a) => a.status === 'สาย').length;
  const leaveCount = roomAttendance.filter((a) => a.status === 'ลา').length;
  const absentCount = roomAttendance.filter((a) => a.status === 'ขาด').length;

  const attendanceRate =
    currentRoomStudents.length > 0 ? Math.round((presentCount / currentRoomStudents.length) * 100) : 100;

  const roomAssignments = assignments.filter(
    (a) => a.room === userRoom || a.room === 'ทุกห้อง'
  );

  // Student specific stats
  const studentSubmissions = isStudent && currentUser
    ? submissions.filter((s) => s.studentId === currentUser.id)
    : [];
  const submittedCount = studentSubmissions.length;
  const pendingCount = Math.max(0, roomAssignments.length - submittedCount);

  return (
    <div className="space-y-6 max-w-6xl mx-auto selection:bg-pink-500 selection:text-white pb-6">
      {/* ============================================================== */}
      {/* 0. HEADER BANNER: ธีมชมพู-ขาว นุ่มนวล สวยงาม และอ่านง่าย */}
      {/* ============================================================== */}
      <div className="relative overflow-hidden rounded-3xl bg-white border-2 border-pink-200 shadow-md p-6 sm:p-7">
        <div className="absolute right-0 top-0 w-80 h-80 bg-pink-100/60 rounded-full blur-3xl -mr-16 -mt-16 pointer-events-none" />
        <div className="absolute left-1/3 bottom-0 w-60 h-60 bg-rose-50/50 rounded-full blur-2xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-5">
          <div className="flex items-center gap-4">
            {/* Mascot: Thai boy, white shirt, black shoes, no necktie */}
            <div className="shrink-0 flex items-center gap-2">
              <MascotIcon size="lg" variant="mascot" className="shadow-sm" />
            </div>

            <div className="space-y-1.5">
              <div className="flex flex-wrap items-center gap-2">
                {/* App Profile Badge: NONGDOEN CARE (Pink Border, White BG, Soft Black Text) */}
                <div className="inline-flex items-center px-2.5 py-0.5 rounded-xl bg-white border-2 border-pink-400 shadow-2xs">
                  <span className="font-black text-xs text-slate-700 tracking-tight">
                    NONGDOEN <span className="text-pink-600">CARE</span>
                  </span>
                </div>
                <span className="text-[11px] font-bold text-pink-700 bg-pink-50 px-2.5 py-0.5 rounded-lg border border-pink-200">
                  สพป.หนองคาย เขต 1
                </span>
              </div>

              <h1 className="text-xl sm:text-2xl font-black tracking-tight text-slate-800">
                โรงเรียนหนองเดิ่นศรีเจริญวิทยา
              </h1>

              <p className="text-xs sm:text-sm text-slate-600">
                สวัสดี {currentUser?.prefix} {currentUser?.firstName} {currentUser?.lastName}
                {currentUser?.nickname && (
                  <span className="text-pink-600 font-bold ml-1">({currentUser.nickname})</span>
                )}
                {' '}• ระบบดิจิทัลดูแลช่วยเหลือนักเรียน
              </p>

              <div className="flex flex-wrap items-center gap-2 pt-1 text-xs text-slate-500">
                <span className="inline-flex items-center gap-1 bg-pink-50/80 px-2.5 py-1 rounded-xl text-slate-700 border border-pink-100 font-medium">
                  <GraduationCap className="w-3.5 h-3.5 text-pink-600" />
                  <span>ชั้น อ.1-3 และ ป.1-6</span>
                </span>
                <span className="inline-flex items-center gap-1 bg-pink-50/80 px-2.5 py-1 rounded-xl text-slate-700 border border-pink-100 font-medium">
                  <MapPin className="w-3.5 h-3.5 text-pink-600" />
                  <span>ม.11 ต.หนองกอมเกาะ</span>
                </span>
                <a
                  href="tel:0910610997"
                  className="inline-flex items-center gap-1 bg-pink-50/80 px-2.5 py-1 rounded-xl text-pink-700 border border-pink-200 font-bold hover:bg-pink-100 transition-colors"
                >
                  <Phone className="w-3.5 h-3.5" />
                  <span>0910610997</span>
                </a>
              </div>
            </div>
          </div>

          {/* Quick Room Badge */}
          <div className="flex flex-col items-start md:items-end justify-center shrink-0 bg-gradient-to-br from-pink-50 via-white to-pink-50/40 border-2 border-pink-200 rounded-2xl p-4 min-w-[190px] shadow-2xs">
            <span className="text-[11px] font-bold text-slate-500">
              {isStudent ? 'ห้องเรียนของฉัน' : 'ห้องเรียนปัจจุบัน'}
            </span>
            <span className="text-2xl font-black text-pink-600">
              {userRoom.startsWith('อ.') ? `ชั้นอนุบาล ${userRoom.slice(2)}` : `ชั้นประถมศึกษาปีที่ ${userRoom.slice(2)}`}
            </span>
            <span className="text-xs text-slate-600 mt-0.5 font-medium">
              {isStudent && currentUser?.number ? (
                <>เลขที่ {currentUser.number} • คะแนน {currentUser.exp || 100} EXP ⭐</>
              ) : (
                <>นักเรียนในห้อง {currentRoomStudents.length} คน</>
              )}
            </span>
          </div>
        </div>
      </div>

      {/* ============================================================== */}
      {/* 1. สรุปขึ้นอันแรก: กล่องสรุปภาพรวมวันนี้ (KPI Summary) */}
      {/* ============================================================== */}
      <section className="bg-white rounded-3xl p-6 border-2 border-pink-200 shadow-xs space-y-4">
        <div className="flex items-center justify-between border-b border-pink-100 pb-3">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-pink-100 text-pink-600 flex items-center justify-center font-bold">
              <TrendingUp className="w-4 h-4" />
            </div>
            <div>
              <h2 className="font-black text-slate-800 text-base sm:text-lg">
                สรุปภาพรวม
              </h2>
              <p className="text-xs text-slate-500">
                {isStudent ? 'สรุปข้อมูลการเรียน การบ้าน และคะแนนความดีส่วนบุคคล' : `สรุปสถิติประจำวัน ชั้น ${userRoom}`}
              </p>
            </div>
          </div>
          <span className="text-xs font-bold text-pink-700 bg-pink-50 px-3 py-1 rounded-full border border-pink-200">
            วันที่ {new Date().toLocaleDateString('th-TH', { day: 'numeric', month: 'short', year: 'numeric' })}
          </span>
        </div>

        {/* 4 Summary Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Card 1: Students */}
          <div className="bg-gradient-to-br from-white to-pink-50/50 rounded-2xl p-5 border-2 border-pink-100 shadow-2xs flex flex-col justify-between">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-600">
                {isStudent ? 'เพื่อนร่วมห้อง' : 'นักเรียนทั้งหมด'}
              </span>
              <div className="w-9 h-9 rounded-xl bg-pink-100 text-pink-600 flex items-center justify-center shadow-2xs">
                <Users className="w-4 h-4" />
              </div>
            </div>
            <div className="mt-3">
              <div className="text-3xl font-black text-slate-800">
                {isStudent ? currentRoomStudents.length : totalStudents}
              </div>
              <div className="text-[11px] text-slate-500 mt-1 font-medium">
                <span>ชั้น {userRoom}</span>
                <span className="mx-1">•</span>
                <span>{isStudent ? 'พร้อมเรียนรู้' : `อนุบาล ${kindergartenStudents} / ประถม ${primaryStudents}`}</span>
              </div>
            </div>
          </div>

          {/* Card 2: Attendance */}
          <div className="bg-gradient-to-br from-white to-emerald-50/40 rounded-2xl p-5 border-2 border-emerald-100 shadow-2xs flex flex-col justify-between">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-600">การมาเรียนวันนี้</span>
              <div className="w-9 h-9 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center shadow-2xs">
                <CalendarCheck className="w-4 h-4" />
              </div>
            </div>
            <div className="mt-3">
              <div className="text-3xl font-black text-emerald-600">{attendanceRate}%</div>
              <div className="text-[11px] text-slate-600 mt-1 flex flex-wrap items-center gap-1.5 font-medium">
                <span className="text-emerald-700 font-bold">มา {presentCount}</span>
                <span>•</span>
                <span className="text-amber-600">สาย {lateCount}</span>
                <span>•</span>
                <span className="text-purple-600">ลา {leaveCount}</span>
                <span>•</span>
                <span className="text-rose-600">ขาด {absentCount}</span>
              </div>
            </div>
          </div>

          {/* Card 3: Homework */}
          <div className="bg-gradient-to-br from-white to-sky-50/40 rounded-2xl p-5 border-2 border-sky-100 shadow-2xs flex flex-col justify-between">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-600">
                {isStudent ? 'การบ้านของฉัน' : `การบ้านห้อง ${userRoom}`}
              </span>
              <div className="w-9 h-9 rounded-xl bg-sky-100 text-sky-700 flex items-center justify-center shadow-2xs">
                <BookOpen className="w-4 h-4" />
              </div>
            </div>
            <div className="mt-3">
              <div className="text-3xl font-black text-sky-600">{roomAssignments.length} งาน</div>
              <div className="text-[11px] text-slate-600 mt-1 font-medium">
                {isStudent ? (
                  <span className="text-emerald-700 font-bold">
                    ส่งแล้ว {submittedCount} งาน • รอส่ง {pendingCount} งาน
                  </span>
                ) : (
                  <span>มอบหมายในระบบดิจิทัล</span>
                )}
              </div>
            </div>
          </div>

          {/* Card 4: EXP / Subjects */}
          <div className="bg-gradient-to-br from-white to-purple-50/40 rounded-2xl p-5 border-2 border-purple-100 shadow-2xs flex flex-col justify-between">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-600">
                {isStudent ? 'แต้มความดี EXP' : 'กลุ่มสาระการเรียนรู้'}
              </span>
              <div className="w-9 h-9 rounded-xl bg-purple-100 text-purple-700 flex items-center justify-center shadow-2xs">
                {isStudent ? <Star className="w-4 h-4 fill-purple-400 text-purple-600" /> : <Layers className="w-4 h-4" />}
              </div>
            </div>
            <div className="mt-3">
              <div className="text-3xl font-black text-purple-600">
                {isStudent ? `${currentUser?.exp || 100}` : subjects.length}
              </div>
              <div className="text-[11px] text-purple-700 mt-1 font-medium">
                <span>{isStudent ? 'คะแนนความประพฤติและจิตสาธารณะ' : '8 กลุ่มสาระแกนกลาง'}</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ============================================================== */}
      {/* 2. ต่อด้วยฟังก์ชันลัด: เมนูและทางลัดด่วน */}
      {/* ============================================================== */}
      <section className="bg-white rounded-3xl p-6 border-2 border-pink-200 shadow-xs space-y-4">
        <div className="flex items-center justify-between border-b border-pink-100 pb-3">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-pink-100 text-pink-600 flex items-center justify-center font-bold">
              <Compass className="w-4 h-4" />
            </div>
            <div>
              <h2 className="font-black text-slate-800 text-base sm:text-lg">
                ฟังก์ชันลัด
              </h2>
              <p className="text-xs text-slate-500">
                คลิกเพื่อเข้าสู่หน้าการทำงานหลักได้รวดเร็ว
              </p>
            </div>
          </div>
          <span className="text-xs text-slate-500">
            {isStudent ? 'เมนูสำหรับนักเรียน' : 'เมนูสำหรับคุณครู'}
          </span>
        </div>

        {/* STUDENT SHORTCUTS: Simple & Cute */}
        {isStudent && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <button
              onClick={() => onNavigateTab('student-portal')}
              className="p-5 rounded-2xl border-2 border-pink-200 hover:border-pink-400 bg-pink-50/40 hover:bg-pink-50 transition-all text-left group flex flex-col justify-between cursor-pointer shadow-2xs"
            >
              <div className="flex items-center justify-between mb-3">
                <div className="w-12 h-12 rounded-xl bg-pink-600 text-white flex items-center justify-center group-hover:scale-105 transition-transform shadow-xs">
                  <FileCheck className="w-6 h-6" />
                </div>
                <span className="px-3 py-1 rounded-full bg-pink-600 text-white text-xs font-black shadow-2xs">
                  {roomAssignments.length} งาน
                </span>
              </div>
              <div className="space-y-1">
                <h3 className="font-black text-slate-800 text-base group-hover:text-pink-600 transition-colors">
                  ไปที่หน้าการบ้าน & ติ๊กส่งงาน
                </h3>
                <p className="text-xs text-slate-600 leading-relaxed">
                  ดูรายละเอียดการบ้าน ติ๊กว่าส่งแล้ว (กรณีส่งแล้ว) หรือแนบภาพถ่ายใบงานส่งคุณครู
                </p>
              </div>
              <div className="mt-4 pt-3 border-t border-pink-200/60 flex items-center justify-between text-xs font-bold text-pink-600">
                <span>เปิดดูการบ้านทันที</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </div>
            </button>

            <button
              onClick={() => onNavigateTab('profile')}
              className="p-5 rounded-2xl border-2 border-rose-200 hover:border-rose-400 bg-rose-50/40 hover:bg-rose-50 transition-all text-left group flex flex-col justify-between cursor-pointer shadow-2xs"
            >
              <div className="flex items-center justify-between mb-3">
                <div className="w-12 h-12 rounded-xl bg-rose-600 text-white flex items-center justify-center group-hover:scale-105 transition-transform shadow-xs">
                  <UserIcon className="w-6 h-6" />
                </div>
                <span className="px-3 py-1 rounded-full bg-rose-100 text-rose-800 text-xs font-bold border border-rose-200">
                  ปรับแต่งน่ารัก ✨
                </span>
              </div>
              <div className="space-y-1">
                <h3 className="font-black text-slate-800 text-base group-hover:text-rose-600 transition-colors">
                  ไปที่หน้าบัญชีส่วนตัว & แต่งธีม
                </h3>
                <p className="text-xs text-slate-600 leading-relaxed">
                  ปรับขนาดรูปภาพโปรไฟล์ แต่งธีมสีน่ารัก ใส่ชื่อเล่น และตรวจสอบคะแนน EXP
                </p>
              </div>
              <div className="mt-4 pt-3 border-t border-rose-200/60 flex items-center justify-between text-xs font-bold text-rose-600">
                <span>เปิดหน้าบัญชีส่วนตัว</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </div>
            </button>
          </div>
        )}

        {/* TEACHER SHORTCUTS */}
        {isTeacher && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5">
            <button
              onClick={() => onNavigateTab('seating')}
              className="p-4 rounded-2xl border-2 border-pink-100 hover:border-pink-300 hover:bg-pink-50/50 transition-all text-left group flex items-start gap-3.5 cursor-pointer shadow-2xs"
            >
              <div className="w-10 h-10 rounded-xl bg-pink-100 text-pink-700 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                <LayoutGrid className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-bold text-slate-800 text-sm group-hover:text-pink-600">
                  ผังที่นั่ง & เช็กชื่อห้องเรียน
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  เช็กชื่อประจำวัน มา/สาย/ลา/ขาด และมอบแต้ม EXP
                </p>
              </div>
            </button>

            <button
              onClick={() => onNavigateTab('grading')}
              className="p-4 rounded-2xl border-2 border-pink-100 hover:border-blue-300 hover:bg-blue-50/40 transition-all text-left group flex items-start gap-3.5 cursor-pointer shadow-2xs"
            >
              <div className="w-10 h-10 rounded-xl bg-blue-100 text-blue-700 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                <CheckCircle2 className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-bold text-slate-800 text-sm group-hover:text-blue-600">
                  โต๊ะตรวจงาน & บันทึกคะแนน
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  ตรวจภาพถ่ายการบ้าน ให้คะแนน และพิมพ์คำแนะนำ
                </p>
              </div>
            </button>

            <button
              onClick={() => onNavigateTab('homework')}
              className="p-4 rounded-2xl border-2 border-pink-100 hover:border-purple-300 hover:bg-purple-50/40 transition-all text-left group flex items-start gap-3.5 cursor-pointer shadow-2xs"
            >
              <div className="w-10 h-10 rounded-xl bg-purple-100 text-purple-700 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                <BookOpen className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-bold text-slate-800 text-sm group-hover:text-purple-600">
                  ระบบติดตามการบ้าน
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  ตรวจสอบสถานะส่งงาน ค้างส่ง และส่งแจ้งเตือน
                </p>
              </div>
            </button>

            <button
              onClick={() => onNavigateTab('students')}
              className="p-4 rounded-2xl border-2 border-pink-100 hover:border-amber-300 hover:bg-amber-50/40 transition-all text-left group flex items-start gap-3.5 cursor-pointer shadow-2xs"
            >
              <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                <Users className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-bold text-slate-800 text-sm group-hover:text-amber-600">
                  ทะเบียนนักเรียน (เพิ่ม/ลบ)
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  จัดการรายชื่อ นำเข้า CSV ปรับเพิ่ม ลบ ข้อมูล
                </p>
              </div>
            </button>

            <button
              onClick={() => onNavigateTab('tools')}
              className="p-4 rounded-2xl border-2 border-pink-100 hover:border-teal-300 hover:bg-teal-50/40 transition-all text-left group flex items-start gap-3.5 cursor-pointer shadow-2xs"
            >
              <div className="w-10 h-10 rounded-xl bg-teal-100 text-teal-700 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                <Timer className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-bold text-slate-800 text-sm group-hover:text-teal-600">
                  เครื่องมือครู & วงล้อสุ่ม
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  นาฬิกาจับเวลาในห้องเรียน และวงล้อสุ่มตอบคำถาม
                </p>
              </div>
            </button>

            <button
              onClick={() => onNavigateTab('profile')}
              className="p-4 rounded-2xl border-2 border-pink-100 hover:border-rose-300 hover:bg-rose-50/40 transition-all text-left group flex items-start gap-3.5 cursor-pointer shadow-2xs"
            >
              <div className="w-10 h-10 rounded-xl bg-rose-100 text-rose-700 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                <UserIcon className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-bold text-slate-800 text-sm group-hover:text-rose-600">
                  บัญชีส่วนตัว & สำรองข้อมูล
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  ปรับขนาดรูป แต่งธีม และสำรอง/นำเข้าข้อมูล JSON
                </p>
              </div>
            </button>
          </div>
        )}
      </section>

      {/* ============================================================== */}
      {/* 3. ต่อด้วยข้อมูลรร.: ข้อมูลสถานศึกษา & สีประจำโรงเรียน */}
      {/* ============================================================== */}
      <section className="bg-white rounded-3xl p-6 border-2 border-pink-200 shadow-xs space-y-4">
        <div className="flex items-center justify-between border-b border-pink-100 pb-3">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-pink-100 text-pink-600 flex items-center justify-center font-bold">
              <GraduationCap className="w-4 h-4" />
            </div>
            <div>
              <h2 className="font-black text-slate-800 text-base sm:text-lg">
                ข้อมูลโรงเรียน
              </h2>
              <p className="text-xs text-slate-500">
                โรงเรียนหนองเดิ่นศรีเจริญวิทยา สพป.หนองคาย เขต 1
              </p>
            </div>
          </div>
          <span className="px-2.5 py-0.5 bg-pink-50 text-pink-700 text-xs font-bold rounded-full border border-pink-200">
            ข้อมูลพื้นฐาน
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs leading-relaxed">
          {/* Box 1 */}
          <div className="bg-pink-50/40 p-4 rounded-2xl border border-pink-200/80 space-y-1.5">
            <div className="font-bold text-sm flex items-center gap-1.5 text-pink-700">
              <MapPin className="w-4 h-4" />
              <span>ที่อยู่และการติดต่อ</span>
            </div>
            <p className="text-slate-600">
              <strong>โรงเรียนหนองเดิ่นศรีเจริญวิทยา</strong><br />
              หมู่ 11 ตำบลหนองกอมเกาะ อำเภอเมืองหนองคาย จังหวัดหนองคาย 43000<br />
              โทรศัพท์: 0910610997<br />
              สังกัด สพป.หนองคาย เขต 1
            </p>
          </div>

          {/* Box 2 */}
          <div className="bg-pink-50/40 p-4 rounded-2xl border border-pink-200/80 space-y-1.5">
            <div className="font-bold text-sm flex items-center gap-1.5 text-pink-700">
              <Award className="w-4 h-4" />
              <span>ระดับชั้นที่เปิดสอน</span>
            </div>
            <p className="text-slate-600">
              • <strong>ระดับปฐมวัย:</strong> อนุบาล 1 (อ.1) - อนุบาล 3 (อ.3)<br />
              • <strong>ระดับประถมศึกษา:</strong> ประถมศึกษาปีที่ 1 (ป.1) - ประถมศึกษาปีที่ 6 (ป.6)<br />
              ดูแลเอาใจใส่นักเรียนอย่างใกล้ชิดด้วยระบบ NONGDOEN CARE
            </p>
          </div>

          {/* Box 3 */}
          <div className="bg-pink-50/40 p-4 rounded-2xl border border-pink-200/80 space-y-1.5">
            <div className="font-bold text-sm flex items-center gap-1.5 text-pink-700">
              <Sparkles className="w-4 h-4" />
              <span>สีประจำโรงเรียน & ความหมาย</span>
            </div>
            <p className="text-slate-600">
              <strong>สีประจำโรงเรียน:</strong> <span className="text-pink-600 font-bold">ชมพู</span> - <span className="text-slate-800 font-bold">ดำ</span><br />
              • <strong className="text-pink-600">ชมพู:</strong> ความรัก ความอบอุ่น ความเมตตา และการดูแลเอาใจใส่<br />
              • <strong className="text-slate-800">ดำ:</strong> ความหนักแน่น เข้มแข็ง ในระเบียบวินัยและคุณธรรม
            </p>
          </div>
        </div>
      </section>

      {/* ============================================================== */}
      {/* 4. ต่อด้วยเพลงมาร์ช: เพลงมาร์ชประจำโรงเรียน */}
      {/* ============================================================== */}
      <section className="bg-gradient-to-r from-pink-500 via-rose-500 to-pink-600 rounded-3xl p-6 text-white shadow-md border-2 border-pink-300 flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-white/20 flex items-center justify-center text-white shrink-0 border border-white/30 shadow-inner">
            <Music className="w-7 h-7" />
          </div>
          <div className="space-y-1">
            <div className="inline-flex items-center gap-1 text-[11px] font-bold text-pink-100 uppercase tracking-wider">
              <span>🎵 บทเพลงประจำสถานศึกษา</span>
            </div>
            <h2 className="font-black text-base sm:text-lg text-white">
              เพลงมาร์ชโรงเรียน
            </h2>
            <p className="text-xs text-pink-100 max-w-xl leading-relaxed">
              "หนองเดิ่นศรีเจริญวิทยา สง่างามสมนามสถานศึกษา... แหล่งวิชาการนำล้ำหน้า เกียรติระบือไกล"
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2 w-full md:w-auto justify-end">
          <button
            onClick={onOpenMarchModal}
            className="w-full md:w-auto flex items-center justify-center gap-2 px-5 py-2.5 bg-white text-pink-700 font-black text-xs rounded-xl shadow-md hover:bg-pink-50 transition-colors cursor-pointer"
          >
            <Music className="w-4 h-4 text-pink-600" />
            <span>ฟังเพลงมาร์ช & วิดีโอโรงเรียน</span>
          </button>
        </div>
      </section>

      {/* ============================================================== */}
      {/* 5. ต่อด้วยเว็บไซต์รร.: เว็บไซต์ 2 ตัว (ทางการ และ สื่อสร้างสรรค์) */}
      {/* ============================================================== */}
      <section className="bg-white rounded-3xl p-6 border-2 border-pink-200 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-pink-100 pb-3">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-pink-100 text-pink-600 flex items-center justify-center font-bold">
              <Globe className="w-4 h-4" />
            </div>
            <div>
              <h2 className="font-black text-slate-800 text-base sm:text-lg">
                เว็บไซต์โรงเรียน
              </h2>
              <p className="text-xs text-slate-500">
                เข้าชมเว็บไซต์ทางการและเว็บไซต์สื่อสร้างสรรค์ โรงเรียนหนองเดิ่นศรีเจริญวิทยา
              </p>
            </div>
          </div>
          <span className="text-xs font-bold text-pink-700 bg-pink-50 px-3 py-1 rounded-full border border-pink-200 self-start sm:self-auto">
            มี 2 เว็บไซต์ให้เข้าชม
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Card 1: Official Website (ทางการ) */}
          <div className="rounded-2xl border-2 border-pink-200 bg-gradient-to-br from-pink-50/30 via-white to-white p-5 flex flex-col justify-between hover:shadow-md transition-all">
            <div className="space-y-2.5">
              <div className="flex items-center justify-between">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-pink-600 text-white text-[11px] font-black tracking-wide shadow-2xs">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  เว็บไซต์หลัก (ทางการ)
                </span>
                <span className="text-[11px] text-slate-400 font-bold">www.nsw-school.com</span>
              </div>
              <div>
                <h3 className="font-black text-slate-800 text-base">โรงเรียนหนองเดิ่นศรีเจริญวิทยา (ทางการ)</h3>
                <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                  ศูนย์รวมข้อมูลโครงสร้างสถานศึกษา ข่าวสารราชการ กิจกรรมนักเรียน ข้อมูลบุคลากร และหลักสูตรการศึกษา
                </p>
              </div>
            </div>
            <div className="pt-4 mt-3 border-t border-pink-100 flex items-center justify-between">
              <span className="text-[11px] text-slate-500 font-medium">สังกัด สพป.หนองคาย เขต 1</span>
              <a
                href="https://www.nsw-school.com"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 px-4 py-2 bg-pink-600 hover:bg-pink-700 text-white text-xs font-bold rounded-xl shadow-xs transition-colors cursor-pointer"
              >
                <span>เข้าสู่เว็บไซต์ทางการ</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>
          </div>

          {/* Card 2: Creative Showcase (ไม่ทางการ) */}
          <div className="rounded-2xl border-2 border-rose-200 bg-gradient-to-br from-rose-50/30 via-white to-white p-5 flex flex-col justify-between hover:shadow-md transition-all">
            <div className="space-y-2.5">
              <div className="flex items-center justify-between">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-600 text-white text-[11px] font-black tracking-wide shadow-2xs">
                  <Sparkles className="w-3.5 h-3.5" />
                  เว็บไซต์สื่อสร้างสรรค์ (ไม่ทางการ)
                </span>
                <span className="text-[11px] text-rose-700 font-bold bg-rose-100 px-2 py-0.5 rounded-md">Canva Site</span>
              </div>
              <div>
                <h3 className="font-black text-slate-800 text-base">สื่อประชาสัมพันธ์ & ผลงานสร้างสรรค์</h3>
                <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                  สื่อมัลติมีเดีย ผลงานนวัตกรรมการเรียนรู้ สื่อการสอนสร้างสรรค์ และภาพกิจกรรมน่ารักมีชีวิตชีวาของโรงเรียน
                </p>
              </div>
            </div>
            <div className="pt-4 mt-3 border-t border-rose-100 flex items-center justify-between">
              <span className="text-[11px] text-slate-500 font-medium">สื่อนำเสนอสร้างสรรค์</span>
              <a
                href="https://kku-creative.my.canva.site/dahu41ngfhw"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold rounded-xl shadow-xs transition-colors cursor-pointer"
              >
                <span>เข้าชมเว็บไซต์สื่อสร้างสรรค์</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* ============================================================== */}
      {/* 6. ต่อด้วยไลน์ OA: สแกนรับการแจ้งเตือน / แจ้งเตือนผู้ปกครอง */}
      {/* ============================================================== */}
      <section className="bg-white rounded-3xl p-6 border-2 border-emerald-200 shadow-xs space-y-4">
        <div className="flex items-center justify-between border-b border-emerald-100 pb-3">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-emerald-100 text-emerald-600 flex items-center justify-center font-bold">
              <QrCode className="w-4 h-4" />
            </div>
            <div>
              <h2 className="font-black text-slate-800 text-base sm:text-lg">
                LINE Official Account
              </h2>
              <p className="text-xs text-slate-500">
                {isStudent ? 'สแกนคิวอาร์โค้ดเพื่อรับการแจ้งเตือนผ่าน LINE' : 'ระบบส่งการแจ้งเตือนผู้ปกครองผ่าน LINE OA'}
              </p>
            </div>
          </div>
          <span className="inline-block px-2.5 py-0.5 bg-[#06C755] text-white text-[10px] font-black rounded-full uppercase tracking-wider">
            @nongdoencare
          </span>
        </div>

        {isStudent ? (
          /* STUDENT VIEW: ONLY QR CODE TO SCAN - NO BROADCAST BUTTONS */
          <div className="bg-gradient-to-r from-emerald-50 via-white to-pink-50/30 rounded-2xl p-6 border border-emerald-200 flex flex-col sm:flex-row items-center gap-6">
            <div className="bg-white p-2.5 rounded-2xl shadow-md shrink-0 border-2 border-emerald-400">
              <img
                src="https://api.qrserver.com/v1/create-qr-code/?size=160x160&data=https://line.me/R/ti/p/@nongdoencare"
                alt="LINE OA QR Code"
                className="w-32 h-32 sm:w-36 sm:h-36 object-contain"
              />
            </div>

            <div className="space-y-2 text-center sm:text-left flex-1">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-[#06C755] text-white text-[11px] font-black rounded-lg uppercase tracking-wider shadow-2xs">
                <QrCode className="w-3.5 h-3.5" />
                <span>แสกนไลน์เพื่อรับการแจ้งเตือน</span>
              </div>
              <h3 className="text-base sm:text-lg font-bold text-slate-800">
                สแกน QR Code เพื่อเชื่อมต่อการแจ้งเตือนเข้ามือถือผู้ปกครอง
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed max-w-xl">
                เปิดแอป LINE บนมือถือแล้วสแกนคิวอาร์โค้ดนี้ เพื่อรับผลการเช็กชื่อประจำวัน การบ้าน และข่าวสารสำคัญจากโรงเรียนหนองเดิ่นศรีเจริญวิทยา
              </p>
              <div className="pt-1">
                <a
                  href="https://line.me/R/ti/p/@nongdoencare"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-4 py-2 bg-[#06C755] text-white font-bold text-xs rounded-xl shadow-xs hover:bg-[#05b34c] transition-colors"
                >
                  <span>เปิด LINE เพิ่มเพื่อน (@nongdoencare)</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </div>
            </div>
          </div>
        ) : (
          /* TEACHER VIEW: LINE OA Summary & Broadcast Alerts */
          <div className="bg-gradient-to-r from-emerald-50 via-white to-pink-50/30 rounded-2xl p-6 border border-emerald-200 flex flex-col lg:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-4">
              <div className="w-20 h-20 bg-white rounded-2xl p-1.5 shadow-md flex items-center justify-center shrink-0 border border-emerald-300">
                <img
                  src="https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=https://line.me/R/ti/p/@nongdoencare"
                  alt="LINE OA QR Code"
                  className="w-full h-full object-contain"
                />
              </div>
              <div>
                <div className="inline-block px-2.5 py-0.5 bg-[#06C755] text-white text-[10px] font-black rounded-md mb-1 tracking-wider uppercase shadow-2xs">
                  LINE OFFICIAL ACCOUNT
                </div>
                <h3 className="text-base sm:text-lg font-bold text-slate-800">
                  ระบบส่งการแจ้งเตือนผู้ปกครองผ่าน LINE Official Account
                </h3>
                <p className="text-xs text-slate-600 max-w-xl mt-1 leading-relaxed">
                  ส่งผลการเช็กชื่อประจำวัน แจ้งเตือนการบ้านค้างส่ง และส่งข้อความประชาสัมพันธ์ของโรงเรียนหนองเดิ่นศรีเจริญวิทยา ถึงมือผู้ปกครอง
                </p>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-2.5 w-full lg:w-auto justify-start lg:justify-end">
              <button
                onClick={() => onOpenLineModal('attendance')}
                className="flex items-center gap-1.5 px-4 py-2.5 bg-[#06C755] text-white font-bold text-xs rounded-xl shadow-xs hover:bg-[#05b34c] transition-colors cursor-pointer"
              >
                <Send className="w-3.5 h-3.5 text-white" />
                <span>แจ้งเตือนเช็กชื่อ</span>
              </button>
              <button
                onClick={() => onOpenLineModal('homework')}
                className="flex items-center gap-1.5 px-4 py-2.5 bg-white text-pink-700 font-bold text-xs rounded-xl border-2 border-pink-300 hover:bg-pink-50 transition-colors cursor-pointer"
              >
                <Bell className="w-3.5 h-3.5 text-pink-600" />
                <span>แจ้งเตือนการบ้าน</span>
              </button>
            </div>
          </div>
        )}
      </section>
    </div>
  );
};
