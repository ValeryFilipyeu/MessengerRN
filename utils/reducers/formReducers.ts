import { State, Action } from "../../types";

export const reducer = (state: State, action: Action): State => {
  const { validationResult, inputId } = action;

  const updatedValidities = {
    ...state.inputValidities,
    [inputId]: validationResult,
  };

  let updatedFormIsValid = true;

  for (const key in updatedValidities) {
    if (updatedValidities[key] !== undefined) {
      updatedFormIsValid = false;
      break;
    }
  }

  return {
    inputValidities: updatedValidities,
    formIsValid: updatedFormIsValid,
  };
};
