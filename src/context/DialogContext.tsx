import { createContext, useContext, useReducer } from "react";

export function useDialogContext() {
  return useContext(DialogContext);
}

export function useDialogDispatch() {
  return useContext(DialogDispatch);
}

/////////////////////////////////////////////////

const initialState = {
  signin: false,
  editprofile: false,
  confirm: false,
  warning: false,
};

const DialogContext = createContext<Dialogs>(initialState);
const DialogDispatch = createContext<React.Dispatch<Action>>(() => null);

export function DialogProvider({ children }: { children: React.ReactNode }) {
  const [value, dispatch] = useReducer(reducer, initialState);

  return (
    <DialogContext.Provider value={value}>
      <DialogDispatch.Provider value={dispatch}>{children}</DialogDispatch.Provider>
    </DialogContext.Provider>
  );
}

type Type = "show" | "hide" | "toggle";
type Name = "signin" | "editprofile" | "confirm" | "warning";

type Dialogs = typeof initialState;
type Action = { type: Type; name: Name };

function reducer(dialogs: Dialogs, action: Action) {
  switch (action.type) {
    case "show": {
      return { ...dialogs, [action.name]: true };
    }
    case "hide": {
      return { ...dialogs, [action.name]: false };
    }
    case "toggle": {
      return { ...dialogs, [action.name]: !dialogs[action.name] };
    }
    default: {
      throw Error(`Unknown action: ${action}`);
    }
  }
}
