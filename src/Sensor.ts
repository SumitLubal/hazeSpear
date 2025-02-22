import * as AMQPL from "amqplib";
import { v4 as uuidv4 } from "uuid";
import { configure } from "winston";
import { DEVICE_REGISTRATION_WITH_CLOUD, SENSOR_TO_CLOUD } from "./QueueNames";
import { registerForQueue } from "./util";
import simConfig from "./Config/simulation.json";
import { Device, DeviceType, FogAssignementToSensor } from "./types";

export default class Sensor {
	id!: string;
	channel!: AMQPL.Channel;
	fogServer: string | undefined;

	constructor() {
		// connect to cloud server and get the assigned Fog server
		this.id = uuidv4();
	}

	async configure() {
		console.log("Starting connection");
		const connection = await AMQPL.connect(
			simConfig.rabitmq.directConfig.url
		);
		this.channel = await connection.createChannel();
		await this.registerToCloud();
		this.openChannelWithCloud();
		//this.sendDataToFog();
	}

	async registerToCloud() {
		const thisDevice: Device = {
			id: this.id,
			deviceType: DeviceType.SENSOR,
		};
		this.channel.sendToQueue(
			DEVICE_REGISTRATION_WITH_CLOUD,
			Buffer.from(JSON.stringify(thisDevice))
		);
	}

	openChannelWithCloud() {
		console.log("Starting config");
		registerForQueue(this.channel, this.id, this.onMessageFromCloud);
	}

	onMessageFromCloud = (msg: AMQPL.ConsumeMessage | null) => {
		if (!msg) {
			console.log("Msg is null");
			return;
		}
		const message: FogAssignementToSensor = JSON.parse(
			msg.content.toString()
		);
		this.fogServer = message.id;
		console.log(`I will start sending data to fog ${this.fogServer}`);
	};
}
