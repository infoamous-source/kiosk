import type { PersonaId, PersonaInfo } from '../types/school';

export interface AptitudeQuestion {
  id: string;
  situationKey: string;
  optionAKey: string;
  optionBKey: string;
  weightsA: PersonaId[];
  weightsB: PersonaId[];
}

export type QuestionSetId = 'set1' | 'set2' | 'set3';

export interface AptitudeQuestionSet {
  id: QuestionSetId;
  questions: AptitudeQuestion[];
}

export const PERSONAS: Record<PersonaId, PersonaInfo> = {
  CEO: {
    id: 'CEO',
    emoji: '🦁',
    nameKey: 'school.aptitude.personas.CEO.name',
    titleKey: 'school.aptitude.personas.CEO.title',
    descriptionKey: 'school.aptitude.personas.CEO.desc',
    color: 'amber',
    strengths: [
      'school.aptitude.personas.CEO.strength1',
      'school.aptitude.personas.CEO.strength2',
      'school.aptitude.personas.CEO.strength3',
    ],
  },
  PM: {
    id: 'PM',
    emoji: '💡',
    nameKey: 'school.aptitude.personas.PM.name',
    titleKey: 'school.aptitude.personas.PM.title',
    descriptionKey: 'school.aptitude.personas.PM.desc',
    color: 'violet',
    strengths: [
      'school.aptitude.personas.PM.strength1',
      'school.aptitude.personas.PM.strength2',
      'school.aptitude.personas.PM.strength3',
    ],
  },
  CPO: {
    id: 'CPO',
    emoji: '📊',
    nameKey: 'school.aptitude.personas.CPO.name',
    titleKey: 'school.aptitude.personas.CPO.title',
    descriptionKey: 'school.aptitude.personas.CPO.desc',
    color: 'blue',
    strengths: [
      'school.aptitude.personas.CPO.strength1',
      'school.aptitude.personas.CPO.strength2',
      'school.aptitude.personas.CPO.strength3',
    ],
  },
  CMO: {
    id: 'CMO',
    emoji: '📣',
    nameKey: 'school.aptitude.personas.CMO.name',
    titleKey: 'school.aptitude.personas.CMO.title',
    descriptionKey: 'school.aptitude.personas.CMO.desc',
    color: 'pink',
    strengths: [
      'school.aptitude.personas.CMO.strength1',
      'school.aptitude.personas.CMO.strength2',
      'school.aptitude.personas.CMO.strength3',
    ],
  },
  CSL: {
    id: 'CSL',
    emoji: '🤝',
    nameKey: 'school.aptitude.personas.CSL.name',
    titleKey: 'school.aptitude.personas.CSL.title',
    descriptionKey: 'school.aptitude.personas.CSL.desc',
    color: 'emerald',
    strengths: [
      'school.aptitude.personas.CSL.strength1',
      'school.aptitude.personas.CSL.strength2',
      'school.aptitude.personas.CSL.strength3',
    ],
  },
};

