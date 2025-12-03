import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Ionicons } from "@expo/vector-icons";
import { StyleSheet, View, Text } from "react-native";
import Home from "../screens/Home";
import Agenda from "../screens/Agenda";
import Clientes from "../screens/Clientes";
import Mais from "../screens/Mais";
import { theme } from "../styles/theme";

const Tab = createBottomTabNavigator();

export default function BottomTabs() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ color, size, focused }) => {
          const icons = {
            Inicio: focused ? "home" : "home-outline",
            Agenda: focused ? "calendar" : "calendar-outline",
            Clientes: focused ? "people" : "people-outline",
            Mais: focused ? "ellipsis-horizontal" : "ellipsis-horizontal-outline",
          };

          return (
            <View
              style={{
                width: focused ? 50 : size,
                height: focused ? 50 : size,
                backgroundColor: focused ? theme.colors.primary : "transparent",
                padding: focused ? 10 : 0,
                borderRadius: 50,
                justifyContent: "center",
                alignItems: "center",
                marginTop: focused ? 16:0,
              }}
            >
              <Ionicons name={icons[route.name]} size={25} color={color}   />
            </View>
          );
        },
        tabBarLabel: ({ focused, color }) => {
          if (focused) return null;
          return <Text style={{ color, fontSize: 11 }}>{route.name}</Text>;
        },
        tabBarActiveTintColor: '#ffffff',
        tabBarInactiveTintColor: "#000000ff",
        headerShown: false,
        tabBarStyle: styles.tabBar,
        tabBarItemStyle: styles.tabBarItem,
        tabBarLabelStyle: styles.label,
      })}
    >
      <Tab.Screen name="Inicio" component={Home} />
      <Tab.Screen name="Agenda" component={Agenda} />
      <Tab.Screen name="Clientes" component={Clientes} />
      <Tab.Screen name="Mais" component={Mais} />
    </Tab.Navigator>
  );
}

const styles = StyleSheet.create({
  // Barra flutuante moderna
  tabBar: {
    position: "absolute",
    bottom: 20,
    left: 10,
    right: 10,
    height: 68,
    borderRadius: 999,
    backgroundColor: theme.colors.white,
    marginHorizontal: theme.spacing.large,
    paddingBottom: 6,
    paddingTop: 6,
    borderTopWidth: 0,
    height: 65,

    // sombra moderna (iOS + Android)
    boxShadowColor: "#000",
    boxShadowOpacity: 0.08,
    boxShadowOffset: { width: 0, height: 10 },
    boxShadowRadius: 10,
    elevation: 5,
  },

  // Ajusta posição interna dos botões
  tabBarItem: {
justifyContent: "center",
  alignItems: "center",
  },

  // Label mais clean
  label: {
    fontSize: 11,
    marginTop: 0,
  },
});
