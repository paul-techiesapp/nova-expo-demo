import { StyleSheet, View, Dimensions } from "react-native";

import { SafeAreaView } from "react-native-safe-area-context";
import { List } from "react-native-paper";
import { FlashList } from "@shopify/flash-list";
import { db } from "../../firebaseConfig";
import { useEffect, useState } from "react";
import { ref, onValue } from "firebase/database";

// const DATA = [
//   {
//     title: "First Item",
//     description: "TEST",
//   },
//   {
//     title: "Second Item",
//     description: "TEST2",
//   },
// ];
interface Email {
  title: string;
  description: string;
}
export default function HomeScreen() {
  const [emailList, setEmailList] = useState<Email[]>([]);

  const emailsRef = ref(db, "emails");

  useEffect(() => {
    onValue(emailsRef, (snapshot) => {
      const data = snapshot.val();
      setEmailList(data);
      // updateStarCount(postElement, data);
    });
  }, []);

  return (
    <SafeAreaView>
      <View
        style={{
          height: Dimensions.get("screen").height,
          width: Dimensions.get("screen").width,
        }}
      >
        <FlashList
          data={emailList}
          renderItem={({ item }) => (
            <List.Item
              title={item.title}
              description={item.description}
              left={(props) => <List.Icon {...props} icon="folder" />}
            />
          )}
          estimatedItemSize={200}
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  titleContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  stepContainer: {
    gap: 8,
    marginBottom: 8,
  },
  reactLogo: {
    height: 178,
    width: 290,
    bottom: 0,
    left: 0,
    position: "absolute",
  },
});
