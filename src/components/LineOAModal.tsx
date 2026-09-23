import React, { useState, useEffect } from 'react';
import { Student, Assignment, AttendanceRecord, ClassRoom, User } from '../types';
import {
  Send,
  Bell,
  Copy,
  Check,
  QrCode,
  Sparkles,
  ExternalLink,
  ShieldCheck,
  Heart,
} from 'lucide-react';
import { playSuccessChime } from '../utils/audio';

interface LineOAModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialMode: 'attendance' | 'homework';
  currentRoom: ClassRoom;
  students: Student[];
  attendance: AttendanceRecord[];
  assignments: Assignment[];
  selectedDate: string;
  currentUser?: User | null;
}

export const LineOAModal: React.FC<LineOAModalProps> = ({
  isOpen,
  onClose,
  initialMode,
  currentRoom,
  students,
  attendance,
  assignments,
  selectedDate,
  currentUser,
}) => {
  const [mode, setMode] = useState<'attendance' | 'homework'>(initialMode);
  const [customMessage, setCustomMessage] = useState<string>('');
  const [copied, setCopied] = useState<boolean>(false);

  const isStudent = currentUser?.role === 'student';

  useEffect(() => {
    setMode(initialMode);
  }, [initialMode]);

  const roomStudents = students.filter((s) => s.room === currentRoom);
  const roomAttendance = attendance.filter((a) => a.room === currentRoom && a.date === selectedDate);

  const presentCount = roomAttendance.filter((a) => a.status === 'มา').length;
  const lateCount = roomAttendance.filter((a) => a.status === 'สาย').length;
  const leaveCount = roomAttendance.filter((a) => a.status === 'ลา').length;
  const absentCount = roomAttendance.filter((a) => a.status === 'ขาด').length;
  const total = roomStudents.length;
  const rate = total > 0 ? Math.round((presentCount / total) * 100) : 100;

  const roomAssignments = assignments.filter((a) => a.room === currentRoom || a.room === 'ทุกห้อง');

  // Generate Message Template for Teacher
  useEffect(() => {
    if (isStudent) return;

    if (mode === 'attendance') {
      const msg = `📢 แจ้งผลการมาเรียนประจำวัน โรงเรียนหนองเดิ่นศรีเจริญวิทยา สพป.หนองคาย เขต 1
🗓️ ประจำวันที่: ${selectedDate}
🏫 ระดับชั้น: ${currentRoom}
👥 นักเรียนทั้งหมด: ${total} คน

✅ มาเรียน: ${presentCount} คน
⏳ มาสาย: ${lateCount} คน
📝 ลา: ${leaveCount} คน
❌ ขาดเรียน: ${absentCount} คน
📊 คิดเป็นอัตราการมาเรียน: ${rate}%

ครูประจำชั้นขอขอบคุณท่านผู้ปกครองที่ให้ความร่วมมือในการส่งบุตรหลานเข้าเรียนอย่างสม่ำเสมอครับ/ค่ะ
📞 สอบถามเพิ่มเติม โทร. 0910610997
🌐 www.nsw-school.com`;
      setCustomMessage(msg);
    } else {
      const taskList = roomAssignments.map((a, i) => `${i + 1}. [${a.subject}] ${a.title} (ส่งภายใน ${a.dueDate})`).join('\n');
      const msg = `📢 แจ้งเตือนการบ้านและภาระงาน โรงเรียนหนองเดิ่นศรีเจริญวิทยา
🏫 ระดับชั้น: ${currentRoom}
📌 รายการงานที่ต้องส่ง:
${taskList || 'ยังไม่มีการบ้านค้างในขณะนี้'}

ขอความกรุณาท่านผู้ปกครองช่วยติดตามดูแลบุตรหลานในการทำแบบฝึกหัด และถ่ายรูปส่งในระบบ NONGDOEN CARE ด้วยครับ/ค่ะ
📞 โทร. 0910610997`;
      setCustomMessage(msg);
    }
  }, [mode, currentRoom, selectedDate, presentCount, lateCount, leaveCount, absentCount, total, rate, roomAssignments, isStudent]);

  if (!isOpen) return null;

  const handleCopy = () => {
    navigator.clipboard.writeText(customMessage).then(() => {
      setCopied(true);
      playSuccessChime();
      setTimeout(() => setCopied(false), 2000);
    });
  };

  const handleSendLine = () => {
    const url = `https://line.me/R/share?text=${encodeURIComponent(customMessage)}`;
    window.open(url, '_blank');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs">
      <div className="bg-white rounded-3xl p-6 sm:p-7 border border-slate-200 shadow-2xl max-w-lg w-full space-y-4 animate-fade-in relative">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-[#06C755] flex items-center justify-center text-white font-bold shadow-2xs">
              <QrCode className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-extrabold text-slate-900 text-sm sm:text-base">
                {isStudent ? 'แสกนไลน์เพื่อรับการแจ้งเตือน' : 'ระบบแจ้งเตือนผ่าน LINE OA'}
              </h3>
              <span className="text-[11px] text-slate-500 font-medium">โรงเรียนหนองเดิ่นศรีเจริญวิทยา</span>
            </div>
          </div>

          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 font-bold text-lg p-1 rounded-lg hover:bg-slate-100 transition-colors"
          >
            ✕
          </button>
        </div>

        {/* STUDENT VIEW: ONLY QR CODE - NO BROADCAST CONTROLS */}
        {isStudent ? (
          <div className="space-y-4 py-2 text-center">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-emerald-100 text-emerald-800 text-xs font-bold rounded-full border border-emerald-200">
              <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
              <span>LINE Official Account: @nongdoencare</span>
            </div>

            <div className="bg-gradient-to-b from-emerald-50 to-white p-6 rounded-3xl border-2 border-emerald-200 max-w-xs mx-auto shadow-sm space-y-3">
              <div className="bg-white p-3 rounded-2xl shadow-md border border-emerald-100 inline-block">
                <img
                  src="https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=https://line.me/R/ti/p/@nongdoencare"
                  alt="LINE QR Code"
                  className="w-48 h-48 object-contain mx-auto"
                />
              </div>
              <p className="text-xs text-slate-600 leading-relaxed font-medium">
                ให้ผู้ปกครองหรือนักเรียนใช้แอป LINE สแกนคิวอาร์โค้ดนี้ เพื่อรับผลเช็กชื่อ การบ้าน และข่าวสารจากโรงเรียน
              </p>
            </div>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-2.5 pt-2">
              <a
                href="https://line.me/R/ti/p/@nongdoencare"
                target="_blank"
                rel="noopener noreferrer"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-2.5 bg-[#06C755] hover:bg-[#05a847] text-white font-bold text-xs rounded-xl shadow-md transition-colors"
              >
                <span>เปิดแอป LINE เพิ่มเพื่อนทันที</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>

              <button
                onClick={onClose}
                className="w-full sm:w-auto px-5 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-xl transition-colors cursor-pointer"
              >
                ปิดหน้าต่าง
              </button>
            </div>
          </div>
        ) : (
          /* TEACHER VIEW: Broadcast controls and template sender */
          <>
            {/* LINE OA Mini Card with QR */}
            <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-3 flex items-center gap-3">
              <div className="w-16 h-16 bg-white rounded-xl p-1 shrink-0 border border-emerald-300 shadow-2xs">
                <img
                  src="https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=https://line.me/R/ti/p/@nongdoencare"
                  alt="LINE QR"
                  className="w-full h-full object-contain"
                />
              </div>
              <div className="text-xs">
                <span className="px-1.5 py-0.5 bg-[#06C755] text-white text-[9px] font-black rounded uppercase">
                  LINE OFFICIAL
                </span>
                <h4 className="font-extrabold text-emerald-950 mt-0.5">
                  NONGDOEN CARE โรงเรียนหนองเดิ่นศรีเจริญวิทยา
                </h4>
                <p className="text-slate-600 text-[11px] mt-0.5">
                  ส่งข้อความสรุปการมาเรียนหรือการบ้านเข้าห้องแชตผู้ปกครอง
                </p>
              </div>
            </div>

            {/* Mode Switcher */}
            <div className="flex gap-2">
              <button
                onClick={() => setMode('attendance')}
                className={`flex-1 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                  mode === 'attendance'
                    ? 'bg-emerald-600 text-white shadow-xs'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                <Send className="w-3.5 h-3.5" />
                <span>เตือนการมาเรียน</span>
              </button>
              <button
                onClick={() => setMode('homework')}
                className={`flex-1 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                  mode === 'homework'
                    ? 'bg-emerald-600 text-white shadow-xs'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                <Bell className="w-3.5 h-3.5" />
                <span>เตือนการบ้าน</span>
              </button>
            </div>

            {/* Editable Message Textarea */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                ข้อความที่จะส่ง (สามารถพิมพ์แก้ไขเพิ่มเติมได้):
              </label>
              <textarea
                value={customMessage}
                onChange={(e) => setCustomMessage(e.target.value)}
                rows={7}
                className="w-full bg-slate-50 border border-slate-300 rounded-xl p-3 text-xs text-slate-900 focus:bg-white focus:border-emerald-500 focus:outline-hidden font-mono leading-relaxed"
              />
            </div>

            {/* Action Buttons */}
            <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
              <button
                onClick={handleCopy}
                className="flex items-center gap-1.5 px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-xl transition-colors cursor-pointer"
              >
                {copied ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
                <span>{copied ? 'คัดลอกแล้ว!' : 'คัดลอกข้อความ'}</span>
              </button>

              <button
                onClick={handleSendLine}
                className="flex items-center gap-1.5 px-5 py-2 bg-[#06C755] hover:bg-[#05a847] text-white text-xs font-bold rounded-xl shadow-md transition-colors cursor-pointer"
              >
                <ExternalLink className="w-4 h-4" />
                <span>ส่งข้อความเข้า LINE ทันที</span>
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};
