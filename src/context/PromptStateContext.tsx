import { createContext, useContext, useReducer, useMemo, type ReactNode, type Dispatch } from 'react'
import { promptReducer, defaultPromptState, selectOutput, type PromptState, type PromptAction } from '../core/promptState'
import type { ComposedOutput } from '../core/types'

interface PromptStateContextValue {
  state: PromptState
  dispatch: Dispatch<PromptAction>
  output: ComposedOutput
}

const PromptStateCtx = createContext<PromptStateContextValue>(null!)

export function PromptStateProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(promptReducer, defaultPromptState)
  const output = useMemo(() => selectOutput(state), [state])
  return (
    <PromptStateCtx.Provider value={{ state, dispatch, output }}>
      {children}
    </PromptStateCtx.Provider>
  )
}

export function usePromptState() {
  return useContext(PromptStateCtx)
}

export function usePromptDispatch() {
  return useContext(PromptStateCtx).dispatch
}

export function usePromptOutput() {
  return useContext(PromptStateCtx).output
}
