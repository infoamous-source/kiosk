import { createContext, useContext, useState, useEffect, useCallback, type ReactNode } from 'react';
import type { User, UserRole, AuthState } from '../types/auth';

interface AuthContextType extends AuthState {
  login: (email: string, password: string, rememberMe?: boolean) => Promise<boolean>;
  logout: () => void;
  register: (data: RegisterData, rememberMe?: boolean) => Promise<boolean>;
}

interface RegisterData {
  name: string;
  email: string;
  password: string;
  organization: string;
  instructorCode: string;
  orgCode: string;
  learningPurpose: string;
}

const STORAGE_KEY = 'kiosk-auth';
const SESSION_KEY = 'kiosk-auth-session';

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<AuthState>({
    user: null,
    isAuthenticated: false,
    isLoading: true,
  });

  // 초기 로드 시 localStorage 또는 sessionStorage에서 인증 상태 복원
  useEffect(() => {
    try {
      // 먼저 localStorage (자동 로그인) 확인
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const data = JSON.parse(stored);
        setState({
          user: data.user,
          isAuthenticated: true,
          isLoading: false,
        });
        return;
      }

      // 그 다음 sessionStorage (일회성 로그인) 확인
      const session = sessionStorage.getItem(SESSION_KEY);
      if (session) {
        const data = JSON.parse(session);
        setState({
          user: data.user,
          isAuthenticated: true,
          isLoading: false,
        });
        return;
      }

      setState((prev) => ({ ...prev, isLoading: false }));
    } catch {
      setState((prev) => ({ ...prev, isLoading: false }));
    }
  }, []);

  const login = useCallback(async (email: string, _password: string, rememberMe = false): Promise<boolean> => {
    // TODO: 실제 API 연동 - _password는 추후 인증 시 사용
    // 현재는 더미 로그인 (instructor@test.com = 강사, 그 외 = 학생)
    await new Promise((resolve) => setTimeout(resolve, 500));

    const role: UserRole = email.includes('instructor') ? 'instructor' : 'student';
    const user: User = {
      id: crypto.randomUUID(),
      name: email.split('@')[0],
      email,
      role,
      organization: '테스트 기관',
      instructorCode: 'INST-001',
      orgCode: 'ORG-001',
      learningPurpose: '학습 목적',
      createdAt: new Date().toISOString(),
      subscription: {
        type: 'none',
        status: 'none',
      },
    };

    // 자동 로그인 체크 시 localStorage에, 아니면 sessionStorage에 저장
    if (rememberMe) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify({ user }));
      sessionStorage.removeItem(SESSION_KEY);
    } else {
      sessionStorage.setItem(SESSION_KEY, JSON.stringify({ user }));
      localStorage.removeItem(STORAGE_KEY);
    }

    setState({ user, isAuthenticated: true, isLoading: false });
    return true;
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem(STORAGE_KEY);
    sessionStorage.removeItem(SESSION_KEY);
    setState({ user: null, isAuthenticated: false, isLoading: false });
  }, []);

  const register = useCallback(async (data: RegisterData, rememberMe = false): Promise<boolean> => {
    // TODO: 실제 API 연동
    await new Promise((resolve) => setTimeout(resolve, 500));

    const user: User = {
      id: crypto.randomUUID(),
      name: data.name,
      email: data.email,
      role: 'student',
      organization: data.organization,
      instructorCode: data.instructorCode,
      orgCode: data.orgCode,
      learningPurpose: data.learningPurpose,
      createdAt: new Date().toISOString(),
      subscription: {
        type: 'none',
        status: 'none',
      },
    };

    // 자동 로그인 체크 시 localStorage에, 아니면 sessionStorage에 저장
    if (rememberMe) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify({ user }));
      sessionStorage.removeItem(SESSION_KEY);
    } else {
      sessionStorage.setItem(SESSION_KEY, JSON.stringify({ user }));
      localStorage.removeItem(STORAGE_KEY);
    }

    setState({ user, isAuthenticated: true, isLoading: false });
    return true;
  }, []);

  return (
    <AuthContext.Provider value={{ ...state, login, logout, register }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
