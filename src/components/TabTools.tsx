import React, { useState, useEffect, useRef } from 'react';
import { Student, ClassRoom } from '../types';
import {
  Timer,
  Play,
  Pause,
  RotateCcw,
  Maximize2,
  Minimize2,
  Trophy,
  Shuffle,
  Users,
  Star,
  Plus,
  Sparkles,
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { playTick, playAlarm, playSuccessChime } from '../utils/audio';

interface TabToolsProps {
  students: Student[];
  currentRoom: ClassRoom;
  onAwardExp: (studentId: string, amount: number) => void;
}

export const TabTools: React.FC<TabToolsProps> = ({ students, currentRoom, onAwardExp }) => {
  // Timer State
  const [timerSeconds, setTimerSeconds] = useState<number>(300); // 5 mins
  const [timerRunning, setTimerRunning] = useState<boolean>(false);
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);
  const timerContainerRef = useRef<HTMLDivElement>(null);

  // Wheel State
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isSpinning, setIsSpinning] = useState<boolean>(false);
  const [wheelRotation, setWheelRotation] = useState<number>(0);
  const [winnerStudent, setWinnerStudent] = useState<Student | null>(null);

  // Group Generator State
  const [groupCount, setGroupCount] = useState<number>(3);
  const [generatedGroups, setGeneratedGroups] = useState<Student[][]>([]);

  const roomStudents = students.filter((s) => s.room === currentRoom);

  // 1. Timer Logic
  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;
    if (timerRunning) {
      interval = setInterval(() => {
        setTimerSeconds((prev) => {
          if (prev <= 1) {
            setTimerRunning(false);
            playAlarm();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [timerRunning]);

  const toggleTimer = () => {
    setTimerRunning(!timerRunning);
  };

  const resetTimer = () => {
    setTimerRunning(false);
    setTimerSeconds(300);
  };

  const addSeconds = (sec: number) => {
    setTimerSeconds((prev) => prev + sec);
  };

  const formatTimer = (sec: number) => {
    const m = Math.floor(sec / 60);
    const s = sec % 60;
    return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
  };

  const toggleFullscreen = () => {
    if (!timerContainerRef.current) return;
    if (!document.fullscreenElement) {
      timerContainerRef.current.requestFullscreen?.().catch(() => {});
      setIsFullscreen(true);
    } else {
      document.exitFullscreen?.().catch(() => {});
      setIsFullscreen(false);
    }
  };

  // 2. Lucky Wheel Drawing & Spinning
  const colors = [
    '#E11D48', '#2563EB', '#10B981', '#F59E0B', '#8B5CF6',
    '#06B6D4', '#EC4899', '#14B8A6', '#F97316', '#6366F1'
  ];

  const drawWheel = (rotation: number) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const count = roomStudents.length;
    if (count === 0) {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.fillStyle = '#64748b';
      ctx.font = '14px Prompt';
      ctx.textAlign = 'center';
      ctx.fillText('ยังไม่มีนักเรียนในห้องนี้', canvas.width / 2, canvas.height / 2);
      return;
    }

    const arc = (2 * Math.PI) / count;
    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;
    const radius = canvas.width / 2 - 10;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    for (let i = 0; i < count; i++) {
      const angle = rotation + i * arc;
      ctx.beginPath();
      ctx.fillStyle = colors[i % colors.length];
      ctx.moveTo(centerX, centerY);
      ctx.arc(centerX, centerY, radius, angle, angle + arc);
      ctx.lineTo(centerX, centerY);
      ctx.fill();
      ctx.strokeStyle = '#ffffff';
      ctx.lineWidth = 2;
      ctx.stroke();

      // Text
      ctx.save();
      ctx.translate(centerX, centerY);
      ctx.rotate(angle + arc / 2);
      ctx.textAlign = 'right';
      ctx.fillStyle = '#ffffff';
      ctx.font = 'bold 12px Prompt';
      const label = roomStudents[i].nickname || roomStudents[i].firstName;
      ctx.fillText(label, radius - 15, 4);
      ctx.restore();
    }

    // Center Hub
    ctx.beginPath();
    ctx.arc(centerX, centerY, 22, 0, 2 * Math.PI);
    ctx.fillStyle = '#0f172a';
    ctx.fill();
    ctx.strokeStyle = '#ffffff';
    ctx.lineWidth = 3;
    ctx.stroke();

    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 10px Prompt';
    ctx.textAlign = 'center';
    ctx.fillText('NSW', centerX, centerY + 3);
  };

  useEffect(() => {
    drawWheel(wheelRotation);
  }, [roomStudents, wheelRotation]);

  const spinWheel = () => {
    if (isSpinning || roomStudents.length === 0) return;
    setIsSpinning(true);
    setWinnerStudent(null);

    const count = roomStudents.length;
    const targetIndex = Math.floor(Math.random() * count);
    const sliceAngle = (2 * Math.PI) / count;

    // Pointer is at the top (-Math.PI / 2)
    const pointerAngle = 1.5 * Math.PI;
    const targetAngle = pointerAngle - (targetIndex * sliceAngle + sliceAngle / 2);
    const fullSpins = (5 + Math.floor(Math.random() * 4)) * (2 * Math.PI);
    const finalAngle = wheelRotation + fullSpins + (targetAngle - (wheelRotation % (2 * Math.PI)));

    const startTime = performance.now();
    const duration = 3500;
    const initialRot = wheelRotation;

    let lastTickAngle = initialRot;

    const animate = (currentTime: number) => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      // Ease out cubic
      const ease = 1 - Math.pow(1 - progress, 3);
      const currentAngle = initialRot + (finalAngle - initialRot) * ease;

      setWheelRotation(currentAngle);

      if (Math.abs(currentAngle - lastTickAngle) >= sliceAngle * 0.8) {
        playTick();
        lastTickAngle = currentAngle;
      }

      if (progress < 1) {
        requestAnimationFrame(animate);
      } else {
        setIsSpinning(false);
        const winner = roomStudents[targetIndex];
        setWinnerStudent(winner);
        playSuccessChime();
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.6 },
        });
      }
    };

    requestAnimationFrame(animate);
  };

  // 3. Group Generator
  const generateGroups = () => {
    if (roomStudents.length === 0) return;
    const shuffled = [...roomStudents].sort(() => Math.random() - 0.5);
    const groups: Student[][] = Array.from({ length: groupCount }, () => []);

    shuffled.forEach((student, idx) => {
      groups[idx % groupCount].push(student);
    });

    setGeneratedGroups(groups);
    playSuccessChime();
  };

  return (
    <div className="space-y-6">
      {/* 2-Column Grid: Timer & Lucky Wheel */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Column 1: Classroom Timer */}
        <div
          ref={timerContainerRef}
          className={`bg-white rounded-2xl p-6 border border-slate-200 shadow-xs flex flex-col justify-between ${
            isFullscreen ? 'fixed inset-0 z-50 p-12 flex flex-col items-center justify-center bg-slate-950 text-white' : ''
          }`}
        >
          <div className="flex items-center justify-between border-b border-slate-100 pb-3 w-full">
            <h3 className="font-extrabold text-slate-900 text-sm sm:text-base flex items-center gap-2">
              <Timer className="w-5 h-5 text-rose-600" />
              <span>นาฬิกาจับเวลาหน้าห้อง (Classroom Timer)</span>
            </h3>
            <button
              onClick={toggleFullscreen}
              className="p-1.5 rounded-lg text-slate-500 hover:text-slate-800 hover:bg-slate-100 transition-colors"
              title={isFullscreen ? 'ออกจากโหมดเต็มจอ' : 'โหมดเต็มจอฉายโปรเจกเตอร์'}
            >
              {isFullscreen ? <Minimize2 className="w-5 h-5" /> : <Maximize2 className="w-5 h-5" />}
            </button>
          </div>

          {/* Digits Display */}
          <div className="text-center py-6">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-1">
              เวลากิจกรรมที่เหลือ
            </span>
            <div className={`font-black tracking-tight select-none font-mono ${isFullscreen ? 'text-8xl sm:text-9xl text-rose-400' : 'text-6xl sm:text-7xl text-slate-900'}`}>
              {formatTimer(timerSeconds)}
            </div>
          </div>

          {/* Presets */}
          <div className="flex flex-wrap justify-center gap-2 py-2">
            {[60, 180, 300, 600, 900].map((sec) => (
              <button
                key={sec}
                onClick={() => {
                  setTimerRunning(false);
                  setTimerSeconds(sec);
                }}
                className="px-3 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-xs rounded-lg transition-colors"
              >
                {sec / 60} นาที
              </button>
            ))}
            <button
              onClick={() => addSeconds(60)}
              className="px-3 py-1 bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 font-bold text-xs rounded-lg transition-colors flex items-center gap-1"
            >
              <Plus className="w-3 h-3" />
              <span>1 นาที</span>
            </button>
          </div>

          {/* Controls */}
          <div className="flex items-center justify-center gap-3 pt-4 border-t border-slate-100">
            <button
              onClick={toggleTimer}
              className={`flex items-center gap-2 px-6 py-2.5 rounded-xl font-bold text-xs sm:text-sm text-white shadow-md transition-all active:scale-95 ${
                timerRunning ? 'bg-amber-600 hover:bg-amber-700' : 'bg-rose-600 hover:bg-rose-700'
              }`}
            >
              {timerRunning ? (
                <>
                  <Pause className="w-4 h-4" />
                  <span>หยุดชั่วคราว</span>
                </>
              ) : (
                <>
                  <Play className="w-4 h-4" />
                  <span>เริ่มจับเวลา</span>
                </>
              )}
            </button>

            <button
              onClick={resetTimer}
              className="flex items-center gap-1.5 px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-xs sm:text-sm rounded-xl transition-colors"
            >
              <RotateCcw className="w-4 h-4" />
              <span>รีเซ็ต</span>
            </button>
          </div>
        </div>

        {/* Column 2: Lucky Wheel */}
        <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <h3 className="font-extrabold text-slate-900 text-sm sm:text-base flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-rose-600" />
              <span>วงล้อสุ่มผู้โชคดี (Lucky Wheel)</span>
            </h3>
            <span className="text-xs font-bold text-rose-700 bg-rose-50 px-2.5 py-0.5 rounded-full border border-rose-200">
              ชั้น {currentRoom} ({roomStudents.length} คน)
            </span>
          </div>

          {/* Wheel Canvas */}
          <div className="relative flex flex-col items-center justify-center py-4">
            {/* Top Pointer */}
            <div className="w-0 h-0 border-l-[12px] border-l-transparent border-r-[12px] border-r-transparent border-t-[20px] border-t-rose-600 z-10 -mb-2 filter drop-shadow-md" />

            <canvas
              ref={canvasRef}
              width={280}
              height={280}
              className="rounded-full shadow-lg border-4 border-slate-900 max-w-full"
            />
          </div>

          {/* Spin Button */}
          <div className="pt-3 border-t border-slate-100 flex flex-col items-center gap-2">
            <button
              onClick={spinWheel}
              disabled={isSpinning || roomStudents.length === 0}
              className="flex items-center justify-center gap-2 w-full py-2.5 bg-gradient-to-r from-rose-600 to-pink-600 hover:from-rose-700 hover:to-pink-700 disabled:opacity-50 text-white font-bold text-sm rounded-xl shadow-md transition-all active:scale-95"
            >
              <Shuffle className="w-4 h-4" />
              <span>{isSpinning ? 'กำลังหมุนวงล้อ...' : 'หมุนวงล้อสุ่มนักเรียน'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Winner Announcement Card (if any) */}
      {winnerStudent && (
        <div className="bg-gradient-to-r from-amber-500 via-rose-500 to-pink-500 rounded-2xl p-6 text-white shadow-xl flex flex-col sm:flex-row items-center justify-between gap-6 animate-fade-in">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-2xl bg-white/20 backdrop-blur-xs flex items-center justify-center text-3xl shadow-inner shrink-0">
              <Trophy className="w-10 h-10 text-amber-200" />
            </div>
            <div>
              <div className="text-xs font-black uppercase tracking-widest text-amber-200">
                ★ ผู้โชคดีจากการสุ่มวงล้อ ★
              </div>
              <h2 className="text-xl sm:text-2xl font-black mt-0.5">
                {winnerStudent.prefix}{winnerStudent.firstName} {winnerStudent.lastName}
              </h2>
              <p className="text-xs text-rose-100">
                (น้อง{winnerStudent.nickname}) • ชั้น {winnerStudent.room} เลขที่ {winnerStudent.number} • มี {winnerStudent.exp} EXP
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <button
              onClick={() => {
                onAwardExp(winnerStudent.id, 10);
                playSuccessChime();
              }}
              className="flex items-center gap-1.5 px-4 py-2.5 bg-white text-rose-700 font-extrabold text-xs sm:text-sm rounded-xl shadow-md hover:bg-rose-50 transition-colors"
            >
              <Star className="w-4 h-4 fill-amber-400 text-amber-500" />
              <span>แจก +10 EXP ให้ผู้โชคดี!</span>
            </button>
            <button
              onClick={() => setWinnerStudent(null)}
              className="px-3 py-2 bg-slate-900/40 hover:bg-slate-900/60 rounded-xl text-xs font-semibold"
            >
              ปิด
            </button>
          </div>
        </div>
      )}

      {/* Row 2: Random Group Generator */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-3">
          <h3 className="font-extrabold text-slate-900 text-sm sm:text-base flex items-center gap-2">
            <Users className="w-5 h-5 text-rose-600" />
            <span>ระบบจัดกลุ่มนักเรียนอัตโนมัติ (Group Generator)</span>
          </h3>

          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-600">
              <span>จำนวนกลุ่ม:</span>
              <select
                value={groupCount}
                onChange={(e) => setGroupCount(Number(e.target.value))}
                className="bg-slate-50 border border-slate-200 text-slate-900 font-bold py-1 px-2.5 rounded-lg focus:outline-hidden"
              >
                {[2, 3, 4, 5, 6].map((num) => (
                  <option key={num} value={num}>
                    {num} กลุ่ม
                  </option>
                ))}
              </select>
            </div>

            <button
              onClick={generateGroups}
              className="flex items-center gap-1.5 px-3.5 py-1.5 bg-slate-900 text-white font-bold text-xs rounded-lg hover:bg-slate-800 transition-colors shadow-2xs"
            >
              <Shuffle className="w-4 h-4 text-rose-400" />
              <span>จัดกลุ่มแบบสุ่ม</span>
            </button>
          </div>
        </div>

        {generatedGroups.length === 0 ? (
          <div className="p-8 text-center text-slate-400 text-xs">
            กดปุ่ม <strong>"จัดกลุ่มแบบสุ่ม"</strong> เพื่อแบ่งกลุ่มนักเรียนในชั้น {currentRoom} อย่างทั่วถึงและเท่าเทียม
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 pt-2">
            {generatedGroups.map((group, idx) => (
              <div
                key={idx}
                className="bg-slate-50 border border-slate-200 rounded-xl p-4 shadow-2xs space-y-3"
              >
                <div className="flex items-center justify-between border-b border-slate-200 pb-2">
                  <span className="font-extrabold text-xs text-rose-700">กลุ่มที่ {idx + 1}</span>
                  <span className="text-[11px] font-semibold text-slate-500">
                    {group.length} คน
                  </span>
                </div>
                <div className="space-y-1.5">
                  {group.map((std) => (
                    <div
                      key={std.id}
                      className="text-xs text-slate-800 flex items-center justify-between bg-white p-2 rounded-lg border border-slate-100"
                    >
                      <span className="font-semibold truncate">
                        {std.number}. {std.firstName} {std.lastName}
                      </span>
                      <span className="text-[10px] text-rose-600 font-bold shrink-0 ml-1">
                        ({std.nickname})
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
