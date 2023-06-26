import React from "react";
import Input from "../components/Input";
import SubmitButton from "../components/SubmitButton";

const SignInForm: React.FC<unknown> = () => {
  return (
    <>
      <Input label="Email" icon="mail" />
      <Input label="Password" icon="lock" />

      <SubmitButton
        title="Sign in"
        onPress={() => console.log("Button pressed")}
        style={{ marginTop: 20 }}
      />
    </>
  );
};

export default SignInForm;