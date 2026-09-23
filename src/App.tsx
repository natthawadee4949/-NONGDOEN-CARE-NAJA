import React, { useState, useEffect } from 'react';
import {
  Student,
  Assignment,
  Submission,
  AttendanceRecord,
  AttendanceStatus,
  ClassRoom,
  NavigationTab,
  User,
} from './types';
import {
  loadAppState,
  saveAppState,
  loadCurrentUser,
  saveCurrentUser,
  exportBackupFile,
  AppStateData,
} from './utils/storage';
import {
  INITIAL_STUDENTS,
  INITIAL_ASSIGNMENTS,
  INITIAL_SUBMISSIONS,
  INITIAL_SUBJECTS,
  generateInitialAttendance,
  DEMO_TEACHER,
  DEMO_STUDENT,
  getTodayDateString,
} from './data/initialData';
import { TopUtilityBar } from './components/TopUtilityBar';
import { SidebarLeft } from './components/SidebarLeft';
import { TabHome } from './components/TabHome';
import { TabSeating } from './components/TabSeating';
import { TabTools } from './components/TabTools';
import { TabGrading } from './components/TabGrading';
import { TabHomework } from './components/TabHomework';
import { TabStudents } from './components/TabStudents';
import { TabStudentPortal } from './components/TabStudentPortal';
import { TabProfile } from './components/TabProfile';
import { LoginGateway } from './components/LoginGateway';
import { AuthModal } from './components/AuthModal';
import { LineOAModal } from './components/LineOAModal';
import { MarchPlayerModal } from './components/MarchPlayerModal';
import { StudentProfileModal } from './components/StudentProfileModal';
import { ImageLightboxModal } from './components/ImageLightboxModal';
import { Footer } from './components/Footer';
import { playSuccessChime, setAudioMuted, getAudioMuted } from './utils/audio';

