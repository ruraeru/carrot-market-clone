"use client";

import Button from "@/components/button";
import Input from "@/components/input";
import { useActionState } from "react";
import { smsVerification } from "./actions";

export default function SMSLogin() {
    const [state, dispatch] = useActionState(smsVerification, null);
    return (
        <div className="flex flex-col gap-10 py-8 px-6">
            <div className="flex flex-col gap-2 
            *:font-medium">
                <h1 className="text-2xl">SMS Login</h1>
                <h2 className="text-xl">Verify your phone number.</h2>
            </div>
            <form action={dispatch} className="flex flex-col gap-3">
                <Input
                    name="phone"
                    type="number"
                    placeholder="Phone number"
                    required
                />
                <Input
                    name="token"
                    type="number"
                    placeholder="Verification code"
                    required
                />
                <Button text="Verify" />
            </form>
        </div>
    )
}