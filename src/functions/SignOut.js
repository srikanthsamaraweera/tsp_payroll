"use server";
import { signOut } from "next-auth/react";

export default async function Sign_Out() {

    await signOut();
    console.log("Logged out");

}