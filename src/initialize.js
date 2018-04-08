import {
	ON_TASK_DONE, ON_NEW_TASK,
	ON_TASK_UPDATE, ON_TASK_ERROR
} from "./constants";

self.userDefined = {};

async function execute(func, UID, payload) {
	try {
		//console.log(`starting ${UID}`);
		let result = func(payload, data => self.postMessage({
			UID,
			action: ON_TASK_UPDATE,
			payload: data
		}));
		if (result instanceof Promise) result = await result;
		self.postMessage({UID, action: ON_TASK_DONE, payload: result});
		//console.log(`done ${UID}`);
	} catch (error) {
		console.error(error);
		self.postMessage({UID, action: ON_TASK_ERROR, error: error.message});
	}
}

export default function initialize(context) {
	if (!context) throw new Error('no functions exported in worker file');
	Object.entries(context).forEach(([key, value]) =>
		value instanceof Function && (self.userDefined[key] = value));
	self.onmessage = async function (e) {
		let {data: {UID, method, action, payload}} = e;
		if (!self.userDefined.hasOwnProperty(method)) throw new Error(`${method} is either not defined or exported`);

		if (action === ON_NEW_TASK)
			await execute(self.userDefined[method], UID, payload);
	};
}