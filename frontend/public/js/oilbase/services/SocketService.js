export class SocketService {
    constructor() {
        this.socket = io();
    }

    // connect(serverUrl) {
    //     this.socket = io(serverUrl, {
    //         transports: ['websocket', 'polling'],
    //         reconnection: true,
    //         reconnectionAttempts: 5,
    //         reconnectionDelay: 1000
    //     });

    //     this.setupEventListeners();
    // }

    // setupEventListeners() {
    //     this.socket.on('connect', () => {
    //         console.log('Connected to server');
    //         this.isConnected = true;
    //         this.notifyObservers('socket_connected', { connected: true });
    //     });

    //     this.socket.on('disconnect', () => {
    //         console.log('Disconnected from server');
    //         this.isConnected = false;
    //         this.notifyObservers('socket_disconnected', { connected: false });
    //     });

    //     this.socket.on('error', (error) => {
    //         console.error('Socket error:', error);
    //         this.notifyObservers('socket_error', { error });
    //     });
    // }

    // // Подписка на события сервера
    // on(event, callback) {
    //     if (this.socket) {
    //         this.socket.on(event, callback);
    //     }
    // }

    // // Отправка события на сервер
    // emit(event, data) {
    //     if (this.socket && this.isConnected) {
    //         this.socket.emit(event, data);
    //     } else {
    //         console.warn('Socket not connected');
    //     }
    // }

    // // Паттерн Наблюдатель для уведомления компонентов
    // addObserver(callback) {
    //     this.observers.push(callback);
    // }

    // removeObserver(callback) {
    //     this.observers = this.observers.filter(obs => obs !== callback);
    // }

    // notifyObservers(event, data) {
    //     this.observers.forEach(observer => {
    //         observer(event, data);
    //     });
    // }

    // disconnect() {
    //     if (this.socket) {
    //         this.socket.disconnect();
    //     }
    // }



}