# offload  
  
> Lightweight module for browser to offload api calls and other computation intensive tasks to a pool of threads.

[![NPM](https://img.shields.io/npm/v/offload.svg)](https://www.npmjs.com/package/offload) [![JavaScript Style Guide](https://img.shields.io/badge/code_style-standard-brightgreen.svg)](https://standardjs.com)  
  
Worker build file in the provided example is less than 18KB. Supports chunking and dynamic import. Follows singleton pattern wherein a single object is managing all function calls. Function calls after exhausting the defined task limit is queued. Tasks are assigned to that thread which has the least amount of active tasks and pending tasks combined.
  
## Installation  
  
```bash  
npm install --save offload worker-loader  
```  
  
## Usage  

# worker.js 
File name doesn't matter. You need to define and  ```export``` all functions you want to be executed in the background pool. Failing to do so will result in webworker not recognising the function. Chunked or dynamically imported files via webpack need not do this. Only one worker file is supported.
```jsx harmony  
import initialize from 'offload/dist/initialize';  
  
export async function getPhotos() {  
  return await (await fetch('https://jsonplaceholder.typicode.com/photos')).json()  
}  
  
export async function getUsers() {  
  return await (await fetch('https://jsonplaceholder.typicode.com/users')).json()  
}
export async function getPost(id) {  
  let {dynamicImport} = await import('./dynamic');  
  return await dynamicImport(id);  
}

initialize(this);
```  
```
Note: It's recommended the defined functions are pure. Functions 
and errors can't be passed as arguments. Error thrown within your 
function will be logged to console with stacktrace anyway. Your 
promise will be rejected with the same message in the main thread 
but will lack stacktrace. Read the mentioned docs below for more 
information. 
  ```
# index.js
You either need to add worker-loader in your webpack's config file or you can inline it as shown below. The comment is necessary if your es lint is hooked up to webpack in case you intend to inline the loader. This can be the only way in situations wherein you're using create-react-app and you don't want to eject.
```jsx harmony
// eslint-disable-next-line import/no-webpack-loader-syntax  
import workerSource from 'worker-loader!./worker'  
import {configure} from 'offload';

configure({source: workerSource, threads: 2, tasks: 4});

// rest of your code
  ```
  
# consumer.js
consume your function the same way you defined it.
```jsx harmony
import {getInstance} from "offload";

getInstance().getPost(1).then(console.log).catch(console.error);

//or in specific use case of react...
class App extends Component {
  async componentDidMount() {  
    console.log(await getInstance().getPost(1));  
  }
  render(){...}
}
```

## API
# initialize(context)
context: you need to pass the ```this```, which is the file context as a parameter. The passed object will include all the exported functions that you want to call on the main thread. Functions not exported won't be visible to ```initialize``` and hence will not be exposed further to be called within the main thread.
```
Note: initialize file is seperate to keep the worker file minimal 
and and to not include the code of the singleton class that 
manages the workers.
```

# configure({source, threads, tasks})
source: the source file in which all your functions are defined.
threads: the number of threads that you want to be spawned.
tasks: the number of tasks each thread will simultaneously take on.
```
Note: If you observe the network console, each network request is 
sequential and not parallel. This is browser specific behaviour. 
We need to wait for HTTP2 to allow parallel requests.
```

# getInstance()
returns a singleton instance that manages all function calls. It'll queue the request if the thread is busy. With the returned instance you can call your function defined in your worker file the same you defined it over there.
```jsx harmony
await getInstance().getPost(1)
```
```
Note: If your defined function in the worker file does not 
return promise, calling the main thread version from getInstance() 
object will be a promise regardless.
```

## Note
Objects passed to the workers are clones and not references.  
Functions and errors cannot be sent over  
[Further Reading](https://developer.mozilla.org/en-US/docs/Web/API/Web_Workers_API/Structured_clone_algorithm), [Webworker API](https://developer.mozilla.org/en-US/docs/Web/API/Web_Workers_API/Using_web_workers)

## Dependency
Big shoutout to the creator of [webpack-loader](https://github.com/webpack-contrib/worker-loader) without which this module couldn't be built

## License  
[MIT](https://github.com/aakashRajur/offload/blob/master/LICENCE) © [aakashRajur](https://github.com/aakashRajur)
Feel free to use the source anyhow you want.