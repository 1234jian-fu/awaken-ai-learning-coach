import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Sparkles, 
  Play, 
  Pause,
  CheckCircle2, 
  ChevronRight, 
  ChevronLeft,
  Activity,
  MessageSquare,
  BookOpen,
  Send,
  Mic,
  Zap,
  Terminal,
  Brain,
  Layers,
  Award,
  AlertCircle,
  HelpCircle,
  Volume2,
  VolumeX,
  RotateCcw,
  BookMarked,
  ArrowRight,
  TrendingUp,
  Cpu,
  Bookmark,
  ChevronDown,
  ChevronUp,
  Check,
  Flame,
  LineChart,
  Lock,
  Unlock,
  Sliders,
  Award as AwardIcon
} from 'lucide-react';
import { initialBlueprint } from '../data';

// Premium, iOS-Style Translucent Outline Icon Container
function TranslucentIcon({ 
  icon: Icon, 
  className = "w-4 h-4", 
  variant = 'brand' 
}: { 
  icon: React.ComponentType<any>; 
  className?: string; 
  variant?: 'brand' | 'success' | 'warning' 
}) {
  const styles = {
    brand: "bg-[#5B8CFF]/8 border-[#5B8CFF]/15 text-[#5B8CFF]",
    success: "bg-[#34C759]/8 border-[#34C759]/15 text-[#34C759]",
    warning: "bg-[#FFB547]/8 border-[#FFB547]/15 text-[#FFB547]"
  };
  
  return (
    <div className={`p-2 rounded-xl border ${styles[variant]} inline-flex items-center justify-center shrink-0`}>
      <Icon className={className} strokeWidth={1.8} />
    </div>
  );
}

