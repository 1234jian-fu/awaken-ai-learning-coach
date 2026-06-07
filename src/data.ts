import { DayBlueprint } from './types';

export const initialBlueprint: DayBlueprint = {
  day: "Day 07",
  title: "硒修饰下的超高镍正极材料改性与修复研究",
  subtitle: "电池材料前沿科学 • 晶格掺杂与表面包覆调控",
  goal: "通过界面稳定性强化，减少高镍正极在循环过程中的副反应、相变和颗粒开裂，由浅入深掌握晶体结构修复技术。",
  level: "Mastery", // Selected by default (精通)
  duration: "1 Week", // Selected by default (1周)
  coverImage: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=800&q=80",
  progressPercent: 20,
  pausedStep: "界面稳定性与副反应抑制",
  pausedStage: "机制拆解",
  pausedProgress: 40,
  steps: [
    {
      id: 1,
      title: "明确核心概念",
      description: "掌握硒（Se）元素如何调控镍基正极表面活性，理解晶格掺杂与表面包覆的热力学稳定性机理。",
      duration: "10 min",
      status: "completed",
      icon: "BookOpen"
    },
    {
      id: 2,
      title: "进入 AI 讲解",
      description: "由 AI 导师深度剖析硒修饰中固态扩散系数变化，以及非原位合成中的缺陷自愈机理。",
      duration: "15 min",
      status: "active",
      icon: "Sparkles"
    },
    {
      id: 3,
      title: "开始实时对话",
      description: "针对其在循环过程中释放的高价态镍副反应，与 AI 导师进行基于第一性原理计算的追问辨析。",
      duration: "20 min",
      status: "pending",
      icon: "MessageSquare text-zinc-500"
    },
    {
      id: 4,
      title: "输出自己的理解",
      description: "尝试画出改性晶格的剪切重构图谱，由 AI 教练对你给出的改性修复方案进行可用性盲测与诊断评分。",
      duration: "15 min",
      status: "pending",
      icon: "PenTool text-zinc-500"
    },
    {
      id: 5,
      title: "生成学习总结",
      description: "生成完整的学术级学习脑图与错题记录，自动同步归档至 Neural Vault 记忆总结中。",
      duration: "10 min",
      status: "pending",
      icon: "FileCheck text-zinc-500"
    }
  ],
  completedSnapshot: [
    "超高镍正极（LiNi90）颗粒微开裂基本演变图像构建完成",
    "硒在表面局域氧空位层能量排斥的热力学相变边界计算验证通过"
  ],
  pendingSnapshot: [
    "硒化锂（Li2Se）相变抑制动力学能垒计算",
    "循环后期过度脱锂状态下的界面副反应特征仿真",
    "完成第 7 天的电池改性学术级蓝图微型论文汇报"
  ]
};
