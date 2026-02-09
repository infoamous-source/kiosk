import type { PersonaId, PersonaInfo } from '../types/school';

export interface AptitudeQuestion {
  id: string;
  situationKey: string;
  optionAKey: string;
  optionBKey: string;
  weightsA: PersonaId[];
  weightsB: PersonaId[];
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

export const QUESTIONS: AptitudeQuestion[] = [
  {
    id: 'Q1',
    situationKey: 'school.aptitude.questions.Q1.situation',
    optionAKey: 'school.aptitude.questions.Q1.A',
    optionBKey: 'school.aptitude.questions.Q1.B',
    weightsA: ['CEO', 'PM'],
    weightsB: ['CPO', 'CSL'],
  },
  {
    id: 'Q2',
    situationKey: 'school.aptitude.questions.Q2.situation',
    optionAKey: 'school.aptitude.questions.Q2.A',
    optionBKey: 'school.aptitude.questions.Q2.B',
    weightsA: ['CPO'],
    weightsB: ['CMO'],
  },
  {
    id: 'Q3',
    situationKey: 'school.aptitude.questions.Q3.situation',
    optionAKey: 'school.aptitude.questions.Q3.A',
    optionBKey: 'school.aptitude.questions.Q3.B',
    weightsA: ['CEO'],
    weightsB: ['PM'],
  },
  {
    id: 'Q4',
    situationKey: 'school.aptitude.questions.Q4.situation',
    optionAKey: 'school.aptitude.questions.Q4.A',
    optionBKey: 'school.aptitude.questions.Q4.B',
    weightsA: ['CMO'],
    weightsB: ['CSL'],
  },
  {
    id: 'Q5',
    situationKey: 'school.aptitude.questions.Q5.situation',
    optionAKey: 'school.aptitude.questions.Q5.A',
    optionBKey: 'school.aptitude.questions.Q5.B',
    weightsA: ['CPO'],
    weightsB: ['PM'],
  },
  {
    id: 'Q6',
    situationKey: 'school.aptitude.questions.Q6.situation',
    optionAKey: 'school.aptitude.questions.Q6.A',
    optionBKey: 'school.aptitude.questions.Q6.B',
    weightsA: ['CPO'],
    weightsB: ['CSL'],
  },
  {
    id: 'Q7',
    situationKey: 'school.aptitude.questions.Q7.situation',
    optionAKey: 'school.aptitude.questions.Q7.A',
    optionBKey: 'school.aptitude.questions.Q7.B',
    weightsA: ['CMO'],
    weightsB: ['CSL'],
  },
  {
    id: 'Q8',
    situationKey: 'school.aptitude.questions.Q8.situation',
    optionAKey: 'school.aptitude.questions.Q8.A',
    optionBKey: 'school.aptitude.questions.Q8.B',
    weightsA: ['CEO', 'CPO'],
    weightsB: ['PM'],
  },
  {
    id: 'Q9',
    situationKey: 'school.aptitude.questions.Q9.situation',
    optionAKey: 'school.aptitude.questions.Q9.A',
    optionBKey: 'school.aptitude.questions.Q9.B',
    weightsA: ['CMO'],
    weightsB: ['CSL'],
  },
  {
    id: 'Q10',
    situationKey: 'school.aptitude.questions.Q10.situation',
    optionAKey: 'school.aptitude.questions.Q10.A',
    optionBKey: 'school.aptitude.questions.Q10.B',
    weightsA: ['CPO'],
    weightsB: ['CMO'],
  },
  {
    id: 'Q11',
    situationKey: 'school.aptitude.questions.Q11.situation',
    optionAKey: 'school.aptitude.questions.Q11.A',
    optionBKey: 'school.aptitude.questions.Q11.B',
    weightsA: ['CEO'],
    weightsB: ['CSL'],
  },
  {
    id: 'Q12',
    situationKey: 'school.aptitude.questions.Q12.situation',
    optionAKey: 'school.aptitude.questions.Q12.A',
    optionBKey: 'school.aptitude.questions.Q12.B',
    weightsA: ['PM', 'CMO'],
    weightsB: ['CEO', 'CPO'],
  },
  {
    id: 'Q13',
    situationKey: 'school.aptitude.questions.Q13.situation',
    optionAKey: 'school.aptitude.questions.Q13.A',
    optionBKey: 'school.aptitude.questions.Q13.B',
    weightsA: ['PM'],
    weightsB: ['CSL'],
  },
  {
    id: 'Q14',
    situationKey: 'school.aptitude.questions.Q14.situation',
    optionAKey: 'school.aptitude.questions.Q14.A',
    optionBKey: 'school.aptitude.questions.Q14.B',
    weightsA: ['CEO'],
    weightsB: ['CMO'],
  },
  {
    id: 'Q15',
    situationKey: 'school.aptitude.questions.Q15.situation',
    optionAKey: 'school.aptitude.questions.Q15.A',
    optionBKey: 'school.aptitude.questions.Q15.B',
    weightsA: ['CEO', 'CPO'],
    weightsB: ['PM', 'CMO'],
  },
];

/** 스코어링 함수 */
export function calculateResult(answers: Record<string, string>): {
  resultType: PersonaId;
  scores: Record<PersonaId, number>;
} {
  const scores: Record<PersonaId, number> = { CEO: 0, PM: 0, CPO: 0, CMO: 0, CSL: 0 };

  for (const [questionId, choice] of Object.entries(answers)) {
    const question = QUESTIONS.find(q => q.id === questionId);
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