// ─── 세트 1: 일상 성향 기반 (여행, 쇼핑, 파티 등) ───
const SET1_QUESTIONS: AptitudeQuestion[] = [
  { id: 'Q1', situationKey: 'school.aptitude.questions.set1.Q1.situation', optionAKey: 'school.aptitude.questions.set1.Q1.A', optionBKey: 'school.aptitude.questions.set1.Q1.B', weightsA: ['CEO'], weightsB: ['PM'] },
  { id: 'Q2', situationKey: 'school.aptitude.questions.set1.Q2.situation', optionAKey: 'school.aptitude.questions.set1.Q2.A', optionBKey: 'school.aptitude.questions.set1.Q2.B', weightsA: ['CPO'], weightsB: ['CMO'] },
  { id: 'Q3', situationKey: 'school.aptitude.questions.set1.Q3.situation', optionAKey: 'school.aptitude.questions.set1.Q3.A', optionBKey: 'school.aptitude.questions.set1.Q3.B', weightsA: ['CSL'], weightsB: ['CEO'] },
  { id: 'Q4', situationKey: 'school.aptitude.questions.set1.Q4.situation', optionAKey: 'school.aptitude.questions.set1.Q4.A', optionBKey: 'school.aptitude.questions.set1.Q4.B', weightsA: ['CMO'], weightsB: ['CPO'] },
  { id: 'Q5', situationKey: 'school.aptitude.questions.set1.Q5.situation', optionAKey: 'school.aptitude.questions.set1.Q5.A', optionBKey: 'school.aptitude.questions.set1.Q5.B', weightsA: ['PM'], weightsB: ['CSL'] },
  { id: 'Q6', situationKey: 'school.aptitude.questions.set1.Q6.situation', optionAKey: 'school.aptitude.questions.set1.Q6.A', optionBKey: 'school.aptitude.questions.set1.Q6.B', weightsA: ['CEO', 'CPO'], weightsB: ['PM'] },
  { id: 'Q7', situationKey: 'school.aptitude.questions.set1.Q7.situation', optionAKey: 'school.aptitude.questions.set1.Q7.A', optionBKey: 'school.aptitude.questions.set1.Q7.B', weightsA: ['CMO'], weightsB: ['CSL'] },
  { id: 'Q8', situationKey: 'school.aptitude.questions.set1.Q8.situation', optionAKey: 'school.aptitude.questions.set1.Q8.A', optionBKey: 'school.aptitude.questions.set1.Q8.B', weightsA: ['CPO'], weightsB: ['PM'] },
  { id: 'Q9', situationKey: 'school.aptitude.questions.set1.Q9.situation', optionAKey: 'school.aptitude.questions.set1.Q9.A', optionBKey: 'school.aptitude.questions.set1.Q9.B', weightsA: ['CEO'], weightsB: ['CMO'] },
  { id: 'Q10', situationKey: 'school.aptitude.questions.set1.Q10.situation', optionAKey: 'school.aptitude.questions.set1.Q10.A', optionBKey: 'school.aptitude.questions.set1.Q10.B', weightsA: ['CSL'], weightsB: ['CPO'] },
  { id: 'Q11', situationKey: 'school.aptitude.questions.set1.Q11.situation', optionAKey: 'school.aptitude.questions.set1.Q11.A', optionBKey: 'school.aptitude.questions.set1.Q11.B', weightsA: ['PM', 'CMO'], weightsB: ['CEO'] },
  { id: 'Q12', situationKey: 'school.aptitude.questions.set1.Q12.situation', optionAKey: 'school.aptitude.questions.set1.Q12.A', optionBKey: 'school.aptitude.questions.set1.Q12.B', weightsA: ['CPO'], weightsB: ['CSL'] },
  { id: 'Q13', situationKey: 'school.aptitude.questions.set1.Q13.situation', optionAKey: 'school.aptitude.questions.set1.Q13.A', optionBKey: 'school.aptitude.questions.set1.Q13.B', weightsA: ['CEO'], weightsB: ['PM'] },
  { id: 'Q14', situationKey: 'school.aptitude.questions.set1.Q14.situation', optionAKey: 'school.aptitude.questions.set1.Q14.A', optionBKey: 'school.aptitude.questions.set1.Q14.B', weightsA: ['CMO'], weightsB: ['CSL'] },
  { id: 'Q15', situationKey: 'school.aptitude.questions.set1.Q15.situation', optionAKey: 'school.aptitude.questions.set1.Q15.A', optionBKey: 'school.aptitude.questions.set1.Q15.B', weightsA: ['CEO', 'CPO'], weightsB: ['PM', 'CMO'] },
];

