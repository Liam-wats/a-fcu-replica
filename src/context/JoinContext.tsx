import { createContext, useContext, useState, useEffect, type ReactNode } from "react";

export interface PersonalData {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  dob: string;
  ssn: string;
}

export interface AddressData {
  street: string;
  apt: string;
  city: string;
  state: string;
  zip: string;
}

export interface CredentialsData {
  loginId: string;
  password: string;
}

interface JoinState {
  goals: string[];
  personal: PersonalData;
  address: AddressData;
  account: string;
  credentials: CredentialsData;
}

interface JoinContextValue extends JoinState {
  setGoals: (goals: string[]) => void;
  setPersonal: (data: PersonalData) => void;
  setAddress: (data: AddressData) => void;
  setAccount: (id: string) => void;
  setCredentials: (data: CredentialsData) => void;
  reset: () => void;
}

const EMPTY: JoinState = {
  goals: [],
  personal: { firstName: "", lastName: "", email: "", phone: "", dob: "", ssn: "" },
  address: { street: "", apt: "", city: "", state: "", zip: "" },
  account: "",
  credentials: { loginId: "", password: "" },
};

const SESSION_KEY = "apfcu_join";

function loadFromSession(): JoinState {
  try {
    const raw = sessionStorage.getItem(SESSION_KEY);
    if (raw) return { ...EMPTY, ...JSON.parse(raw) };
  } catch {}
  return EMPTY;
}

const JoinContext = createContext<JoinContextValue | null>(null);

export function JoinProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<JoinState>(loadFromSession);

  useEffect(() => {
    sessionStorage.setItem(SESSION_KEY, JSON.stringify(state));
  }, [state]);

  const setGoals = (goals: string[]) => setState((s) => ({ ...s, goals }));
  const setPersonal = (personal: PersonalData) => setState((s) => ({ ...s, personal }));
  const setAddress = (address: AddressData) => setState((s) => ({ ...s, address }));
  const setAccount = (account: string) => setState((s) => ({ ...s, account }));
  const setCredentials = (credentials: CredentialsData) => setState((s) => ({ ...s, credentials }));
  const reset = () => {
    sessionStorage.removeItem(SESSION_KEY);
    setState(EMPTY);
  };

  return (
    <JoinContext.Provider value={{ ...state, setGoals, setPersonal, setAddress, setAccount, setCredentials, reset }}>
      {children}
    </JoinContext.Provider>
  );
}

export function useJoin(): JoinContextValue {
  const ctx = useContext(JoinContext);
  if (!ctx) throw new Error("useJoin must be used inside JoinProvider");
  return ctx;
}

export const STEP_META = [
  { id: 1, slug: "goals", label: "Your Goals", path: "/join/goals" },
  { id: 2, slug: "personal", label: "About You", path: "/join/personal" },
  { id: 3, slug: "account", label: "Account & Login", path: "/join/account" },
  { id: 4, slug: "review", label: "Review", path: "/join/review" },
] as const;
