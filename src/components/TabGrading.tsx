import React, { useState } from 'react';
import { Student, Assignment, Submission, ClassRoom, SubjectItem, User } from '../types';
import {
  CheckSquare,
  PlusCircle,
  Sparkles,
  BookOpen,
  CheckCircle2,
  AlertCircle,
  Save,
  Trash2,
} from 'lucide-react';
import { playSuccessChime, playClickSound } from '../utils/audio';

interface TabGradingProps {
  students: Student[];
  assignments: Assignment[];
  submissions: Submission[];
  currentRoom: ClassRoom;
  currentUser: User | null;
  subjects: SubjectItem[];
  onAddAssignment: (assignment: Omit<Assignment, 'id' | 'createdAt'>) => void;
  onUpdateScore: (assignmentId: string, studentId: string, score: number, feedback?: string) => void;
  onBatchScore: (assignmentId: string, type: 'full' | 'addOne') => void;
}

export const TabGrading: React.FC<TabGradingProps> = ({
  students,
  assignments,
  submissions,
  currentRoom,
  currentUser,
  subjects,
  onAddAssignment,
  onUpdateScore,
  onBatchScore,
}) => {
  const roomAssignments = assignments.filter(
    (a) => a.room === currentRoom || a.room === 'ทุกห้อง'
  );

  const [selectedAssignmentId, setSelectedAssignmentId] = useState<string>(
    roomAssignments[0]?.id || ''
  );

  const [showAddModal, setShowAddModal] = useState<boolean>(false);

  // New Assignment Form State
  const [newTitle, setNewTitle] = useState('');
  const [newSubject, setNewSubject] = useState(subjects[0]?.name || 'ภาษาไทย');
  const [newDesc, setNewDesc] = useState('');
  const [newDueDate, setNewDueDate] = useState('');
  const [newEvalType, setNewEvalType] = useState<'score' | 'scale'>('score');
  const [newMaxScore, setNewMaxScore] = useState<number>(10);

  const currentAssignment = assignments.find((a) => a.id === selectedAssignmentId) || roomAssignments[0];
  const roomStudents = students.filter((s) => s.room === currentRoom).sort((a, b) => a.number - b.number);

  const handleCreateAssignment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;

    onAddAssignment({
      room: currentRoom,
      title: newTitle.trim(),
      subject: newSubject,
      description: newDesc.trim(),
      dueDate: newDueDate || new Date().toISOString().slice(0, 10),
      evalType: newEvalType,
      maxScore: Number(newMaxScore) || 10,
      teacherId: currentUser?.id,
    });

    setNewTitle('');
    setNewDesc('');
    setShowAddModal(false);
    playSuccessChime();
  };

  const getStudentSubmission = (studentId: string) => {
    if (!currentAssignment) return null;
    return submissions.find(
      (s) => s.assignmentId === currentAssignment.id && s.studentId === studentId
    );
  };

  // Stats calculation
  const scores = roomStudents
    .map((s) => getStudentSubmission(s.id)?.score)
    .filter((score): score is number => typeof score === 'number');

  const avgScore = scores.length > 0
    ? (scores.reduce((a, b) => a + b, 0) / scores.length).toFixed(1)
    : '0';

  const maxRecorded = scores.length > 0 ? Math.max(...scores) : 0;
  const gradedCount = scores.length;

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs space-y-5">
        {/* Header Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-4">
          <div>
            <h2 className="text-lg font-extrabold text-slate-900 flex items-center gap-2">
              <CheckSquare className="w-5 h-5 text-rose-600" />
              <span>โต๊ะตรวจงาน & สมุดคะแนน (Grading Matrix)</span>
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              บันทึกคะแนนเก็บ ตรวจสอบการส่งงาน และคำนวณผลประเมินอัตโนมัติ
            </p>
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            <button
              onClick={() => setShowAddModal(true)}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold rounded-lg shadow-2xs transition-colors"
            >
              <PlusCircle className="w-4 h-4" />
              <span>+ สั่งการบ้านใหม่</span>
            </button>
          </div>
        </div>

        {/* Assignment Picker & Batch Grading Tools */}
        <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 flex flex-col md:flex-row md:items-center justify-between gap-4">
          {/* Assignment Selector */}
          <div className="flex-1 flex items-center gap-2 flex-wrap">
            <span className="text-xs font-bold text-slate-700 shrink-0 flex items-center gap-1">
              <BookOpen className="w-4 h-4 text-rose-600" />
              เลือกใบงาน/การบ้าน:
            </span>
            <select
              value={currentAssignment?.id || ''}
              onChange={(e) => setSelectedAssignmentId(e.target.value)}
              className="bg-white text-xs font-bold text-slate-900 border border-slate-300 rounded-lg py-1.5 px-3 focus:outline-hidden max-w-md shadow-2xs"
            >
              {roomAssignments.length === 0 && <option value="">ยังไม่มีการบ้าน</option>}
              {roomAssignments.map((asg) => (
                <option key={asg.id} value={asg.id}>
                  [{asg.subject}] {asg.title} (เต็ม {asg.maxScore} คะแนน)
                </option>
              ))}
            </select>
          </div>

          {/* Batch Tools */}
          {currentAssignment && (
            <div className="flex items-center gap-2">
              <button
                onClick={() => {
                  onBatchScore(currentAssignment.id, 'full');
                  playSuccessChime();
                }}
                className="flex items-center gap-1 px-3 py-1.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border border-emerald-300 rounded-lg text-xs font-bold transition-colors shadow-2xs"
                title="บันทึกให้คะแนนเต็มแก่นักเรียนทุกคนในชั้นนี้"
              >
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                <span>ให้เต็มทุกคน</span>
              </button>

              <button
                onClick={() => {
                  onBatchScore(currentAssignment.id, 'addOne');
                  playClickSound();
                }}
                className="flex items-center gap-1 px-3 py-1.5 bg-blue-50 hover:bg-blue-100 text-blue-700 border border-blue-300 rounded-lg text-xs font-bold transition-colors shadow-2xs"
                title="เพิ่มคะแนน +1 แก่นักเรียนทุกคน"
              >
                <span>+1 คะแนน</span>
              </button>
            </div>
          )}
        </div>

        {/* Current Assignment Details Card */}
        {currentAssignment && (
          <div className="p-4 rounded-xl bg-rose-50/60 border border-rose-200/80 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="px-2 py-0.5 bg-rose-600 text-white rounded text-[10px] font-bold">
                  {currentAssignment.subject}
                </span>
                <h4 className="font-extrabold text-sm text-slate-900">{currentAssignment.title}</h4>
              </div>
              <p className="text-xs text-slate-600">{currentAssignment.description}</p>
              <div className="text-[11px] text-slate-500">
                กำหนดส่ง: {currentAssignment.dueDate} • คะแนนเต็ม: {currentAssignment.maxScore} คะแนน
              </div>
            </div>

            {/* Quick Stats */}
            <div className="flex items-center gap-4 bg-white px-4 py-2 rounded-xl border border-rose-200/60 shadow-2xs shrink-0 text-center">
              <div>
                <div className="text-[10px] text-slate-400 font-bold uppercase">ตรวจแล้ว</div>
                <div className="text-base font-black text-slate-800">
                  {gradedCount} / {roomStudents.length}
                </div>
              </div>
              <div className="h-7 border-r border-slate-200" />
              <div>
                <div className="text-[10px] text-slate-400 font-bold uppercase">คะแนนเฉลี่ย</div>
                <div className="text-base font-black text-rose-600">{avgScore}</div>
              </div>
              <div className="h-7 border-r border-slate-200" />
              <div>
                <div className="text-[10px] text-slate-400 font-bold uppercase">สูงสุด</div>
                <div className="text-base font-black text-emerald-600">{maxRecorded}</div>
              </div>
            </div>
          </div>
        )}

        {/* Grading Table */}
        {!currentAssignment ? (
          <div className="p-12 text-center text-slate-400 text-xs">
            ยังไม่มีรายการการบ้านในชั้น {currentRoom} คลิกปุ่ม "+ สั่งการบ้านใหม่" เพื่อเริ่มต้น
          </div>
        ) : (
          <div className="overflow-x-auto rounded-xl border border-slate-200">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-slate-100 text-slate-700 border-b border-slate-200 text-[11px] font-extrabold uppercase">
                  <th className="p-3 w-16 text-center">เลขที่</th>
                  <th className="p-3">ชื่อ - นามสกุล นักเรียน</th>
                  <th className="p-3 w-28 text-center">สถานะงาน</th>
                  <th className="p-3 w-36 text-center">คะแนน (เต็ม {currentAssignment.maxScore})</th>
                  <th className="p-3 w-28 text-center">ผลประเมิน</th>
                  <th className="p-3">ข้อเสนอแนะคุณครู</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 bg-white">
                {roomStudents.map((student) => {
                  const sub = getStudentSubmission(student.id);
                  const score = sub?.score;
                  const isSubmitted = !!sub;
                  const maxScore = currentAssignment.maxScore || 10;
                  const isPassed = typeof score === 'number' && score >= maxScore * 0.5;

                  return (
                    <tr key={student.id} className="hover:bg-slate-50/80 transition-colors">
                      <td className="p-3 text-center font-bold text-slate-700">
                        {student.number}
                      </td>

                      <td className="p-3">
                        <div className="font-extrabold text-slate-900">
                          {student.prefix}{student.firstName} {student.lastName}
                        </div>
                        <div className="text-[11px] text-rose-600 font-bold">
                          น้อง{student.nickname}
                        </div>
                      </td>

                      <td className="p-3 text-center">
                        {isSubmitted ? (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                            <CheckCircle2 className="w-3 h-3" />
                            <span>ส่งแล้ว</span>
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-slate-100 text-slate-500 border border-slate-200">
                            <span>ยังไม่ส่ง</span>
                          </span>
                        )}
                      </td>

                      <td className="p-3 text-center">
                        <div className="flex items-center justify-center gap-1">
                          <input
                            type="number"
                            min="0"
                            max={maxScore}
                            value={typeof score === 'number' ? score : ''}
                            onChange={(e) => {
                              const val = e.target.value === '' ? 0 : Number(e.target.value);
                              if (val <= maxScore && val >= 0) {
                                onUpdateScore(currentAssignment.id, student.id, val, sub?.feedback);
                              }
                            }}
                            placeholder="0"
                            className="w-16 text-center font-black text-sm bg-slate-50 border border-slate-300 rounded-lg py-1 text-slate-900 focus:bg-white focus:border-rose-500 focus:outline-hidden"
                          />
                          <span className="text-slate-400 font-bold text-xs">/ {maxScore}</span>
                        </div>
                      </td>

                      <td className="p-3 text-center font-bold">
                        {typeof score === 'number' ? (
                          isPassed ? (
                            <span className="text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200 text-[10px]">
                              ✓ ผ่านเกณฑ์
                            </span>
                          ) : (
                            <span className="text-rose-700 bg-rose-50 px-2 py-0.5 rounded border border-rose-200 text-[10px]">
                              ปรับปรุง
                            </span>
                          )
                        ) : (
                          <span className="text-slate-400">-</span>
                        )}
                      </td>

                      <td className="p-3">
                        <input
                          type="text"
                          value={sub?.feedback || ''}
                          onChange={(e) => {
                            onUpdateScore(
                              currentAssignment.id,
                              student.id,
                              sub?.score ?? 0,
                              e.target.value
                            );
                          }}
                          placeholder="คำชมเชยหรือข้อควรปรับปรุง..."
                          className="w-full text-xs text-slate-700 bg-transparent hover:bg-slate-50 border-b border-transparent hover:border-slate-200 focus:border-rose-400 focus:bg-white px-2 py-1 rounded focus:outline-hidden"
                        />
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Add Assignment Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs">
          <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xl max-w-lg w-full space-y-4 animate-fade-in">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="font-extrabold text-slate-900 text-sm sm:text-base flex items-center gap-2">
                <PlusCircle className="w-5 h-5 text-rose-600" />
                <span>สั่งการบ้าน / มอบหมายงานใหม่ ({currentRoom})</span>
              </h3>
              <button
                onClick={() => setShowAddModal(false)}
                className="text-slate-400 hover:text-slate-600 text-lg font-bold"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateAssignment} className="space-y-3.5 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">ชื่องาน / ใบงาน</label>
                <input
                  type="text"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  placeholder="เช่น แบบฝึกหัดคณิตศาสตร์ เรื่องการบวก..."
                  required
                  className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2.5 text-slate-900 focus:bg-white focus:border-rose-500 focus:outline-hidden font-medium"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">รายวิชา</label>
                  <select
                    value={newSubject}
                    onChange={(e) => setNewSubject(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2.5 text-slate-900 focus:outline-hidden font-semibold"
                  >
                    {subjects.map((sub) => (
                      <option key={sub.id} value={sub.name}>
                        {sub.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">คะแนนเต็ม</label>
                  <input
                    type="number"
                    min="1"
                    max="100"
                    value={newMaxScore}
                    onChange={(e) => setNewMaxScore(Number(e.target.value))}
                    className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2.5 text-slate-900 focus:outline-hidden font-semibold"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">กำหนดส่ง</label>
                <input
                  type="date"
                  value={newDueDate}
                  onChange={(e) => setNewDueDate(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2.5 text-slate-900 focus:outline-hidden font-semibold"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  รายละเอียด / คำสั่งการบ้าน
                </label>
                <textarea
                  value={newDesc}
                  onChange={(e) => setNewDesc(e.target.value)}
                  placeholder="ระบุข้อแนะนำ เช่น ให้นักเรียนทำข้อ 1-10 ถ่ายรูปส่งในระบบ..."
                  rows={3}
                  className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2.5 text-slate-900 focus:bg-white focus:border-rose-500 focus:outline-hidden"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold rounded-lg transition-colors"
                >
                  ยกเลิก
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-rose-600 hover:bg-rose-700 text-white font-bold rounded-lg shadow-sm transition-colors"
                >
                  บันทึกสั่งงาน
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
