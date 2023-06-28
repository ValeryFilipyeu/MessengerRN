import React, { useCallback, useReducer, useState, useEffect } from "react";
import { ActivityIndicator, Alert } from "react-native";
import { useDispatch } from "react-redux";

import Input from "../components/Input";
import SubmitButton from "../components/SubmitButton";
import { validateInput } from "../utils/actions/formActions";
import { reducer } from "../utils/reducers/formReducers";
import { State } from "../types";
import { signIn } from "../utils/actions/authActions";
import { colors } from "../constants/colors";

const isTestMode = true;

const initialState: State = {
  inputValues: {
    email: isTestMode ? "valeranuzhdin1998@mail.ru" : "",
    password: isTestMode ? "password" : "",
  },
  inputValidities: {
    email: isTestMode,
    password: isTestMode,
  },
  formIsValid: isTestMode
};

const SignInForm: React.FC<unknown> = () => {
  const dispatch = useDispatch();
  const [error, setError] = useState<null | string>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [formState, dispatchFormState] = useReducer(reducer, initialState);

  const inputChangedHandler = useCallback(
    (inputId: string, inputValue: string) => {
      const result = validateInput(inputId, inputValue);
      dispatchFormState({ inputId, validationResult: result, inputValue })
    },
    [dispatchFormState]
  );

  useEffect(() => {
    if (error) {
      Alert.alert("An error occured", error, [{ text: "Okay" }]);
    }
  }, [error]);

  const authHandler = useCallback(async () => {
    try {
      setIsLoading(true);

      const action = signIn(
        formState.inputValues.email,
        formState.inputValues.password
      );
      setError(null);
      // @ts-ignore
      await dispatch(action);
    } catch (error) {
      setError((error as Error).message);
      setIsLoading(false);
    }
  }, [dispatch, formState]);

  return (
    <>
      <Input
        id="email"
        label="Email"
        icon="mail"
        autoCapitalize="none"
        keyboardType="email-address"
        onInputChanged={inputChangedHandler}
        errorText={formState.inputValidities["email"] as [string]}
      />
      <Input
        id="password"
        label="Password"
        icon="lock"
        autoCapitalize="none"
        secureTextEntry
        onInputChanged={inputChangedHandler}
        errorText={formState.inputValidities["password"] as [string]}
      />

      {isLoading ? (
        <ActivityIndicator
          size={"small"}
          color={colors.pink}
          style={{ marginTop: 10 }}
        />
      ) : (
        <SubmitButton
          title="Sign in"
          onPress={authHandler}
          style={{ marginTop: 20 }}
          disabled={!formState.formIsValid}
        />
      )}
    </>
  );
};

export default SignInForm;
