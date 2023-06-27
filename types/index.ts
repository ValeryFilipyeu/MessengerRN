export type RootStackParamList = {
  Home: undefined;
  ChatSettings: undefined;
  ChatScreen: undefined;
};

export interface State {
  inputValidities: Record<string, boolean | [string] | undefined>;
  formIsValid: boolean;
}

export interface Action {
  inputId: string;
  validationResult: [string] | undefined;
}
