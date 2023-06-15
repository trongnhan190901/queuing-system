export interface Service {
    id: string;
    serviceCode: string;
    serviceName: string;
    description: string;
    enableEditNumber: string;
    startValueNumber: string;
    endValueNumber: string;
    enableEditPrefix: string;
    startValuePrefix: string;
    enableEditSurfix: string;
    startValueSurfix: string;
    enableEditReset: string;
    active: boolean;
}

export interface Device {
    id: string;
    deviceCode: string;
    deviceName: string;
    deviceTypeSelect: string;
    username: string;
    password: string;
    ipAddress: string;
    serviceUse: string;
    active: boolean;
    connect: boolean;
}

export interface Account {
    id: string;
    fullName: string;
    phone: string;
    email: string;
    account: string;
    username: string;
    password: string;
    active: boolean;
    role: string;
}

interface Role {
    id: string;
    roleName: string;
    roleDes: string;
    roleCount: number;
    featAX: boolean;
    featAY: boolean;
    featAZ: boolean;
    featBX: boolean;
    featBY: boolean;
    featBZ: boolean;
}
