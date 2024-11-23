"use client"

import FormButton from "@/components/button";
import FormInput from "@/components/input";
import SocialLogin from "@/components/social-login";
import { handleForm } from "./actions";
import { useActionState } from "react";

export default function LogIn() {
    //useFormState => handleForm(null) return state => call again action 
    //=> handleForm(prevState) return PrevState
    const [state, dispatch] = useActionState(handleForm, null);
    return (
        <div className="flex flex-col gap-10 py-8 px-6">
            <div className="flex flex-col gap-2 
            *:font-medium">
                <h1 className="text-2xl">안녕하세요!</h1>
                <h2 className="text-xl">Log in with email and password.
                </h2>
            </div>
            <form action={dispatch} className="flex flex-col gap-3">
                <FormInput
                    name="email"
                    type="email"
                    placeholder="Email"
                    required
                />
                <FormInput
                    name="password"
                    type="password"
                    placeholder="Password"
                    required
                />
                <FormButton text="Log in" />
            </form>
            <SocialLogin />
        </div>
    )
}