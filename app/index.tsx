import { router } from "expo-router";
import React from "react";
import { useForm, Controller } from "react-hook-form";
import {
  View,
  KeyboardAvoidingView,
  TouchableWithoutFeedback,
  Keyboard,
} from "react-native";
import { TextInput, Button, Title, Text } from "react-native-paper";
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";
import { app } from "../firebaseConfig"; // Ensure you have a firebaseConfig file that initializes Firebase

const LoginPage: React.FC = () => {
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const [signInError, setSignInError] = React.useState<string | null>(null);
  const [loading, setLoading] = React.useState<boolean>(false);

  const onSubmit = async (data: any) => {
    setLoading(true);
    const auth = getAuth(app);
    setSignInError(null);
    try {
      const userCredential = await signInWithEmailAndPassword(
        auth,
        data.email,
        data.password
      );
      console.log("User signed in:", userCredential.user);
      alert("User signed in successfully!");
      // Navigate to the next screen or handle successful login
    } catch (error: any) {
      console.error("Error signing in:", error);
      // Handle error (e.g., show a message to the user)
      setSignInError(error.message);
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
            <Title>Login</Title>
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
              Login
            </Button>

            <Button
              mode="contained"
              style={{
                marginTop: 10,
                backgroundColor: "#efefef",
                borderColor: "#000",
                borderStyle: "solid",
                borderWidth: 1,
              }}
              onPress={() => router.navigate("/sign-up")}
            >
              <Text style={{ color: "#000" }}>Sign Up</Text>
            </Button>
            {signInError && (
              <Text style={{ color: "red", marginTop: 10 }}>{signInError}</Text>
            )}
          </View>
        </View>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
};

export default LoginPage;
