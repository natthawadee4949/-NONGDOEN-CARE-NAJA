import React, { useState } from 'react';
import { UserRole, ClassRoom, User, Student } from '../types';
import {
  LogIn,
  UserPlus,
  ShieldCheck,
  User as UserIcon,
  Phone,
  Key,
  GraduationCap,
  Sparkles,
  CalendarCheck,
  BookOpen,
  Award,
  Globe,
  ExternalLink,
  Heart,
  Smile,
  CheckCircle2,
} from 'lucide-react';
import { MascotIcon } from './MascotIcon';
import { playSuccessChime, playClickSound } from '../utils/audio';

interface LoginGatewayProps {
  onLogin: (user: User) => void;
  onRegister: (newUser: User) => void;
  onQuickDemoTeacher: () => void;
  onQuickDemoStudent: () => void;
  existingStudents: Student[];
}

export const LoginGateway: React.FC<LoginGatewayProps> = ({
  onLogin,
  onRegister,
  onQuickDemoTeacher,
  onQuickDemoStudent,
  existingStudents,
}) => {
  const [roleMode, setRoleMode] = useState<UserRole>('teacher');
  const [activeTab, setActiveTab] = useState<'login' | 'register'>('login');

  // Teacher Login Form
  const [teacherPhone, setTeacherPhone] = useState('0910610997');
  const [teacherPass, setTeacherPass] = useState('1234');

  // Student Login Form
  const [studentRoom, setStudentRoom] = useState<ClassRoom>('ป.1');
  const [studentNumber, setStudentNumber] = useState<number>(1);
  const [studentName, setStudentName] = useState<string>('');

  // Register Form (Real Account Creation)
  const [regRole, setRegRole] = useState<UserRole>('teacher');
  const [regPrefix, setRegPrefix] = useState('คุณครู');
  const [regFirstName, setRegFirstName] = useState('');
  const [regLastName, setRegLastName] = useState('');
  const [regNickname, setRegNickname] = useState('');
  const [regRoom, setRegRoom] = useState<ClassRoom>('ป.1');
  const [regNumber, setRegNumber] = useState<number>(1);
  const [regPhone, setRegPhone] = useState('');
  const [regPass, setRegPass] = useState('');

  const handleTeacherLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const isCareDemo = teacherPhone === '0910610997' || teacherPhone.includes('care');
    const user: User = {
      id: isCareDemo ? 'usr-teacher-care' : `usr-teacher-${Date.now()}`,
      role: 'teacher',
      login: teacherPhone,
      prefix: 'คุณครู',
      firstName: isCareDemo ? 'ครูแคร์' : 'คุณครู',
      lastName: isCareDemo ? 'ศรีเจริญ' : '',
      nickname: isCareDemo ? 'ครูแคร์' : 'ครู',
      room: 'ป.1',
      phone: teacherPhone,
      exp: 999,
      bio: 'ครูประจำชั้น โรงเรียนหนองเดิ่นศรีเจริญวิทยา สพป.หนองคาย เขต 1',
    };
    playSuccessChime();
    onLogin(user);
  };

  const handleStudentLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const matched = existingStudents.find(
      (s) => s.room === studentRoom && s.number === Number(studentNumber)
    );

    const isDoenDemo = Number(studentNumber) === 1 && studentRoom === 'ป.1';

    const user: User = {
      id: matched ? matched.id : (isDoenDemo ? 'std-p1-doen' : `std-${studentRoom}-${studentNumber}`),
      role: 'student',
      login: `${studentRoom}-${studentNumber}`,
      prefix: matched ? matched.prefix : 'เด็กชาย',
      firstName: matched ? matched.firstName : (studentName.trim() || (isDoenDemo ? 'น้องเดิ่น' : `นักเรียนเลขที่ ${studentNumber}`)),
      lastName: matched ? matched.lastName : 'ศรีเจริญ',
      nickname: matched ? matched.nickname : (studentName.trim() || (isDoenDemo ? 'น้องเดิ่น' : `เลขที่ ${studentNumber}`)),
      room: studentRoom,
      number: Number(studentNumber),
      phone: matched ? matched.phone : '0910610997',
      exp: matched ? matched.exp : 150,
      avatarSize: 96,
      themeColor: 'sakura',
    };
    playSuccessChime();
    onLogin(user);
  };

  const handleRegisterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!regFirstName.trim() || !regLastName.trim()) return;

    const newUser: User = {
      id: `usr-${regRole}-${Date.now()}`,
      role: regRole,
      login: regPhone.trim() || (regRole === 'student' ? `${regRoom}-${regNumber}` : `user_${Date.now()}`),
      prefix: regPrefix,
      firstName: regFirstName.trim(),
      lastName: regLastName.trim(),
      nickname: regNickname.trim() || regFirstName.trim(),
      room: regRoom,
      number: regRole === 'student' ? Number(regNumber) : undefined,
      phone: regPhone.trim() || '0910610997',
      exp: regRole === 'teacher' ? 999 : 50,
      avatarSize: 96,
      themeColor: regRole === 'teacher' ? 'rose' : 'sakura',
      bio: regRole === 'teacher'
        ? `ครูประจำชั้น ${regRoom} โรงเรียนหนองเดิ่นศรีเจริญวิทยา`
        : `นักเรียนชั้น ${regRoom} เลขที่ ${regNumber} โรงเรียนหนองเดิ่นศรีเจริญวิทยา`,
    };

    playSuccessChime();
    onRegister(newUser);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-rose-50 via-slate-50 to-pink-50/40 flex flex-col justify-between selection:bg-rose-500 selection:text-white">
      {/* Official Top Bar */}
      <header className="bg-slate-900 text-slate-200 text-xs py-2 px-4 border-b border-slate-800">
        <div className="max-w-6xl mx-auto flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-2 font-medium">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span>ระบบบริการอิเล็กทรอนิกส์ โรงเรียนหนองเดิ่นศรีเจริญวิทยา สพป.หนองคาย เขต 1</span>
          </div>
          <div className="flex items-center gap-3 text-slate-300 text-[11px] flex-wrap">
            <a
              href="https://www.nsw-school.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-rose-300 hover:text-white font-semibold transition-colors"
            >
              เว็บทางการ: www.nsw-school.com ↗
            </a>
            <span className="text-slate-600">•</span>
            <a
              href="https://kku-creative.my.canva.site/dahu41ngfhw"
              target="_blank"
              rel="noopener noreferrer"
              className="text-pink-300 hover:text-white transition-colors"
            >
              เว็บสื่อสร้างสรรค์ (ไม่ทางการ) ↗
            </a>
            <span className="text-slate-600">•</span>
            <span className="text-slate-400">โทร: 0910610997</span>
          </div>
        </div>
      </header>

      {/* Main Login / Registration Container */}
      <main className="max-w-5xl mx-auto px-4 py-8 sm:py-12 flex-1 flex flex-col items-center justify-center w-full">
        {/* School Branding Header */}
        <div className="text-center mb-6 sm:mb-8 space-y-2 max-w-xl">
          <div className="flex items-center justify-center gap-3">
            <MascotIcon size="lg" variant="logo" className="hover:scale-105 transition-transform" />
            <MascotIcon size="lg" variant="mascot" className="hover:scale-105 transition-transform" />
          </div>

          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-100 border border-rose-200 text-rose-800 text-xs font-bold shadow-2xs">
            <Sparkles className="w-3.5 h-3.5 text-rose-600" />
            <span>NONGDOEN CARE • ระบบดูแลช่วยเหลือนักเรียนและจัดการชั้นเรียน</span>
          </div>

          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
            โรงเรียนหนองเดิ่นศรีเจริญวิทยา
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 font-medium">
            สำนักงานเขตพื้นที่การศึกษาประถมศึกษาหนองคาย เขต 1 (สพป.นค.1)
          </p>
        </div>

        {/* Auth Gateway Box */}
        <div className="bg-white rounded-3xl border border-rose-100 shadow-xl overflow-hidden max-w-xl w-full">
          {/* Header Switch: Teacher vs Student Portal */}
          <div className="grid grid-cols-2 p-1.5 bg-slate-100 border-b border-slate-200">
            <button
              onClick={() => {
                setRoleMode('teacher');
                setActiveTab('login');
                playClickSound();
              }}
              className={`py-3 px-4 rounded-2xl font-bold text-xs sm:text-sm flex items-center justify-center gap-2 transition-all cursor-pointer ${
                roleMode === 'teacher' && activeTab === 'login'
                  ? 'bg-slate-900 text-white shadow-md'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-white/60'
              }`}
            >
              <ShieldCheck className="w-4 h-4 text-rose-400" />
              <span>ห้องครูประจำชั้น</span>
            </button>

            <button
              onClick={() => {
                setRoleMode('student');
                setActiveTab('login');
                playClickSound();
              }}
              className={`py-3 px-4 rounded-2xl font-bold text-xs sm:text-sm flex items-center justify-center gap-2 transition-all cursor-pointer ${
                roleMode === 'student' && activeTab === 'login'
                  ? 'bg-rose-600 text-white shadow-md'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-white/60'
              }`}
            >
              <UserIcon className="w-4 h-4 text-white" />
              <span>พอร์ทัลนักเรียน</span>
            </button>
          </div>

          {/* Quick Demo Fast Access Strip - ONLY "ครูแคร์" and "น้องเดิ่น" */}
          <div className="bg-gradient-to-r from-rose-50 via-pink-50 to-rose-50 p-3.5 border-b border-rose-100 flex flex-col sm:flex-row items-center justify-between gap-2.5">
            <div className="text-[11px] font-black text-rose-900 flex items-center gap-1.5">
              <Sparkles className="w-4 h-4 text-rose-600 shrink-0" />
              <span>บัญชีทดลองใช้ (Trial Demo):</span>
            </div>
            <div className="flex items-center gap-2 w-full sm:w-auto">
              <button
                onClick={onQuickDemoTeacher}
                className="flex-1 sm:flex-none px-3.5 py-1.5 bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold rounded-xl shadow-2xs transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
                title="ทดลองใช้งานในบทบาท ครูแคร์"
              >
                <ShieldCheck className="w-3.5 h-3.5 text-rose-400" />
                <span>ทดลองใช้: ครูแคร์</span>
              </button>
              <button
                onClick={onQuickDemoStudent}
                className="flex-1 sm:flex-none px-3.5 py-1.5 bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold rounded-xl shadow-2xs transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
                title="ทดลองใช้งานในบทบาท น้องเดิ่น"
              >
                <UserIcon className="w-3.5 h-3.5" />
                <span>ทดลองใช้: น้องเดิ่น</span>
              </button>
            </div>
          </div>

          {/* Tab Sub-bar: Login vs Register Real Account */}
          <div className="flex border-b border-slate-100 px-6 pt-4 text-xs font-bold">
            <button
              onClick={() => {
                setActiveTab('login');
                playClickSound();
              }}
              className={`pb-2.5 mr-6 border-b-2 transition-colors flex items-center gap-1.5 cursor-pointer ${
                activeTab === 'login'
                  ? 'border-rose-600 text-rose-600'
                  : 'border-transparent text-slate-400 hover:text-slate-700'
              }`}
            >
              <LogIn className="w-3.5 h-3.5" />
              <span>เข้าสู่ระบบ ({roleMode === 'teacher' ? 'คุณครู' : 'นักเรียน'})</span>
            </button>
            <button
              onClick={() => {
                setActiveTab('register');
                playClickSound();
              }}
              className={`pb-2.5 border-b-2 transition-colors flex items-center gap-1.5 cursor-pointer ${
                activeTab === 'register'
                  ? 'border-rose-600 text-rose-600'
                  : 'border-transparent text-slate-400 hover:text-slate-700'
              }`}
            >
              <UserPlus className="w-3.5 h-3.5" />
              <span>ลงทะเบียนบัญชีจริง (คุณครู / นักเรียน)</span>
            </button>
          </div>

          {/* Form Content */}
          <div className="p-6 sm:p-8">
            {/* TEACHER LOGIN */}
            {activeTab === 'login' && roleMode === 'teacher' && (
              <form onSubmit={handleTeacherLoginSubmit} className="space-y-4">
                <div className="space-y-1">
                  <label className="block text-xs font-bold text-slate-700 flex items-center gap-1">
                    <Phone className="w-3.5 h-3.5 text-rose-600" />
                    <span>เบอร์โทรศัพท์ประจำตัวครู (หรือบัญชีทดลอง: 0910610997):</span>
                  </label>
                  <input
                    type="text"
                    value={teacherPhone}
                    onChange={(e) => setTeacherPhone(e.target.value)}
                    placeholder="เช่น 0910610997"
                    required
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl p-3 text-xs sm:text-sm text-slate-900 font-semibold focus:bg-white focus:border-rose-500 focus:outline-hidden"
                  />
                  <p className="text-[11px] text-slate-500">
                    * คุณครูใช้เบอร์โทรศัพท์จริงที่ลงทะเบียนไว้ในการเข้าสู่ระบบ หรือคลิกปุ่ม "ทดลองใช้: ครูแคร์" ด้านบน
                  </p>
                </div>

                <div className="space-y-1">
                  <label className="block text-xs font-bold text-slate-700 flex items-center gap-1">
                    <Key className="w-3.5 h-3.5 text-rose-600" />
                    <span>รหัสผ่าน:</span>
                  </label>
                  <input
                    type="password"
                    value={teacherPass}
                    onChange={(e) => setTeacherPass(e.target.value)}
                    placeholder="รหัสผ่าน"
                    required
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl p-3 text-xs sm:text-sm text-slate-900 font-semibold focus:bg-white focus:border-rose-500 focus:outline-hidden"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-3 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs sm:text-sm rounded-xl shadow-md transition-colors flex items-center justify-center gap-2 cursor-pointer"
                >
                  <ShieldCheck className="w-4 h-4 text-rose-400" />
                  <span>เข้าสู่ระบบห้องครูประจำชั้น</span>
                </button>
              </form>
            )}

            {/* STUDENT LOGIN */}
            {activeTab === 'login' && roleMode === 'student' && (
              <form onSubmit={handleStudentLoginSubmit} className="space-y-4">
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="block text-xs font-bold text-slate-700 flex items-center gap-1">
                      <GraduationCap className="w-3.5 h-3.5 text-rose-600" />
                      <span>ระดับชั้น:</span>
                    </label>
                    <select
                      value={studentRoom}
                      onChange={(e) => setStudentRoom(e.target.value as ClassRoom)}
                      className="w-full bg-slate-50 border border-slate-300 rounded-xl p-3 text-xs sm:text-sm text-slate-900 font-bold focus:bg-white focus:border-rose-500 focus:outline-hidden cursor-pointer"
                    >
                      {['อ.1', 'อ.2', 'อ.3', 'ป.1', 'ป.2', 'ป.3', 'ป.4', 'ป.5', 'ป.6'].map((r) => (
                        <option key={r} value={r}>
                          {r.startsWith('อ.') ? `อนุบาล ${r.slice(2)} (${r})` : `ประถม ${r.slice(2)} (${r})`}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="space-y-1">
                    <label className="block text-xs font-bold text-slate-700">เลขที่:</label>
                    <input
                      type="number"
                      min={1}
                      max={50}
                      value={studentNumber}
                      onChange={(e) => setStudentNumber(Number(e.target.value))}
                      required
                      className="w-full bg-slate-50 border border-slate-300 rounded-xl p-3 text-xs sm:text-sm text-slate-900 font-bold focus:bg-white focus:border-rose-500 focus:outline-hidden"
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="block text-xs font-bold text-slate-700">ชื่อหรือชื่อเล่นนักเรียน (ถ้ามี):</label>
                  <input
                    type="text"
                    value={studentName}
                    onChange={(e) => setStudentName(e.target.value)}
                    placeholder="เช่น น้องเดิ่น หรือ น้องบาส"
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl p-3 text-xs sm:text-sm text-slate-900 font-semibold focus:bg-white focus:border-rose-500 focus:outline-hidden"
                  />
                  <p className="text-[11px] text-slate-500">
                    * นักเรียนสามารถเข้าได้ทันทีด้วย ชั้น และ เลขที่ หรือกดปุ่ม "ทดลองใช้: น้องเดิ่น" ด้านบน
                  </p>
                </div>

                <button
                  type="submit"
                  className="w-full py-3 bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs sm:text-sm rounded-xl shadow-md transition-colors flex items-center justify-center gap-2 cursor-pointer"
                >
                  <UserIcon className="w-4 h-4" />
                  <span>เข้าสู่ระบบการบ้านของฉัน</span>
                </button>
              </form>
            )}

            {/* REAL ACCOUNT REGISTRATION FORM */}
            {activeTab === 'register' && (
              <form onSubmit={handleRegisterSubmit} className="space-y-4">
                <div className="bg-rose-50/70 p-3 rounded-2xl border border-rose-200 text-xs">
                  <span className="font-bold text-rose-900 flex items-center gap-1.5 mb-2">
                    <CheckCircle2 className="w-4 h-4 text-rose-600" />
                    <span>ลงทะเบียนบัญชีจริง (เลือกบทบาทผู้ใช้งาน):</span>
                  </span>
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      type="button"
                      onClick={() => {
                        setRegRole('teacher');
                        setRegPrefix('คุณครู');
                        playClickSound();
                      }}
                      className={`py-2 px-3 rounded-xl font-bold text-xs flex items-center justify-center gap-1.5 cursor-pointer ${
                        regRole === 'teacher'
                          ? 'bg-slate-900 text-white shadow-xs'
                          : 'bg-white text-slate-700 border border-slate-200'
                      }`}
                    >
                      <ShieldCheck className="w-3.5 h-3.5 text-rose-400" />
                      <span>บัญชีคุณครูจริง</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => {
                        setRegRole('student');
                        setRegPrefix('เด็กชาย');
                        playClickSound();
                      }}
                      className={`py-2 px-3 rounded-xl font-bold text-xs flex items-center justify-center gap-1.5 cursor-pointer ${
                        regRole === 'student'
                          ? 'bg-rose-600 text-white shadow-xs'
                          : 'bg-white text-slate-700 border border-slate-200'
                      }`}
                    >
                      <UserIcon className="w-3.5 h-3.5" />
                      <span>บัญชีนักเรียนจริง</span>
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-2.5">
                  <div className="space-y-1">
                    <label className="block text-xs font-bold text-slate-700">คำนำหน้า:</label>
                    <select
                      value={regPrefix}
                      onChange={(e) => setRegPrefix(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-300 rounded-xl p-2.5 text-xs text-slate-900 font-semibold focus:outline-hidden"
                    >
                      {regRole === 'teacher' ? (
                        <>
                          <option value="คุณครู">คุณครู</option>
                          <option value="นาย">นาย</option>
                          <option value="นาง">นาง</option>
                          <option value="นางสาว">นางสาว</option>
                        </>
                      ) : (
                        <>
                          <option value="เด็กชาย">เด็กชาย</option>
                          <option value="เด็กหญิง">เด็กหญิง</option>
                          <option value="นาย">นาย</option>
                          <option value="นางสาว">นางสาว</option>
                        </>
                      )}
                    </select>
                  </div>

                  <div className="space-y-1">
                    <label className="block text-xs font-bold text-slate-700">ชื่อจริง *:</label>
                    <input
                      type="text"
                      value={regFirstName}
                      onChange={(e) => setRegFirstName(e.target.value)}
                      placeholder="ชื่อจริง"
                      required
                      className="w-full bg-slate-50 border border-slate-300 rounded-xl p-2.5 text-xs text-slate-900 font-semibold focus:outline-hidden"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="block text-xs font-bold text-slate-700">นามสกุล *:</label>
                    <input
                      type="text"
                      value={regLastName}
                      onChange={(e) => setRegLastName(e.target.value)}
                      placeholder="นามสกุล"
                      required
                      className="w-full bg-slate-50 border border-slate-300 rounded-xl p-2.5 text-xs text-slate-900 font-semibold focus:outline-hidden"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                  <div className="space-y-1 bg-rose-50/50 p-2 rounded-xl border border-rose-200">
                    <label className="block text-xs font-black text-rose-800 flex items-center gap-1">
                      <Heart className="w-3.5 h-3.5 text-rose-600 fill-rose-500" />
                      <span>ชื่อเล่น:</span>
                    </label>
                    <input
                      type="text"
                      value={regNickname}
                      onChange={(e) => setRegNickname(e.target.value)}
                      placeholder="เช่น ครูแคร์ / น้องเดิ่น"
                      className="w-full bg-white border border-rose-300 rounded-lg p-2 text-xs text-slate-900 font-bold focus:outline-hidden"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="block text-xs font-bold text-slate-700">ระดับชั้น:</label>
                    <select
                      value={regRoom}
                      onChange={(e) => setRegRoom(e.target.value as ClassRoom)}
                      className="w-full bg-slate-50 border border-slate-300 rounded-xl p-2 text-xs text-slate-900 font-bold focus:outline-hidden"
                    >
                      {['อ.1', 'อ.2', 'อ.3', 'ป.1', 'ป.2', 'ป.3', 'ป.4', 'ป.5', 'ป.6'].map((r) => (
                        <option key={r} value={r}>
                          {r}
                        </option>
                      ))}
                    </select>
                  </div>

                  {regRole === 'student' ? (
                    <div className="space-y-1">
                      <label className="block text-xs font-bold text-slate-700">เลขที่:</label>
                      <input
                        type="number"
                        min={1}
                        max={50}
                        value={regNumber}
                        onChange={(e) => setRegNumber(Number(e.target.value))}
                        className="w-full bg-slate-50 border border-slate-300 rounded-xl p-2 text-xs text-slate-900 font-bold focus:outline-hidden"
                      />
                    </div>
                  ) : (
                    <div className="space-y-1">
                      <label className="block text-xs font-bold text-slate-700">เบอร์โทรศัพท์ (ไอดี):</label>
                      <input
                        type="tel"
                        value={regPhone}
                        onChange={(e) => setRegPhone(e.target.value)}
                        placeholder="0910610997"
                        required
                        className="w-full bg-slate-50 border border-slate-300 rounded-xl p-2 text-xs text-slate-900 font-medium focus:outline-hidden"
                      />
                    </div>
                  )}
                </div>

                <div className="space-y-1">
                  <label className="block text-xs font-bold text-slate-700">รหัสผ่าน:</label>
                  <input
                    type="password"
                    value={regPass}
                    onChange={(e) => setRegPass(e.target.value)}
                    placeholder="กำหนดรหัสผ่าน"
                    required
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl p-2.5 text-xs text-slate-900 font-semibold focus:outline-hidden"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-3 bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs sm:text-sm rounded-xl shadow-md transition-colors flex items-center justify-center gap-2 cursor-pointer"
                >
                  <UserPlus className="w-4 h-4" />
                  <span>ยืนยันการลงทะเบียนบัญชีจริง และเข้าสู่ระบบ</span>
                </button>
              </form>
            )}
          </div>
        </div>

        {/* Feature Highlight Badges */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-8 w-full max-w-xl text-center">
          <div className="bg-white/80 backdrop-blur-xs p-3 rounded-2xl border border-rose-100 shadow-2xs">
            <CalendarCheck className="w-5 h-5 mx-auto text-rose-600 mb-1" />
            <div className="font-bold text-[11px] text-slate-800">เช็กชื่อผังที่นั่ง</div>
            <div className="text-[10px] text-slate-500">บันทึกเรียลไทม์</div>
          </div>
          <div className="bg-white/80 backdrop-blur-xs p-3 rounded-2xl border border-rose-100 shadow-2xs">
            <BookOpen className="w-5 h-5 mx-auto text-rose-600 mb-1" />
            <div className="font-bold text-[11px] text-slate-800">ตรวจส่งการบ้าน</div>
            <div className="text-[10px] text-slate-500">ส่งรูปภาพ & ให้คะแนน</div>
          </div>
          <div className="bg-white/80 backdrop-blur-xs p-3 rounded-2xl border border-rose-100 shadow-2xs">
            <Award className="w-5 h-5 mx-auto text-amber-500 mb-1" />
            <div className="font-bold text-[11px] text-slate-800">แต้มความดี EXP</div>
            <div className="text-[10px] text-slate-500">สะสมรางวัลดาว</div>
          </div>
          <div className="bg-white/80 backdrop-blur-xs p-3 rounded-2xl border border-rose-100 shadow-2xs">
            <Sparkles className="w-5 h-5 mx-auto text-purple-600 mb-1" />
            <div className="font-bold text-[11px] text-slate-800">เครื่องมือครู</div>
            <div className="text-[10px] text-slate-500">นาฬิกา & วงล้อสุ่ม</div>
          </div>
        </div>
      </main>

      {/* Official Footer */}
      <footer className="text-center py-4 text-xs text-slate-500 border-t border-slate-200 bg-white/60">
        <div>โรงเรียนหนองเดิ่นศรีเจริญวิทยา หมู่ 11 ต.หนองกอมเกาะ อ.เมืองหนองคาย จ.หนองคาย 43000</div>
        <div className="text-[11px] text-slate-400 mt-1 flex flex-wrap items-center justify-center gap-2">
          <span>สพป.หนองคาย เขต 1</span>
          <span>•</span>
          <span>โทร: 0910610997</span>
          <span>•</span>
          <a
            href="https://www.nsw-school.com"
            target="_blank"
            rel="noopener noreferrer"
            className="text-rose-600 hover:underline font-medium"
          >
            เว็บไซต์ทางการ (www.nsw-school.com)
          </a>
          <span>•</span>
          <a
            href="https://kku-creative.my.canva.site/dahu41ngfhw"
            target="_blank"
            rel="noopener noreferrer"
            className="text-pink-600 hover:underline font-medium"
          >
            เว็บไซต์สื่อสร้างสรรค์ (ไม่ทางการ)
          </a>
        </div>
      </footer>
    </div>
  );
};
