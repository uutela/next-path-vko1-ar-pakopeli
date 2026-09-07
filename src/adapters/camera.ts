export type CameraPermission = 'granted' | 'denied' | 'undetermined';

/** What the AR screen needs of the camera. Fakes in tests choose a value. */
export interface CameraAdapter {
  permission: CameraPermission;
  request(): void;
}
