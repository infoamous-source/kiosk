import { createContext, useContext, useState, useEffect, useCallback, type ReactNode } from 'react';
import type { User, AuthState } from '../types/auth';
import type { ProfileRow } from '../types/database';
import { supabase } from '../lib/supabase';

interface AuthContextType extends AuthState {
  login: (email: string, password: string, rememberMe?: boolean) => Promise<boolean>;
  logout: () => void;
  register: (data: RegisterData, rememberMe?: boolean) => Promise<boolean>;
}

export interface RegisterData {
  name: string;
  email: string;
  password: string;
  organization: string;
  instructorCode: string;
  orgCode: string;
  learningPurpose: string;
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

  const register = useCallback(async (data: RegisterData, _rememberMe = false): Promise<{ success: boolean; error?: string }> => {
    // 1) Supabase Auth 계정 생성
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email: data.email,
      password: data.password,
      options: {
        data: {
          name: data.name,
          role: 'student',
        },
      },
    });

    if (authError || !authData.user) {
      console.error('Register error:', authError?.message);
      return { success: false, error: authError?.message };
    }

    // 2) profiles 테이블에 추가 정보 업데이트
    //    (trigger가 기본 행을 생성하므로 UPDATE)
    const { error: profileError } = await supabase
      .from('profiles')
      .update({
        name: data.name,
        organization: data.organization,
        instructor_code: data.instructorCode,
        org_code: data.orgCode,
        learning_purpose: data.learningPurpose,
      })
      .eq('id', authData.user.id);

    if (profileError) {
      console.error('Profile update error:', profileError.message);
      return { success: false, error: profileError.message };
    }

    return { success: true };
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
