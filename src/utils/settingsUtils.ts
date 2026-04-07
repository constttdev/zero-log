import { colorUtils } from "./colorUtils.js";

const SETTINGS = [
  {
    name: "debug",
    defaultValue: false,
    description: "Will log extra info while using this library",
  },
  {
    name: "warningLogColor",
    defaultValue: colorUtils.yellow,
    description: "The color of the logged message",
  },
  {
    name: "errorLogColor",
    defaultValue: colorUtils.red,
    description: "The color of the logged message",
  },
  {
    name: "successLogColor",
    defaultValue: colorUtils.green,
    description: "The color of the logged message",
  },
  {
    name: "warningLogPrefix",
    defaultValue: "WARNING: ",
    description: "The prefix of the logged message",
  },
  {
    name: "errorLogPrefix",
    defaultValue: "ERROR: ",
    description: "The prefix of the logged message",
  },
  {
    name: "successLogPrefix",
    defaultValue: "SUCCESS: ",
    description: "The prefix of the logged message",
  },
] as const;

type SettingName = (typeof SETTINGS)[number]["name"];

type SETTING = {
  name: SettingName;
  value?: any;
  defaultValue: any;
  description: string;
};

const runtimeSettings: SETTING[] = SETTINGS.map((s) => ({ ...s }));

function getSetting(setting: SettingName): SETTING | undefined {
  const s = runtimeSettings.find((s) => s.name === setting);
  if (s && s.value === undefined) s.value = s.defaultValue;
  return s;
}

function setSettingValue(setting: SettingName, value: any) {
  const s = runtimeSettings.find((s) => s.name === setting);
  if (s) s.value = value;
  else {
    if (getSetting("debug")?.value) {
      throw new Error(
        `Setting "${setting}" not found | VALUE: ${value} | Available: ${SETTINGS.map((s) => s.name).join(", ")}`,
      );
    } else {
      throw new Error(`Setting "${setting}" not found`);
    }
  }
}

function getSettingValue(setting: SettingName): any {
  const s = getSetting(setting);
  return s ? s.value : undefined;
}

export { getSetting, getSettingValue, setSettingValue };
