import React, { useState } from 'react';
import { Student, AttendanceRecord, AttendanceStatus, ClassRoom, User } from '../types';
import {
  CalendarCheck,
  CheckCircle2,
  Send,
  Sparkles,
  User as UserIcon,
  Phone,
  Star,
  Monitor,
  RotateCcw,
  UserPlus,
} from 'lucide-react';
import { playClickSound, playSuccessChime } from '../utils/audio';
import { MascotIcon } from './MascotIcon';

interface TabSeatingProps {
  students: Student[];
  attendance: AttendanceRecord[];
  currentRoom: ClassRoom;
  currentUser: User | null;
  selectedDate: string;
  onChangeDate: (date: string) => void;
  onUpdateAttendance: (studentId: string, status: AttendanceStatus) => void;
  onMarkAllPresent: () => void;
  onOpenLineModal: (mode: 'attendance') => void;
  onAwardExp: (studentId: string, amount: number) => void;
  onSelectStudent: (student: Student) => void;
  onOpenAddStudent?: () => void;
}

export const TabSeating: React.FC<TabSeatingProps> = ({
  students,
  attendance,
  currentRoom,
  selectedDate,
  onChangeDate,
  onUpdateAttendance,
  onMarkAllPresent,
  onOpenLineModal,
  onAwardExp,
  onSelectStudent,
  onOpenAddStudent,
}) => {
  const [clickMode, setClickMode] = useState<'cycle' | AttendanceStatus>('cycle');

  const roomStudents = students
    .filter((s) => s.room === currentRoom)
    .sort((a, b) => a.number - b.number);

  const getStudentStatus = (studentId: string): AttendanceStatus => {
    const record = attendance.find(
      (a) => a.studentId === studentId && a.room === currentRoom && a.date === selectedDate
    );
    return record ? record.status : 'มา';
  };

  const handleDeskClick = (studentId: string) => {
    playClickSound();
    const current = getStudentStatus(studentId);
    let next: AttendanceStatus = 'มา';

    if (clickMode === 'cycle') {
      const order: AttendanceStatus[] = ['มา', 'สาย', 'ลา', 'ขาด'];
      const nextIndex = (order.indexOf(current) + 1) % order.length;
      next = order[nextIndex];
    } else {
      next = clickMode;
    }

    onUpdateAttendance(studentId, next);
  };

  const presentCount = roomStudents.filter((s) => getStudentStatus(s.id) === 'มา').length;
  const lateCount = roomStudents.filter((s) => getStudentStatus(s.id) === 'สาย').length;
  const leaveCount = roomStudents.filter((s) => getStudentStatus(s.id) === 'ลา').length;
  const absentCount = roomStudents.filter((s) => getStudentStatus(s.id) === 'ขาด').length;

  const total = roomStudents.length;
  const rate = total > 0 ? Math.round((presentCount / total) * 100) : 100;

  const getStatusColor = (status: AttendanceStatus) => {
    switch (status) {
      case 'มา':
        return 'bg-emerald-500 text-white border-emerald-600 hover:bg-emerald-600';
      case 'สาย':
        return 'bg-amber-500 text-white border-amber-600 hover:bg-amber-600';
      case 'ลา':
        return 'bg-purple-500 text-white border-purple-600 hover:bg-purple-600';
      case 'ขาด':
        return 'bg-rose-600 text-white border-rose-700 hover:bg-rose-700';
    }
  };

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-xs space-y-5">
        {/* Header Toolbar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-5">
          <div className="flex items-center gap-3">
            <MascotIcon size="md" variant="mascot" />
            <div>
              <h2 className="text-lg font-black text-slate-900 flex items-center gap-2">
                <CalendarCheck className="w-5 h-5 text-rose-600" />
                <span>ผังที่นั่งห้องเรียน & ระบบเช็กชื่อ</span>
                <span className="text-xs font-black text-rose-700 bg-rose-50 px-3 py-1 rounded-full border border-rose-200">
                  ชั้น {currentRoom}
                </span>
              </h2>
              <p className="text-xs text-slate-500 mt-0.5 font-medium">
                คลิกที่โต๊ะเพื่อเปลี่ยนสถานะ (มา/สาย/ลา/ขาด) หรือกดดูข้อมูลด่วนของนักเรียน
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            <div className="flex items-center gap-1.5 bg-slate-50 border border-slate-200 rounded-xl px-3 py-2">
              <span className="text-xs font-bold text-slate-600">วันที่:</span>
              <input
                type="date"
                value={selectedDate}
                onChange={(e) => onChangeDate(e.target.value)}
                className="text-xs font-black text-slate-900 bg-transparent focus:outline-hidden cursor-pointer"
              />
            </div>

            {onOpenAddStudent && (
              <button
                onClick={onOpenAddStudent}
                className="flex items-center gap-1.5 px-3 py-2 bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold rounded-xl shadow-2xs transition-colors cursor-pointer"
              >
                <UserPlus className="w-4 h-4 text-rose-400" />
                <span>+ เพิ่มนักเรียน</span>
              </button>
            )}

            <button
              onClick={() => {
                playSuccessChime();
                onMarkAllPresent();
              }}
              disabled={roomStudents.length === 0}
              className="flex items-center gap-1.5 px-3 py-2 bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white text-xs font-bold rounded-xl shadow-2xs transition-colors cursor-pointer"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>มาครบทุกคน</span>
            </button>

            <button
              onClick={() => onOpenLineModal('attendance')}
              className="flex items-center gap-1.5 px-3 py-2 bg-[#06C755] hover:bg-[#05a847] text-white text-xs font-bold rounded-xl shadow-2xs transition-colors cursor-pointer"
            >
              <Send className="w-4 h-4" />
              <span>สรุปส่ง LINE OA</span>
            </button>
          </div>
        </div>

        {/* Progress & Quick Mode Selector */}
        <div className="bg-gradient-to-r from-rose-50/60 to-slate-50 p-4 rounded-2xl border border-rose-100 flex flex-col md:flex-row md:items-center justify-between gap-4">
          {/* Progress */}
          <div className="flex-1 max-w-md space-y-1.5">
            <div className="flex items-center justify-between text-xs font-bold">
              <span className="text-slate-700">อัตราการมาเรียน: {rate}%</span>
              <span className="text-emerald-700">
                มา {presentCount} / ทั้งหมด {total} คน
                {lateCount > 0 && <span className="text-amber-600 ml-1.5">(สาย {lateCount})</span>}
                {leaveCount > 0 && <span className="text-purple-600 ml-1.5">(ลา {leaveCount})</span>}
                {absentCount > 0 && <span className="text-rose-600 ml-1.5">(ขาด {absentCount})</span>}
              </span>
            </div>
            <div className="w-full bg-slate-200 h-2.5 rounded-full overflow-hidden">
              <div
                className="bg-gradient-to-r from-emerald-500 to-teal-500 h-full rounded-full transition-all duration-300"
                style={{ width: `${rate}%` }}
              />
            </div>
          </div>

          {/* Mode Selector Chips */}
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-xs font-bold text-slate-700">โหมดคลิกโต๊ะ:</span>
            <div className="flex items-center gap-1 bg-white p-1 rounded-xl border border-slate-200 text-xs shadow-2xs">
              <button
                onClick={() => setClickMode('cycle')}
                className={`px-2.5 py-1 rounded-lg font-bold transition-colors flex items-center gap-1 cursor-pointer ${
                  clickMode === 'cycle' ? 'bg-slate-900 text-white' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <RotateCcw className="w-3 h-3" />
                <span>วนรอบ</span>
              </button>
              <button
                onClick={() => setClickMode('มา')}
                className={`px-2.5 py-1 rounded-lg font-bold transition-colors cursor-pointer ${
                  clickMode === 'มา' ? 'bg-emerald-600 text-white' : 'text-emerald-700 hover:bg-emerald-50'
                }`}
              >
                ● มา
              </button>
              <button
                onClick={() => setClickMode('สาย')}
                className={`px-2.5 py-1 rounded-lg font-bold transition-colors cursor-pointer ${
                  clickMode === 'สาย' ? 'bg-amber-600 text-white' : 'text-amber-700 hover:bg-amber-50'
                }`}
              >
                ● สาย
              </button>
              <button
                onClick={() => setClickMode('ลา')}
                className={`px-2.5 py-1 rounded-lg font-bold transition-colors cursor-pointer ${
                  clickMode === 'ลา' ? 'bg-purple-600 text-white' : 'text-purple-700 hover:bg-purple-50'
                }`}
              >
                ● ลา
              </button>
              <button
                onClick={() => setClickMode('ขาด')}
                className={`px-2.5 py-1 rounded-lg font-bold transition-colors cursor-pointer ${
                  clickMode === 'ขาด' ? 'bg-rose-600 text-white' : 'text-rose-700 hover:bg-rose-50'
                }`}
              >
                ● ขาด
              </button>
            </div>
          </div>
        </div>

        {/* Chalkboard / Front of Classroom */}
        <div className="w-full bg-slate-900 text-slate-200 py-3 px-4 rounded-2xl text-center text-xs font-bold border border-slate-700 flex items-center justify-center gap-2 shadow-inner">
          <Monitor className="w-4 h-4 text-rose-400" />
          <span>กระดานหน้าชั้นเรียน / โต๊ะคุณครูประจำชั้น โรงเรียนหนองเดิ่นศรีเจริญวิทยา</span>
        </div>

        {/* Desks Grid */}
        {roomStudents.length === 0 ? (
          <div className="text-center py-12 px-4 bg-gradient-to-b from-rose-50/40 to-slate-50 rounded-2xl border-2 border-dashed border-rose-200 space-y-4">
            <MascotIcon size="xl" variant="mascot" className="mx-auto" />
            <div className="space-y-1 max-w-md mx-auto">
              <h3 className="text-base font-black text-slate-900">
                ยังไม่มีข้อมูลนักเรียนในผังชั้นเรียน {currentRoom}
              </h3>
              <p className="text-xs text-slate-500 font-medium">
                เพิ่มนักเรียนจริงของท่าน เพื่อแสดงโต๊ะนักเรียนและบันทึกการเช็กชื่อในหน้านี้
              </p>
            </div>
            {onOpenAddStudent && (
              <button
                onClick={onOpenAddStudent}
                className="inline-flex items-center gap-2 px-5 py-2.5 bg-rose-600 hover:bg-rose-700 text-white text-xs font-black rounded-xl shadow-md transition-all active:scale-95 cursor-pointer"
              >
                <UserPlus className="w-4 h-4" />
                <span>+ เพิ่มนักเรียนเข้าชั้น {currentRoom}</span>
              </button>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3.5 pt-2">
            {roomStudents.map((student) => {
              const status = getStudentStatus(student.id);
              const statusColor = getStatusColor(status);

              return (
                <div
                  key={student.id}
                  className="group relative bg-white border border-slate-200 rounded-2xl p-3 shadow-2xs hover:shadow-md hover:border-rose-300 transition-all flex flex-col justify-between min-h-[140px]"
                >
                  {/* Top Bar: Number & Status Badge */}
                  <div className="flex items-center justify-between">
                    <span className="w-6 h-6 rounded-full bg-slate-100 text-slate-700 text-xs font-black flex items-center justify-center border border-slate-200">
                      {student.number}
                    </span>

                    <button
                      onClick={() => handleDeskClick(student.id)}
                      className={`text-[11px] font-black px-2.5 py-0.5 rounded-full border shadow-2xs transition-transform active:scale-90 cursor-pointer ${statusColor}`}
                      title="คลิกเพื่อเปลี่ยนสถานะ"
                    >
                      {status}
                    </button>
                  </div>

                  {/* Student Name */}
                  <button
                    onClick={() => onSelectStudent(student)}
                    className="my-2 text-left hover:text-rose-600 transition-colors cursor-pointer"
                  >
                    <div className="font-black text-xs text-slate-900 leading-tight">
                      {student.prefix}{student.firstName}
                    </div>
                    <div className="text-[11px] text-slate-600 font-medium">
                      {student.lastName}
                    </div>
                    <div className="text-[10px] text-rose-600 font-bold mt-0.5">
                      น้อง{student.nickname}
                    </div>
                  </button>

                  {/* Bottom Bar: EXP and Actions */}
                  <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-[10px]">
                    <div className="flex items-center gap-1 font-bold text-amber-600">
                      <Star className="w-3 h-3 fill-amber-400 text-amber-500" />
                      <span>{student.exp}</span>
                    </div>

                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        playSuccessChime();
                        onAwardExp(student.id, 5);
                      }}
                      className="px-1.5 py-0.5 bg-amber-50 hover:bg-amber-100 text-amber-800 font-black rounded border border-amber-200 transition-colors"
                      title="ให้แต้มความดี +5 EXP"
                    >
                      +5 ดาว
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};
