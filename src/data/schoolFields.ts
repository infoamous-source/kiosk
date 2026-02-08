import type { SchoolField } from '../types/enrollment';

/** 학교별 추가 입학 정보 필드 정의 */
export const SCHOOL_ADDITIONAL_FIELDS: Record<string, SchoolField[]> = {
  'digital-basics': [
    {
      id: 'computer_experience',
      labelKey: 'enrollment.fields.computerExperience',
      type: 'select',
      required: true,
      options: [
        { value: 'none', labelKey: 'enrollment.fields.expNone' },
        { value: 'basic', labelKey: 'enrollment.fields.expBasic' },
        { value: 'intermediate', labelKey: 'enrollment.fields.expIntermediate' },
      ],
    },
    {
      id: 'has_own_device',
      labelKey: 'enrollment.fields.hasOwnDevice',
      type: 'select',
      required: true,
      options: [
        { value: 'smartphone_only', labelKey: 'enrollment.fields.smartphoneOnly' },
        { value: 'has_computer', labelKey: 'enrollment.fields.hasComputer' },
        { value: 'no_device', labelKey: 'enrollment.fields.noDevice' },
      ],
    },
    {
      id: 'digital_goals',
      labelKey: 'enrollment.fields.digitalGoals',
      type: 'textarea',
      required: false,
    },
  ],

  'marketing': [
    {
      id: 'sns_accounts',
      labelKey: 'enrollment.fields.snsAccounts',
      type: 'multiselect',
      required: true,
      options: [
        { value: 'instagram', labelKey: 'Instagram' },
        { value: 'youtube', labelKey: 'YouTube' },
        { value: 'tiktok', labelKey: 'TikTok' },
        { value: 'facebook', labelKey: 'Facebook' },
        { value: 'naver_blog', labelKey: 'Naver Blog' },
        { value: 'none', labelKey: 'enrollment.fields.noSNS' },
      ],
    },
    {
      id: 'business_type',
      labelKey: 'enrollment.fields.businessType',
      type: 'select',
      required: true,
      options: [
        { value: 'none', labelKey: 'enrollment.fields.noBusiness' },
        { value: 'planning', labelKey: 'enrollment.fields.planningBusiness' },
        { value: 'running', labelKey: 'enrollment.fields.runningBusiness' },
      ],
    },
    {
      id: 'marketing_experience',
      labelKey: 'enrollment.fields.marketingExperience',
      type: 'select',
      required: true,
      options: [
        { value: 'none', labelKey: 'enrollment.fields.expNone' },
        { value: 'basic', labelKey: 'enrollment.fields.expBasic' },
        { value: 'experienced', labelKey: 'enrollment.fields.expExperienced' },
      ],
    },
  ],

  'career': [
    {
      id: 'visa_type',
      labelKey: 'enrollment.fields.visaType',
      type: 'select',
      required: true,
      options: [
        { value: 'E7', labelKey: 'E-7' },
        { value: 'E9', labelKey: 'E-9' },
        { value: 'F2', labelKey: 'F-2' },
        { value: 'F4', labelKey: 'F-4' },
        { value: 'F5', labelKey: 'F-5' },
        { value: 'F6', labelKey: 'F-6' },
        { value: 'D2', labelKey: 'D-2 (유학)' },
        { value: 'other', labelKey: 'enrollment.fields.otherVisa' },
      ],
    },
    {
      id: 'work_experience_korea',
      labelKey: 'enrollment.fields.workExperienceKorea',
      type: 'select',
      required: true,
      options: [
        { value: 'none', labelKey: 'enrollment.fields.expNone' },
        { value: 'under1year', labelKey: 'enrollment.fields.under1year' },
        { value: '1to3years', labelKey: 'enrollment.fields.1to3years' },
        { value: 'over3years', labelKey: 'enrollment.fields.over3years' },
      ],
    },
    {
      id: 'desired_industry',
      labelKey: 'enrollment.fields.desiredIndustry',
      type: 'text',
      required: false,
    },
    {
      id: 'korean_level',
      labelKey: 'enrollment.fields.koreanLevel',
      type: 'select',
      required: true,
      options: [
        { value: 'topik0', labelKey: 'TOPIK 0 (없음)' },
        { value: 'topik1', labelKey: 'TOPIK 1' },
        { value: 'topik2', labelKey: 'TOPIK 2' },
        { value: 'topik3', labelKey: 'TOPIK 3' },
        { value: 'topik4', labelKey: 'TOPIK 4' },
        { value: 'topik5', labelKey: 'TOPIK 5' },
        { value: 'topik6', labelKey: 'TOPIK 6' },
      ],
    },
  ],
};
