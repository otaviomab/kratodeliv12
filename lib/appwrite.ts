import { Client, Account, Databases, Storage, Functions, Avatars } from 'appwrite';

const client = new Client()
    .setEndpoint(process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT as string)
    .setProject(process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID as string);

// Exporta as instâncias dos serviços
export const account = new Account(client);
export const databases = new Databases(client);
export const storage = new Storage(client);
export const functions = new Functions(client);
export const avatars = new Avatars(client);

// Exporta o cliente para uso em outros lugares se necessário
export default client; 