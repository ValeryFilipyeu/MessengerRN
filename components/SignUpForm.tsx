import React from "react";
import Input from "../components/Input";
import SubmitButton from "../components/SubmitButton";

const SignUpForm: React.FC<unknown> = () => {
  return (
    <>
      <Input label="First name" icon="user" />
      <Input label="Last name" icon="user" />
      <Input label="Email" icon="mail" />
      <Input label="Password" icon="lock" />

      <SubmitButton
        title="Sign up"
        onPress={() => console.log("Button pressed")}
        style={{ marginTop: 20 }}
      />
    </>
  );
};

export default SignUpForm;