export default function BlueprintPage() {
  // Navigation: 1 = 蓝图, 2 = 导师 , 3 = 记忆/中枢 Dashboard (Redesigned Active Default)
  const [activeTab, setActiveTab] = useState<1 | 2 | 3>(3);

  // --- States for NEW REDESIGNED Memory/Vault Page (Tab 3) ---
  const [learningScore, setLearningScore] = useState<number>(85);
  const [isTomorrowBlueprintExpanded, setIsTomorrowBlueprintExpanded] = useState<boolean>(true);
  const [isPlayingRecordedVoice, setIsPlayingRecordedVoice] = useState<boolean>(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  
  // Custom interactive data vectors for Tab 3 (User Gaps & Mastered points)
  const [masteredSkills, setMasteredSkills] = useState<string[]>([
    "界面电子调控层作用机理 (Se-Ni配位键)",
    "超高镍极片晶格微裂纹原位稳定机理",
    "1.5% mol 临界掺杂扩散系数热力学临界态"
  ]);

  const [weakSkills, setWeakSkills] = useState<string[]>([
    "多极化状态下的原位颗粒开裂裂纹自补偿动力学",
    "小组答辩中的学术级逻辑阐述与论点输出"
  ]);

  // Handle Toast popover notifications
  const triggerToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 4500);
  };

  // Move a weak skill to Mastered and boost progress score!
  const markAsMastered = (skillName: string, index: number) => {
    // Remove from weakness
    const updatedWeak = [...weakSkills];
    updatedWeak.splice(index, 1);
    setWeakSkills(updatedWeak);

    // Add to mastered
    setMasteredSkills([...masteredSkills, skillName]);

    // Boost score dynamically to show delightful micro-feedback
    const newScore = Math.min(100, learningScore + 7);
    setLearningScore(newScore);

    triggerToast(`🎉 成功攻克薄弱盲区！"${skillName}" 已并入今日已掌握。今日掌握率提升至 ${newScore}%！`);
  };

  // Restore skills to default state for unlimited interactive replay
  const handleResetSkills = () => {
    setMasteredSkills([
      "界面电子调控层作用机理 (Se-Ni配位键)",
      "超高镍极片晶格微裂纹原位稳定机理",
      "1.5% mol 临界掺杂扩散系数热力学临界态"
    ]);
    setWeakSkills([
      "多极化状态下的原位颗粒开裂裂纹自补偿动力学",
      "小组答辩中的学术级逻辑阐述与论点输出"
    ]);
    setLearningScore(85);
    triggerToast("记忆中枢数据已重置到今日初始值。您可以继续点击自主巩固！");
  };

  // --- States for REDESIGNED AI Tutor Page (Page 2) ---
  const [isPlayingAudio, setIsPlayingAudio] = useState<boolean>(true);
  const [currentStage, setCurrentStage] = useState<'concept' | 'mechanism' | 'training'>('mechanism');
  
  // Custom interactive text content for AI Lecturing Card
  const defaultLectureText = "超高镍正极在循环中容易发生表面结构退化，导致阻抗上升和容量衰减。硒修饰可以通过界面调控、缺陷缓冲和副反应抑制，帮助材料维持更稳定的循环状态。";
  const [lectureText, setLectureText] = useState<string>(defaultLectureText);
  const [lectureTone, setLectureTone] = useState<'default' | 'simpler' | 'example' | 'defense'>('default');

  // Mic state machine: 'idle' | 'recording' | 'transcribing' | 'synced' (语音转文字存入中枢)
  const [micState, setMicState] = useState<'idle' | 'recording' | 'transcribing' | 'synced'>('idle');
  const [isMutingSpeech, setIsMutingSpeech] = useState<boolean>(false);
  const [recordingSeconds, setRecordingSeconds] = useState<number>(0);
  const [customDialogue, setCustomDialogue] = useState<Array<{ sender: 'user' | 'assistant' | 'diagnose', text: string }>>([
    {
      sender: 'user',
      text: "硒修饰为什么能提升界面稳定性？"
    },
    {
      sender: 'assistant',
      text: "可以先这样理解：硒修饰在界面处能与过渡金属镍发生强配位键合，限制其脱氧逸出。生成的超薄硒化锂高离子电导相，能减少电解液与强活性 Ni⁴⁺ 发生氧化反应，从而在根本上平抑界面热力学副反应并缓解晶格相变退化。"
    },
    {
      sender: 'diagnose',
      text: "系统判断：您当前的研究聚焦点集中在“界面调控机制”，建议继续听第二小节“界面稳定性与副反应抑制”。高层级学术要点已实时归档中枢。"
    }
  ]);

  // Audio timer simulator for recording state
  useEffect(() => {
    let interval: any;
    if (micState === 'recording') {
      interval = setInterval(() => {
        setRecordingSeconds(sec => sec + 1);
      }, 1000);
    } else {
      setRecordingSeconds(0);
    }
    return () => clearInterval(interval);
  }, [micState]);

  // Custom text input
  const [textInputValue, setTextInputValue] = useState<string>('');

  // States for Blueprint Tab controls (Page 1)
  const [currentLevel, setCurrentLevel] = useState<'Concept' | 'Structure' | 'Mastery'>('Mastery');
  const [currentDuration, setCurrentDuration] = useState<'3 Days' | '1 Week' | '1 Month'>('1 Week');
  const [interactiveProgress, setInteractiveProgress] = useState(initialBlueprint.progressPercent);
  const [checklist, setChecklist] = useState(initialBlueprint.steps);

  // Handle checklist clicks on Blueprint view
  const toggleStep = (id: number) => {
    const updated = checklist.map(step => {
      if (step.id === id) {
        const nextStatus = step.status === 'completed' ? 'pending' : 'completed';
        return { ...step, status: nextStatus as any };
      }
      return step;
    });
    setChecklist(updated);

    const completedCount = updated.filter(s => s.status === 'completed').length;
    const newPct = Math.round((completedCount / updated.length) * 100);
    setInteractiveProgress(newPct);
  };

  // Helper formats seconds value 
  const formatTime = (sec: number) => {
    const minutes = Math.floor(sec / 60);
    const seconds = sec % 60;
    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  };

  // Triggering simulated recording pipeline
  const handleMicInteract = () => {
    if (micState === 'idle') {
      setMicState('recording');
    } else if (micState === 'recording') {
      setMicState('transcribing');
      // Transition to synced after 2 seconds simulation
      setTimeout(() => {
        setMicState('synced');
        // append the simulated speech text to the dialogue
        setCustomDialogue(prev => [
          ...prev,
          {
            sender: 'user',
            text: "过渡金属外延界面在强酸溶解时的锂空位浓度分布模型如何建立？"
          },
          {
            sender: 'assistant',
            text: "我们已成功录制此条音频。由于锂浓度呈现梯度阻力，硒掺杂能在 5nm 厚度层内部形成电荷斥能垒。系统已将该录音转写并同步存储到研究总结中枢。"
          },
          {
            sender: 'diagnose',
            text: "系统判断：此学情表现证明您已顺利掌握过渡态活化能势垒。今日界面稳定性（Mechanism）评估已更新，音频片段已同步归档入中枢系统。"
          }
        ]);
        
        // Push newly sync skill live to Tab 3 for realistic integration!
        setWeakSkills(prev => [...prev, "高电压状态下过渡金属阳离子酸溶与电能垒计算模型"]);
        setLearningScore(Math.max(40, learningScore - 4));

        setTimeout(() => {
          setMicState('idle');
        }, 5000);
      }, 2000);
    }
  };

  // Handles clicking lecture modifications
  const tweakLectureStyle = (tone: 'default' | 'simpler' | 'example' | 'defense') => {
    setLectureTone(tone);
    if (tone === 'default') {
      setLectureText(defaultLectureText);
    } else if (tone === 'simpler') {
      setLectureText("想象高镍电极表面是一块容易风化开裂的悬崖泥壁，而硒修饰就像是给悬崖喷涂了一层极富弹性的高级固化胶，把所有晶格裂隙粘住的同时，还能防水防腐，让高负荷循环平稳流畅。");
    } else if (tone === 'example') {
      setLectureText("在 1.5% 摩尔比的工艺配比下掺杂硒原子。由于硒半径（1.98 Å）比氧大，它不仅能在结构中充当一个微型支撑骨架、稍微撑开锂离子通道阻力，还通过强配位阴离子阻断电解液对高镍晶面的极化腐蚀。");
    } else if (tone === 'defense') {
      setLectureText("过渡陈述：‘本研究通过外延引入低极化、高共价性的硒阴离（Se）构建局部化学势自调控 network，有效控制高截止电压下的过渡金属阳离子溶解，实实现热力学层面的结构协同稳定演化。’");
    }
  };

  const submitTextQuestion = (e: React.FormEvent) => {
    e.preventDefault();
    if (!textInputValue.trim()) return;

    const typedText = textInputValue;
    setTextInputValue('');

    setCustomDialogue(prev => [
      ...prev,
      {
        sender: 'user',
        text: typedText
      },
      {
        sender: 'assistant',
        text: `收到您的书面学术追问。对此阶段的「机制拆解」：引入硒修饰极大地消除了姜-泰勒畸变（Jahn-Teller distortion）引发的剪切形变力。我们能在晶粒内部观察到持续完美的空间对称层（R-3m）。`
      },
      {
        sender: 'diagnose',
        text: `理解诊断：您当前提及的「${typedText}」已被系统感知并关联到主知识链。建议继续推进下一阶段的表达对抗训练。`
      }
    ]);
  };

  return (
    <div className="flex-1 flex flex-col h-full bg-[#09090b] text-white font-sans overflow-hidden select-none relative">
      
      {/* 1. 顶部状态敏感动态 Header 区域 */}
      <header className="px-5 pt-3.5 pb-2.5 flex justify-between items-center bg-[#09090b]/85 backdrop-blur-xl border-b border-white/[0.04] shrink-0 z-20">
        {activeTab === 3 ? (
          <div className="flex-1 flex justify-between items-center pt-1 animate-fade-in">
            <div className="flex items-center gap-1.5 cursor-pointer group" onClick={() => setActiveTab(2)}>
              <ChevronLeft className="w-4 h-4 text-slate-400 group-hover:text-white transition-colors" />
              <span className="text-[11px] font-bold text-slate-400 tracking-widest uppercase font-sans">返回导师讲解</span>
            </div>

            {/* Right Mini Progress */}
            <div className="flex items-center gap-1.5 px-3 h-6 bg-[#5B8CFF]/8 rounded-full border border-[#5B8CFF]/15 shrink-0">
              <span className="relative flex h-1.5 w-1.5 shrink-0">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#5B8CFF] opacity-65"></span>
                <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-[#5B8CFF]/80"></span>
              </span>
              <span className="text-[12px] font-medium text-[#5B8CFF] font-sans tracking-wide whitespace-nowrap">今日掌握率 {learningScore}%</span>
            </div>
          </div>
        ) : activeTab === 2 ? (
          <>
            <div className="flex items-center gap-1.5 cursor-pointer" onClick={() => setActiveTab(1)}>
              <div className="p-1 -ml-1 rounded-lg hover:bg-white/5 text-slate-400 active:text-white transition-all flex items-center">
                <ChevronLeft className="w-5 h-5 text-slate-300" />
                <span className="text-[13px] font-medium text-slate-400 hidden sm:inline -ml-0.5">主路线</span>
              </div>
            </div>
 
            {/* Center Page Title */}
            <div className="text-center">
              <span className="font-sans font-bold text-[16px] text-white tracking-widest block uppercase">
                导师训练舱
              </span>
              <span className="text-[9.5px] text-slate-500 font-medium tracking-widest block uppercase mt-1 font-sans">
                ACTIVE LECTURE COCKPIT
              </span>
            </div>
 
            {/* Right Status Indicator */}
            <div className="flex items-center gap-1.5 px-3 h-6 bg-[#34C759]/8 rounded-full border border-[#34C759]/15 shrink-0">
              <span className="relative flex h-1.5 w-1.5 shrink-0 animate-pulse">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#34C759] opacity-65"></span>
                <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-[#34C759]/80"></span>
              </span>
              <span className="text-[12px] font-medium text-[#34C759] tracking-wide uppercase font-sans whitespace-nowrap">
                AI ON
              </span>
            </div>
          </>
        ) : (
          <>
            <div className="space-y-0.5">
              <h1 className="text-[18px] font-bold text-white tracking-tight font-sans">电池学改性主线</h1>
              <span className="text-[9.5px] font-medium text-slate-500 tracking-widest uppercase font-sans block mt-1">AWAKEN PROCESS</span>
            </div>
            {/* Right Version Token */}
            <div className="flex items-center gap-1.5 px-3 h-6 bg-[#7B8794]/8 border border-[#7B8794]/15 rounded-full shrink-0">
              <span className="text-[12px] font-medium text-[#7B8794] tracking-wide font-sans whitespace-nowrap">
                V1.4 PRO
              </span>
            </div>
          </>
        )}
      </header>

      {/* 2. 主滚动卡片区域 (Primary Scrollable Workspace Section) */}
      <div className="flex-1 overflow-y-auto no-scrollbar pb-24 relative">
        
        {/* Absolute Toast Popover */}
        <AnimatePresence>
          {toastMessage && (
            <motion.div
              initial={{ opacity: 0, y: -15, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -10 }}
              className="absolute top-3 inset-x-4 bg-[#6366f1] text-[11.5px] font-medium p-3.5 rounded-xl shadow-[0_12px_24px_rgba(99,102,241,0.4)] border border-white/10 text-white z-50 flex items-start gap-2 leading-relaxed"
            >
              <Sparkles className="w-4 h-4 text-white shrink-0 mt-0.5 animate-pulse" />
              <div className="flex-1">{toastMessage}</div>
            </motion.div>
          )}
        </AnimatePresence>

        <AnimatePresence mode="wait">
          
          {/* ======================= TAB 1: BLUEPRINT VIEW ======================= */}
          {activeTab === 1 && (
            <motion.div 
              key="blueprint-panel"
              initial={{ opacity: 0, y: 5 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -5 }}
              transition={{ duration: 0.15 }}
              className="px-4.5 pt-4 space-y-5"
            >
              <div className="space-y-1">
                <h1 className="text-[24px] font-bold text-white tracking-tight leading-tight font-sans">
                  先定主线，再开始对话
                </h1>
                <span className="text-[10px] font-medium text-slate-500 tracking-widest uppercase block font-sans mt-1">
                  BLUEPRINT NAVIGATION
                </span>
                <p className="text-[13px] text-slate-400 leading-relaxed font-sans pt-1">
                  设定材料研究的核心课题，AI 导师为你智能铺设。
                </p>
              </div>

              {/* Core Topic Card */}
              <section className="bg-[#121215] border border-white/[0.04] rounded-[22px] overflow-hidden shadow-lg">
                <div className="h-24 w-full relative">
                  <img 
                    alt="Structure Graph" 
                    src={initialBlueprint.coverImage} 
                    className="w-full h-full object-cover brightness-[0.55]"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#121215] via-[#121215]/30 to-transparent" />
                  <div className="absolute top-3 left-3 flex gap-1.5">
                    <span className="px-3 h-6 rounded-full bg-[#5B8CFF]/8 border border-[#5B8CFF]/15 text-[12px] font-medium text-[#5B8CFF] uppercase tracking-wide font-sans flex items-center justify-center">
                      Electrochemistry
                    </span>
                  </div>
                </div>

                <div className="p-4.5 space-y-4">
                  <div className="space-y-0.5">
                    <span className="text-[12.5px] font-bold text-zinc-200 block font-sans">当前课题主题</span>
                    <span className="text-[9.5px] font-medium text-slate-500 tracking-widest uppercase block font-sans">EXPLORATION TOPIC</span>
                    <h3 className="text-[16px] font-bold text-white tracking-tight leading-snug font-sans pt-1.5">
                      {initialBlueprint.title}
                    </h3>
                    <p className="text-[13px] leading-relaxed text-zinc-400 pt-0.5 font-sans">
                      {initialBlueprint.goal}
                    </p>
                    <div className="flex items-center gap-2 mt-2.5 py-1.5 px-3 bg-[#6366f1]/6 border border-[#6366f1]/15 rounded-xl text-[12px] text-indigo-300">
                      <Sparkles className="w-3.5 h-3.5 text-indigo-300 animate-pulse shrink-0" strokeWidth={1.8} />
                      <span className="font-sans font-medium text-[11px]">主题越具体，讲解课程越能在原子级精准切入核心。</span>
                    </div>
                  </div>

                  {/* Level & Cycle */}
                  <div className="grid grid-cols-2 gap-3.5 pt-3.5 border-t border-white/[0.04]">
                    <div className="space-y-1">
                      <span className="text-[11.5px] font-bold text-zinc-300 block font-sans">学习深度</span>
                      <span className="text-[9px] font-medium text-slate-500 tracking-widest uppercase block font-sans">DEPTH</span>
                      <div className="grid grid-cols-3 bg-black/50 p-[3px] rounded-xl border border-white/[0.04] mt-1.5">
                        {(['Concept', 'Structure', 'Mastery'] as const).map((lvl) => (
                          <button
                            key={lvl}
                            onClick={() => setCurrentLevel(lvl)}
                            className={`py-1.5 text-[11px] font-semibold rounded-lg transition-all text-center cursor-pointer ${
                              currentLevel === lvl 
                                ? 'bg-[#6366f1] text-white font-bold shadow-sm shadow-[#6366f1]/10' 
                                : 'text-zinc-400 hover:text-zinc-200'
                            }`}
                          >
                            {lvl === 'Concept' ? '概念' : lvl === 'Structure' ? '结构' : '精通'}
                          </button>
                        ))}
                      </div>
                    </div>

                    <div className="space-y-1">
                      <span className="text-[11.5px] font-bold text-zinc-300 block font-sans">规划周期</span>
                      <span className="text-[9px] font-medium text-slate-500 tracking-widest uppercase block font-sans">CYCLE</span>
                      <div className="grid grid-cols-3 bg-black/50 p-[3px] rounded-xl border border-white/[0.04] mt-1.5">
                        {(['3 Days', '1 Week', '1 Month'] as const).map((dur) => (
                          <button
                            key={dur}
                            onClick={() => setCurrentDuration(dur)}
                            className={`py-1.5 text-[11px] font-semibold rounded-lg transition-all text-center cursor-pointer ${
                              currentDuration === dur 
                                ? 'bg-[#6366f1] text-white font-bold shadow-sm shadow-[#6366f1]/10' 
                                : 'text-zinc-400 hover:text-zinc-200'
                            }`}
                          >
                            {dur === '3 Days' ? '3天' : dur === '1 Week' ? '1周' : '1月'}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </section>

              {/* Continue block */}
              <section className="bg-[#121215] border border-white/[0.04] rounded-[20px] p-4.5 relative overflow-hidden">
                <div className="flex items-center justify-between gap-4">
                  <div className="space-y-1.5 flex-1">
                    <div className="space-y-0.5">
                      <div className="flex items-center gap-1.5">
                        <span className="w-1.5 h-1.5 rounded-full bg-[#6366f1] select-none shrink-0" />
                        <span className="text-[13px] font-bold text-zinc-100 font-sans">从上次暂停点继续</span>
                      </div>
                      <span className="text-[9px] font-semibold text-[#818cf8]/70 font-sans uppercase tracking-widest block pl-3.5 mt-0.5">
                        INTERRUPTED POINT
                      </span>
                    </div>
                    
                    <h4 className="text-[14.5px] font-bold text-white tracking-tight font-sans">
                      上次学习到：Li⁺ 界面稳定性与副反应抑制
                    </h4>
                    
                    <div className="flex items-center gap-2 text-[12px] text-slate-400 font-sans">
                      <span>当前环节: <strong className="text-zinc-200 font-medium">机制分子拆解</strong></span>
                      <span className="text-zinc-700">•</span>
                      <span>已完成部分 <span className="text-indigo-300 font-bold font-sans">40%</span></span>
                    </div>
                  </div>

                  <button 
                    onClick={() => setActiveTab(2)}
                    className="shrink-0 w-12 h-12 rounded-full bg-[#6366f1] hover:bg-[#5254e0] active:scale-95 text-white flex flex-col items-center justify-center transition-all cursor-pointer shadow-lg shadow-[#6366f1]/10 group"
                  >
                    <Play className="w-4 h-4 fill-white text-white translate-x-[1px] group-hover:scale-110 transition-transform" />
                    <span className="text-[8px] font-bold uppercase mt-0.5 tracking-wider font-sans">开始</span>
                  </button>
                </div>
              </section>

              {/* Learning step-by-step route and progress metrics */}
              <section className="space-y-3">
                <div className="flex justify-between items-end pb-1.5">
                  <div className="space-y-0.5">
                    <span className="text-[13.5px] font-bold text-zinc-100 block font-sans">今日学习路线规划</span>
                    <span className="text-[9px] font-semibold text-slate-500 tracking-widest uppercase block font-sans mt-0.5">STUDY PLAN</span>
                  </div>
                  <span className="text-[11px] font-bold text-[#818cf8] font-sans shrink-0">{interactiveProgress}% Overall</span>
                </div>

                <div className="space-y-2.5 relative">
                  <div className="absolute left-[23px] top-6 bottom-6 w-px bg-white/[0.04]" />

                  {checklist.map((step, idx) => {
                    const isCompleted = step.status === 'completed';
                    const isActive = step.status === 'active';

                    return (
                      <div
                        key={step.id}
                        onClick={() => {
                          if (isActive) {
                            setActiveTab(2);
                          } else {
                            toggleStep(step.id);
                          }
                        }}
                        className={`relative flex items-start gap-4 p-4 rounded-[18px] transition-all cursor-pointer ${
                          isActive
                            ? 'bg-[#121215] border border-[#6366f1]/40 ring-1 ring-[#6366f1]/10'
                            : isCompleted
                              ? 'bg-[#121215]/40 border border-white/[0.02] opacity-60'
                              : 'bg-[#121215]/20 border border-white/[0.04] hover:border-white/[0.08]'
                        }`}
                      >
                        <div className="relative shrink-0 z-10 pt-0.5">
                          {isCompleted ? (
                            <div className="w-[18px] h-[18px] rounded-full bg-[#32d74b]/8 border border-[#32d74b]/20 text-[#32d74b] flex items-center justify-center">
                              <Check className="w-3 h-3" strokeWidth={3} />
                            </div>
                          ) : isActive ? (
                            <div className="w-[18px] h-[18px] rounded-full bg-[#6366f1]/10 border border-[#818cf8]/50 text-indigo-300 flex items-center justify-center relative">
                              <span className="w-1.5 h-1.5 bg-[#818cf8] rounded-full" />
                              <span className="absolute inset-0 rounded-full border border-indigo-400/40 animate-ping" />
                            </div>
                          ) : (
                            <div className="w-[18px] h-[18px] rounded-full bg-black border border-white/15 text-zinc-400 flex items-center justify-center">
                              <span className="text-[10px] font-bold font-sans">{idx + 1}</span>
                            </div>
                          )}
                        </div>

                        <div className="flex-1 space-y-0.5">
                          <h4 className={`text-[13.5px] font-bold font-sans leading-tight ${isCompleted ? 'text-zinc-500 line-through' : 'text-zinc-200'}`}>
                            {step.title}
                          </h4>
                          <p className="text-[12px] leading-relaxed text-[#8e8e93] font-sans">
                            {step.description}
                          </p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </section>

              {/* Master CTA entering the lecture */}
              <div className="pt-2">
                <button 
                  onClick={() => setActiveTab(2)}
                  className="w-full h-12 bg-[#6366f1] hover:bg-[#5254e0] active:scale-[0.99] text-white rounded-xl text-[13.5px] font-bold shadow-[0_4px_16px_rgba(99,102,241,0.15)] flex items-center justify-center gap-2 cursor-pointer transition-all"
                >
                  <Sparkles className="w-4 h-4 fill-white" />
                  <span className="font-sans">生成今日讲解课程</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </motion.div>
          )}

          {/* ======================= TAB 2: REDESIGNED MENTOR PAGE (TUTOR COCKPIT) ======================= */}
          {activeTab === 2 && (
            <motion.div 
              key="mentor-panel"
              initial={{ opacity: 0, y: 5 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -5 }}
              transition={{ duration: 0.15 }}
              className="px-4 pb-28 pt-4 space-y-4"
            >
              
              {/* AI 讲解核心多级交互圆心 */}
              <section className="bg-[#121215] border border-white/[0.04] rounded-[24px] p-5 flex flex-col items-center justify-center relative overflow-hidden shadow-lg">
                {/* Ambience background light gradient */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-48 h-48 bg-[#6366f1]/5 rounded-full blur-[35px] pointer-events-none" />

                {/* Speaker top actions header */}
                <div className="w-full flex items-center justify-between mb-4.5 z-10">
                  <div className="flex items-center gap-2">
                    <span className="flex h-2 w-2 relative">
                      {isPlayingAudio ? (
                        <>
                          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#6366f1] opacity-75"></span>
                          <span className="relative inline-flex rounded-full h-2 w-2 bg-[#6366f1]"></span>
                        </>
                      ) : (
                        <span className="relative inline-flex rounded-full h-2 w-2 bg-zinc-500"></span>
                      )}
                    </span>
                    <span className="text-[11px] font-bold font-sans text-slate-400 uppercase tracking-widest whitespace-nowrap">
                      {isPlayingAudio ? '当前讲解进行中...' : '讲解已暂停'}
                    </span>
                  </div>

                  {/* Audio Speaker Mute */}
                  <button 
                    onClick={() => setIsMutingSpeech(!isMutingSpeech)}
                    className="p-2 rounded-xl bg-white/[0.03] border border-white/[0.04] text-zinc-400 hover:text-white transition-all cursor-pointer"
                  >
                    {isMutingSpeech ? <VolumeX className="w-4 h-4 text-amber-500 animate-pulse" /> : <Volume2 className="w-4 h-4" />}
                  </button>
                </div>

                {/* Central Interactive Glowing Circle */}
                <div className="relative my-3.5 z-10">
                  {/* Waveforms ripple rings */}
                  <AnimatePresence>
                    {isPlayingAudio && (
                      <>
                        <motion.div 
                          className="absolute inset-0 rounded-full border border-indigo-500/20"
                          animate={{ scale: [1, 1.45, 1], opacity: [0.6, 0, 0.6] }}
                          transition={{ duration: 2.2, repeat: Infinity, ease: "easeOut" }}
                        />
                        <motion.div 
                          className="absolute inset-0 rounded-full border border-indigo-500/10"
                          animate={{ scale: [1, 1.75, 1], opacity: [0.4, 0, 0.4] }}
                          transition={{ duration: 3.4, repeat: Infinity, ease: "easeOut", delay: 0.8 }}
                        />
                      </>
                    )}
                  </AnimatePresence>

                  {/* Inner interact block disc */}
                  <button
                    onClick={() => setIsPlayingAudio(!isPlayingAudio)}
                    className={`w-28 h-28 rounded-full flex flex-col items-center justify-center transition-all relative cursor-pointer outline-none ${
                      isPlayingAudio 
                        ? 'bg-[#6366f1] text-white shadow-[0_0_24px_rgba(99,102,241,0.22)] border border-white/10 scale-[1.02]' 
                        : 'bg-zinc-900/40 border border-white/5 text-zinc-400 hover:text-zinc-200 hover:border-white/10 shadow-md'
                    }`}
                  >
                    <div className="mb-0.5">
                      {isPlayingAudio ? (
                        <Pause className="w-6 h-6 fill-white text-white" />
                      ) : (
                        <Play className="w-6 h-6 fill-zinc-300 text-zinc-300 translate-x-0.5" />
                      )}
                    </div>
                    <span className="text-[10px] font-bold uppercase tracking-widest font-sans mt-1">
                      {isPlayingAudio ? 'PAUSE' : 'PLAY'}
                    </span>

                    {isPlayingAudio && (
                      <div className="absolute top-2.5 left-4 h-1.5 w-1.5 rounded-full bg-white animate-bounce" />
                    )}
                  </button>
                </div>

                {/* Animated visualizer line chart graph */}
                <div className="flex items-center gap-[3px] h-6 my-3.5 z-10 w-full justify-center px-8">
                  {[2, 4, 1, 5, 3, 6, 2, 7, 3, 1, 4, 2, 5, 8, 3, 2, 4, 1].map((val, idx) => (
                    <motion.div
                      key={idx}
                      className={`w-[2px] rounded-full ${
                        isPlayingAudio 
                          ? 'bg-[#6366f1]' 
                          : 'bg-zinc-800'
                      }`}
                      animate={{ 
                        height: isPlayingAudio ? [4, val * 2.8 + 4, 4] : 3
                      }}
                      transition={{ 
                        repeat: Infinity, 
                        duration: 0.6 + (idx % 4) * 0.12,
                        ease: "easeOut"
                      }}
                    />
                  ))}
                </div>

                {/* Three-stage flow selector progress */}
                <div className="w-full mt-3.5 pt-3.5 border-t border-white/[0.04] space-y-2.5 z-10">
                  <div className="flex justify-between text-[11px] font-semibold text-slate-400 font-sans">
                    <span className={currentStage === 'concept' ? 'text-white font-bold' : ''}>
                      1. 概念讲解
                    </span>
                    <span className={`flex items-center gap-1 ${currentStage === 'mechanism' ? 'text-[#818cf8] font-bold' : ''}`}>
                      <Activity className="w-3.5 h-3.5 text-[#6366f1] animate-pulse" />
                      <span>2. 机制拆解</span>
                    </span>
                    <span className={currentStage === 'training' ? 'text-white font-bold' : ''}>
                      3. 表达训练
                    </span>
                  </div>

                  {/* Horizontal indicators bar */}
                  <div className="grid grid-cols-3 gap-2 h-1">
                    <div 
                      className={`h-full rounded-full cursor-pointer transition-colors ${
                        currentStage === 'concept' || currentStage === 'mechanism' || currentStage === 'training'
                          ? 'bg-[#6366f1]' 
                          : 'bg-zinc-800'
                      }`}
                      onClick={() => setCurrentStage('concept')}
                    />
                    <div 
                      className={`h-full rounded-full cursor-pointer relative overflow-hidden transition-colors ${
                        currentStage === 'mechanism' || currentStage === 'training'
                          ? 'bg-[#6366f1]' 
                          : 'bg-zinc-800'
                      }`}
                      onClick={() => setCurrentStage('mechanism')}
                    >
                      {currentStage === 'mechanism' && (
                        <motion.div 
                          className="absolute inset-0 bg-white/70" 
                          animate={{ x: ['-100%', '100%'] }} 
                          transition={{ repeat: Infinity, duration: 1.5, ease: "linear" }}
                        />
                      )}
                    </div>
                    <div 
                      className={`h-full rounded-full cursor-pointer transition-colors ${
                        currentStage === 'training'
                          ? 'bg-[#6366f1]' 
                          : 'bg-zinc-800'
                      }`}
                      onClick={() => setCurrentStage('training')}
                    />
                  </div>
                  
                  <p className="text-[11px] text-zinc-500 text-center italic font-sans pt-0.5">
                    暂停后，下次将从当前位置进度继续。
                  </p>
                </div>
              </section>

              {/* AI 讲解卡片 (AI Lecture Card with quick adjust tone sliders) */}
              <section className="bg-[#121215] border border-white/[0.04] rounded-[22px] p-4.5 space-y-3.5 relative shadow-lg">
                <div className="flex justify-between items-start">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2 text-[12px] font-medium text-[#5B8CFF] font-sans">
                      <div className="p-1.5 rounded-lg bg-[#5B8CFF]/8 border border-[#5B8CFF]/15 text-[#5B8CFF] flex items-center justify-center shrink-0">
                        <Cpu className="w-3.5 h-[14px]" strokeWidth={1.8} />
                      </div>
                      <span className="whitespace-nowrap">当前讲解 • 核心学术段落</span>
                    </div>
                    <h3 className="text-[15.5px] font-bold text-white tracking-tight font-sans">
                      界面稳定性与副反应抑制
                    </h3>
                  </div>
                </div>

                <div className="p-4 bg-zinc-950/40 rounded-xl border border-white/[0.02] text-[13px] text-zinc-200 leading-relaxed font-sans relative">
                  <span className="absolute left-[8px] top-[14px] bottom-[14px] w-[1.5px] bg-[#6366f1]" />
                  <p className="pl-3.5 italic">
                    "{lectureText}"
                  </p>
                </div>

                {/* Audi tweak modifiers */}
                <div className="space-y-1 pt-1">
                  <div className="space-y-0.5">
                    <span className="text-[12px] font-bold text-zinc-200 block font-sans">音频调速器风格</span>
                    <span className="text-[9px] font-semibold text-slate-500 uppercase tracking-widest block font-sans">
                      AUDIO TONES
                    </span>
                  </div>
                  <div className="grid grid-cols-4 gap-2 pt-1.5">
                    {(['default', 'simpler', 'example', 'defense'] as const).map((t) => (
                      <button 
                        key={t}
                        onClick={() => tweakLectureStyle(t)}
                        className={`py-2 text-[10.5px] font-semibold rounded-lg border transition-all cursor-pointer ${
                          lectureTone === t 
                            ? 'bg-[#6366f1]/10 border-[#6366f1]/30 text-indigo-300' 
                            : 'bg-white/[0.02] border border-white/5 text-zinc-400 hover:text-white hover:bg-[#1c1c1e]'
                        }`}
                      >
                        {t === 'default' ? '重讲' : t === 'simpler' ? '更通俗' : t === 'example' ? '举个例' : '答辩论文'}
                      </button>
                    ))}
                  </div>
                </div>
              </section>

              {/* Debate Q&A Sequence list */}
              <section className="space-y-2.5">
                <div className="flex justify-between items-end pb-1">
                  <div className="space-y-0.5">
                    <span className="text-[14px] font-bold text-zinc-100 block font-sans">实时追问学术论辩过程</span>
                    <span className="text-[9px] font-semibold text-slate-500 tracking-widest uppercase block font-sans mt-0.5">DEBATE LOG</span>
                  </div>
                </div>

                <div className="space-y-3">
                  {customDialogue.map((item, idx) => (
                    <div 
                      key={idx}
                      className={`p-4 rounded-xl border ${
                        item.sender === 'user'
                          ? 'bg-[#1c1c22] border-white/[0.04]'
                          : item.sender === 'diagnose'
                            ? 'bg-[#6366f1]/4 border-[#6366f1]/12 text-[#818cf8]'
                            : 'bg-[#121215] border-white/[0.04]'
                      }`}
                    >
                      <div className="flex items-center gap-1.5 mb-1.5">
                        <span className={`text-[10.5px] font-bold font-sans tracking-widest uppercase ${
                          item.sender === 'user' 
                            ? 'text-slate-400' 
                            : item.sender === 'diagnose'
                              ? 'text-[#818cf8]'
                              : 'text-[#32d74b]'
                        }`}>
                          {item.sender === 'user' ? (
                            <span className="flex items-center gap-1.5">
                              <span className="w-1.5 h-1.5 rounded-full bg-slate-500/50" />
                              <span className="whitespace-nowrap">您的提问</span>
                            </span>
                          ) : item.sender === 'diagnose' ? (
                            <span className="flex items-center gap-1.5">
                              <span className="w-1.5 h-1.5 rounded-full bg-indigo-500/80" />
                              <span className="whitespace-nowrap">理解诊断</span>
                            </span>
                          ) : (
                            <span className="flex items-center gap-1.5">
                              <span className="w-1.5 h-1.5 rounded-full bg-[#32d74b]" />
                              <span className="whitespace-nowrap">AI 解析</span>
                            </span>
                          )}
                        </span>
                      </div>
                      <p className="text-[12.5px] leading-relaxed text-zinc-200 font-sans">{item.text}</p>
                    </div>
                  ))}
                </div>
              </section>

              {/* Speech recorder mock element */}
              <section className="bg-[#121215] border border-white/[0.04] rounded-2xl p-4.5 flex flex-col items-center justify-center space-y-3.5 relative shadow-md">
                <div className="text-center w-full">
                  <span className="text-[12.5px] text-zinc-200 font-medium font-sans block">
                    {micState === 'idle' && '点击麦克风开始口头答辩 / 阐述理解'}
                    {micState === 'recording' && `正在录音中 —— 已录制 ${formatTime(recordingSeconds)}`}
                    {micState === 'transcribing' && '正在提取学术要点并安全归档中...'}
                    {micState === 'synced' && '已成功完成学术转写，评分信息已同步存入记忆中枢。'}
                  </span>
                </div>

                <button
                  type="button"
                  onClick={handleMicInteract}
                  className={`w-14 h-14 rounded-full flex items-center justify-center relative cursor-pointer outline-none transition-all ${
                    micState === 'recording'
                      ? 'bg-red-500 text-white ring-8 ring-red-500/10 shadow-[0_0_20px_rgba(239,68,68,0.3)]'
                      : micState === 'transcribing'
                        ? 'bg-purple-600 text-white animate-pulse'
                        : micState === 'synced'
                          ? 'bg-emerald-500 text-white shadow-[0_0_15px_rgba(16,185,129,0.2)]'
                          : 'bg-[#6366f1] hover:bg-[#5254e0] text-white shadow-[0_4px_16px_rgba(99,102,241,0.15)]'
                  }`}
                >
                  {micState === 'transcribing' ? (
                    <RotateCcw className="w-5 h-5 animate-spin" />
                  ) : micState === 'synced' ? (
                    <Check className="w-5 h-5" strokeWidth={3} />
                  ) : (
                    <Mic className={`w-5 h-5 ${micState === 'recording' ? 'animate-bounce' : ''}`} />
                  )}
                </button>

                <p className="text-[10px] text-slate-500 tracking-wider font-sans">
                  语音保存为 MP4 → 学术翻译机 → 存入总结记忆中枢
                </p>
              </section>

              {/* Text Form Input */}
              <section className="bg-[#121215] border border-white/[0.04] rounded-2xl p-3 space-y-2">
                <form onSubmit={submitTextQuestion} className="flex gap-2 items-center">
                  <input 
                    type="text" 
                    value={textInputValue}
                    onChange={(e) => setTextInputValue(e.target.value)}
                    placeholder="对硒修饰界面相变有疑问？输入你的追问描述..."
                    className="flex-1 bg-zinc-950/40 text-zinc-100 placeholder-zinc-500 border border-white/[0.04] rounded-xl px-3.5 py-2 text-[12.5px] font-sans focus:outline-none focus:border-[#6366f1] transition-colors"
                  />
                  <button
                    type="submit"
                    disabled={!textInputValue.trim()}
                    className="px-4 py-2 bg-[#6366f1] hover:bg-[#5254e0] text-white font-bold rounded-xl text-[12.5px] disabled:opacity-30 transition-all cursor-pointer flex items-center gap-1 font-sans shadow-sm"
                  >
                    <span>发送</span>
                    <Send className="w-3.5 h-3.5" />
                  </button>
                </form>
              </section>

            </motion.div>
          )}

          {/* ======================= TAB 3: REDESIGNED NEURAL VAULT MEMORY PORTAL (Page 3) ======================= */}
          {activeTab === 3 && (
            <motion.div 
              key="memory-panel"
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.98 }}
              transition={{ duration: 0.18 }}
              className="px-4.5 pt-4 space-y-5 pb-28"
            >
              
              {/* Core Header Section A */}
              <div className="space-y-2">
                <h1 className="text-[24px] font-bold text-white tracking-tight leading-tight font-sans">
                  学习总结
                </h1>
                <span className="px-3 h-6 rounded-full bg-[#5B8CFF]/8 border border-[#5B8CFF]/15 text-[12px] font-medium text-[#5B8CFF] uppercase tracking-wide font-sans inline-flex items-center mt-1">
                  NEURAL VAULT & LOGS
                </span>
                <p className="text-[13.5px] text-slate-400 leading-[1.7] font-sans pt-1">
                  今天学了什么、掌握了什么、还需要学什么
                </p>
              </div>

              {/* B. Core Mastery dials / Today's Overview (今日概览) */}
              <section className="bg-[#121215] border border-white/[0.04] rounded-[24px] p-5.5 relative overflow-hidden shadow-lg">
                {/* Background ambient light */}
                <div className="absolute top-0 right-0 w-32 h-32 bg-[#5B8CFF]/4 rounded-full blur-[35px] pointer-events-none" />

                <div className="flex items-center justify-between gap-5">
                  
                  {/* Circular progress container */}
                  <div className="relative shrink-0 w-22 h-22 flex items-center justify-center bg-zinc-950/40 rounded-full border border-white/[0.04] shadow-inner">
                    {/* SVG Radial Progress */}
                    <svg className="absolute inset-0 w-full h-full transform -rotate-90">
                      <circle 
                        cx="44" 
                        cy="44" 
                        r="37" 
                        stroke="rgba(255,255,255,0.02)" 
                        strokeWidth="5" 
                        fill="transparent"
                      />
                      <motion.circle 
                        cx="44" 
                        cy="44" 
                        r="37" 
                        stroke="#5B8CFF" 
                        strokeWidth="5.5" 
                        fill="transparent"
                        strokeDasharray={2 * Math.PI * 37}
                        animate={{ strokeDashoffset: 2 * Math.PI * 37 * (1 - learningScore / 100) }}
                        transition={{ duration: 1, ease: "easeOut" }}
                        strokeLinecap="round"
                      />
                    </svg>

                    <div className="text-center z-10">
                      <motion.span 
                        className="text-[28px] font-extrabold tracking-tighter text-white block leading-none font-sans"
                        animate={{ scale: [1, 1.05, 1] }}
                        key={learningScore}
                      >
                        {learningScore}
                      </motion.span>
                      <span className="text-[10px] font-bold text-slate-400 block uppercase tracking-wider mt-0.5 font-sans">掌握率</span>
                    </div>
                  </div>

                  {/* Summary progress indexes */}
                  <div className="flex-1 space-y-2">
                    <div className="space-y-0.5">
                      <span className="text-[13px] font-bold text-zinc-100 block font-sans">今日评估学情</span>
                      <span className="text-[9px] font-semibold text-slate-500 tracking-widest uppercase block font-sans">LEVEL EVALUATION</span>
                    </div>
                    
                    <div className="space-y-1.5 font-sans">
                      <div className="flex justify-between items-center text-[13px]">
                        <span className="text-zinc-400 font-medium shrink-0 whitespace-nowrap">任务完成状态：</span>
                        <span className="text-[#34C759] font-bold">4 / 5 已学</span>
                      </div>
                      <div className="flex justify-between items-center text-[13px]">
                        <span className="text-zinc-400 font-medium shrink-0 whitespace-nowrap">诊断理解深度：</span>
                        <span className="text-zinc-100 font-bold">高阶学术级 (Mastery)</span>
                      </div>
                      <div className="flex justify-between items-center text-[13px]">
                        <span className="text-zinc-400 font-medium shrink-0 whitespace-nowrap">总活跃时长：</span>
                        <span className="text-[#5B8CFF] font-bold">65 分钟</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Comprehension blind-test quick controller triggers */}
                <div className="mt-5 pt-4 border-t border-white/[0.04] flex gap-2 justify-between items-center font-sans">
                  <span className="text-[12.5px] text-slate-400 font-medium leading-[1.65]">
                    中枢评估：当前已收录 <span className="text-white font-bold">{masteredSkills.length}</span> 项掌握点，仍在分析盲区。
                  </span>
                  
                  <button 
                    onClick={() => triggerToast("系统判断：您的原子级极化物性解析十分扎实，已向学术中枢打上“永久归档”标签。")}
                    className="shrink-0 px-3 py-1.5 text-[10px] bg-white/[0.03] hover:bg-white/[0.08] text-zinc-300 font-bold rounded-lg border border-white/[0.04] tracking-wider transition-all cursor-pointer"
                  >
                    盲测诊断
                  </button>
                </div>
              </section>

              {/* C. 知识合成卡片 (Knowledge Synthesis Card) */}
              <section className="bg-[#121215] border border-white/[0.04] rounded-[24px] p-5.5 space-y-4 shadow-lg relative overflow-hidden">
                {/* Visual Accent indicator left line */}
                <div className="absolute top-[16px] bottom-[16px] left-0 w-1 bg-[#5B8CFF] rounded-r-md" />

                <div className="flex items-center gap-3 pl-1.5">
                  <div className="w-8 h-8 rounded-xl bg-[#5B8CFF]/8 border border-[#5B8CFF]/15 text-[#5B8CFF] flex items-center justify-center shrink-0">
                    <BookMarked className="w-4.5 h-4.5" strokeWidth={1.8} />
                  </div>
                  <div className="space-y-0.5">
                    <h3 className="text-[15.5px] font-bold text-white tracking-tight font-sans">知识合成</h3>
                    <span className="text-[9px] text-slate-500 font-sans font-medium uppercase tracking-widest block mt-0.5">CORE SYNTHESIS</span>
                  </div>
                </div>

                {/* 1. 核心概念 clickable tags */}
                <div className="space-y-1.5 pl-1.5 font-sans">
                  <div className="space-y-0.5">
                    <span className="text-[12.5px] font-bold text-zinc-300 block">今日核心概念</span>
                    <span className="text-[9px] font-semibold text-slate-500 uppercase tracking-widest block">TOP REQUISITES</span>
                  </div>
                  <div className="flex flex-wrap gap-1.5 pt-1.5">
                    {[
                      { name: "高镍正极 (LiNi90)", desc: "能量密度高达280Wh/g，但过渡金属容易脱氧极化" },
                      { name: "结构稳定性 (R-3m)", desc: "防止剪切微开裂发生（预防姜-泰勒畸变导致的晶格坍塌）" },
                      { name: "界面调控 (Se掺杂)", desc: "构筑5nm超薄电子导通保护膜，减少副反应发生" }
                    ].map((concept, s) => (
                      <button
                        key={s}
                        onClick={() => triggerToast(`概念解析：${concept.name} - ${concept.desc}`)}
                        className="px-3 h-6 bg-[#7B8794]/8 hover:bg-[#727d89]/15 border border-[#7B8794]/15 rounded-full text-[12px] font-medium text-zinc-300 hover:text-white transition-all cursor-pointer flex items-center justify-center whitespace-nowrap"
                      >
                        {concept.name}
                      </button>
                    ))}
                  </div>
                </div>

                {/* 2. 逻辑主线 Timeline hierarchy */}
                <div className="space-y-2.5 pl-1.5 font-sans">
                  <div className="space-y-0.5">
                    <span className="text-[12.5px] font-bold text-zinc-300 block">主课题逻辑主线演化</span>
                    <span className="text-[9px] font-semibold text-slate-500 uppercase tracking-widest block">KNOWLEDGE SEQUENCE</span>
                  </div>
                  
                  <div className="bg-zinc-950/40 p-3.5 rounded-xl border border-white/[0.04] space-y-3.5">
                    <div className="flex items-start gap-3 text-[13px] text-zinc-100">
                      <span className="w-5 h-5 rounded bg-[#FFB547]/8 border border-[#FFB547]/15 text-[#FFB547] flex items-center justify-center text-[10px] font-sans font-bold shrink-0 mt-0.5">01</span>
                      <div className="flex flex-col sm:flex-row sm:items-start gap-1">
                        <span className="text-slate-400 font-semibold whitespace-nowrap shrink-0">失效原因：</span>
                        <span className="text-zinc-300">高截止电压晶粒高氧气逸出与过渡金属溶解</span>
                      </div>
                    </div>

                    <div className="flex items-start gap-3 text-[13px] text-zinc-100 border-t border-white/[0.03] pt-3">
                      <span className="w-5 h-5 rounded bg-[#5B8CFF]/8 border border-[#5B8CFF]/15 text-[#5B8CFF] flex items-center justify-center text-[10px] font-sans font-bold shrink-0 mt-0.5">02</span>
                      <div className="flex flex-col sm:flex-row sm:items-start gap-1">
                        <span className="text-[#5B8CFF] font-semibold whitespace-nowrap shrink-0">硒修饰定位：</span>
                        <span className="text-zinc-300">表面键合平抑化学极化势势垒</span>
                      </div>
                    </div>

                    <div className="flex items-start gap-3 text-[13px] text-zinc-100 border-t border-white/[0.03] pt-3">
                      <span className="w-5 h-5 rounded bg-[#34C759]/8 border border-[#34C759]/15 text-[#34C759] flex items-center justify-center text-[10px] font-sans font-bold shrink-0 mt-0.5">03</span>
                      <div className="flex flex-col sm:flex-row sm:items-start gap-1">
                        <span className="text-[#34C759] font-semibold whitespace-nowrap shrink-0">终极表现：</span>
                        <span className="text-zinc-300">晶格畸变平复，界面阻抗减少 92%</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* 3. 今日训练重点 section */}
                <div className="pl-1.5 pt-1.5 space-y-2.5 font-sans">
                  <div className="space-y-0.5">
                    <span className="text-[9px] font-semibold text-slate-500 uppercase tracking-widest block">
                      PRACTICE TARGET
                    </span>
                    <h4 className="text-[13px] font-bold text-zinc-200">
                      用您自己的话口头复述解释
                    </h4>
                  </div>
                  
                  <div className="bg-[#5B8CFF]/6 border border-[#5B8CFF]/15 p-4 rounded-xl flex items-start gap-2.5">
                    <div className="p-1.5 rounded-lg bg-[#5B8CFF]/8 border border-[#5B8CFF]/20 text-[#5B8CFF] shrink-0 mt-0.5">
                      <Activity className="w-3.5 h-[14px]" strokeWidth={2} />
                    </div>
                    <div className="space-y-1">
                      <p className="text-[12.5px] text-slate-400 leading-[1.7] italic">
                        “硒原子是如何利用阻挡能垒，彻底屏蔽电解液腐蚀并修复高镍材料在4.5V极化状态下的晶格破裂？”
                      </p>
                    </div>
                  </div>
                </div>
              </section>

              {/* D. 已掌握 / 仍然存在盲区 (Mastered vs Needs Improvement Column Card) */}
              <section className="bg-[#121215] border border-white/[0.04] rounded-[22px] p-5.5 space-y-4 shadow-lg font-sans">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2.5">
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-xl bg-[#5B8CFF]/8 border border-[#5B8CFF]/15 text-[#5B8CFF] flex items-center justify-center shrink-0">
                      <Activity className="w-4.5 h-4.5" strokeWidth={1.8} />
                    </div>
                    <div className="space-y-0.5">
                      <h3 className="text-[15.5px] font-bold text-white tracking-tight">已掌握 vs 仍需加强</h3>
                      <span className="text-[9px] text-slate-500 font-sans font-medium uppercase tracking-widest block">LEVEL EVALUATION</span>
                    </div>
                  </div>
                  
                  {weakSkills.length > 0 && (
                    <span className="px-3 h-6 bg-[#FFB547]/8 text-[#FFB547] rounded-full border border-[#FFB547]/15 text-[12px] font-medium tracking-wide font-sans animate-pulse whitespace-nowrap flex items-center self-start sm:self-auto">
                      当前存在 {weakSkills.length} 处理解待强化
                    </span>
                  )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  
                  {/* Left list: Mastered points (Prisinte success style) */}
                  <div className="bg-zinc-950/40 p-4 rounded-xl border border-[#34C759]/15 space-y-3">
                    <div className="space-y-0.5">
                      <div className="flex items-center gap-1.5">
                        <span className="w-1.5 h-1.5 rounded-full bg-[#34C759] shrink-0" />
                        <span className="text-[12.5px] font-bold text-[#34C759]">已掌握</span>
                      </div>
                      <span className="text-[8.5px] font-semibold text-slate-500 tracking-widest uppercase block pl-[9px]">
                        SOLIDIFY
                      </span>
                    </div>

                    <div className="space-y-2">
                      {masteredSkills.map((m, i) => (
                        <div key={i} className="bg-zinc-900/10 p-3 rounded-lg border border-white/[0.02] relative overflow-hidden group">
                          <Check className="absolute top-1.5 right-1.5 w-3 h-3 text-[#34C759]/70" />
                          <p className="text-[12.5px] text-zinc-300 font-medium leading-[1.65] pr-3">
                            {m}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Right list: Weakness blindspots with action trigger buttons */}
                  <div className="bg-zinc-950/40 p-4 rounded-xl border border-[#FFB547]/15 space-y-3 relative">
                    <div className="space-y-0.5">
                      <div className="flex items-center gap-1.5">
                        <span className="w-1.5 h-1.5 rounded-full bg-[#FFB547] animate-pulse shrink-0" />
                        <span className="text-[12.5px] font-bold text-[#FFB547]">仍需加强</span>
                      </div>
                      <span className="text-[8.5px] font-semibold text-slate-500 tracking-widest uppercase block pl-[9px]">
                        GAPS
                      </span>
                    </div>

                    {weakSkills.length === 0 ? (
                      <div className="pt-4 pb-2 text-center text-[12px] text-slate-400 leading-relaxed">
                        所有核心盲区均已攻克！今日掌握度完美达到 100%!
                      </div>
                    ) : (
                      <div className="space-y-2">
                        {weakSkills.map((w, index) => (
                           <div 
                            key={index} 
                            onClick={() => markAsMastered(w, index)}
                            className="bg-[#1c1c22] hover:bg-[#5B8CFF]/5 p-3 rounded-lg border border-[#FFB547]/15 text-left transition-all cursor-pointer hover:border-[#5B8CFF]/40 block group space-y-1.5"
                           >
                            <p className="text-[12.5px] text-zinc-300 font-medium leading-[1.65] block">
                              {w}
                            </p>
                            <div className="flex items-center justify-between mt-1.5 text-[11px] font-medium">
                              <span className="text-[#FFB547] bg-[#FFB547]/8 px-2 h-[20px] rounded-full border border-[#FFB547]/15 font-sans flex items-center justify-center">#需强化</span>
                              <span className="text-[#5B8CFF] group-hover:text-white transition-colors">标记掌握 +7%</span>
                            </div>
                           </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>

                {/* Reset helper mechanism button */}
                <div className="pt-1 flex justify-end">
                  <button 
                    onClick={handleResetSkills}
                    className="text-[10px] text-zinc-500 hover:text-zinc-300 flex items-center gap-1 cursor-pointer transition-colors"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                    <span>重置盲区用于测试交互</span>
                  </button>
                </div>
              </section>

                            {/* Dynamic Transcript Deliverable Section */}
              <section className="bg-[#121215] border border-white/[0.04] rounded-[22px] p-5.5 space-y-4 shadow-lg font-sans">
                <div className="flex justify-between items-end border-b border-white/[0.04] pb-3">
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-xl bg-[#5B8CFF]/8 border border-[#5B8CFF]/15 text-[#5B8CFF] flex items-center justify-center shrink-0">
                      <Brain className="w-4.5 h-4.5" strokeWidth={1.8} />
                    </div>
                    <div className="space-y-0.5">
                      <span className="text-[13.5px] font-bold text-zinc-100 block">今日学术语音成果</span>
                      <span className="text-[9px] font-semibold text-slate-500 tracking-widest uppercase block mt-0.5">AUDIO ACHIEVEMENTS</span>
                    </div>
                  </div>
                  <span className="px-3 h-6 rounded-full bg-[#5B8CFF]/8 border border-[#5B8CFF]/15 text-[#5B8CFF] text-[12px] font-medium tracking-wide font-sans flex items-center whitespace-nowrap">
                    MP4 段落已就绪
                  </span>
                </div>

                {/* Recording card displaying play/pause waveforms */}
                <div className="bg-zinc-950/40 p-4 rounded-xl border border-white/[0.02] relative overflow-hidden">
                  <div className="flex items-start gap-3.5">
                    
                    {/* Circle Pulse Play icon */}
                    <button 
                      onClick={() => {
                        setIsPlayingRecordedVoice(!isPlayingRecordedVoice);
                        if (!isPlayingRecordedVoice) {
                          triggerToast("🔊 正在试听播报：“过渡金属外延界面在强酸溶解时的锂空位浓度...”");
                        }
                      }}
                      className={`w-9 h-9 rounded-full flex items-center justify-center shrink-0 transition-all cursor-pointer ${
                        isPlayingRecordedVoice ? 'bg-[#34C759] text-black shadow-lg shadow-[#34C759]/15 scale-[1.03]' : 'bg-white/[0.03] border border-white/[0.04] hover:bg-white/10 text-white'
                      }`}
                    >
                      {isPlayingRecordedVoice ? <Pause className="w-4 h-4 fill-black text-black" /> : <Play className="w-4 h-4 fill-white text-white translate-x-0.5" />}
                    </button>

                    <div className="flex-1 min-w-0 space-y-1">
                      <div className="flex items-center justify-between gap-2.5">
                        <span className="text-[13.5px] font-bold text-zinc-100 truncate">AWAKEN-AUDIO-REC-07.mp4</span>
                        <span className="text-[11px] text-slate-400 font-mono shrink-0">01:42</span>
                      </div>
                      <p className="text-[12.5px] text-slate-400 leading-relaxed pt-0.5">已由系统翻译机转化为专业论文级阐述，并完成中枢同步。</p>
                    </div>
                  </div>

                  <div className="mt-3.5 pt-3.5 border-t border-white/[0.04] space-y-2">
                    <p className="text-[12.5px] text-zinc-300 leading-[1.7] italic pl-3.5 border-l-[1.5px] border-[#5B8CFF]/50 pr-2">
                      "过渡金属外延界面在强酸溶解时的锂空位浓度分布模型如何建立？我认为由于锂浓度呈现梯度阻力，采用硒分子气相沉积能在 5nm 厚皮层内部形成特大电荷斥力..."
                    </p>
                    
                    {isPlayingRecordedVoice && (
                      <div className="flex items-center gap-[2.5px] justify-start px-2.5 py-1.5 bg-[#34C759]/5 rounded-lg border border-[#34C759]/10 mt-2">
                        <span className="text-[10px] text-[#34C759] mr-2">试听正在播放：</span>
                        {[1, 3, 2, 5, 2, 4, 1, 3, 2, 6, 2, 1, 4, 2].map((v, i) => (
                          <span 
                            key={i} 
                            className="w-[1.5px] bg-[#34C759] rounded-full" 
                            style={{ 
                              height: `${v * 2.2 + 2}px`,
                              animation: `beacon-pulse ${0.4 + (i % 3) * 0.1}s infinite alternate` 
                            }}
                          />
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </section>

              {/* E. 下一步训练 / 明日蓝图 timeline map */}
              <section className="bg-[#121215] border border-white/[0.04] rounded-[22px] p-5.5 space-y-4.5 relative overflow-hidden shadow-lg font-sans">
                <button 
                  onClick={() => setIsTomorrowBlueprintExpanded(!isTomorrowBlueprintExpanded)}
                  className="w-full flex justify-between items-center cursor-pointer select-none text-left"
                >
                  <div className="space-y-1">
                    <div className="space-y-0.5">
                      <span className="text-[13.5px] font-bold text-zinc-100 block">下一步训练 / 明日学术蓝图</span>
                      <span className="text-[9px] font-semibold text-slate-500 tracking-widest uppercase block mt-0.5">TOMORROW'S FORECAST</span>
                    </div>
                    <p className="text-[12.5px] text-[#8e8e93] pt-0.5">根据您今天的表现已微调明日的演化链</p>
                  </div>
                  {isTomorrowBlueprintExpanded ? <ChevronUp className="w-4 h-4 text-zinc-400" /> : <ChevronDown className="w-4.5 h-4.5 text-zinc-400" />}
                </button>

                <AnimatePresence>
                  {isTomorrowBlueprintExpanded && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      className="space-y-5.5 overflow-hidden pt-2"
                    >
                      <div className="relative pl-5 space-y-5.5">
                        <div className="absolute left-1.5 top-2.5 bottom-2.5 w-px bg-[#5B8CFF]/20" />

                        {/* Point 1: Forecast weakness repair */}
                        <div className="relative space-y-2">
                          <span className="absolute -left-[20px] top-1.5 w-2 h-2 rounded-full bg-[#FFB547] ring-4 ring-[#FFB547]/10" />
                          <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-1.5 w-full">
                            <div className="space-y-0.5">
                              <span className="text-[10px] font-bold tracking-wider text-[#FFB547] uppercase font-mono block">焦点 1</span>
                              <h4 className="text-[13.5px] font-bold text-white font-sans leading-tight">
                                Jahn-Teller 失衡机制密度图 (DOS) 推演
                              </h4>
                            </div>
                            <span className="px-2.5 h-[22px] rounded-full bg-[#FFB547]/8 border border-[#FFB547]/15 text-[#FFB547] text-[11px] font-medium font-sans flex items-center justify-center shrink-0 self-start sm:self-auto">
                              薄弱点巩固
                            </span>
                          </div>
                          <p className="text-[12.5px] text-slate-400 leading-[1.7] pl-0">
                            聚焦极化脱锂状态下的多位点应力分散，由 AI 导师带您进行 3 轮交互式晶格自旋极化数值演算。
                          </p>
                        </div>

                        {/* Point 2: Presentation drill */}
                        <div className="relative space-y-2">
                          <span className="absolute -left-[20px] top-1.5 w-2 h-2 rounded-full bg-[#5B8CFF] ring-4 ring-[#5B8CFF]/10" />
                          <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-1.5 w-full">
                            <div className="space-y-0.5">
                              <span className="text-[10px] font-bold tracking-wider text-[#5B8CFF] uppercase font-mono block">焦点 2</span>
                              <h4 className="text-[13.5px] font-bold text-white font-sans leading-tight">
                                论文答辩临场逻辑模拟对抗
                              </h4>
                            </div>
                            <span className="px-2.5 h-[22px] rounded-full bg-[#5B8CFF]/8 border border-[#5B8CFF]/15 text-[#5B8CFF] text-[11px] font-medium font-sans flex items-center justify-center shrink-0 self-start sm:self-auto">
                              答辩逻辑
                            </span>
                          </div>
                          <p className="text-[12.5px] text-slate-400 leading-[1.7] pl-0">
                            模拟评委对“硒掺杂究竟如何自修复过度相变”展开多维反问，AI 实时帮您纠正措辞。
                          </p>
                        </div>

                        {/* Point 3: Experimental plan match */}
                        <div className="relative space-y-2">
                          <span className="absolute -left-[20px] top-1.5 w-2 h-2 rounded-full bg-[#34C759] ring-4 ring-[#34C759]/10" />
                          <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-1.5 w-full">
                            <div className="space-y-0.5">
                              <span className="text-[10px] font-bold tracking-wider text-[#34C759] uppercase font-mono block">焦点 3</span>
                              <h4 className="text-[13.5px] font-bold text-white font-sans leading-tight">
                                电解液匹配改性工艺配比
                              </h4>
                            </div>
                            <span className="px-2.5 h-[22px] rounded-full bg-[#34C759]/8 border border-[#34C759]/15 text-[#34C759] text-[11px] font-medium font-sans flex items-center justify-center shrink-0 self-start sm:self-auto">
                              实验设计
                            </span>
                          </div>
                          <p className="text-[12.5px] text-slate-400 leading-[1.7] pl-0">
                            设计气相还原沉积合成方案及物料比标定，并使用自主表达得出可用报告。
                          </p>
                        </div>
                      </div>

                      <div className="pt-[18px]">
                        <button 
                          onClick={() => {
                            setActiveTab(2);
                            triggerToast("✨ 已为您自动校正明日主线并开启导师讲解，开始进入自主练习和纠错汇报课程！");
                          }}
                          className="w-full py-2.5 bg-black hover:bg-zinc-900 border border-white/5 rounded-xl text-[12px] font-bold text-center text-zinc-300 hover:text-white transition-all cursor-pointer flex items-center justify-center gap-1.5"
                        >
                          <span>确认明日蓝图并开启模拟答辩</span>
                          <ChevronRight className="w-3.5 h-3.5 text-zinc-400" />
                        </button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </section>

              {/* Central Vault database statistics */}
              <div className="bg-white/[0.01] border border-white/[0.04] rounded-xl p-3.5 flex justify-between items-center text-slate-400 text-[11.5px] font-sans">
                <div className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#34C759]" />
                  <span>所有学习进度与口语记录已安全同步</span>
                </div>
                <span className="text-slate-500 text-[11px] font-medium font-sans">智能中枢已归档</span>
              </div>

            </motion.div>
          )}

        </AnimatePresence>
      </div>

      {/* 3. 底部固定 iOS Tab 导航栏 (Fixed bottom tabs bar - memory item highlighted brand blue by default) */}
      <nav className="absolute bottom-0 inset-x-0 bg-[#0c0c0e]/95 backdrop-blur-xl border-t border-white/5 h-[76px] pb-4.5 flex justify-around items-center z-40 px-6 shrink-0 font-sans">
        
        {/* Tab 1: 蓝图 */}
        <button
          onClick={() => setActiveTab(1)}
          className="flex flex-col items-center gap-[4px] cursor-pointer transition-all relative py-1.5 px-3 rounded-xl"
        >
          <Layers className={`w-[21px] h-[21px] transition-all duration-200 ${
            activeTab === 1 ? 'text-[#5B8CFF] scale-110' : 'text-[#8e8e93] hover:text-zinc-200'
          }`} strokeWidth={activeTab === 1 ? 2.5 : 2} />
          <span className={`text-[10px] font-bold ${
            activeTab === 1 ? 'text-[#5B8CFF]' : 'text-[#8e8e93]'
          }`}>
            蓝图
          </span>
          {activeTab === 1 && (
            <motion.div 
              layoutId="nav-dot-glow"
              className="absolute -bottom-1.5 h-[3px] w-6 rounded-full bg-[#5B8CFF]"
              transition={{ type: "spring", stiffness: 350, damping: 28 }}
              style={{ boxShadow: '0 0 10px #5B8CFF' }}
            />
          )}
        </button>

        {/* Tab 2: 导师 */}
        <button
          onClick={() => setActiveTab(2)}
          className="flex flex-col items-center gap-[4px] cursor-pointer transition-all relative py-1.5 px-3 rounded-xl"
        >
          <Mic className={`w-[21px] h-[21px] transition-all duration-200 ${
            activeTab === 2 ? 'text-[#5B8CFF] scale-110' : 'text-[#8e8e93] hover:text-zinc-200'
          }`} strokeWidth={activeTab === 2 ? 2.5 : 2} />
          <span className={`text-[10px] font-bold ${
            activeTab === 2 ? 'text-[#5B8CFF]' : 'text-[#8e8e93]'
          }`}>
            导师
          </span>
          {activeTab === 2 && (
            <motion.div 
              layoutId="nav-dot-glow"
              className="absolute -bottom-1.5 h-[3px] w-6 rounded-full bg-[#5B8CFF]"
              transition={{ type: "spring", stiffness: 350, damping: 28 }}
              style={{ boxShadow: '0 0 10px #5B8CFF' }}
            />
          )}
        </button>

        {/* Tab 3: 记忆 (High-fidelity active highlight by default) */}
        <button
          onClick={() => setActiveTab(3)}
          className="flex flex-col items-center gap-[4px] cursor-pointer transition-all relative py-1.5 px-3 rounded-xl"
        >
          <Brain className={`w-[21px] h-[21px] transition-all duration-200 ${
            activeTab === 3 ? 'text-[#5B8CFF] scale-110' : 'text-[#8e8e93] hover:text-zinc-200'
          }`} strokeWidth={activeTab === 3 ? 2.5 : 2} />
          <span className={`text-[10px] font-bold ${
            activeTab === 3 ? 'text-[#5B8CFF]' : 'text-[#8e8e93]'
          }`}>
            记忆
          </span>
          {activeTab === 3 && (
            <motion.div 
              layoutId="nav-dot-glow"
              className="absolute -bottom-1.5 h-[3px] w-6 rounded-full bg-[#5B8CFF]"
              transition={{ type: "spring", stiffness: 350, damping: 28 }}
              style={{ boxShadow: '0 0 10px #5B8CFF' }}
            />
          )}
        </button>

      </nav>

    </div>
  );
}
