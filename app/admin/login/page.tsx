import Image from "next/image";

import { FormEvent } from "react";
import { redirect } from "next/navigation";
import { env } from "@/app/env";
import { cookies } from "next/headers";

export default function LoginPage() {
    async function submit(formData: FormData) {
        "use server";
        
        let password = formData.get("password");
        if(!password) {
            console.log("No password provided");
            return redirect("/admin/login");
        }

        password = "admin:" + password;
        
        if(password !== env.basicAuthSecret) {
            console.log("Wrong password provided");
            console.log("Password provided: ", password);
            console.log("Env password: ", env.basicAuthSecret);
            return redirect("/admin/login");
        }

        console.log("Login success");

        (await cookies()).set({
            name: 'token',
            value: password,
            httpOnly: true,
            path: '/',
            secure: true,
            maxAge: 60 * 60 * 24 * 7, // 1 week
        })
        redirect("/admin/memento"); 
    }    
    
    

    return <>
<div className="fixed bg-zinc-950 -z-50 w-screen h-dvh h-vh"></div>
<div className="fixed w-screen h-dvh h-vh flex justify-center items-center">
    <div className="bg-zinc-900 p-8 rounded-2xl flex flex-col w-full max-w-72 mx-4">
        <h1 className="w-full text-center font-bold text-xl">Admin Page</h1>
        <form action={submit} method="post" className="flex flex-col">
            
            <div className="h-1"></div>
            <label htmlFor="password" className="font-semibold mb-1 text-sm">Password</label>
            <div className="w-full flex relative items-center">
                <input type="password" id="password" name="password" className="cursor-text rounded-xl pl-12 bg-zinc-900 text-slate-50 outline-none ring-1 ring-zinc-700 hover:ring-1 hover:ring-indigo-700 focus:ring-indigo-700 focus:bg-zinc-800 ring-inset h-10 w-full"/>
                <Image alt="password icon" width={50} height={50} src="https://api.iconify.design/mdi/password.svg?color=%23aaaaaa" className="absolute w-4 ml-4"/>
            </div>
            
            <div className="h-4"></div>
            <button type="submit" className="bg-blue-600 hover:bg-blue-700 active:ring-4 focus:ring-4 ring-blue-800 text-slate-50 px-2 w-full py-1 rounded-xl cursor-pointer font-semibold flex items-center justify-center h-10">Login</button>
        </form>
    </div>
</div>
</>
}