// ─── 세트 2: 일상 성향 기반 (음식, 취미, 학교 등) ───
const SET2_QUESTIONS: AptitudeQuestion[] = [
  { id: 'Q1', situationKey: 'school.aptitude.questions.set2.Q1.situation', optionAKey: 'school.aptitude.questions.set2.Q1.A', optionBKey: 'school.aptitude.questions.set2.Q1.B', weightsA: ['PM'], weightsB: ['CEO'] },
  { id: 'Q2', situationKey: 'school.aptitude.questions.set2.Q2.situation', optionAKey: 'school.aptitude.questions.set2.Q2.A', optionBKey: 'school.aptitude.questions.set2.Q2.B', weightsA: ['CMO'], weightsB: ['CPO'] },
  { id: 'Q3', situationKey: 'school.aptitude.questions.set2.Q3.situation', optionAKey: 'school.aptitude.questions.set2.Q3.A', optionBKey: 'school.aptitude.questions.set2.Q3.B', weightsA: ['CEO'], weightsB: ['CSL'] },
  { id: 'Q4', situationKey: 'school.aptitude.questions.set2.Q4.situation', optionAKey: 'school.aptitude.questions.set2.Q4.A', optionBKey: 'school.aptitude.questions.set2.Q4.B', weightsA: ['CPO'], weightsB: ['PM'] },
  { id: 'Q5', situationKey: 'school.aptitude.questions.set2.Q5.situation', optionAKey: 'school.aptitude.questions.set2.Q5.A', optionBKey: 'school.aptitude.questions.set2.Q5.B', weightsA: ['CSL'], weightsB: ['CMO'] },
  { id: 'Q6', situationKey: 'school.aptitude.questions.set2.Q6.situation', optionAKey: 'school.aptitude.questions.set2.Q6.A', optionBKey: 'school.aptitude.questions.set2.Q6.B', weightsA: ['PM'], weightsB: ['CPO'] },
  { id: 'Q7', situationKey: 'school.aptitude.questions.set2.Q7.situation', optionAKey: 'school.aptitude.questions.set2.Q7.A', optionBKey: 'school.aptitude.questions.set2.Q7.B', weightsA: ['CEO'], weightsB: ['CMO'] },
  { id: 'Q8', situationKey: 'school.aptitude.questions.set2.Q8.situation', optionAKey: 'school.aptitude.questions.set2.Q8.A', optionBKey: 'school.aptitude.questions.set2.Q8.B', weightsA: ['CSL'], weightsB: ['CEO'] },
  { id: 'Q9', situationKey: 'school.aptitude.questions.set2.Q9.situation', optionAKey: 'school.aptitude.questions.set2.Q9.A', optionBKey: 'school.aptitude.questions.set2.Q9.B', weightsA: ['CPO'], weightsB: ['CMO'] },
  { id: 'Q10', situationKey: 'school.aptitude.questions.set2.Q10.situation', optionAKey: 'school.aptitude.questions.set2.Q10.A', optionBKey: 'school.aptitude.questions.set2.Q10.B', weightsA: ['PM', 'CSL'], weightsB: ['CEO'] },
  { id: 'Q11', situationKey: 'school.aptitude.questions.set2.Q11.situation', optionAKey: 'school.aptitude.questions.set2.Q11.A', optionBKey: 'school.aptitude.questions.set2.Q11.B', weightsA: ['CMO'], weightsB: ['CPO'] },
  { id: 'Q12', situationKey: 'school.aptitude.questions.set2.Q12.situation', optionAKey: 'school.aptitude.questions.set2.Q12.A', optionBKey: 'school.aptitude.questions.set2.Q12.B', weightsA: ['CEO'], weightsB: ['PM'] },
  { id: 'Q13', situationKey: 'school.aptitude.questions.set2.Q13.situation', optionAKey: 'school.aptitude.questions.set2.Q13.A', optionBKey: 'school.aptitude.questions.set2.Q13.B', weightsA: ['CSL'], weightsB: ['CPO'] },
  { id: 'Q14', situationKey: 'school.aptitude.questions.set2.Q14.situation', optionAKey: 'school.aptitude.questions.set2.Q14.A', optionBKey: 'school.aptitude.questions.set2.Q14.B', weightsA: ['PM', 'CMO'], weightsB: ['CSL'] },
  { id: 'Q15', situationKey: 'school.aptitude.questions.set2.Q15.situation', optionAKey: 'school.aptitude.questions.set2.Q15.A', optionBKey: 'school.aptitude.questions.set2.Q15.B', weightsA: ['CEO', 'CPO'], weightsB: ['CMO', 'CSL'] },
];

