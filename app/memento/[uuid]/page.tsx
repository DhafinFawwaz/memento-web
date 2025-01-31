import { headers } from "next/headers";


export default async function MementoUser({ params }: { params: { uuid: string } }) {
    
    return (
        <div>
        <h1>User</h1>
        <p>UUID: </p>
        </div>
    );
}