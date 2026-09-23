import React, { useState } from 'react';
import { Student, Assignment, Submission, ClassRoom } from '../types';
import {
  BookOpen,
  CheckCircle2,
  Clock,
  AlertCircle,
  Send,
  Eye,
  FileText,
  Sparkles,
} from 'lucide-react';
import { playSuccessChime } from '../utils/audio';

interface TabHomeworkProps {
  students: Student[];
  assignments: Assignment[];
  submissions: Submission[];
  currentRoom: ClassRoom;
  onOpenLineModal: (mode: 'homework') => void;
  onBatchMarkSubmitted: (assignmentId: string) => void;
  onViewImage: (imageUrl: string, title: string) => void;
}

export const TabHomework: React.FC<TabHomeworkProps> = ({
  students,
  assignments,
  submissions,
  currentRoom,
  onOpenLineModal,
  onBatchMarkSubmitted,
  onViewImage,
}) => {
  const [filterStatus, setFilterStatus] = useState<'all' | 'pending' | 'submitted' | 'checked'>('all');
  const [activeAssignmentId, setActiveAssignmentId] = useState<string>(assignments[0]?.id || '');

  const roomAssignments = assignments.filter((a) => a.room === currentRoom || a.room === 'ทุกห้อง');
  const currentAssignment = assignments.find((a) => a.id === activeAssignmentId) || roomAssignments[0];
  const roomStudents = students.filter((s) => s.room === currentRoom);

  const getSubmission = (studentId: string) => {
    if (!currentAssignment) return null;
    return submissions.find(
      (s) => s.assignmentId === currentAssignment.id && s.studentId === studentId
    );
  };

  const filteredStudents = roomStudents.filter((student) => {
    const sub = getSubmission(student.id);
    if (filterStatus === 'all') return true;
    if (filterStatus === 'pending') return !sub;
    if (filterStatus === 'submitted') return !!sub && sub.status === 'submitted';
    if (filterStatus === 'checked') return !!sub && sub.status === 'graded';
    return true;
  });

  const submittedCount = roomStudents.filter((s) => !!getSubmission(s.id)).length;
  const pendingCount = roomStudents.length - submittedCount;

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs space-y-5">
        {/* Header Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-4">
          <div>
            <h2 className="text-lg font-extrabold text-slate-900 flex items-center gap-2">
              <BookOpen className="w-5 h-5 text-rose-600" />
              <span>ติดตามการบ้านและสถานะการส่งงาน</span>
              <span className="text-xs font-bold text-rose-700 bg-rose-50 px-2.5 py-0.5 rounded-full border border-rose-200">
                ชั้น {currentRoom}
              </span>
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              ติดตามรายบุคคล แยกตามห้องเรียน และแจ้งเตือนผู้ปกครองผ่าน LINE OA ได้ทันที
            </p>
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            <button
              onClick={() => onOpenLineModal('homework')}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-[#06C755] hover:bg-[#05a847] text-white text-xs font-bold rounded-lg shadow-2xs transition-colors"
            >
              <Send className="w-4 h-4" />
              <span>แจ้งเตือนการบ้านผ่าน LINE OA</span>
            </button>
          </div>
        </div>

        {/* Assignment Tabs & Summary Card */}
        <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-3">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-xs font-bold text-slate-700 shrink-0">เลือกงาน:</span>
            <div className="flex items-center gap-1.5 flex-wrap">
              {roomAssignments.map((asg) => (
                <button
                  key={asg.id}
                  onClick={() => setActiveAssignmentId(asg.id)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                    (currentAssignment?.id === asg.id)
                      ? 'bg-rose-600 text-white shadow-xs'
                      : 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-100'
                  }`}
                >
                  [{asg.subject}] {asg.title}
                </button>
              ))}
            </div>
          </div>

          {currentAssignment && (
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-3 border-t border-slate-200 text-xs">
              <div className="text-slate-600">
                <strong>คำสั่ง:</strong> {currentAssignment.description} (กำหนดส่ง {currentAssignment.dueDate})
              </div>

              <div className="flex items-center gap-3 shrink-0">
                <span className="text-emerald-700 font-bold">
                  ส่งแล้ว: {submittedCount} คน
                </span>
                <span className="text-rose-600 font-bold">
                  ยังไม่ส่ง: {pendingCount} คน
                </span>
                <button
                  onClick={() => {
                    onBatchMarkSubmitted(currentAssignment.id);
                    playSuccessChime();
                  }}
                  className="px-2.5 py-1 bg-white hover:bg-slate-100 text-slate-800 border border-slate-300 rounded-lg font-bold shadow-2xs transition-colors"
                >
                  บันทึกส่งแล้วทุกคน
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Filter Chips */}
        <div className="flex items-center gap-1.5 bg-slate-100 p-1 rounded-xl w-fit text-xs">
          <button
            onClick={() => setFilterStatus('all')}
            className={`px-3 py-1.5 rounded-lg font-bold transition-colors ${
              filterStatus === 'all' ? 'bg-white text-slate-900 shadow-2xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            ทั้งหมด ({roomStudents.length})
          </button>
          <button
            onClick={() => setFilterStatus('pending')}
            className={`px-3 py-1.5 rounded-lg font-bold transition-colors ${
              filterStatus === 'pending' ? 'bg-white text-rose-600 shadow-2xs' : 'text-slate-600 hover:text-rose-600'
            }`}
          >
            ยังไม่ส่ง ({pendingCount})
          </button>
          <button
            onClick={() => setFilterStatus('submitted')}
            className={`px-3 py-1.5 rounded-lg font-bold transition-colors ${
              filterStatus === 'submitted' ? 'bg-white text-blue-600 shadow-2xs' : 'text-slate-600 hover:text-blue-600'
            }`}
          >
            ส่งแล้ว ({submittedCount})
          </button>
        </div>

        {/* Students List */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3.5">
          {filteredStudents.map((student) => {
            const sub = getSubmission(student.id);

            return (
              <div
                key={student.id}
                className="bg-white border border-slate-200 rounded-xl p-4 shadow-2xs hover:shadow-md transition-all space-y-3"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="w-6 h-6 rounded-full bg-slate-100 text-slate-700 text-xs font-bold flex items-center justify-center">
                      {student.number}
                    </span>
                    <div>
                      <div className="font-extrabold text-xs text-slate-900">
                        {student.prefix}{student.firstName} {student.lastName}
                      </div>
                      <div className="text-[11px] text-rose-600 font-bold">
                        น้อง{student.nickname}
                      </div>
                    </div>
                  </div>

                  {sub ? (
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200 flex items-center gap-1">
                      <CheckCircle2 className="w-3 h-3" />
                      <span>{sub.status === 'graded' ? `ตรวจแล้ว (${sub.score} คะแนน)` : 'ส่งแล้ว'}</span>
                    </span>
                  ) : (
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-rose-50 text-rose-600 border border-rose-200 flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      <span>ยังไม่ส่ง</span>
                    </span>
                  )}
                </div>

                {/* Submission note or image thumbnail if submitted */}
                {sub ? (
                  <div className="bg-slate-50 p-2.5 rounded-lg border border-slate-200 space-y-1 text-xs">
                    {sub.note && (
                      <p className="text-slate-600 italic">
                        "{sub.note}"
                      </p>
                    )}
                    {sub.fileUrl && (
                      <div className="flex items-center gap-2 pt-1">
                        <img
                          src={sub.fileUrl}
                          alt="ผลงานนักเรียน"
                          className="w-14 h-14 object-cover rounded-md border border-slate-300 cursor-pointer hover:opacity-80 transition-opacity"
                          onClick={() => onViewImage(sub.fileUrl!, `ผลงานของ ${student.prefix}${student.firstName}`)}
                        />
                        <button
                          onClick={() => onViewImage(sub.fileUrl!, `ผลงานของ ${student.prefix}${student.firstName}`)}
                          className="text-[11px] font-bold text-rose-600 hover:underline flex items-center gap-1"
                        >
                          <Eye className="w-3 h-3" />
                          <span>ดูภาพขยาย</span>
                        </button>
                      </div>
                    )}
                    {sub.feedback && (
                      <div className="text-[11px] text-emerald-700 font-medium pt-1 border-t border-slate-200">
                        <strong>ครูตรวจ:</strong> {sub.feedback}
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="text-xs text-slate-400 italic">
                    รอผู้ปกครอง/นักเรียนแนบรูปถ่ายการบ้านส่งในระบบ
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