// ─── 세트 3: 일상 성향 기반 (일, 돈, 관계 등) ───
const SET3_QUESTIONS: AptitudeQuestion[] = [
  { id: 'Q1', situationKey: 'school.aptitude.questions.set3.Q1.situation', optionAKey: 'school.aptitude.questions.set3.Q1.A', optionBKey: 'school.aptitude.questions.set3.Q1.B', weightsA: ['CEO'], weightsB: ['CMO'] },
  { id: 'Q2', situationKey: 'school.aptitude.questions.set3.Q2.situation', optionAKey: 'school.aptitude.questions.set3.Q2.A', optionBKey: 'school.aptitude.questions.set3.Q2.B', weightsA: ['PM'], weightsB: ['CPO'] },
  { id: 'Q3', situationKey: 'school.aptitude.questions.set3.Q3.situation', optionAKey: 'school.aptitude.questions.set3.Q3.A', optionBKey: 'school.aptitude.questions.set3.Q3.B', weightsA: ['CSL'], weightsB: ['CEO'] },
  { id: 'Q4', situationKey: 'school.aptitude.questions.set3.Q4.situation', optionAKey: 'school.aptitude.questions.set3.Q4.A', optionBKey: 'school.aptitude.questions.set3.Q4.B', weightsA: ['CMO'], weightsB: ['PM'] },
  { id: 'Q5', situationKey: 'school.aptitude.questions.set3.Q5.situation', optionAKey: 'school.aptitude.questions.set3.Q5.A', optionBKey: 'school.aptitude.questions.set3.Q5.B', weightsA: ['CPO'], weightsB: ['CSL'] },
  { id: 'Q6', situationKey: 'school.aptitude.questions.set3.Q6.situation', optionAKey: 'school.aptitude.questions.set3.Q6.A', optionBKey: 'school.aptitude.questions.set3.Q6.B', weightsA: ['CEO'], weightsB: ['PM'] },
  { id: 'Q7', situationKey: 'school.aptitude.questions.set3.Q7.situation', optionAKey: 'school.aptitude.questions.set3.Q7.A', optionBKey: 'school.aptitude.questions.set3.Q7.B', weightsA: ['CMO'], weightsB: ['CPO'] },
  { id: 'Q8', situationKey: 'school.aptitude.questions.set3.Q8.situation', optionAKey: 'school.aptitude.questions.set3.Q8.A', optionBKey: 'school.aptitude.questions.set3.Q8.B', weightsA: ['CSL'], weightsB: ['PM'] },
  { id: 'Q9', situationKey: 'school.aptitude.questions.set3.Q9.situation', optionAKey: 'school.aptitude.questions.set3.Q9.A', optionBKey: 'school.aptitude.questions.set3.Q9.B', weightsA: ['CEO', 'CPO'], weightsB: ['CMO'] },
  { id: 'Q10', situationKey: 'school.aptitude.questions.set3.Q10.situation', optionAKey: 'school.aptitude.questions.set3.Q10.A', optionBKey: 'school.aptitude.questions.set3.Q10.B', weightsA: ['PM'], weightsB: ['CSL'] },
  { id: 'Q11', situationKey: 'school.aptitude.questions.set3.Q11.situation', optionAKey: 'school.aptitude.questions.set3.Q11.A', optionBKey: 'school.aptitude.questions.set3.Q11.B', weightsA: ['CPO'], weightsB: ['CMO'] },
  { id: 'Q12', situationKey: 'school.aptitude.questions.set3.Q12.situation', optionAKey: 'school.aptitude.questions.set3.Q12.A', optionBKey: 'school.aptitude.questions.set3.Q12.B', weightsA: ['CEO'], weightsB: ['CSL'] },
  { id: 'Q13', situationKey: 'school.aptitude.questions.set3.Q13.situation', optionAKey: 'school.aptitude.questions.set3.Q13.A', optionBKey: 'school.aptitude.questions.set3.Q13.B', weightsA: ['PM', 'CMO'], weightsB: ['CPO'] },
  { id: 'Q14', situationKey: 'school.aptitude.questions.set3.Q14.situation', optionAKey: 'school.aptitude.questions.set3.Q14.A', optionBKey: 'school.aptitude.questions.set3.Q14.B', weightsA: ['CSL'], weightsB: ['CEO'] },
  { id: 'Q15', situationKey: 'school.aptitude.questions.set3.Q15.situation', optionAKey: 'school.aptitude.questions.set3.Q15.A', optionBKey: 'school.aptitude.questions.set3.Q15.B', weightsA: ['CPO', 'CSL'], weightsB: ['PM', 'CEO'] },
];

export const QUESTION_SETS: AptitudeQuestionSet[] = [
  { id: 'set1', questions: SET1_QUESTIONS },
  { id: 'set2', questions: SET2_QUESTIONS },
  { id: 'set3', questions: SET3_QUESTIONS },
];

/** 하위호환용 — 기본 세트(set1)의 질문 배열 */
export const QUESTIONS = QUESTION_SETS[0].questions;

/** 이전에 푼 세트를 피해서 다른 세트 반환 */
export function getQuestionSet(previousSetId?: string): AptitudeQuestionSet {
  if (!previousSetId) {
    return QUESTION_SETS[Math.floor(Math.random() * QUESTION_SETS.length)];
  }
  const available = QUESTION_SETS.filter((s) => s.id !== previousSetId);
  if (available.length === 0) {
    return QUESTION_SETS[Math.floor(Math.random() * QUESTION_SETS.length)];
  }
  return available[Math.floor(Math.random() * available.length)];
}

/** 스코어링 함수 */
export function calculateResult(
  answers: Record<string, string>,
  questions: AptitudeQuestion[],
): {
  resultType: PersonaId;
  scores: Record<PersonaId, number>;
} {
  const scores: Record<PersonaId, number> = { CEO: 0, PM: 0, CPO: 0, CMO: 0, CSL: 0 };

  for (const [questionId, choice] of Object.entries(answers)) {
    const question = questions.find((q) => q.id === questionId);
    if (!question) continue;

    const weights = choice === 'A' ? question.weightsA : question.weightsB;
    for (const persona of weights) {
      scores[persona] += 1;
    }
  }

  // 동점 시 우선순위: CEO > PM > CPO > CMO > CSL
  const priority: PersonaId[] = ['CEO', 'PM', 'CPO', 'CMO', 'CSL'];
  let resultType: PersonaId = 'CEO';
  let maxScore = -1;

  for (const p of priority) {
    if (scores[p] > maxScore) {
      maxScore = scores[p];
      resultType = p;
    }
  }

  return { resultType, scores };
}
