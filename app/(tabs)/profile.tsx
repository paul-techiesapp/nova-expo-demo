import { Controller, SubmitHandler, useForm } from "react-hook-form";
import "react-native-get-random-values";
import { v4 as uuidv4 } from "uuid";
import {
  getStorage,
  ref as storageRef,
  uploadBytes,
  getDownloadURL,
} from "firebase/storage";
import { View, Text, StyleSheet, Pressable } from "react-native";
import { Avatar, Button, TextInput } from "react-native-paper";
import * as ImagePicker from "expo-image-picker";
import { useEffect, useState } from "react";
import { getApps, initializeApp } from "firebase/app";
import { db, firebaseConfig } from "@/firebaseConfig";
import { get, ref, update } from "firebase/database";

if (!getApps().length) {
  initializeApp(firebaseConfig);
}

const Profile = () => {
  const {
    control,
    handleSubmit,
    reset,
    setValue,
    getValues,
    formState: { errors },
  } = useForm<Inputs>();

  const [image, setImage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const pickImage = async () => {
    // No permissions request is necessary for launching the image library
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 0.3,
    });

    if (!result.canceled) {
      setValue("profileImage", result.assets[0].uri);
      setImage(result.assets[0].uri);
      const firebaseImageUrl = await uploadImageAsync(result.assets[0].uri);
      updateProfile({ profileImage: firebaseImageUrl });
    }
  };

  const getProfile = async () => {
    const profileSnapshot = await get(ref(db, `users/1`));
    if (profileSnapshot.exists()) {
      const profile = profileSnapshot.val();
      reset(profile);
      setImage(profile.profileImage || null);
    }
  };

  const updateProfile = (data: any) => {
    setLoading(true);
    update(ref(db, `users/1`), data)
      .then(() => {
        // router.navigate("/");
      })
      .catch((error) => {
        console.error("Error saving data: ", error);
      })
      .finally(() => {
        // reset();
        getProfile();
        setLoading(false);
      });
  };

  const onSubmit: SubmitHandler<Inputs> = async (data) => {
    updateProfile(data);
  };

  useEffect(() => {
    getProfile();
  }, []);

  return (
    <View style={{ flex: 1, padding: 16 }}>
      <Pressable onPress={pickImage}>
        {image != null ? (
          <Avatar.Image
            size={100}
            source={{ uri: image }}
            style={{ alignSelf: "center", marginBottom: 25 }}
          />
        ) : (
          <Avatar.Icon
            size={100}
            icon="account"
            style={{ alignSelf: "center", marginBottom: 25 }}
          />
        )}
      </Pressable>
      <Controller
        name="fullName"
        control={control}
        rules={{ required: true }}
        render={({ field }) => (
          <View style={{ marginBottom: 16 }}>
            <TextInput
              label="Full Name"
              onChangeText={(text) => field.onChange(text)}
              {...field}
            />
            {errors.task && (
              <Text style={{ color: "red" }}>First name is required</Text>
            )}
          </View>
        )}
      />

      <Controller
        name="phoneNo"
        control={control}
        rules={{ required: true }}
        render={({ field }) => (
          <View style={{ marginBottom: 16 }}>
            <TextInput
              label="Phone No."
              onChangeText={(text) => field.onChange(text)}
              {...field}
            />
            {errors.task && (
              <Text style={{ color: "red" }}>First name is required</Text>
            )}
          </View>
        )}
      />

      <Controller
        name="email"
        control={control}
        rules={{ required: true }}
        render={({ field }) => (
          <View style={{ marginBottom: 16 }}>
            <TextInput
              label="Email"
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

async function uploadImageAsync(uri: string) {
  try {
    const response = await fetch(uri);
    const blob = await response.blob();
    const storage = getStorage();
    const fileRef = storageRef(storage, `profileImages/${uuidv4()}`);
    await uploadBytes(fileRef, blob);
    return await getDownloadURL(fileRef);
  } catch (e) {
    console.log(e);
  }
}

export default Profile;
