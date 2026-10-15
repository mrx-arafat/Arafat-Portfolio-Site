export type MotionPreference = "on" | "off" | "reduced";

/** Let the operating system take precedence over a saved animation preference. */
export function resolveMotionPreference(saved: string | null, reduced: boolean): MotionPreference {
  return reduced ? "reduced" : saved === "off" ? "off" : "on";
}
