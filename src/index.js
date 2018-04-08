import {
	ON_TASK_UPDATE,
	ON_TASK_DONE,
	ON_TASK_ERROR,
	ON_NEW_TASK
} from "./constants";

const config = {
	UID_LENGTH: 8,
	THREAD_COUNT: 1,
	TASK_COUNT: 4,
	WORKER: null,
	instance: null
};

function guid(length = 4) {
	return Array.from({length: length}, () =>
		Math.floor((1 + Math.random()) * 0x10000)
			.toString(16)
			.substring(1))
		.reduce((sub, value, index) =>
			`${sub}${index + 1 !== config.UID_LENGTH ? '-' : ''}${value}`);
}

function findLeastBusy(handles) {
	return handles.reduce((selected, next) => next.getLoad() < selected.getLoad() ? next : selected);
}

class ThreadPool {
	constructor() {
		this.onMessage = this.onMessage.bind(this);
		this.getConfig = this.getConfig.bind(this);
		this.getMethod = this.getMethod.bind(this);
		this.tasks = [];
		this.handles = Array.from({length: config.THREAD_COUNT},
			(v, TID) => {
				let thread = new config.WORKER();
				thread.addEventListener('message', e => this.onMessage(TID, e));
				thread.addEventListener('error', e => ThreadPool.onError(TID, e));
				return {
					tasks: 0,
					pending: [],
					getLoad: function () {
						return this.tasks + this.pending.length;
					},
					thread
				}
			});
		Object.keys(this).forEach(key =>
			Object.defineProperty(this, key, {
				enumerable: false,
				writable: false,
				configurable: false
			})
		);
		return new Proxy(this, {get: this.getMethod});
	}

	onMessage(TID, e) {
		let {data: {UID, action, payload}} = e,
			taskIndex = this.tasks.findIndex(({UID: _UID}) => _UID === UID);
		if (taskIndex < 0) return;
		let {onUpdate, onDone, onError} = this.tasks[taskIndex];
		switch (action) {
			case ON_TASK_DONE: {
				this.handles[TID].tasks -= 1;
				onDone && onDone(payload);
				this.tasks.splice(taskIndex, 1);
				this.startNextTask(TID);
				break;
			}
			case ON_TASK_UPDATE:
				onUpdate && onUpdate(payload);
				break;
			case ON_TASK_ERROR:
				this.handles[TID].tasks -= 1;
				onError && onError(payload);
				this.tasks.splice(taskIndex, 1);
				this.startNextTask(TID);
				break;
			default:
		}
	}

	static onError(TID, e) {
		console.error(TID, e);
	}

	startNextTask(TID) {
		let handle = this.handles[TID];
		if (!handle.pending.length) return;
		let {UID, method, payload} = handle.pending.splice(0, 1)[0];
		handle.tasks += 1;
		handle.thread.postMessage({UID, method, action: ON_NEW_TASK, payload});
	}

	enqueue(method) {
		return (payload, onUpdate) => {
			return new Promise((resolve, reject) => {
				let newTask = {
					UID: guid(config.UID_LENGTH),
					method,
					onUpdate,
					onDone: resolve,
					onError: reject
				};
				this.tasks.push(newTask);
				let handle = findLeastBusy(this.handles);
				if (handle.tasks < config.TASK_COUNT) {
					handle.tasks += 1;
					handle.thread.postMessage({UID: newTask.UID, method, action: ON_NEW_TASK, payload});
				}
				else handle.pending.push({
					UID: newTask.UID,
					method,
					payload
				});
				return newTask.UID;
			});
		}
	}

	getMethod(target, name) {
		if (target.hasOwnProperty(name)) return target[name];
		return this.enqueue(name);
	}

	getConfig() {
		let {THREAD_COUNT: threads, TASK_COUNT: tasks} = config;
		return {threads, tasks};
	}
}

export function configure({source, threads, tasks}) {
	let {THREAD_COUNT, TASK_COUNT} = config;
	config.WORKER = source;
	config.THREAD_COUNT = threads || THREAD_COUNT;
	config.TASK_COUNT = tasks || TASK_COUNT;
}

export function getInstance() {
	if (!config.WORKER) throw new Error('source not provided. Please configure a valid worker file');
	if (!config.instance) config.instance = new ThreadPool();
	return config.instance;
}