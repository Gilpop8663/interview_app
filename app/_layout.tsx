import { Stack } from "expo-router";

type ItemRouteParams = {
  id: string;
};

export default function RootLayout() {
  return (
    <Stack>
      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      <Stack.Screen
        name="modal"
        options={{ presentation: "modal", title: "모달" }}
      />
      <Stack.Screen
        name="item/[id]"
        options={({ route }) => {
          const { id } = route.params as ItemRouteParams; // 강제로 타입을 지정

          return {
            title: `아이템 ${id}`,
          };
        }}
      />
    </Stack>
  );
}