export default function App() {
  // Global State
  const [appState, setAppState] = useState<AppStateData>(() => loadAppState());
  const [currentUser, setCurrentUser] = useState<User | null>(() => loadCurrentUser());
  const [activeTab, setActiveTab] = useState<NavigationTab>('home');
  const [currentRoom, setCurrentRoom] = useState<ClassRoom>('ป.1');
  const [selectedDate, setSelectedDate] = useState<string>(getTodayDateString());
  const [isMutedState, setIsMutedState] = useState<boolean>(() => getAudioMuted());

  const handleToggleMute = () => {
    const next = !isMutedState;
    setIsMutedState(next);
    setAudioMuted(next);
  };

  // Modals
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [lineModalOpen, setLineModalOpen] = useState(false);
  const [lineModalMode, setLineModalMode] = useState<'attendance' | 'homework'>('attendance');
  const [marchModalOpen, setMarchModalOpen] = useState(false);
  const [selectedStudentForProfile, setSelectedStudentForProfile] = useState<Student | null>(null);
  const [lightboxImage, setLightboxImage] = useState<string | null>(null);
  const [lightboxCaption, setLightboxCaption] = useState<string>('');

  // Toast Notification
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage((prev) => (prev === msg ? null : prev));
    }, 3000);
  };

  // Persist State Changes
  useEffect(() => {
    saveAppState(appState);
  }, [appState]);

  useEffect(() => {
    saveCurrentUser(currentUser);
  }, [currentUser]);

  // Guard student access: allow home, student-portal (การบ้าน), and profile (บัญชีส่วนตัว)
  useEffect(() => {
    if (currentUser?.role === 'student') {
      if (activeTab !== 'home' && activeTab !== 'student-portal' && activeTab !== 'profile') {
        setActiveTab('home');
      }
    }
  }, [currentUser?.role, activeTab]);

  // Attendance Handlers
  const handleUpdateAttendance = (studentId: string, status: AttendanceStatus) => {
    setAppState((prev) => {
      const existingIdx = prev.attendance.findIndex(
        (a) => a.studentId === studentId && a.room === currentRoom && a.date === selectedDate
      );

      let updatedAttendance: AttendanceRecord[];
      if (existingIdx >= 0) {
        updatedAttendance = [...prev.attendance];
        updatedAttendance[existingIdx] = {
          ...updatedAttendance[existingIdx],
          status,
          updatedAt: new Date().toISOString(),
        };
      } else {
        const newRecord: AttendanceRecord = {
          id: `att-${studentId}-${selectedDate}`,
          date: selectedDate,
          studentId,
          room: currentRoom,
          status,
          updatedAt: new Date().toISOString(),
          updatedBy: currentUser?.firstName || 'คุณครู',
        };
        updatedAttendance = [...prev.attendance, newRecord];
      }

      return {
        ...prev,
        attendance: updatedAttendance,
      };
    });
  };

  const handleMarkAllPresent = () => {
    const roomStudents = appState.students.filter((s) => s.room === currentRoom);

    setAppState((prev) => {
      const otherAttendance = prev.attendance.filter(
        (a) => !(a.room === currentRoom && a.date === selectedDate)
      );

      const allPresentRecords: AttendanceRecord[] = roomStudents.map((s) => ({
        id: `att-${s.id}-${selectedDate}`,
        date: selectedDate,
        studentId: s.id,
        room: currentRoom,
        status: 'มา',
        updatedAt: new Date().toISOString(),
        updatedBy: currentUser?.firstName || 'คุณครู',
      }));

      return {
        ...prev,
        attendance: [...otherAttendance, ...allPresentRecords],
      };
    });

    showToast(`บันทึกการมาเรียนครบทุกคนในชั้น ${currentRoom} แล้ว`);
  };

  // Student Handlers
  const handleAddStudent = (studentData: Omit<Student, 'id' | 'exp'>) => {
    const newStudent: Student = {
      ...studentData,
      id: `std-${Date.now()}`,
      exp: 100,
    };

    setAppState((prev) => ({
      ...prev,
      students: [...prev.students, newStudent],
    }));

    showToast(`เพิ่ม ${newStudent.prefix}${newStudent.firstName} เรียบร้อยแล้ว`);
  };

  const handleUpdateStudent = (studentId: string, updated: Partial<Student>) => {
    setAppState((prev) => ({
      ...prev,
      students: prev.students.map((s) => (s.id === studentId ? { ...s, ...updated } : s)),
    }));
    showToast('บันทึกการแก้ไขข้อมูลนักเรียนแล้ว');
  };

  const handleDeleteStudent = (studentId: string) => {
    setAppState((prev) => ({
      ...prev,
      students: prev.students.filter((s) => s.id !== studentId),
      attendance: prev.attendance.filter((a) => a.studentId !== studentId),
      submissions: prev.submissions.filter((sub) => sub.studentId !== studentId),
    }));
    if (selectedStudentForProfile?.id === studentId) {
      setSelectedStudentForProfile(null);
    }
    showToast('ลบข้อมูลนักเรียนออกจากระบบแล้ว');
  };

  const handleClearRoomStudents = (room: ClassRoom) => {
    setAppState((prev) => ({
      ...prev,
      students: prev.students.filter((s) => s.room !== room),
      attendance: prev.attendance.filter((a) => a.room !== room),
    }));
    showToast(`ล้างข้อมูลนักเรียนชั้น ${room} เรียบร้อยแล้ว`);
  };

  // Assignment Handlers
  const handleAddAssignment = (asgData: Omit<Assignment, 'id' | 'createdAt'>) => {
    const newAssignment: Assignment = {
      ...asgData,
      id: `asg-${Date.now()}`,
      createdAt: new Date().toISOString(),
    };

    setAppState((prev) => ({
      ...prev,
      assignments: [newAssignment, ...prev.assignments],
    }));

    showToast(`สั่งการบ้าน "${newAssignment.title}" สำเร็จ`);
  };

  // Grading Handlers
  const handleUpdateScore = (
    assignmentId: string,
    studentId: string,
    score: number,
    feedback?: string
  ) => {
    setAppState((prev) => {
      const existingIdx = prev.submissions.findIndex(
        (s) => s.assignmentId === assignmentId && s.studentId === studentId
      );

      let updatedSubs: Submission[];
      if (existingIdx >= 0) {
        updatedSubs = [...prev.submissions];
        updatedSubs[existingIdx] = {
          ...updatedSubs[existingIdx],
          score,
          feedback,
          status: 'graded',
        };
      } else {
        const newSub: Submission = {
          id: `sub-${Date.now()}-${studentId}`,
          assignmentId,
          studentId,
          score,
          feedback,
          submittedAt: new Date().toISOString(),
          status: 'graded',
        };
        updatedSubs = [...prev.submissions, newSub];
      }

      return {
        ...prev,
        submissions: updatedSubs,
      };
    });
  };

  const handleBatchScore = (assignmentId: string, type: 'full' | 'addOne') => {
    const targetAsg = appState.assignments.find((a) => a.id === assignmentId);
    if (!targetAsg) return;

    const roomStudents = appState.students.filter((s) => s.room === currentRoom);

    setAppState((prev) => {
      const updatedSubs = [...prev.submissions];

      roomStudents.forEach((student) => {
        const idx = updatedSubs.findIndex(
          (s) => s.assignmentId === assignmentId && s.studentId === student.id
        );

        if (idx >= 0) {
          const currentScore = updatedSubs[idx].score || 0;
          const newScore =
            type === 'full'
              ? targetAsg.maxScore
              : Math.min(targetAsg.maxScore, currentScore + 1);

          updatedSubs[idx] = {
            ...updatedSubs[idx],
            score: newScore,
            status: 'graded',
          };
        } else {
          updatedSubs.push({
            id: `sub-${Date.now()}-${student.id}`,
            assignmentId,
            studentId: student.id,
            score: type === 'full' ? targetAsg.maxScore : 1,
            submittedAt: new Date().toISOString(),
            status: 'graded',
          });
        }
      });

      return {
        ...prev,
        submissions: updatedSubs,
      };
    });

    showToast(type === 'full' ? 'บันทึกคะแนนเต็มให้นักเรียนทุกคนแล้ว' : 'เพิ่มคะแนน +1 ให้ทุกคนแล้ว');
  };

  const handleBatchMarkSubmitted = (assignmentId: string) => {
    const roomStudents = appState.students.filter((s) => s.room === currentRoom);

    setAppState((prev) => {
      const updatedSubs = [...prev.submissions];

      roomStudents.forEach((student) => {
        const exists = updatedSubs.some(
          (s) => s.assignmentId === assignmentId && s.studentId === student.id
        );

        if (!exists) {
          updatedSubs.push({
            id: `sub-${Date.now()}-${student.id}`,
            assignmentId,
            studentId: student.id,
            submittedAt: new Date().toISOString(),
            status: 'submitted',
          });
        }
      });

      return {
        ...prev,
        submissions: updatedSubs,
      };
    });

    showToast('บันทึกส่งการบ้านแล้วทุกคน');
  };

  // Student Homework Submission
  const handleSubmitHomework = (
    assignmentId: string,
    studentId: string,
    fileUrl?: string,
    note?: string
  ) => {
    setAppState((prev) => {
      const newSub: Submission = {
        id: `sub-${Date.now()}-${studentId}`,
        assignmentId,
        studentId,
        fileUrl,
        note: note || 'กรณีส่งแล้ว',
        submittedAt: new Date().toISOString(),
        status: 'submitted',
      };

      return {
        ...prev,
        submissions: [newSub, ...prev.submissions.filter((s) => !(s.assignmentId === assignmentId && s.studentId === studentId))],
      };
    });

    showToast('บันทึกกรณีส่งแล้วเรียบร้อย!');
  };

  const handleToggleHomeworkStatus = (
    assignmentId: string,
    studentId: string,
    markSubmitted: boolean,
    fileUrl?: string,
    note?: string
  ) => {
    setAppState((prev) => {
      if (!markSubmitted) {
        return {
          ...prev,
          submissions: prev.submissions.filter(
            (s) => !(s.assignmentId === assignmentId && s.studentId === studentId)
          ),
        };
      }
      const newSub: Submission = {
        id: `sub-${Date.now()}-${studentId}`,
        assignmentId,
        studentId,
        fileUrl,
        note: note || 'กรณีส่งแล้ว',
        submittedAt: new Date().toISOString(),
        status: 'submitted',
      };
      return {
        ...prev,
        submissions: [
          newSub,
          ...prev.submissions.filter(
            (s) => !(s.assignmentId === assignmentId && s.studentId === studentId)
          ),
        ],
      };
    });

    if (markSubmitted) {
      showToast('ติ๊กบันทึกแล้ว: กรณีส่งแล้ว ✓');
    } else {
      showToast('ยกเลิกการติ๊กส่งการบ้านแล้ว');
    }
  };

  // EXP Award
  const handleAwardExp = (studentId: string, amount: number) => {
    setAppState((prev) => ({
      ...prev,
      students: prev.students.map((s) =>
        s.id === studentId ? { ...s, exp: (s.exp || 0) + amount } : s
      ),
    }));

    showToast(`เพิ่ม +${amount} EXP คะแนนความดีแล้ว!`);
  };

  // Auth & Roles
  const handleLogin = (user: User) => {
    setCurrentUser(user);
    setAuthModalOpen(false);
    if (user.role === 'student') {
      setActiveTab('student-portal');
    } else {
      setActiveTab('home');
    }
    showToast(`ยินดีต้อนรับ ${user.prefix || ''}${user.firstName}`);
  };

  const handleRegister = (newUser: User) => {
    setCurrentUser(newUser);
    setAppState((prev) => ({
      ...prev,
      users: [...prev.users, newUser],
      students:
        newUser.role === 'student'
          ? [
              ...prev.students,
              {
                id: newUser.id,
                prefix: newUser.prefix || 'เด็กชาย',
                firstName: newUser.firstName,
                lastName: newUser.lastName,
                nickname: newUser.nickname || newUser.firstName,
                room: newUser.room || 'ป.1',
                number: newUser.number || 1,
                phone: newUser.phone || '0910610997',
                status: 'normal',
                exp: 50,
              },
            ]
          : prev.students,
    }));
    setAuthModalOpen(false);
    setActiveTab('home');
    showToast(`ยินดีต้อนรับ ${newUser.prefix || ''}${newUser.firstName} ${newUser.nickname ? `(${newUser.nickname})` : ''} ลงทะเบียนสำเร็จ`);
  };

  const handleQuickDemoTeacher = () => {
    setCurrentUser(DEMO_TEACHER);
    setAuthModalOpen(false);
    setActiveTab('home');
    showToast('เข้าสู่ระบบในฐานะ ครูแคร์ (ทดลองใช้)');
  };

  const handleQuickDemoStudent = () => {
    setCurrentUser(DEMO_STUDENT);
    setAuthModalOpen(false);
    setActiveTab('home');
    showToast('เข้าสู่ระบบในฐานะ น้องเดิ่น (ทดลองใช้)');
  };

  const handleSwitchRole = (role: 'teacher' | 'student') => {
    if (role === 'teacher') {
      setCurrentUser(DEMO_TEACHER);
      setActiveTab('home');
      showToast('สลับเข้าสู่ระบบ: ครูแคร์');
    } else {
      setCurrentUser(DEMO_STUDENT);
      setActiveTab('home');
      showToast('สลับเข้าสู่ระบบ: น้องเดิ่น');
    }
    playSuccessChime();
  };

  const handleLogout = () => {
    setCurrentUser(null);
    setAuthModalOpen(false);
    showToast('ออกจากระบบเรียบร้อย');
  };

  // Profile Update
  const handleUpdateProfile = (updated: Partial<User>) => {
    if (!currentUser) return;
    const nextUser = { ...currentUser, ...updated };
    setCurrentUser(nextUser);
    showToast('บันทึกข้อมูลส่วนตัวเรียบร้อย');
  };

  // Export & Backup
  const handleExportCsv = () => {
    const roomStudents = appState.students.filter((s) => s.room === currentRoom);
    let csvContent = 'data:text/csv;charset=utf-8,\uFEFF';
    csvContent += 'เลขที่,คำนำหน้า,ชื่อ,นามสกุล,ชื่อเล่น,ชั้น,เบอร์ติดต่อ,สถานะการดูแล,EXP\n';

    roomStudents.forEach((s) => {
      csvContent += `${s.number},${s.prefix},${s.firstName},${s.lastName},${s.nickname},${s.room},${s.phone},${s.status},${s.exp}\n`;
    });

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `students-${currentRoom}-${selectedDate}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    showToast('ส่งออกไฟล์ CSV เรียบร้อย');
  };

  const handleExportBackup = () => {
    exportBackupFile(appState);
    showToast('ดาวน์โหลดไฟล์สำรองข้อมูล JSON แล้ว');
  };

  const handleImportBackup = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (ev) => {
      try {
        const parsed = JSON.parse(ev.target?.result as string);
        if (parsed && Array.isArray(parsed.students)) {
          setAppState(parsed);
          showToast('นำเข้าข้อมูลสำเร็จ!');
        } else {
          showToast('รูปแบบไฟล์สำรองข้อมูลไม่ถูกต้อง');
        }
      } catch (err) {
        showToast('เกิดข้อผิดพลาดในการอ่านไฟล์ JSON');
      }
    };
    reader.readAsText(file);
  };

  const handleResetDefaultData = () => {
    if (window.confirm('คุณต้องการรีเซ็ตข้อมูลทั้งหมดกลับเป็นค่าเริ่มต้นหรือไม่?')) {
      const initialData: AppStateData = {
        students: INITIAL_STUDENTS,
        assignments: INITIAL_ASSIGNMENTS,
        submissions: INITIAL_SUBMISSIONS,
        attendance: generateInitialAttendance(),
        subjects: INITIAL_SUBJECTS,
        users: [DEMO_TEACHER, DEMO_STUDENT],
      };
      setAppState(initialData);
      showToast('รีเซ็ตข้อมูลเป็นค่าเริ่มต้นเรียบร้อยแล้ว');
    }
  };

  // 1. หน้าแรกต้องเข้าสู่ระบบก่อน: หากยังไม่ได้เข้าสู่ระบบ แสดง LoginGateway
  if (!currentUser) {
    return (
      <>
        <LoginGateway
          onLogin={handleLogin}
          onRegister={handleRegister}
          onQuickDemoTeacher={handleQuickDemoTeacher}
          onQuickDemoStudent={handleQuickDemoStudent}
          existingStudents={appState.students}
        />
        {toastMessage && (
          <div className="fixed bottom-6 right-6 z-50 bg-slate-900 text-white text-xs font-bold px-4 py-2.5 rounded-2xl shadow-xl border border-slate-700 flex items-center gap-2 animate-bounce">
            <span className="w-2 h-2 rounded-full bg-rose-500" />
            <span>{toastMessage}</span>
          </div>
        )}
      </>
    );
  }

  return (
    <div className="min-h-screen flex bg-slate-100 text-slate-800 font-sans">
      {/* 1. Left Sidebar Navigation Bar (ย้ายแถบเมนูมาฝั่งซ้ายของจอ) */}
      <SidebarLeft
        activeTab={activeTab}
        onSelectTab={setActiveTab}
        currentRoom={currentRoom}
        onChangeRoom={setCurrentRoom}
        currentUser={currentUser}
        onLogout={handleLogout}
        onOpenMarchModal={() => setMarchModalOpen(true)}
        onSwitchRole={handleSwitchRole}
        isMuted={isMutedState}
        onToggleMute={handleToggleMute}
      />

      {/* 2. Right Content Area (Offset for Left Sidebar on Desktop) */}
      <div className="flex-1 flex flex-col min-w-0 lg:pl-72 transition-all">
        {/* Top Utility Bar */}
        <TopUtilityBar
          currentUser={currentUser}
          onOpenMarchModal={() => setMarchModalOpen(true)}
          onOpenProfile={() => setActiveTab('profile')}
          onOpenLogin={() => setAuthModalOpen(true)}
          onLogout={handleLogout}
          onSwitchRole={handleSwitchRole}
        />

        {/* 3. Main Body Container */}
        <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 py-6 sm:py-8">
          {currentUser.role === 'student' ? (
            /* Student Views: Home, Homework Portal, and Profile */
            <>
              {activeTab === 'home' && (
                <TabHome
                  students={appState.students}
                  assignments={appState.assignments}
                  submissions={appState.submissions}
                  attendance={appState.attendance}
                  subjects={appState.subjects}
                  currentRoom={currentRoom}
                  currentUser={currentUser}
                  todayDate={selectedDate}
                  onNavigateTab={setActiveTab}
                  onOpenLineModal={(mode) => {
                    setLineModalMode(mode);
                    setLineModalOpen(true);
                  }}
                  onOpenMarchModal={() => setMarchModalOpen(true)}
                  onOpenAddStudent={() => setActiveTab('students')}
                  onOpenAddAssignment={() => setActiveTab('grading')}
                />
              )}

              {activeTab === 'student-portal' && (
                <TabStudentPortal
                  currentUser={currentUser}
                  students={appState.students}
                  assignments={appState.assignments}
                  submissions={appState.submissions}
                  onSubmitHomework={handleSubmitHomework}
                  onToggleHomeworkStatus={handleToggleHomeworkStatus}
                  onViewImage={(url, caption) => {
                    setLightboxImage(url);
                    setLightboxCaption(caption);
                  }}
                />
              )}

              {activeTab === 'profile' && (
                <TabProfile
                  currentUser={currentUser}
                  onUpdateUser={handleUpdateProfile}
                  onExportBackup={handleExportBackup}
                  onImportBackup={handleImportBackup}
                  onResetDefaultData={handleResetDefaultData}
                />
              )}
            </>
          ) : (
            /* Teacher Views: Full Class & Institutional Management */
            <>
              {activeTab === 'home' && (
                <TabHome
                  students={appState.students}
                  assignments={appState.assignments}
                  submissions={appState.submissions}
                  attendance={appState.attendance}
                  subjects={appState.subjects}
                  currentRoom={currentRoom}
                  currentUser={currentUser}
                  todayDate={selectedDate}
                  onNavigateTab={setActiveTab}
                  onOpenLineModal={(mode) => {
                    setLineModalMode(mode);
                    setLineModalOpen(true);
                  }}
                  onOpenMarchModal={() => setMarchModalOpen(true)}
                  onOpenAddStudent={() => setActiveTab('students')}
                  onOpenAddAssignment={() => setActiveTab('grading')}
                />
              )}

              {activeTab === 'seating' && (
                <TabSeating
                  students={appState.students}
                  attendance={appState.attendance}
                  currentRoom={currentRoom}
                  currentUser={currentUser}
                  selectedDate={selectedDate}
                  onChangeDate={setSelectedDate}
                  onUpdateAttendance={handleUpdateAttendance}
                  onMarkAllPresent={handleMarkAllPresent}
                  onOpenLineModal={(mode) => {
                    setLineModalMode(mode);
                    setLineModalOpen(true);
                  }}
                  onAwardExp={handleAwardExp}
                  onSelectStudent={setSelectedStudentForProfile}
                  onOpenAddStudent={() => setActiveTab('students')}
                />
              )}

              {activeTab === 'tools' && (
                <TabTools
                  students={appState.students}
                  currentRoom={currentRoom}
                  onAwardExp={handleAwardExp}
                />
              )}

              {activeTab === 'grading' && (
                <TabGrading
                  students={appState.students}
                  assignments={appState.assignments}
                  submissions={appState.submissions}
                  currentRoom={currentRoom}
                  currentUser={currentUser}
                  subjects={appState.subjects}
                  onAddAssignment={handleAddAssignment}
                  onUpdateScore={handleUpdateScore}
                  onBatchScore={handleBatchScore}
                />
              )}

              {activeTab === 'homework' && (
                <TabHomework
                  students={appState.students}
                  assignments={appState.assignments}
                  submissions={appState.submissions}
                  currentRoom={currentRoom}
                  onOpenLineModal={(mode) => {
                    setLineModalMode(mode);
                    setLineModalOpen(true);
                  }}
                  onBatchMarkSubmitted={handleBatchMarkSubmitted}
                  onViewImage={(url, caption) => {
                    setLightboxImage(url);
                    setLightboxCaption(caption);
                  }}
                />
              )}

              {activeTab === 'students' && (
                <TabStudents
                  students={appState.students}
                  currentRoom={currentRoom}
                  onAddStudent={handleAddStudent}
                  onUpdateStudent={handleUpdateStudent}
                  onDeleteStudent={handleDeleteStudent}
                  onSelectStudent={setSelectedStudentForProfile}
                  onExportCsv={handleExportCsv}
                  onClearRoomStudents={handleClearRoomStudents}
                />
              )}

              {activeTab === 'profile' && (
                <TabProfile
                  currentUser={currentUser}
                  onUpdateUser={handleUpdateProfile}
                  onExportBackup={handleExportBackup}
                  onImportBackup={handleImportBackup}
                  onResetDefaultData={handleResetDefaultData}
                />
              )}
            </>
          )}
        </main>

        {/* 4. Footer */}
        <Footer
          onNavigateTab={setActiveTab}
          onOpenLineModal={() => {
            setLineModalMode('attendance');
            setLineModalOpen(true);
          }}
          currentUser={currentUser}
        />
      </div>

      {/* Modals */}
      <AuthModal
        isOpen={authModalOpen}
        onClose={() => setAuthModalOpen(false)}
        onLogin={handleLogin}
        onRegister={handleRegister}
        onQuickDemoTeacher={handleQuickDemoTeacher}
        onQuickDemoStudent={handleQuickDemoStudent}
      />

      <LineOAModal
        isOpen={lineModalOpen}
        onClose={() => setLineModalOpen(false)}
        initialMode={lineModalMode}
        currentRoom={currentRoom}
        students={appState.students}
        attendance={appState.attendance}
        assignments={appState.assignments}
        selectedDate={selectedDate}
        currentUser={currentUser}
      />

      <MarchPlayerModal
        isOpen={marchModalOpen}
        onClose={() => setMarchModalOpen(false)}
      />

      <StudentProfileModal
        student={selectedStudentForProfile}
        onClose={() => setSelectedStudentForProfile(null)}
        onAwardExp={handleAwardExp}
        onDeleteStudent={currentUser?.role === 'teacher' ? handleDeleteStudent : undefined}
      />

      <ImageLightboxModal
        imageUrl={lightboxImage}
        caption={lightboxCaption}
        onClose={() => setLightboxImage(null)}
      />

      {/* Toast Notification Notification Pill */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-slate-900 text-white text-xs font-bold px-4 py-2.5 rounded-2xl shadow-xl border border-slate-700 flex items-center gap-2 animate-bounce">
          <span className="w-2 h-2 rounded-full bg-rose-500" />
          <span>{toastMessage}</span>
        </div>
      )}
    </div>
  );
}
