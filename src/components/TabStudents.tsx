import React, { useState } from 'react';
import { Student, ClassRoom, StudentCareStatus } from '../types';
import {
  Users,
  Search,
  PlusCircle,
  FileSpreadsheet,
  Phone,
  Star,
  ShieldCheck,
  AlertTriangle,
  AlertOctagon,
  Trash2,
  Edit3,
  UserPlus,
  Sparkles,
  Info,
} from 'lucide-react';
import { playSuccessChime, playClickSound } from '../utils/audio';
import { MascotIcon } from './MascotIcon';

interface TabStudentsProps {
  students: Student[];
  currentRoom: ClassRoom;
  onAddStudent: (student: Omit<Student, 'id' | 'exp'>) => void;
  onUpdateStudent: (studentId: string, updated: Partial<Student>) => void;
  onDeleteStudent: (studentId: string) => void;
  onSelectStudent: (student: Student) => void;
  onExportCsv: () => void;
  onClearRoomStudents?: (room: ClassRoom) => void;
}

export const TabStudents: React.FC<TabStudentsProps> = ({
  students,
  currentRoom,
  onAddStudent,
  onUpdateStudent,
  onDeleteStudent,
  onSelectStudent,
  onExportCsv,
  onClearRoomStudents,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [careFilter, setCareFilter] = useState<'all' | StudentCareStatus>('all');
  
  // Modals state
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingStudent, setEditingStudent] = useState<Student | null>(null);
  const [deletingStudent, setDeletingStudent] = useState<Student | null>(null);

  // New Student Form State
  const roomStudents = students
    .filter((s) => s.room === currentRoom)
    .sort((a, b) => a.number - b.number);

  const [newPrefix, setNewPrefix] = useState('เด็กชาย');
  const [newFirstName, setNewFirstName] = useState('');
  const [newLastName, setNewLastName] = useState('');
  const [newNickname, setNewNickname] = useState('');
  const [newNumber, setNewNumber] = useState<number>(roomStudents.length + 1);
  const [newPhone, setNewPhone] = useState('');
  const [newStatus, setNewStatus] = useState<StudentCareStatus>('normal');

  // Edit Student Form State
  const [editPrefix, setEditPrefix] = useState('เด็กชาย');
  const [editFirstName, setEditFirstName] = useState('');
  const [editLastName, setEditLastName] = useState('');
  const [editNickname, setEditNickname] = useState('');
  const [editNumber, setEditNumber] = useState<number>(1);
  const [editPhone, setEditPhone] = useState('');
  const [editStatus, setEditStatus] = useState<StudentCareStatus>('normal');

  const openAddModal = () => {
    setNewNumber(roomStudents.length > 0 ? Math.max(...roomStudents.map(s => s.number)) + 1 : 1);
    setShowAddModal(true);
  };

  const openEditModal = (student: Student, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    setEditingStudent(student);
    setEditPrefix(student.prefix);
    setEditFirstName(student.firstName);
    setEditLastName(student.lastName);
    setEditNickname(student.nickname);
    setEditNumber(student.number);
    setEditPhone(student.phone);
    setEditStatus(student.status);
  };

  const handleCreateStudent = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newFirstName.trim() || !newLastName.trim()) return;

    onAddStudent({
      prefix: newPrefix,
      firstName: newFirstName.trim(),
      lastName: newLastName.trim(),
      nickname: newNickname.trim() || newFirstName.trim(),
      room: currentRoom,
      number: Number(newNumber) || (roomStudents.length + 1),
      phone: newPhone.trim() || '0910610997',
      status: newStatus,
    });

    setNewFirstName('');
    setNewLastName('');
    setNewNickname('');
    setShowAddModal(false);
    playSuccessChime();
  };

  const handleSaveEdit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingStudent || !editFirstName.trim() || !editLastName.trim()) return;

    onUpdateStudent(editingStudent.id, {
      prefix: editPrefix,
      firstName: editFirstName.trim(),
      lastName: editLastName.trim(),
      nickname: editNickname.trim() || editFirstName.trim(),
      number: Number(editNumber),
      phone: editPhone.trim() || '0910610997',
      status: editStatus,
    });

    setEditingStudent(null);
    playSuccessChime();
  };

  const handleConfirmDelete = () => {
    if (!deletingStudent) return;
    onDeleteStudent(deletingStudent.id);
    setDeletingStudent(null);
    playClickSound();
  };

  const filteredStudents = roomStudents.filter((student) => {
    const matchesSearch =
      student.firstName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      student.lastName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      student.nickname.toLowerCase().includes(searchQuery.toLowerCase()) ||
      String(student.number).includes(searchQuery);

    const matchesCare = careFilter === 'all' || student.status === careFilter;

    return matchesSearch && matchesCare;
  });

  const getStatusBadge = (status: StudentCareStatus) => {
    switch (status) {
      case 'normal':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
            <span>ปกติ</span>
          </span>
        );
      case 'watch':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-amber-50 text-amber-700 border border-amber-200">
            <AlertTriangle className="w-3.5 h-3.5 text-amber-600" />
            <span>เฝ้าระวัง</span>
          </span>
        );
      case 'danger':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-rose-50 text-rose-700 border border-rose-200">
            <AlertOctagon className="w-3.5 h-3.5 text-rose-600" />
            <span>เฝ้าระวังเข้มงวด</span>
          </span>
        );
    }
  };

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-xs space-y-5">
        {/* Header Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-5">
          <div className="flex items-center gap-3">
            <MascotIcon size="md" variant="mascot" />
            <div>
              <h2 className="text-lg font-black text-slate-900 flex items-center gap-2">
                <Users className="w-5 h-5 text-rose-600" />
                <span>ทะเบียนนักเรียน & จัดการข้อมูลนักเรียน</span>
                <span className="text-xs font-black text-rose-700 bg-rose-50 px-3 py-1 rounded-full border border-rose-200">
                  ชั้น {currentRoom}
                </span>
              </h2>
              <p className="text-xs text-slate-500 mt-0.5 font-medium">
                เพิ่ม ปรับปรุงแก้ไข และลบรายชื่อนักเรียน พร้อมบันทึกระบบดูแลช่วยเหลือนักเรียน
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            <button
              onClick={openAddModal}
              className="flex items-center gap-1.5 px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold rounded-xl shadow-md transition-all cursor-pointer active:scale-95"
            >
              <PlusCircle className="w-4 h-4" />
              <span>+ เพิ่มนักเรียนใหม่</span>
            </button>

            <button
              onClick={onExportCsv}
              disabled={roomStudents.length === 0}
              className="flex items-center gap-1.5 px-3 py-2 bg-slate-100 hover:bg-slate-200 disabled:opacity-50 text-slate-700 text-xs font-bold rounded-xl border border-slate-300 transition-colors"
            >
              <FileSpreadsheet className="w-4 h-4 text-emerald-600" />
              <span>ส่งออก CSV</span>
            </button>

            {onClearRoomStudents && roomStudents.length > 0 && (
              <button
                onClick={() => {
                  if (window.confirm(`ต้องการลบรายชื่อนักเรียนทั้งหมดในชั้น ${currentRoom} หรือไม่?`)) {
                    onClearRoomStudents(currentRoom);
                  }
                }}
                className="flex items-center gap-1 px-3 py-2 text-rose-600 hover:bg-rose-50 text-xs font-bold rounded-xl border border-rose-200 transition-colors"
                title="ลบรายชื่อนักเรียนทั้งหมดในห้องนี้"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>ล้างทั้งห้อง</span>
              </button>
            )}
          </div>
        </div>

        {/* Search & Filter Bar */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-slate-50 p-3 rounded-2xl border border-slate-200">
          <div className="relative w-full sm:w-80">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="ค้นหาชื่อ, นามสกุล, หรือเลขที่..."
              className="w-full pl-9 pr-3 py-2 bg-white border border-slate-200 rounded-xl text-xs text-slate-800 placeholder:text-slate-400 focus:outline-hidden focus:border-rose-400 shadow-2xs font-medium"
            />
          </div>

          <div className="flex items-center gap-1.5 w-full sm:w-auto overflow-x-auto text-xs">
            <button
              onClick={() => setCareFilter('all')}
              className={`px-3 py-1.5 rounded-xl font-bold transition-colors cursor-pointer ${
                careFilter === 'all' ? 'bg-slate-900 text-white' : 'bg-white text-slate-600 border border-slate-200'
              }`}
            >
              ทั้งหมด ({roomStudents.length})
            </button>
            <button
              onClick={() => setCareFilter('normal')}
              className={`px-3 py-1.5 rounded-xl font-bold transition-colors cursor-pointer ${
                careFilter === 'normal' ? 'bg-emerald-600 text-white' : 'bg-white text-emerald-700 border border-slate-200'
              }`}
            >
              ● ปกติ
            </button>
            <button
              onClick={() => setCareFilter('watch')}
              className={`px-3 py-1.5 rounded-xl font-bold transition-colors cursor-pointer ${
                careFilter === 'watch' ? 'bg-amber-600 text-white' : 'bg-white text-amber-700 border border-slate-200'
              }`}
            >
              ● เฝ้าระวัง
            </button>
            <button
              onClick={() => setCareFilter('danger')}
              className={`px-3 py-1.5 rounded-xl font-bold transition-colors cursor-pointer ${
                careFilter === 'danger' ? 'bg-rose-600 text-white' : 'bg-white text-rose-700 border border-slate-200'
              }`}
            >
              ● เฝ้าระวังเข้มงวด
            </button>
          </div>
        </div>

        {/* Empty State vs Student Table */}
        {roomStudents.length === 0 ? (
          <div className="text-center py-12 px-4 bg-gradient-to-b from-rose-50/50 to-pink-50/20 rounded-2xl border-2 border-dashed border-rose-200 space-y-4">
            <MascotIcon size="xl" variant="mascot" className="mx-auto" />
            <div className="space-y-1 max-w-md mx-auto">
              <h3 className="text-base font-black text-slate-900">
                ยังไม่มีข้อมูลนักเรียนในชั้น {currentRoom}
              </h3>
              <p className="text-xs text-slate-500 font-medium leading-relaxed">
                ระบบเริ่มต้นแบบหน้าว่าง (ไม่ใช้ชื่อนักเรียนตัวอย่าง) เพื่อให้คุณครูกรอกข้อมูลนักเรียนจริงได้อย่างถูกต้อง
              </p>
            </div>
            <button
              onClick={openAddModal}
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-rose-600 hover:bg-rose-700 text-white text-xs font-black rounded-xl shadow-md transition-all active:scale-95 cursor-pointer"
            >
              <UserPlus className="w-4 h-4" />
              <span>+ เพิ่มนักเรียนคนแรกในชั้น {currentRoom}</span>
            </button>
          </div>
        ) : (
          <div className="overflow-x-auto rounded-2xl border border-slate-200 shadow-2xs">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-slate-100 text-slate-700 border-b border-slate-200 text-[11px] font-extrabold uppercase">
                  <th className="p-3.5 w-16 text-center">เลขที่</th>
                  <th className="p-3.5">ชื่อ - นามสกุล นักเรียน</th>
                  <th className="p-3.5">ชื่อเล่น</th>
                  <th className="p-3.5 text-center">คะแนนความดี</th>
                  <th className="p-3.5 text-center">กลุ่มการดูแล</th>
                  <th className="p-3.5">เบอร์ติดต่อผู้ปกครอง</th>
                  <th className="p-3.5 text-center w-36">จัดการข้อมูล</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 bg-white">
                {filteredStudents.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="p-8 text-center text-slate-400 font-medium">
                      ไม่พบข้อมูลนักเรียนที่ตรงกับคำค้นหา "{searchQuery}"
                    </td>
                  </tr>
                ) : (
                  filteredStudents.map((student) => (
                    <tr
                      key={student.id}
                      className="hover:bg-rose-50/40 transition-colors group"
                    >
                      <td className="p-3.5 text-center font-black text-slate-700">
                        <span className="w-7 h-7 rounded-full bg-slate-100 text-slate-800 text-xs font-bold inline-flex items-center justify-center">
                          {student.number}
                        </span>
                      </td>

                      <td className="p-3.5">
                        <button
                          onClick={() => onSelectStudent(student)}
                          className="font-extrabold text-slate-900 hover:text-rose-600 transition-colors text-left flex items-center gap-1.5"
                        >
                          <span>{student.prefix}{student.firstName} {student.lastName}</span>
                        </button>
                      </td>

                      <td className="p-3.5 text-rose-700 font-bold">
                        น้อง{student.nickname}
                      </td>

                      <td className="p-3.5 text-center font-black text-amber-600">
                        <span className="inline-flex items-center gap-1">
                          <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-500" />
                          <span>{student.exp} EXP</span>
                        </span>
                      </td>

                      <td className="p-3.5 text-center">
                        {getStatusBadge(student.status)}
                      </td>

                      <td className="p-3.5 text-slate-600">
                        <a
                          href={`tel:${student.phone}`}
                          className="inline-flex items-center gap-1 hover:text-rose-600 transition-colors font-medium"
                        >
                          <Phone className="w-3.5 h-3.5 text-rose-500" />
                          <span>{student.phone}</span>
                        </a>
                      </td>

                      {/* Action buttons: Edit, Delete, View */}
                      <td className="p-3.5 text-center">
                        <div className="flex items-center justify-center gap-1.5">
                          <button
                            onClick={() => onSelectStudent(student)}
                            className="p-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg transition-colors"
                            title="ดูโปรไฟล์"
                          >
                            <Info className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={(e) => openEditModal(student, e)}
                            className="p-1.5 bg-blue-50 hover:bg-blue-100 text-blue-700 rounded-lg transition-colors"
                            title="แก้ไขข้อมูลนักเรียน"
                          >
                            <Edit3 className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => setDeletingStudent(student)}
                            className="p-1.5 bg-rose-50 hover:bg-rose-100 text-rose-700 rounded-lg transition-colors"
                            title="ลบนักเรียน"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* 1. Add Student Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs">
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-2xl max-w-lg w-full space-y-4 animate-fade-in">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="font-black text-slate-900 text-base flex items-center gap-2">
                <PlusCircle className="w-5 h-5 text-rose-600" />
                <span>เพิ่มข้อมูลนักเรียนใหม่ (ชั้น {currentRoom})</span>
              </h3>
              <button
                onClick={() => setShowAddModal(false)}
                className="text-slate-400 hover:text-slate-600 text-lg font-bold"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateStudent} className="space-y-3.5 text-xs">
              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">เลขที่</label>
                  <input
                    type="number"
                    min="1"
                    max="99"
                    value={newNumber}
                    onChange={(e) => setNewNumber(Number(e.target.value))}
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl p-2.5 text-slate-900 focus:outline-hidden font-bold"
                    required
                  />
                </div>

                <div className="col-span-2">
                  <label className="block font-bold text-slate-700 mb-1">คำนำหน้า</label>
                  <select
                    value={newPrefix}
                    onChange={(e) => setNewPrefix(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl p-2.5 text-slate-900 focus:outline-hidden font-semibold"
                  >
                    <option value="เด็กชาย">เด็กชาย</option>
                    <option value="เด็กหญิง">เด็กหญิง</option>
                    <option value="นาย">นาย</option>
                    <option value="นางสาว">นางสาว</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">ชื่อจริง</label>
                  <input
                    type="text"
                    value={newFirstName}
                    onChange={(e) => setNewFirstName(e.target.value)}
                    placeholder="เช่น ศักดิ์สิทธิ์"
                    required
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl p-2.5 text-slate-900 focus:outline-hidden font-medium"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">นามสกุล</label>
                  <input
                    type="text"
                    value={newLastName}
                    onChange={(e) => setNewLastName(e.target.value)}
                    placeholder="เช่น ศรีเจริญ"
                    required
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl p-2.5 text-slate-900 focus:outline-hidden font-medium"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">ชื่อเล่น</label>
                  <input
                    type="text"
                    value={newNickname}
                    onChange={(e) => setNewNickname(e.target.value)}
                    placeholder="เช่น บาส, ต้า"
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl p-2.5 text-slate-900 focus:outline-hidden font-medium"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">เบอร์โทรศัพท์ผู้ปกครอง</label>
                  <input
                    type="tel"
                    value={newPhone}
                    onChange={(e) => setNewPhone(e.target.value)}
                    placeholder="เช่น 0910610997"
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl p-2.5 text-slate-900 focus:outline-hidden font-medium"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">กลุ่มการดูแลช่วยเหลือ</label>
                <select
                  value={newStatus}
                  onChange={(e) => setNewStatus(e.target.value as StudentCareStatus)}
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl p-2.5 text-slate-900 focus:outline-hidden font-semibold"
                >
                  <option value="normal">กลุ่มปกติ (มีผลการเรียนและความประพฤติปกติ)</option>
                  <option value="watch">กลุ่มเฝ้าระวัง (ต้องการการดูแลด้านการเรียนหรือสุขภาพ)</option>
                  <option value="danger">กลุ่มเฝ้าระวังเข้มงวด (ต้องการความช่วยเหลือพิเศษ)</option>
                </select>
              </div>

              <div className="flex items-center justify-end gap-2 pt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold rounded-xl transition-colors cursor-pointer"
                >
                  ยกเลิก
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-rose-600 hover:bg-rose-700 text-white font-bold rounded-xl shadow-md transition-colors cursor-pointer"
                >
                  บันทึกข้อมูลนักเรียน
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 2. Edit Student Modal */}
      {editingStudent && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs">
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-2xl max-w-lg w-full space-y-4 animate-fade-in">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="font-black text-slate-900 text-base flex items-center gap-2">
                <Edit3 className="w-5 h-5 text-blue-600" />
                <span>แก้ไขข้อมูลนักเรียน: {editingStudent.firstName} (ชั้น {editingStudent.room})</span>
              </h3>
              <button
                onClick={() => setEditingStudent(null)}
                className="text-slate-400 hover:text-slate-600 text-lg font-bold"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSaveEdit} className="space-y-3.5 text-xs">
              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">เลขที่</label>
                  <input
                    type="number"
                    min="1"
                    max="99"
                    value={editNumber}
                    onChange={(e) => setEditNumber(Number(e.target.value))}
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl p-2.5 text-slate-900 focus:outline-hidden font-bold"
                    required
                  />
                </div>

                <div className="col-span-2">
                  <label className="block font-bold text-slate-700 mb-1">คำนำหน้า</label>
                  <select
                    value={editPrefix}
                    onChange={(e) => setEditPrefix(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl p-2.5 text-slate-900 focus:outline-hidden font-semibold"
                  >
                    <option value="เด็กชาย">เด็กชาย</option>
                    <option value="เด็กหญิง">เด็กหญิง</option>
                    <option value="นาย">นาย</option>
                    <option value="นางสาว">นางสาว</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">ชื่อจริง</label>
                  <input
                    type="text"
                    value={editFirstName}
                    onChange={(e) => setEditFirstName(e.target.value)}
                    required
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl p-2.5 text-slate-900 focus:outline-hidden font-medium"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">นามสกุล</label>
                  <input
                    type="text"
                    value={editLastName}
                    onChange={(e) => setEditLastName(e.target.value)}
                    required
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl p-2.5 text-slate-900 focus:outline-hidden font-medium"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">ชื่อเล่น</label>
                  <input
                    type="text"
                    value={editNickname}
                    onChange={(e) => setEditNickname(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl p-2.5 text-slate-900 focus:outline-hidden font-medium"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">เบอร์โทรศัพท์ผู้ปกครอง</label>
                  <input
                    type="tel"
                    value={editPhone}
                    onChange={(e) => setEditPhone(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl p-2.5 text-slate-900 focus:outline-hidden font-medium"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">กลุ่มการดูแลช่วยเหลือ</label>
                <select
                  value={editStatus}
                  onChange={(e) => setEditStatus(e.target.value as StudentCareStatus)}
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl p-2.5 text-slate-900 focus:outline-hidden font-semibold"
                >
                  <option value="normal">กลุ่มปกติ</option>
                  <option value="watch">กลุ่มเฝ้าระวัง</option>
                  <option value="danger">กลุ่มเฝ้าระวังเข้มงวด</option>
                </select>
              </div>

              <div className="flex items-center justify-end gap-2 pt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setEditingStudent(null)}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold rounded-xl transition-colors cursor-pointer"
                >
                  ยกเลิก
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl shadow-md transition-colors cursor-pointer"
                >
                  บันทึกการแก้ไข
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 3. Delete Confirmation Dialog */}
      {deletingStudent && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs">
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-2xl max-w-sm w-full space-y-4 animate-fade-in text-center">
            <div className="w-14 h-14 mx-auto rounded-full bg-rose-100 text-rose-600 flex items-center justify-center">
              <Trash2 className="w-7 h-7" />
            </div>

            <div className="space-y-1">
              <h3 className="font-black text-slate-900 text-base">ยืนยันการลบนักเรียน?</h3>
              <p className="text-xs text-slate-500 font-medium">
                คุณต้องการลบรายชื่อ <strong className="text-rose-600">{deletingStudent.prefix}{deletingStudent.firstName} {deletingStudent.lastName}</strong> (เลขที่ {deletingStudent.number}) ชั้น {deletingStudent.room} ออกจากระบบใช่หรือไม่?
              </p>
            </div>

            <div className="flex items-center justify-center gap-2 pt-2">
              <button
                type="button"
                onClick={() => setDeletingStudent(null)}
                className="flex-1 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl text-xs transition-colors cursor-pointer"
              >
                ยกเลิก
              </button>
              <button
                type="button"
                onClick={handleConfirmDelete}
                className="flex-1 py-2.5 bg-rose-600 hover:bg-rose-700 text-white font-bold rounded-xl text-xs shadow-md transition-colors cursor-pointer"
              >
                ยืนยันการลบ
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
