import { createContext, useCallback, useContext, useRef, useState, type ReactNode } from 'react';
import { toastRef } from '../ui/anim';

const Ctx = createContext<(msg: string) => void>(() => {});

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toast, setToast] = useState<{ msg: string; id: number } | null>(null);
  const timer = useRef(0);
  const flash = useCallback((msg: string) => {
    setToast({ msg, id: Date.now() });
    clearTimeout(timer.current);
    timer.current = window.setTimeout(() => setToast(null), 2400);
  }, []);
  return (
    <Ctx.Provider value={flash}>
      {children}
      {toast && (
        <div key={toast.id} ref={toastRef} role="status" aria-live="polite" style={{ position: 'fixed', top: '20px', left: '50%', transform: 'translateX(-50%)', display: 'flex', alignItems: 'center', gap: '8px', padding: '12px 20px', borderRadius: '99px', background: 'rgb(var(--fb-a,236,40,78))', color: 'var(--fb-on,#fff)', fontWeight: 700, fontSize: '13px', boxShadow: '0 12px 36px rgba(var(--fb-a,236,40,78),.5)', zIndex: 90, whiteSpace: 'nowrap', maxWidth: 'calc(100vw - 32px)', overflow: 'hidden', textOverflow: 'ellipsis' }}>
          <span className="ms" style={{ fontSize: '18px' }}>check_circle</span>
          {toast.msg}
        </div>
      )}
    </Ctx.Provider>
  );
}

export const useToast = () => useContext(Ctx);
