
  
# offload  
  
> Lightweight module for browser to offload api calls and other computation intensive tasks to a pool of threads.  
  
[![NPM](https://img.shields.io/npm/v/offload.svg)](https://www.npmjs.com/package/offload) [![JavaScript Style Guide](https://img.shields.io/badge/code_style-standard-brightgreen.svg)](https://standardjs.com)  
  
Worker build file in the provided example is less than 18KB. Supports chunking and dynamic import. Follows singleton pattern wherein a single object is managing all function calls. Function calls after exhausting the defined task limit is queued. Tasks are assigned to that thread which has the least amount of active tasks and pending tasks combined.  
  
[DEMO](https://aakashrajur.github.io/offload/)  
  
[DEMO SOURCE](https://github.com/aakashRajur/offload/tree/master/example)  
  
## Installation  
```bash  
npm i -D worker-loader  
npm install offload  
```  
  
## Usage  
  
### workerExample.js  
You need to define and  ```export``` all your functions which require to be  executed in the background pool. Failing to do so will result in webworker not recognising the function. Only one worker file is supported.  
You can also dynamically import chunks like you normally do in any es6 code anyway.  **Chunks need not call the initialize function**
  
Functions defined and exported will receive any object you pass in the main thread as first argument and a callback that you can use to relay back any updates to the your main thread version of the function.
```jsx harmony  
import initialize from 'offload/dist/initialize';  
  
export async function getPhotos() {  
  return await (await fetch('https://jsonplaceholder.typicode.com/photos')).json()  
}  
  
export async function getUsers(arg, onUpdate) {  
  return await (await fetch('https://jsonplaceholder.typicode.com/users')).json()  
}  
export async function getPost(id) {  
  let {dynamicImport} = await import('./dynamic');  
  return await dynamicImport(id);  
}  

export async function postUpdates(interval, onUpdate){
  //cpu intensive task 1
  onUpdate({/*your update object*/});
  //cpu intensive task 2
  onUpdate({/*your update object*/});
  //cpu intensive task 3
  return {success: true};
}
  
initialize(this);  
```  
```  
Note: It's recommended your defined functions be pure. Functions and errors can't be passed as arguments.  
Error thrown within your function will be logged to console with stacktrace and your promise on main thread will be rejected with the same message. 
Read the mentioned docs below for more information.  
  ```  
### index.js  
You either need to add worker-loader in your webpack's config file or you can inline it as shown below. The comment is necessary if your es lint is hooked up to webpack in case you intend to inline the loader. This can be the only way in situations wherein you're using create-react-app and you don't want to eject.  
```jsx harmony  
// eslint-disable-next-line import/no-webpack-loader-syntax  
import workerSource from 'worker-loader!./worker'  
import {configure} from 'offload';  
  
configure({source: workerSource, threads: 2, tasks: 4});  
  
// rest of your code  
  ```  
  
### consumer.js  
consume your function by passing your arguments parcelled into an object and a callback that will receive you updates, as parcelled objects
```jsx harmony  
import {getInstance} from "offload";  

getInstance().getPost(1, update => console.log(update)).then(console.log).catch(console.error);  

//or in specific use case of react...  
class App extends Component {  
  async componentDidMount() {  
    console.log(await getInstance().getPost(1, update => console.log(update)));  
  }  
  render(){...}  
}  
```  
  
## API  
### initialize(context)  
#### context
 you need to pass the ```this```, which is the file context as a parameter. The passed object will include all the exported functions that you want to call on the main thread. 

Functions not exported won't be visible to ```initialize``` and hence will not be exposed further to be called within the main thread.  Your exported functions will receive ***two arguments***:

#### arg
 any object (except functions and errors) passed from the main thread. You can parcel your arguments in one object.
#### onUpdate(data)
 in case you want to send updates to the main thread, you receive this callback as second argument which accepts a single argument. 
 Call this function with your update data parcelled into a single object and receive the same parcelled object back in the main thread.
```jsx harmony
async function funcA(arg, onUpdate){...}
```
```  
Note: initialize file is seperate to keep the worker file minimal and and to not include the code  
of the singleton class that manages the workers.  
```  
  
### configure({source, threads, tasks})  
#### source
 the source file in which all your functions are defined.  (**REQUIRED**)  
####  threads
 the number of threads that you want to be spawned.  (**DEFAULT: 1**)  
#### tasks
  the number of tasks each thread will simultaneously take on. (**DEFAULT: 4**)  
```  
Note: If you observe the network console, each network request is  sequential and not parallel.  
This is browser specific behaviour. We need to wait for HTTP2 to allow parallel requests.  
```  
  
### getInstance()  
returns a singleton instance that manages all calls to worker. It'll queue the request if the thread is busy. With the returned instance, you can call any function defined in your worker file.

Pass your arguments parcelled in an object first, and then a callback as second if you want to listen for updates you emit back in your worker file.

```jsx harmony  
await getInstance().funcA(arg, 
    update => console.log('worker sent update: ', update));
```  
```  
Note: If your defined function in the worker file does not return promise, calling the main  
thread version from getInstance() object will be a promise regardless.  
```  
  
# Note  
Objects passed to the workers are clones and not references.  
Functions and errors cannot be sent over  
  
[Further Reading](https://developer.mozilla.org/en-US/docs/Web/API/Web_Workers_API/Structured_clone_algorithm)  
  
[Webworker API](https://developer.mozilla.org/en-US/docs/Web/API/Web_Workers_API/Using_web_workers)  
  
# Dependency  
Big shoutout to the creator of [webpack-loader](https://github.com/webpack-contrib/worker-loader) without which this module couldn't be built  
  
# License  
[MIT](https://github.com/aakashRajur/offload/blob/master/LICENCE) © [aakashRajur](https://github.com/aakashRajur)  
Feel free to use the source anyhow you want.