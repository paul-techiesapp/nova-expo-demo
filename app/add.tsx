import { View } from "react-native";
import { Button, Snackbar, Text, TextInput } from "react-native-paper";
import { SafeAreaView } from "react-native-safe-area-context";
import { useForm, SubmitHandler, Controller } from "react-hook-form";
import { db } from "../firebaseConfig";
import { ref, push } from "firebase/database";
import { router } from "expo-router";
import { useState } from "react";

const taskRef = ref(db, "tasks");

const AddScreen = () => {
  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<Inputs>();
  const [visible, setVisible] = useState(false);
  const [loading, setLoading] = useState(false);

  const onSubmit: SubmitHandler<Inputs> = (data) => {
    setLoading(true);
    push(taskRef, data)
      .then(() => {
        setVisible(true);
        router.navigate("/");
      })
      .catch((error) => {
        console.error("Error saving data: ", error);
      })
      .finally(() => {
        reset();
        setLoading(false);
      });
  };

  return (
    <View style={{ flex: 1, padding: 16 }}>
      <Controller
        name="task"
        control={control}
        rules={{ required: true }}
        render={({ field }) => (
          <View style={{ marginBottom: 16 }}>
            <TextInput
              label="Task"
              onChangeText={(text) => field.onChange(text)}
              {...field}
            />
            {errors.task && (
              <Text style={{ color: "red" }}>First name is required</Text>
            )}
          </View>
        )}
      />

      <Button
        mode="contained"
        onPress={handleSubmit(onSubmit)}
        loading={loading}
      >
        Save
      </Button>
      <Snackbar
        visible={visible}
        duration={4000}
        onDismiss={() => console.log("nothing")}
      >
        Successfully created new task!
      </Snackbar>
    </View>
  );
};

export default AddScreen;
