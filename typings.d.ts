declare module 'redux-websocket/lib/common' {
  export interface Protocol {
    onopen?: () => void;
    onmessage: (message: any, respond: (message: Object) => void) => void;
    send?: (message: Object) => void;
  }

  export interface WebSocketConnection {
    registerProtocol(name: string, protocol: Protocol): void;
  }
}

declare module 'redux-websocket/lib/client' {
  import {Protocol, WebSocketConnection} from 'redux-websocket/lib/common';

  export class WebSocketClient implements WebSocketConnection {
    protocols: {};
    socket: WebSocket;
    constructor(url: any);
    registerProtocol(name: string, protocol: Protocol): void;
  }
  export function websocketMiddleware(client: WebSocketClient):
      (store: any) => (next: any) => (action: any) => any;
}

declare module 'redux-websocket/lib/server' {
  import {Protocol, WebSocketConnection} from 'redux-websocket/lib/common';

  export class WebSocketServer implements WebSocketConnection {
    constructor(httpServer);
    registerProtocol(name: string, protocol: Protocol): void;
  }
  export function websocketMiddleware({server, actions}: {
    server: WebSocketServer;
    actions: any;
  }): (store: any) => (next: any) => (action: any) => any;
}

declare module 'redux-websocket/lib/sync' {
  import {Protocol, WebSocketConnection} from 'redux-websocket/lib/common';

  type Settings = {
    connection: WebSocketConnection,
    keys: string[],
    skipVersion?: string[],
  };

  export function syncStoreEnhancer(settings: Settings): (next) => (reducer, initialState) => any;

  export function noopReducer(state);
}

declare module 'redux-websocket/lib/rpc' {
  export type RpcSettings = {
    /**
     * Name for the RPC namespace, if not specified the classname will be used.
     */
    name?: string;
    /**
     * Timeout in ms for how long the client will wait for a response before rejecting.
     * Defaults to 10000.
     */
    timeout?: number;
  };

  export function clientError(message: string);

  export interface RemoteProceduresDecorator {
    (settings: RpcSettings): ClassDecorator;
  }
}

declare module 'redux-websocket/lib/rpc/client' {
  import {WebSocketClient} from 'redux-websocket/lib/client';
  import {clientError, RemoteProceduresDecorator, RpcSettings} from 'redux-websocket/lib/rpc';
  export {clientError};

  type RpcClientSettings = {
    /**
     * Optional id to use for connecting to an RPC server with a non-empty id
     */
    id?: string|number,
    socket: WebSocketClient,
  }

  type RpcClient = {
    remoteProcedures: RemoteProceduresDecorator,
  }

  export function createRpcClient({socket, id}: RpcClientSettings): RpcClient;
}

declare module 'redux-websocket/lib/rpc/server' {
  import {WebSocketServer} from 'redux-websocket/lib/server';
  import {clientError, RemoteProceduresDecorator, RpcSettings} from 'redux-websocket/lib/rpc';
  export {clientError};

  type RpcServerSettings = {
    /**
     * Optional id to use when handling multiple RPC servers on a single WebSocketServer.
     * The same id must be specified on the client.
     */
    id?: string|number,
    socket: WebSocketServer,
  }

  type RpcServer = {
    remoteProcedures: RemoteProceduresDecorator,
  }

  export function createRpcServer({socket, id}: RpcServerSettings): RpcServer;
}
