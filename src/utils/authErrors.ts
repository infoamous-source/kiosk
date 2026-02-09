export interface AuthError {
  title: string;
  reason: string;
  solution: string;
}

export function parseAuthError(error: unknown): AuthError {
  if (error && typeof error === 'object' && 'message' in error) {
    const message = (error as { message?: string }).message || '';

    if (message.includes('already registered') || message.includes('23505')) {
      return {
        title: '회원가입 실패',
        reason: '이미 사용 중인 이메일입니다.',
        solution: '다른 이메일 주소를 사용하거나 로그인 페이지로 이동하세요.',
      };
    }

    if (message.includes('register_failed') || message.includes('supabase')) {
      return {
        title: '등록 실패 (Registration Failed)',
        reason: '서버 연결에 실패했습니다 (Could not connect to server)',
        solution: '잠시 후 다시 시도해주세요 (Please try again later)',
      };
    }

    if (message.includes('weak_password') || message.includes('Password should be') || message.includes('password')) {
      return {
        title: '비밀번호 오류 (Password Error)',
        reason: '비밀번호가 너무 약합니다 (Password is too weak)',
        solution: '영문, 숫자, 특수문자를 포함하여 8자 이상 입력하세요 (Use 8+ chars with letters, numbers, special chars)',
      };
    }

    if (message.includes('invalid_credentials') || message.includes('Invalid login')) {
      return {
        title: '로그인 실패',
        reason: '이메일 또는 비밀번호가 올바르지 않습니다.',
        solution: '입력한 정보를 다시 확인하세요.',
      };
    }

    if (message.includes('Database error')) {
      return {
        title: '서버 오류',
        reason: '서버에서 사용자 정보를 처리하지 못했습니다.',
        solution: '잠시 후 다시 시도하거나 관리자에게 문의하세요.',
      };
    }
  }

  return {
    title: '오류 발생',
    reason: '알 수 없는 오류가 발생했습니다.',
    solution: '네트워크 연결을 확인하고 다시 시도하세요.',
  };
}
