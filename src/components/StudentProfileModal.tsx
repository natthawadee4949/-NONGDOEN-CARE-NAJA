import React from 'react';
import { Student } from '../types';
import { User, Phone, Star, ShieldCheck, AlertTriangle, AlertOctagon, Trash2, Edit3 } from 'lucide-react';
import { playSuccessChime, playClickSound } from '../utils/audio';

interface StudentProfileModalProps {
  student: Student | null;
  onClose: () => void;
  onAwardExp: (studentId: string, amount: number) => void;
  onDeleteStudent?: (studentId: string) => void;
}

export const StudentProfileModal: React.FC<StudentProfileModalProps> = ({
  student,
  onClose,
  onAwardExp,
  onDeleteStudent,
}) => {
  if (!student) return null;

  const getStatusInfo = (status: string) => {
    switch (status) {
      case 'normal':
        return { label: 'กลุ่มปกติ', color: 'text-emerald-700 bg-emerald-50 border-emerald-200' };
      case 'watch':
        return { label: 'กลุ่มเฝ้าระวัง', color: 'text-amber-700 bg-amber-50 border-amber-200' };
      case 'danger':
        return { label: 'กลุ่มเฝ้าระวังเข้มงวด', color: 'text-rose-700 bg-rose-50 border-rose-200' };
      default:
        return { label: 'ปกติ', color: 'text-slate-700 bg-slate-50 border-slate-200' };
    }
  };

  const statusInfo = getStatusInfo(student.status);

  const handleDelete = () => {
    if (window.confirm(`ยืนยันการลบ ${student.prefix}${student.firstName} ${student.lastName} ออกจากระบบ?`)) {
      if (onDeleteStudent) {
        onDeleteStudent(student.id);
        playClickSound();
        onClose();
      }
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs">
      <div className="bg-white rounded-3xl p-6 sm:p-7 border border-slate-200 shadow-2xl max-w-sm w-full space-y-4 animate-fade-in text-xs">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <h3 className="font-black text-slate-900 text-sm sm:text-base flex items-center gap-1.5">
            <User className="w-4 h-4 text-rose-600" />
            <span>ข้อมูลนักเรียนรายบุคคล</span>
          </h3>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600 font-bold text-lg cursor-pointer">
            ✕
          </button>
        </div>

        {/* Profile Card */}
        <div className="text-center space-y-2 py-2">
          <div className="w-16 h-16 mx-auto rounded-2xl bg-gradient-to-tr from-rose-600 to-pink-500 text-white font-black text-2xl flex items-center justify-center shadow-md">
            {student.firstName.slice(0, 1)}
          </div>
          <div>
            <h4 className="font-black text-slate-900 text-base">
              {student.prefix}{student.firstName} {student.lastName}
            </h4>
            <div className="text-rose-600 font-bold text-xs">
              น้อง{student.nickname}
            </div>
            <div className="text-slate-500 text-[11px] mt-0.5 font-medium">
              ชั้น {student.room} • เลขที่ {student.number}
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 gap-2 text-center">
          <div className="bg-slate-50 p-3 rounded-2xl border border-slate-200">
            <span className="text-[10px] text-slate-400 font-bold block mb-0.5">คะแนนความดี</span>
            <div className="font-black text-amber-600 text-sm flex items-center justify-center gap-1">
              <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-500" />
              <span>{student.exp} EXP</span>
            </div>
          </div>

          <div className="bg-slate-50 p-3 rounded-2xl border border-slate-200">
            <span className="text-[10px] text-slate-400 font-bold block mb-0.5">การดูแลช่วยเหลือ</span>
            <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border inline-block ${statusInfo.color}`}>
              {statusInfo.label}
            </span>
          </div>
        </div>

        {/* Parent Contact */}
        <div className="bg-slate-50 p-3 rounded-2xl border border-slate-200 flex items-center justify-between">
          <div>
            <span className="text-[10px] text-slate-400 font-bold block">เบอร์ติดต่อผู้ปกครอง</span>
            <span className="font-bold text-slate-800 text-xs">{student.phone}</span>
          </div>
          <a
            href={`tel:${student.phone}`}
            className="p-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold transition-colors"
            title="โทรหาผู้ปกครอง"
          >
            <Phone className="w-4 h-4" />
          </a>
        </div>

        {/* Actions */}
        <div className="space-y-2 pt-2 border-t border-slate-100">
          <button
            onClick={() => {
              onAwardExp(student.id, 10);
              playSuccessChime();
            }}
            className="w-full py-2.5 bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-300 rounded-xl font-black transition-colors flex items-center justify-center gap-1.5 cursor-pointer shadow-2xs"
          >
            <Star className="w-4 h-4 fill-amber-400 text-amber-600" />
            <span>+10 EXP คะแนนความดี</span>
          </button>

          <div className="flex items-center gap-2">
            {onDeleteStudent && (
              <button
                onClick={handleDelete}
                className="flex-1 py-2 bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 rounded-xl font-bold transition-colors flex items-center justify-center gap-1 cursor-pointer"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>ลบนักเรียน</span>
              </button>
            )}
            <button
              onClick={onClose}
              className="flex-1 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl font-bold transition-colors cursor-pointer"
            >
              ปิดหน้าต่าง
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
