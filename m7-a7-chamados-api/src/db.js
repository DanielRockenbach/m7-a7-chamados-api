import "dotenv/config";
import dns from "node:dns";
import { MongoClient } from "mongodb";

const dnsServers = (process.env.MONGODB_DNS_SERVERS ?? "1.1.1.1,8.8.8.8")
	.split(",")
	.map((server) => server.trim())
	.filter(Boolean);
dns.setServers(dnsServers);

const uri = process.env.MONGODB_URI;
if (!uri) {
throw new Error(
"MONGODB_URI não configurada."
);
}
const client = new MongoClient(uri);
let collection;
export async function conectarBanco() {
await client.connect();
const db = client.db("m7-frontend");
collection = db.collection("chamados");
await db.command({ ping: 1 });
console.log("MongoDB conectado.");
}
export function chamadosCollection() {
if (!collection) {
throw new Error("Banco não conectado.");
}
return collection;
}
