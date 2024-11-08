import React, { useState } from "react";
import { useForm, Controller } from "react-hook-form";
import {
  View,
  KeyboardAvoidingView,
  TouchableWithoutFeedback,
  Keyboard,
} from "react-native";
import { TextInput, Button, Title, Text } from "react-native-paper";
import { getAuth, createUserWithEmailAndPassword } from "firebase/auth";
import { app } from "../firebaseConfig"; // Adjust the import according to your firebase config file path
import { router } from "expo-router";

const SignUpPage: React.FC = () => {
  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();

  const [signUpError, setSignUpError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  const onSubmit = async (data: any) => {
    const auth = getAuth(app);
    setSignUpError(null);
    setLoading(true);
    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        data.email,
        data.password
      );
      console.log("User signed up:", userCredential.user);
      alert("User signed up successfully!");
      reset();
      router.navigate("/");
    } catch (error: any) {
      console.error("Error signing up:", error);
      setSignUpError(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView style={{ flex: 1 }} behavior="padding">
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <View
          style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
        >
          <View style={{ width: "80%" }}>
            <Title>Sign Up</Title>
            <Controller
              control={control}
              rules={{ required: true }}
              render={({ field: { onChange, onBlur, value } }) => (
                <TextInput
                  label="Email"
                  onBlur={onBlur}
                  onChangeText={onChange}
                  value={value}
                  error={!!errors.email}
                />
              )}
              name="email"
              defaultValue=""
            />
            {errors.email && <Text>Email is required.</Text>}
            <Controller
              control={control}
              rules={{ required: true }}
              render={({ field: { onChange, onBlur, value } }) => (
                <TextInput
                  label="Password"
                  secureTextEntry
                  onBlur={onBlur}
                  onChangeText={onChange}
                  value={value}
                  error={!!errors.password}
                />
              )}
              name="password"
              defaultValue=""
            />
            {errors.password && <Text>Password is required.</Text>}
            <Button
              mode="contained"
              onPress={handleSubmit(onSubmit)}
              style={{ marginTop: 20 }}
              loading={loading}
            >
              Sign Up
            </Button>
            {signUpError && (
              <Text style={{ color: "red", marginTop: 10 }}>{signUpError}</Text>
            )}
          </View>
        </View>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
};

export default SignUpPage;
