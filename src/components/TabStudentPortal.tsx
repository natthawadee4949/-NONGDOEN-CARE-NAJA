import React, { useState } from 'react';
import { Student, Assignment, Submission, User } from '../types';
import {
  CheckCircle2,
  Clock,
  UploadCloud,
  Star,
  Camera,
  Calendar,
  Send,
  Sparkles,
  FileText,
  Check,
  RotateCcw,
} from 'lucide-react';
import { playClickSound, playSuccessChime } from '../utils/audio';

interface TabStudentPortalProps {
  currentUser: User | null;
  students: Student[];
  assignments: Assignment[];
  submissions: Submission[];
  onSubmitHomework: (assignmentId: string, studentId: string, fileUrl?: string, note?: string) => void;
  onToggleHomeworkStatus?: (assignmentId: string, studentId: string, markSubmitted: boolean, fileUrl?: string, note?: string) => void;
  onViewImage: (url: string, title: string) => void;
}

export const TabStudentPortal: React.FC<TabStudentPortalProps> = ({
  currentUser,
  students,
  assignments,
  submissions,
  onSubmitHomework,
  onToggleHomeworkStatus,
  onViewImage,
}) => {
  const [activeSubmitModalAssignment, setActiveSubmitModalAssignment] = useState<Assignment | null>(null);
  const [submitNote, setSubmitNote] = useState('');
  const [previewImageUrl, setPreviewImageUrl] = useState<string>('');

  // Find matching student profile
  const studentProfile: Student =
    students.find((s) => s.id === currentUser?.id) ||
    students.find((s) => s.room === currentUser?.room && s.number === currentUser?.number) || {
      id: currentUser?.id || 'std-active',
      prefix: currentUser?.prefix || 'เด็กชาย',
      firstName: currentUser?.firstName || 'นักเรียน',
      lastName: currentUser?.lastName || 'หนองเดิ่น',
      nickname: currentUser?.nickname || currentUser?.firstName || 'เพื่อนรัก',
      room: currentUser?.room || 'ป.1',
      number: currentUser?.number || 1,
      phone: currentUser?.phone || '0910610997',
      status: 'normal',
      exp: currentUser?.exp || 100,
      avatarUrl: currentUser?.avatarUrl,
    };
  const myRoom = studentProfile.room || currentUser?.room || 'ป.1';

  const myAssignments = assignments.filter(
    (a) => a.room === myRoom || a.room === 'ทุกห้อง'
  );

  const getMySubmission = (assignmentId: string) => {
    return submissions.find(
      (s) => s.assignmentId === assignmentId && s.studentId === studentProfile?.id
    );
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setPreviewImageUrl(url);
    }
  };

  // Quick tick toggle for "กรณีส่งแล้ว"
  const handleToggleTick = (assignmentId: string, markSubmitted: boolean) => {
    playClickSound();
    if (onToggleHomeworkStatus) {
      onToggleHomeworkStatus(assignmentId, studentProfile.id, markSubmitted);
    } else {
      if (markSubmitted) {
        onSubmitHomework(assignmentId, studentProfile.id, undefined, 'กรณีส่งแล้ว');
      }
    }
    if (markSubmitted) {
      playSuccessChime();
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeSubmitModalAssignment || !studentProfile) return;

    onSubmitHomework(
      activeSubmitModalAssignment.id,
      studentProfile.id,
      previewImageUrl || 'https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=500&auto=format&fit=crop&q=60',
      submitNote.trim() || 'กรณีส่งแล้ว'
    );

    setActiveSubmitModalAssignment(null);
    setSubmitNote('');
    setPreviewImageUrl('');
    playSuccessChime();
  };

  return (
    <div className="space-y-6">
      {/* Student Profile Header Card */}
      <div className={`rounded-3xl bg-gradient-to-r ${currentUser?.themeColor === 'sakura' ? 'from-pink-900 via-rose-800 to-slate-900' : currentUser?.themeColor === 'lavender' ? 'from-purple-950 via-indigo-900 to-slate-900' : currentUser?.themeColor === 'mint' ? 'from-emerald-950 via-teal-900 to-slate-900' : currentUser?.themeColor === 'sky' ? 'from-sky-950 via-blue-900 to-slate-900' : 'from-slate-950 via-slate-900 to-rose-950'} text-white p-6 sm:p-8 shadow-xl border border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-6`}>
        <div className="flex items-center gap-4">
          <div
            style={{ width: `${currentUser?.avatarSize || 80}px`, height: `${currentUser?.avatarSize || 80}px` }}
            className="rounded-2xl bg-rose-600 flex items-center justify-center text-white text-2xl font-black shadow-lg overflow-hidden border-2 border-rose-300 shrink-0 transition-all"
          >
            {studentProfile?.avatarUrl ? (
              <img src={studentProfile.avatarUrl} alt="" className="w-full h-full object-cover" />
            ) : (
              studentProfile?.firstName.slice(0, 1) || 'น'
            )}
          </div>

          <div>
            <div className="text-xs font-bold text-rose-300 flex items-center gap-1.5 mb-1">
              <Sparkles className="w-3.5 h-3.5" />
              <span>พอร์ทัลการบ้านนักเรียน • รร.หนองเดิ่นศรีเจริญวิทยา</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-black flex items-center gap-2">
              <span>{studentProfile?.prefix}{studentProfile?.firstName} {studentProfile?.lastName}</span>
              {studentProfile?.nickname && (
                <span className="px-2.5 py-0.5 rounded-full bg-rose-500/30 text-rose-200 text-xs font-bold border border-rose-400/40">
                  น้อง{studentProfile.nickname}
                </span>
              )}
            </h2>
            <div className="flex flex-wrap items-center gap-3 text-xs text-slate-300 mt-1 font-medium">
              <span>ชั้น: <strong className="text-rose-400">{studentProfile?.room}</strong></span>
              <span>•</span>
              <span>เลขที่: <strong className="text-white">{studentProfile?.number || 1}</strong></span>
              <span>•</span>
              <span>สังกัด: <strong>สพป.หนองคาย เขต 1</strong></span>
            </div>
          </div>
        </div>

        {/* Conduct & Today's Status */}
        <div className="flex items-center gap-3">
          <div className="bg-slate-900/80 border border-slate-700 p-3.5 rounded-xl text-center min-w-[110px]">
            <span className="text-[10px] text-slate-400 font-bold uppercase block mb-0.5">คะแนนความดี</span>
            <div className="text-lg font-black text-amber-400 flex items-center justify-center gap-1">
              <Star className="w-4 h-4 fill-amber-400 text-amber-500" />
              <span>{studentProfile?.exp || 0} EXP</span>
            </div>
          </div>

          <div className="bg-slate-900/80 border border-slate-700 p-3.5 rounded-xl text-center min-w-[130px]">
            <span className="text-[10px] text-slate-400 font-bold uppercase block mb-0.5">สถานะวันนี้</span>
            <div className="text-sm font-black text-emerald-400 flex items-center justify-center gap-1">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <span>มาเรียนปกติ</span>
            </div>
          </div>
        </div>
      </div>

      {/* Homework List Card */}
      <div className="bg-white rounded-3xl p-6 sm:p-7 border border-slate-200/80 shadow-xs space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-4">
          <div>
            <h3 className="font-black text-slate-900 text-base sm:text-lg flex items-center gap-2">
              <FileText className="w-5 h-5 text-rose-600" />
              <span>ภาระงาน & การบ้านของฉัน (ชั้น {myRoom})</span>
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              สามารถติ๊กว่าส่งแล้ว (กรณีส่งแล้ว) หรือถ่ายภาพใบงานส่งคุณครูได้เลยครับ
            </p>
          </div>
          <div className="text-xs font-bold text-rose-700 bg-rose-50 px-3 py-1 rounded-full border border-rose-200 self-start sm:self-auto">
            รวม {myAssignments.length} รายการ
          </div>
        </div>

        {myAssignments.length === 0 ? (
          <div className="p-12 text-center text-slate-400 text-xs">
            ไม่มีการบ้านที่ค้างอยู่ในขณะนี้ เก่งมากครับ!
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {myAssignments.map((assignment) => {
              const sub = getMySubmission(assignment.id);
              const isSubmitted = !!sub;

              return (
                <div
                  key={assignment.id}
                  className={`border rounded-2xl p-5 shadow-2xs hover:shadow-md transition-all flex flex-col justify-between space-y-4 ${
                    isSubmitted
                      ? 'bg-emerald-50/30 border-emerald-300'
                      : 'bg-white border-slate-200 hover:border-rose-300'
                  }`}
                >
                  <div className="space-y-2.5">
                    <div className="flex items-center justify-between gap-2">
                      <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-rose-100 text-rose-800">
                        {assignment.subject}
                      </span>
                      {isSubmitted ? (
                        <span className="px-2.5 py-0.5 rounded-full text-[11px] font-black bg-emerald-100 text-emerald-800 flex items-center gap-1 border border-emerald-300">
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                          <span>{sub.status === 'graded' ? `ตรวจแล้ว (${sub.score}/${assignment.maxScore})` : 'กรณีส่งแล้ว ✓'}</span>
                        </span>
                      ) : (
                        <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-amber-100 text-amber-800 flex items-center gap-1 border border-amber-300">
                          <Clock className="w-3.5 h-3.5 text-amber-600" />
                          <span>รอส่ง</span>
                        </span>
                      )}
                    </div>

                    <h4 className="font-black text-sm text-slate-900 leading-snug">
                      {assignment.title}
                    </h4>

                    <p className="text-xs text-slate-600 leading-relaxed">
                      {assignment.description}
                    </p>

                    <div className="text-[11px] text-slate-500 font-medium flex flex-wrap items-center gap-2 pt-1 border-t border-slate-100">
                      <span>กำหนดส่ง: <strong className="text-slate-800">{assignment.dueDate}</strong></span>
                      <span>•</span>
                      <span>คะแนนเต็ม: <strong className="text-rose-600">{assignment.maxScore}</strong> คะแนน</span>
                    </div>
                  </div>

                  {/* SUBMISSION & TICK AREA */}
                  <div className="space-y-3 pt-2">
                    {isSubmitted ? (
                      /* ALREADY SUBMITTED: "กรณีส่งแล้ว" DISPLAY & UNTICK BUTTON */
                      <div className="bg-white p-3.5 rounded-2xl border-2 border-emerald-300 text-xs space-y-2 shadow-2xs">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2.5">
                            <div className="w-6 h-6 rounded-lg bg-emerald-600 text-white flex items-center justify-center font-black text-xs shadow-xs shrink-0">
                              ✓
                            </div>
                            <div>
                              <span className="font-black text-xs text-emerald-950 block">
                                กรณีส่งแล้ว (ติ๊กส่งเรียบร้อยแล้ว)
                              </span>
                              <span className="text-[10px] text-emerald-700 font-medium">
                                บันทึกเมื่อ: {new Date(sub.submittedAt).toLocaleDateString('th-TH')}
                                {sub.note && ` • ${sub.note}`}
                              </span>
                            </div>
                          </div>

                          <button
                            type="button"
                            onClick={() => handleToggleTick(assignment.id, false)}
                            className="text-[10px] font-bold text-slate-400 hover:text-rose-600 underline px-1.5 py-0.5 rounded cursor-pointer"
                            title="คลิกเพื่อยกเลิกการติ๊กส่ง"
                          >
                            ยกเลิกติ๊ก
                          </button>
                        </div>

                        {/* If graded by teacher */}
                        {typeof sub.score === 'number' && (
                          <div className="flex items-center justify-between p-2 bg-emerald-50 rounded-xl border border-emerald-200 font-bold text-emerald-900 text-xs">
                            <span>คะแนนที่คุณครูตรวจให้:</span>
                            <span className="text-emerald-700 font-black text-sm">
                              {sub.score} / {assignment.maxScore} คะแนน
                            </span>
                          </div>
                        )}

                        {/* Attached Image preview if any */}
                        {sub.fileUrl && (
                          <div className="flex items-center gap-2 pt-1 border-t border-slate-100">
                            <img
                              src={sub.fileUrl}
                              alt=""
                              className="w-12 h-12 object-cover rounded-xl border border-emerald-200 cursor-pointer hover:opacity-80 transition-opacity"
                              onClick={() => onViewImage(sub.fileUrl!, `การบ้านวิชา ${assignment.subject}`)}
                            />
                            <button
                              onClick={() => onViewImage(sub.fileUrl!, `การบ้านวิชา ${assignment.subject}`)}
                              className="text-[11px] text-rose-600 font-bold hover:underline cursor-pointer"
                            >
                              ดูรูปภาพที่แนบส่ง
                            </button>
                          </div>
                        )}

                        {sub.feedback && (
                          <div className="p-2.5 bg-emerald-50 rounded-xl text-emerald-900 font-medium text-[11px] border border-emerald-200">
                            <strong>ข้อความจากคุณครู:</strong> {sub.feedback}
                          </div>
                        )}
                      </div>
                    ) : (
                      /* NOT YET SUBMITTED: TICK BUTTON "กรณีส่งแล้ว" + CAMERA UPLOAD BUTTON */
                      <div className="space-y-2">
                        {/* 1. ปุ่มติ๊กว่าส่งแล้ว: เขียนว่า "กรณีส่งแล้ว" */}
                        <button
                          type="button"
                          onClick={() => handleToggleTick(assignment.id, true)}
                          className="w-full flex items-center justify-between p-3 rounded-2xl bg-emerald-50/60 hover:bg-emerald-100/80 border-2 border-dashed border-emerald-400 hover:border-emerald-600 shadow-2xs transition-all text-left cursor-pointer group"
                        >
                          <div className="flex items-center gap-2.5">
                            <div className="w-6 h-6 rounded-lg border-2 border-emerald-500 bg-white group-hover:bg-emerald-500 flex items-center justify-center transition-colors shadow-2xs">
                              <Check className="w-3.5 h-3.5 text-white opacity-0 group-hover:opacity-100 transition-opacity" />
                            </div>
                            <div>
                              <div className="font-black text-xs text-emerald-900 flex items-center gap-1.5">
                                <span>กรณีส่งแล้ว (ติ๊กว่าส่งแล้ว)</span>
                                <span className="text-[10px] px-2 py-0.5 bg-emerald-600 text-white rounded-md font-bold">
                                  คลิกติ๊กส่ง
                                </span>
                              </div>
                              <span className="text-[10px] text-emerald-700 font-medium">
                                ส่งสมุดหรือส่งใบงานให้ครูแล้ว คลิกติ๊กได้ทันที
                              </span>
                            </div>
                          </div>
                          <CheckCircle2 className="w-4 h-4 text-emerald-600 group-hover:scale-110 transition-transform" />
                        </button>

                        {/* 2. หรือ ถ่ายภาพ/แนบรูปส่งงาน */}
                        <button
                          type="button"
                          onClick={() => setActiveSubmitModalAssignment(assignment)}
                          className="w-full flex items-center justify-center gap-1.5 py-2 px-3 bg-white hover:bg-rose-50 text-rose-700 font-bold text-xs rounded-xl border border-rose-200 hover:border-rose-400 transition-colors cursor-pointer"
                        >
                          <Camera className="w-3.5 h-3.5" />
                          <span>ถ่ายรูปภาพ / แนบรูปภาพผลงาน (ถ้ามี)</span>
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Homework Submission Modal with Photo Upload */}
      {activeSubmitModalAssignment && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs">
          <div className="bg-white rounded-3xl p-6 sm:p-7 border border-slate-200 shadow-2xl max-w-lg w-full space-y-4 animate-fade-in">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <h3 className="font-extrabold text-slate-900 text-sm sm:text-base flex items-center gap-2">
                  <UploadCloud className="w-5 h-5 text-rose-600" />
                  <span>ส่งการบ้าน & แนบรูปภาพ</span>
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  [{activeSubmitModalAssignment.subject}] {activeSubmitModalAssignment.title}
                </p>
              </div>
              <button
                onClick={() => setActiveSubmitModalAssignment(null)}
                className="text-slate-400 hover:text-slate-600 text-lg font-bold p-1 rounded-lg"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1 flex items-center gap-1">
                  <Camera className="w-4 h-4 text-rose-600" />
                  <span>ถ่ายภาพ / แนบรูปภาพผลงานการบ้าน:</span>
                </label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl p-2.5 text-slate-900 focus:outline-hidden"
                />
              </div>

              {previewImageUrl && (
                <div className="text-center p-2.5 bg-slate-50 rounded-2xl border border-slate-200">
                  <span className="text-[10px] text-slate-500 block mb-1">ภาพตัวอย่างที่จะส่ง:</span>
                  <img
                    src={previewImageUrl}
                    alt="Preview"
                    className="max-h-48 mx-auto rounded-xl shadow-xs border border-slate-300"
                  />
                </div>
              )}

              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  บันทึกเพิ่มเติม (กรณีส่งแล้ว):
                </label>
                <textarea
                  value={submitNote}
                  onChange={(e) => setSubmitNote(e.target.value)}
                  placeholder="เช่น กรณีส่งแล้ว / ส่งสมุดที่โต๊ะครูแล้วครับ"
                  rows={2}
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl p-2.5 text-slate-900 focus:bg-white focus:border-rose-500 focus:outline-hidden"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setActiveSubmitModalAssignment(null)}
                  className="px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl transition-colors cursor-pointer"
                >
                  ยกเลิก
                </button>
                <button
                  type="submit"
                  className="flex items-center gap-1.5 px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl shadow-sm transition-colors cursor-pointer"
                >
                  <Check className="w-4 h-4" />
                  <span>ยืนยันบันทึก (กรณีส่งแล้ว)</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
