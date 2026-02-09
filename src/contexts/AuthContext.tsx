import { createContext, useContext, useState, useEffect, useCallback, type ReactNode } from 'react';
import type { User, AuthState } from '../types/auth';
import type { ProfileRow } from '../types/database';
import { supabase, isSupabaseConfigured } from '../lib/supabase';
import { updateProfile } from '../services/profileService';
import { createEnrollment } from '../services/enrollmentService';

interface AuthContextType extends AuthState {
  login: (email: string, password: string, rememberMe?: boolean) => Promise<boolean>;
  logout: () => void;
  register: (data: RegisterData, rememberMe?: boolean) => Promise<boolean>;
}

export interface RegisterData {
  name: string;
  email: string;
  password: string;
  instructorCode: string;
  orgCode: string;
  country: string;
  gender: 'male' | 'female';
  birthYear: number;
}

const AuthContext = createContext<AuthContextType | null>(null);

/** ProfileRow → User 변환 */
function profileToUser(p: ProfileRow): User {
  return {
    id: p.id,
    name: p.name,
    email: p.email,
    role: p.role,
    organization: p.organization || '',
    instructorCode: p.instructor_code || '',
    orgCode: p.org_code || '',
    learningPurpose: p.learning_purpose || '',
    createdAt: p.created_at,
    age: p.age ?? undefined,
    gender: p.gender ?? undefined,
    country: p.country ?? undefined,
  };
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<AuthState>({
    user: null,
    isAuthenticated: false,
    isLoading: true,
  });

  // Supabase 인증 상태 변화 감지
  useEffect(() => {
    // Supabase 미설정 시 오프라인 모드
    if (!isSupabaseConfigured) {
      setState({ user: null, isAuthenticated: false, isLoading: false });
      return;
    }

    // 현재 세션 확인
    supabase.auth.getSession().then(async ({ data: { session } }) => {
      if (session?.user) {
        const profile = await fetchProfile(session.user.id);
        if (profile) {
          setState({
            user: profileToUser(profile),
            isAuthenticated: true,
            isLoading: false,
          });
          return;
        }
      }
      setState((prev) => ({ ...prev, isLoading: false }));
    });

    // 인증 상태 변경 리스너
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (event === 'SIGNED_IN' && session?.user) {
          const profile = await fetchProfile(session.user.id);
          if (profile) {
            setState({
              user: profileToUser(profile),
              isAuthenticated: true,
              isLoading: false,
            });
          }
        } else if (event === 'SIGNED_OUT') {
          setState({ user: null, isAuthenticated: false, isLoading: false });
        }
      },
    );

    return () => subscription.unsubscribe();
  }, []);

  const login = useCallback(async (email: string, password: string, _rememberMe = false): Promise<boolean> => {
    if (!isSupabaseConfigured) {
      console.warn('[Auth] Supabase 미설정 — 로그인 불가');
      return false;
    }
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) {
      console.error('Login error:', error.message);
      return false;
    }
    return true;
  }, []);

  const logout = useCallback(async () => {
    await supabase.auth.signOut();
    setState({ user: null, isAuthenticated: false, isLoading: false });
  }, []);

  const register = useCallback(async (data: RegisterData, _rememberMe = false): Promise<boolean> => {
    if (!isSupabaseConfigured) {
      throw new Error('supabase_not_configured');
    }

    // 1) Supabase Auth 계정 생성 (트리거가 profiles 자동 생성)
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email: data.email,
      password: data.password,
      options: {
        data: {
          name: data.name,
          role: 'student',
          instructor_code: data.instructorCode || '',
          org_code: data.orgCode || '',
        },
      },
    });

    if (authError) {
      console.error('Register error:', authError.message);
      throw new Error(authError.message);
    }

    if (!authData.user) {
      console.error('No user returned from signUp');
      throw new Error('register_failed');
    }

    // 2) 트리거가 profiles 행을 자동 생성하도록 대기
    await new Promise(resolve => setTimeout(resolve, 500));

    // 3) 자동 로그인 (세션 생성)
    const { error: loginError } = await supabase.auth.signInWithPassword({
      email: data.email,
      password: data.password,
    });

    if (loginError) {
      console.error('Auto-login error:', loginError.message);
      throw new Error(loginError.message);
    }

    // 4) 추가 프로필 정보 저장 (country, gender, age, instructor_code, org_code)
    const currentYear = new Date().getFullYear();
    await updateProfile(authData.user.id, {
      country: data.country,
      gender: data.gender,
      age: currentYear - data.birthYear,
      instructor_code: data.instructorCode || '',
      org_code: data.orgCode || '',
    });

    // 5) 마케팅 학교 enrollment 자동 생성
    await createEnrollment(authData.user.id, 'marketing', null);

    // 6) user 상태가 onAuthStateChange로 자동 업데이트됨
    return true;
  }, []);

  return (
    <AuthContext.Provider value={{ ...state, login, logout, register }}>
      {children}
    </AuthContext.Provider>
  );
}

/** Supabase에서 프로필 조회 */
async function fetchProfile(userId: string): Promise<ProfileRow | null> {
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', userId)
    .single();

  if (error) {
    console.error('Fetch profile error:', error.message);
    return null;
  }
  return data as ProfileRow;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
