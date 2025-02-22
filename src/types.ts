export type IoTMessage = {
	messageId: number;
	value: number;
	timestamp: string;
};

export type IoTDevice = {
	messages: Array<IoTMessage>;
	deviceId: string;
};

export enum MESSAGETYPE {
	REGISTER_FOG_ID,
}

export type PeerCommandMessage = {
	messageType: MESSAGETYPE;
	message: any;
};

export enum DeviceType {
	FOG,
	SENSOR,
}

export type Device = {
	id: string;
	deviceType: DeviceType;
	community?: string | undefined;
};

export type Community = {
	device: Device;
	id: string;
};

export type FogAssignementToSensor = {
	id: string;
};
