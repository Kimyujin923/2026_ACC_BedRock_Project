import { useState } from "react";
import { ChefHat, Eye, EyeOff } from "lucide-react";
import { apiLogin, apiRegister } from "../api";

type Mode = "login" | "signup";

interface Props {
  onLogin: (name: string, email: string) => void;
}

function InputField({
  label, type = "text", placeholder, value, onChange, error, hint,
}: {
  label: string; type?: string; placeholder: string; value: string;
  onChange: (v: string) => void; error?: string; hint?: string;
}) {
  const [show, setShow] = useState(false);
  const isPassword = type === "password";
  return (
    <div className="space-y-1.5">
      <label className="block text-sm font-semibold text-foreground">{label}</label>
      <div className="relative">
        <input
          type={isPassword && show ? "text" : type}
          placeholder={placeholder}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className={`w-full px-4 py-2.5 text-sm border rounded-xl bg-white outline-none transition-all ${
            error
              ? "border-red-400 focus:border-red-400 focus:ring-2 focus:ring-red-100"
              : "border-border focus:border-primary focus:ring-2 focus:ring-primary/10"
          }`}
        />
        {isPassword && (
          <button
            type="button"
            onClick={() => setShow((p) => !p)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
          >
            {show ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
          </button>
        )}
      </div>
      {error && <p className="text-xs text-red-500">{error}</p>}
      {hint && !error && <p className="text-xs text-muted-foreground">{hint}</p>}
    </div>
  );
}

function PasswordStrength({ password }: { password: string }) {
  if (!password) return null;
  const checks = [
    { label: "8자 이상", ok: password.length >= 8 },
    { label: "영문 포함", ok: /[a-zA-Z]/.test(password) },
    { label: "숫자 포함", ok: /[0-9]/.test(password) },
    { label: "특수문자 포함", ok: /[^a-zA-Z0-9]/.test(password) },
  ];
  const score = checks.filter((c) => c.ok).length;
  const colors = ["bg-red-400", "bg-orange-400", "bg-yellow-400", "bg-primary"];
  const labels = ["취약", "보통", "양호", "강함"];
  return (
    <div className="mt-2 space-y-2">
      <div className="flex gap-1">
        {[0, 1, 2, 3].map((i) => (
          <div key={i} className={`h-1 flex-1 rounded-full transition-colors duration-300 ${i < score ? colors[score - 1] : "bg-gray-100"}`} />
        ))}
      </div>
      <div className="flex items-center justify-between">
        <div className="flex flex-wrap gap-x-3 gap-y-1">
          {checks.map(({ label, ok }) => (
            <span key={label} className={`text-xs flex items-center gap-1 ${ok ? "text-primary" : "text-muted-foreground"}`}>
              <span className={`w-1.5 h-1.5 rounded-full ${ok ? "bg-primary" : "bg-gray-200"}`} />
              {label}
            </span>
          ))}
        </div>
        {score > 0 && (
          <span className={`text-xs font-semibold ${score === 4 ? "text-primary" : score >= 2 ? "text-yellow-600" : "text-red-500"}`}>
            {labels[score - 1]}
          </span>
        )}
      </div>
    </div>
  );
}

export default function AuthPage({ onLogin }: Props) {
  const [mode, setMode] = useState<Mode>("login");
  const [loading, setLoading] = useState(false);
  const [apiError, setApiError] = useState("");

  const [loginEmail, setLoginEmail] = useState("");
  const [loginPw, setLoginPw] = useState("");
  const [loginErrors, setLoginErrors] = useState<Record<string, string>>({});

  const [signupName, setSignupName] = useState("");
  const [signupEmail, setSignupEmail] = useState("");
  const [signupPw, setSignupPw] = useState("");
  const [signupPwConfirm, setSignupPwConfirm] = useState("");
  const [agree, setAgree] = useState(false);
  const [signupErrors, setSignupErrors] = useState<Record<string, string>>({});

  const validateLogin = () => {
    const errs: Record<string, string> = {};
    if (!loginEmail) errs.email = "이메일을 입력해 주세요";
    else if (!/\S+@\S+\.\S+/.test(loginEmail)) errs.email = "올바른 이메일 형식이 아니에요";
    if (!loginPw) errs.pw = "비밀번호를 입력해 주세요";
    setLoginErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const validateSignup = () => {
    const errs: Record<string, string> = {};
    if (!signupName.trim()) errs.name = "이름을 입력해 주세요";
    if (!signupEmail) errs.email = "이메일을 입력해 주세요";
    else if (!/\S+@\S+\.\S+/.test(signupEmail)) errs.email = "올바른 이메일 형식이 아니에요";
    if (!signupPw) errs.pw = "비밀번호를 입력해 주세요";
    else if (signupPw.length < 8) errs.pw = "비밀번호는 8자 이상이어야 해요";
    if (signupPw !== signupPwConfirm) errs.pwConfirm = "비밀번호가 일치하지 않아요";
    if (!agree) errs.agree = "이용약관에 동의해 주세요";
    setSignupErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateLogin()) return;
    setLoading(true);
    setApiError("");
    try {
      const { name, email } = await apiLogin(loginEmail, loginPw);
      onLogin(name, email);
    } catch (err) {
      setApiError(err instanceof Error ? err.message : "로그인에 실패했어요");
    } finally {
      setLoading(false);
    }
  };

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateSignup()) return;
    setLoading(true);
    setApiError("");
    try {
      const { name, email } = await apiRegister(signupName, signupEmail, signupPw);
      onLogin(name, email);
    } catch (err) {
      setApiError(err instanceof Error ? err.message : "회원가입에 실패했어요");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <nav className="bg-white border-b border-border">
        <div className="max-w-6xl mx-auto px-5 h-14 flex items-center">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 bg-primary rounded-lg flex items-center justify-center">
              <ChefHat className="w-4 h-4 text-white" strokeWidth={2.5} />
            </div>
            <span className="font-bold text-foreground text-[15px]">냉장고 셰프</span>
          </div>
        </div>
      </nav>

      <div className="flex-1 flex items-center justify-center px-5 py-12">
        <div className="w-full max-w-sm">
          <div className="text-center mb-8">
            <div className="w-12 h-12 bg-primary rounded-2xl flex items-center justify-center mx-auto mb-3">
              <ChefHat className="w-6 h-6 text-white" strokeWidth={2.5} />
            </div>
            <h1 className="text-xl font-bold text-foreground">
              {mode === "login" ? "로그인" : "회원가입"}
            </h1>
            <p className="text-sm text-muted-foreground mt-1">
              {mode === "login" ? "냉장고 셰프와 함께 오늘의 요리를 찾아보세요" : "냉장고 셰프에 오신 걸 환영해요"}
            </p>
          </div>

          <div className="flex bg-muted rounded-xl p-1 mb-6">
            {(["login", "signup"] as const).map((m) => (
              <button
                key={m}
                onClick={() => { setMode(m); setApiError(""); }}
                className={`flex-1 text-sm font-semibold py-2 rounded-lg transition-all ${
                  mode === m ? "bg-white text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"
                }`}
              >
                {m === "login" ? "로그인" : "회원가입"}
              </button>
            ))}
          </div>

          {apiError && (
            <div className="mb-4 px-4 py-3 bg-red-50 border border-red-200 rounded-xl text-sm text-red-600">
              {apiError}
            </div>
          )}

          {mode === "login" && (
            <form onSubmit={handleLogin} className="space-y-4">
              <InputField
                label="이메일" type="email" placeholder="chef@example.com"
                value={loginEmail} onChange={setLoginEmail} error={loginErrors.email}
              />
              <InputField
                label="비밀번호" type="password" placeholder="비밀번호를 입력하세요"
                value={loginPw} onChange={setLoginPw} error={loginErrors.pw}
              />
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-primary text-white py-3 rounded-xl font-semibold hover:bg-primary/90 transition-colors mt-2 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {loading && <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />}
                로그인
              </button>
              <p className="text-center text-xs text-muted-foreground pt-2">
                계정이 없으신가요?{" "}
                <button type="button" onClick={() => { setMode("signup"); setApiError(""); }} className="text-primary font-semibold hover:underline">
                  회원가입
                </button>
              </p>
            </form>
          )}

          {mode === "signup" && (
            <form onSubmit={handleSignup} className="space-y-4">
              <InputField
                label="이름" placeholder="홍길동"
                value={signupName} onChange={setSignupName} error={signupErrors.name}
              />
              <InputField
                label="이메일" type="email" placeholder="chef@example.com"
                value={signupEmail} onChange={setSignupEmail} error={signupErrors.email}
              />
              <div className="space-y-1.5">
                <InputField
                  label="비밀번호" type="password" placeholder="8자 이상 입력하세요"
                  value={signupPw} onChange={setSignupPw} error={signupErrors.pw}
                />
                <PasswordStrength password={signupPw} />
              </div>
              <InputField
                label="비밀번호 확인" type="password" placeholder="비밀번호를 다시 입력하세요"
                value={signupPwConfirm} onChange={setSignupPwConfirm} error={signupErrors.pwConfirm}
                hint={signupPwConfirm && signupPw === signupPwConfirm ? "✓ 비밀번호가 일치해요" : undefined}
              />
              <div>
                <label className="flex items-start gap-2.5 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={agree}
                    onChange={(e) => setAgree(e.target.checked)}
                    className="accent-primary w-4 h-4 mt-0.5 shrink-0"
                  />
                  <span className="text-sm text-muted-foreground leading-relaxed">
                    <span className="text-primary font-semibold">이용약관</span> 및{" "}
                    <span className="text-primary font-semibold">개인정보처리방침</span>에 동의합니다
                  </span>
                </label>
                {signupErrors.agree && <p className="text-xs text-red-500 mt-1 ml-6">{signupErrors.agree}</p>}
              </div>
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-primary text-white py-3 rounded-xl font-semibold hover:bg-primary/90 transition-colors mt-2 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {loading && <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />}
                회원가입
              </button>
              <p className="text-center text-xs text-muted-foreground pt-2">
                이미 계정이 있으신가요?{" "}
                <button type="button" onClick={() => { setMode("login"); setApiError(""); }} className="text-primary font-semibold hover:underline">
                  로그인
                </button>
              </p>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
