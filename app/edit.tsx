import { View } from "react-native";
import { Button, Text, TextInput } from "react-native-paper";
import { useForm, SubmitHandler, Controller } from "react-hook-form";
import { db } from "../firebaseConfig";
import { ref, get, update } from "firebase/database";
import { router, useLocalSearchParams } from "expo-router";
import { useEffect, useState } from "react";

const taskRef = ref(db, "tasks");

const EditScreen = () => {
  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<Inputs>();
  const [loading, setLoading] = useState(false);

  const params = useLocalSearchParams();

  const getTaskById = async () => {
    const taskSnapshot = await get(ref(db, `tasks/${params.id}`));
    if (taskSnapshot.exists()) {
      const task = taskSnapshot.val();
      reset(task);
    }
  };

  useEffect(() => {
    getTaskById();
  }, []);

  const onSubmit: SubmitHandler<Inputs> = (data) => {
    setLoading(true);
    update(ref(db, `tasks/${params.id}`), data)
      .then(() => {
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
    </View>
  );
};

export default EditScreen;
