import pino from "pino";
import { env } from "../config/env.config";

const isProd = env.NODE_ENV === "production";

const logger = pino(
	{
		level: isProd ? "info" : "debug",
		transport: isProd
			? undefined
			: {
					target: "pino-pretty",
					options: {
						colorize: true,
						translateTime: "yyyy-mm-dd HH:MM:ss.l o",
						ignore: "pid,hostname",
						singleLine: true,
					},
				},
	},
	//   pino.destination(`${__dirname}/src/pino/app.log`)
);

export default logger;
