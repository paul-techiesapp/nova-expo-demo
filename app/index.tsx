import _ from "lodash";
import Checkbox from "expo-checkbox";
import { View, Dimensions, Pressable } from "react-native";

import { SafeAreaView } from "react-native-safe-area-context";
import { Button, Divider, Icon, List, Menu, Text } from "react-native-paper";
import { FlashList } from "@shopify/flash-list";
import { db } from "../firebaseConfig";
import { useEffect, useState } from "react";
import { ref, onValue, update, remove } from "firebase/database";
import { Link } from "expo-router";

interface Task {
  id: string;
  task: string;
  completed: boolean;
}

export default function HomeScreen() {
  const [taskList, setTaskList] = useState<Task[]>([]);
  const [doneTaskList, setDoneTaskList] = useState<Task[]>([]);

  const tasksRef = ref(db, "tasks");

  useEffect(() => {
    onValue(tasksRef, (snapshot) => {
      const data = _.pickBy(snapshot.val(), (task) => !task.completed);
      const doneData = _.pickBy(snapshot.val(), (task) => task.completed);
      setTaskList(_.map(data, (value, key) => ({ ...value, id: key })));
      setDoneTaskList(_.map(doneData, (value, key) => ({ ...value, id: key })));
    });
  }, []);

  const handleCheckboxChange = (taskId: string, newValue: boolean) => {
    const taskRef = ref(db, `tasks/${taskId}`);
    setTaskList((prevTaskList) =>
      prevTaskList.map((task) =>
        task.id === taskId ? { ...task, completed: newValue } : task
      )
    );
    setTimeout(() => {
      update(taskRef, { completed: newValue });
    }, 500);
  };

  const handleDeleteTask = (taskId: string) => {
    const taskRef = ref(db, `tasks/${taskId}`);
    remove(taskRef);
  };

  return (
    <SafeAreaView>
      <View style={{ margin: 10, alignItems: "flex-end" }}>
        <Link href="/add">
          <Button mode="contained" icon="plus">
            Task
          </Button>
        </Link>
      </View>
      <View
        style={{
          padding: 10,
          height: Dimensions.get("screen").height * 0.4,
          width: Dimensions.get("screen").width,
        }}
      >
        <Text variant="titleLarge">TODO ({taskList.length})</Text>
        <FlashList
          data={taskList}
          ListEmptyComponent={
            <View style={{ marginTop: 20 }}>
              <Text variant="bodyLarge" style={{ color: "gray" }}>
                There are no tasks to show...
              </Text>
            </View>
          }
          renderItem={({ item }) => (
            <List.Item
              title={item.task}
              right={() => (
                <>
                  {/* <Icon source="dots-vertical" size={25} /> */}
                  <Link href={{ pathname: "/edit", params: { id: item.id } }}>
                    <Icon source="pencil" size={25} />
                  </Link>
                  <View style={{ width: 10 }} />
                  <Pressable onPress={() => handleDeleteTask(item.id)}>
                    <Icon source="delete" size={25} color="red" />
                  </Pressable>
                </>
              )}
              left={(props) => (
                <Checkbox
                  style={{ margin: 5 }}
                  value={item.completed}
                  onValueChange={(newValue) =>
                    handleCheckboxChange(item.id, newValue)
                  }
                />
              )}
            />
          )}
          estimatedItemSize={200}
        />
      </View>
      <Divider style={{ marginTop: 10 }} />
      <View
        style={{
          padding: 10,
          marginTop: 20,
          height: Dimensions.get("screen").height * 0.4,
          width: Dimensions.get("screen").width,
        }}
      >
        <Text variant="titleLarge">Done Tasks ({doneTaskList.length})</Text>
        <FlashList
          data={doneTaskList}
          ListEmptyComponent={
            <View style={{ marginTop: 20 }}>
              <Text variant="bodyLarge" style={{ color: "gray" }}>
                There are no tasks to show...
              </Text>
            </View>
          }
          renderItem={({ item }) => (
            <Link href={{ pathname: "/edit", params: { id: item.id } }}>
              <List.Item
                title={item.task}
                left={(props) => (
                  <Checkbox
                    style={{ margin: 5 }}
                    value={item.completed}
                    onValueChange={(newValue) =>
                      handleCheckboxChange(item.id, newValue)
                    }
                  />
                )}
              />
            </Link>
          )}
          estimatedItemSize={200}
        />
      </View>
    </SafeAreaView>
  );
}

const ListEditMenu = () => (
  <View style={{ position: "absolute", right: 0 }}>
    <Menu.Item leadingIcon="edit" onPress={() => {}} title="Edit" />
    <Menu.Item leadingIcon="delete" onPress={() => {}} title="Delete" />
  </View>
);
